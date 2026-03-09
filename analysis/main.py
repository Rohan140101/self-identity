from fastapi import FastAPI
from pydantic import BaseModel
from data_processor import IdentityAnalyzer
from fastapi.middleware.cors import CORSMiddleware
import os
from pdf_generator import generate_full_identity_report
from report_mailer import send_email_with_report
from datetime import datetime
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


analyzer = IdentityAnalyzer('data/prolific_data.csv', 'data/survey_data.csv', 'data/did_option_dict.json')

class SurveyInput(BaseModel):
    finalRankedChoices: list


@app.post("/analyze")
async def analyze_survey(data: dict):
    # print('Here2:,', data)
    data = analyzer.normalize_user_answer_likerts(data)


    top_id_table = analyzer.get_top_identity_report(data['finalRankedChoices'])
    
    expected_vs_actual_rank_table = analyzer.get_expected_vs_actual_rank(data)
    expected_vs_actual_rank_well_being = analyzer.get_expected_vs_actual_well_being(data, expected_vs_actual_rank_table)
    optimized_result = analyzer.get_highest_happiness_permutations(data, expected_vs_actual_rank_table)
    return {
        "top_identity_table": top_id_table,
        "expected_vs_actual_rank_table": expected_vs_actual_rank_table,
        "expected_vs_actual_rank_well_being": expected_vs_actual_rank_well_being,
        "optimized_result": optimized_result
    }


@app.post("/api/send-report")
async def handle_report_request(data: dict):
    user_email = data.get("email")
    if not os.path.exists("generated_reports"):
        os.makedirs("generated_reports")

    x = datetime.now()
    date_format_string = x.strftime("%Y_%m_%d_%H%M%S")


    filename = f"generated_reports/report_{user_email.split('@')[0]}_{date_format_string}.pdf"
    generate_full_identity_report(data, user_email, filename)
    send_email_with_report(user_email, filename)
    return {"status": "success", "message": f"Report Generated and Sent"}

# @app.route('/api/append-to-sheets', methods=['POST'])
# def append_to_sheets(data: dict):
#     email = data['email']
#     answers = data['answers']
    
#     headers = [
#         "timestamp", "survey_id", "email", "age", "gender", 
#         "choice_1", "choice_2", "choice_3", "choice_4", "choice_5", 
#         "optimized_pct"
#     ]
    
#     choices = data.get('finalRankedChoices', [])
    
#     # 3. Build the row list based on your headers
#     row = [
#         data.get("timestamp"),
#         data.get("survey_id"),
#         data.get("email"),
#         data.get("age"),
#         data.get("gender"),
#         choices[0] if len(choices) > 0 else "",
#         choices[1] if len(choices) > 1 else "",
#         choices[2] if len(choices) > 2 else "",
#         choices[3] if len(choices) > 3 else "",
#         choices[4] if len(choices) > 4 else "",
#         data.get("optimized_pct")
#     ]
    
#     sheet.append_row(row)
#     return {"status": "success"}, 200