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
    allow_origins=["https://self-identity.me", "https://www.self-identity.me", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


analyzer = IdentityAnalyzer('data/prolific_data.csv', 'data/survey_data.csv', 'data/did_option_dict.json')

class SurveyInput(BaseModel):
    finalRankedChoices: list

@app.post("/getRankedOrder")
async def get_ranked_order(data: dict):
    sorted_data = analyzer.get_user_order(data)
    return {
        "sorted_data": sorted_data
    }

@app.post("/analyze")
async def analyze_survey(data: dict):
    # print('Here2:,', data)
    data = analyzer.normalize_user_answer_likerts(data)


    top_id_table = analyzer.get_top_identity_report(data['finalRankedChoices'])
    
    expected_vs_actual_rank_table, expected_vs_actual_rank_short_table = analyzer.get_expected_vs_actual_rank(data)
    expected_vs_actual_rank_well_being = analyzer.get_expected_vs_actual_well_being(data, expected_vs_actual_rank_table)
    optimized_result = analyzer.get_highest_permutation(data, expected_vs_actual_rank_table)
    print('Sending Data to Client')
    return {
        "top_identity_table": top_id_table,
        "expected_vs_actual_rank_table": expected_vs_actual_rank_short_table,
        "expected_vs_actual_rank_well_being": expected_vs_actual_rank_well_being,
        "optimized_result": optimized_result
    }


@app.post("/send-report")
async def handle_report_request(data: dict):
    user_name = data.get("username")
    user_email = data.get("email")
    if not os.path.exists("generated_reports"):
        os.makedirs("generated_reports")

    x = datetime.now()
    date_format_string = x.strftime("%Y_%m_%d_%H%M%S")


    filename = f"generated_reports/report_{user_email.split('@')[0]}_{date_format_string}.pdf"
    generated_images = await generate_full_identity_report(data, user_email, filename)
    send_email_with_report(data, user_name, user_email, filename, generated_images)
    return {"status": "success", "message": f"Report Generated and Sent"}

