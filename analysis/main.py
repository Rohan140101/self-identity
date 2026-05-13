from fastapi import FastAPI
from pydantic import BaseModel
from data_processor import IdentityAnalyzer
from fastapi.middleware.cors import CORSMiddleware
import os
from pdf_generator import generate_full_identity_report
from report_mailer import send_email_with_report
from datetime import datetime
from sm_image_generator import S3_Instance
from message_generator import social_media_message_generator
from tst_email_mailer import send_tst_confirmation_email
from grsm_email_mailer import send_bio_grading_email
from word_personality_processor import WordPersonalityAnalyzer

# Entry Point for FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://self-identity.me", "https://www.self-identity.me", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initializing objects
analyzer = IdentityAnalyzer('data/prolific_data.csv', 'data/survey_data.csv', 'data/did_option_dict.json')
s3_instance = S3_Instance()
word_personality_analyzer = WordPersonalityAnalyzer('data/words_personality_and_half_life_scores.csv', 'data/word_personality_pvalues.csv')
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
    # Analyze Survey and Get Report Data
    data = analyzer.normalize_user_answer_likerts(data)


    top_id_table = analyzer.get_top_identity_report(data['finalRankedChoices'])
    
    expected_vs_actual_rank_table, expected_vs_actual_rank_short_table = analyzer.get_expected_vs_actual_rank(data)
    expected_vs_actual_rank_well_being = analyzer.get_expected_vs_actual_well_being(data, expected_vs_actual_rank_table)
    optimized_result = analyzer.get_highest_permutation(data, expected_vs_actual_rank_table)
    return {
        "top_identity_table": top_id_table,
        "expected_vs_actual_rank_table": expected_vs_actual_rank_short_table,
        "expected_vs_actual_rank_well_being": expected_vs_actual_rank_well_being,
        "optimized_result": optimized_result
    }


@app.post("/send-report")
async def handle_report_request(data: dict):
    # Send Report to User
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


@app.post("/share_social_media")
async def handle_share_social_media(data:dict):
    # Sharing Happiness on Social Media (Uploading Images to Bucket)
    now = datetime.now()
    timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
    user_email = data.get("email")
    image_urls = s3_instance.get_sm_image_paths(data=data, timestamp=timestamp, user_email=user_email)
    sm_msg = social_media_message_generator(data)
    
    return {
        "image_urls": image_urls,
        "sm_msg": sm_msg
    }

@app.post("/mail_tst_results")
async def mail_tst_results(data: dict):
    # Mailing TST Results
    user_email = data.get("user_email")
    user_name = data.get("user_name")
    statements = data.get("statements")
    send_tst_confirmation_email(user_name, user_email, statements)
    
    return {
        "status": "success", "message": f"TST Email Generated and Sent"
    }


@app.post("/mail_grade_social_media_results")
async def mail_grade_social_media_results(data: dict):
    # Mailing Social Media Bio Grading
    user_email = data.get("user_email")
    user_name = data.get("user_name")
    instagramId = data.get("instagramId")
    twitterId = data.get("twitterId")
    facebookId = data.get("facebookId")
    bio = data.get("bio")
    send_bio_grading_email(user_email, user_name, instagramId, facebookId, twitterId, bio)
    
    return {
        "status": "success", "message": f"Grade Social Media Bio Email Generated and Sent"
    }


@app.post("/word_personality_half_life_analysis")
async def word_personality_half_life_analysis(data: dict):
    # Returning Report Parameters for Word Dashboard
    word_list = data.get("word_list")
    categories = data.get("categories")
    personality_percentile_table, personality_pvalue_table = word_personality_analyzer.get_personality_scores(word_list, categories)
    km_curve_params = word_personality_analyzer.get_km_curve_params(word_list)
    
    
    return {
        "personality_percentile_table": personality_percentile_table,
        "personality_pvalue_table": personality_pvalue_table,
        "km_curve_params": km_curve_params
    }



# @app.post("/get_twitter_message")
# async def get_twitter_message(data: dict):
#     msg = twitter_message_generator(data)
#     return {
        
#     }