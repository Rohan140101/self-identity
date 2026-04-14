#!/usr/bin/env python3

import os
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
from datetime import datetime, timedelta
from collections import defaultdict

load_dotenv()

script_dir = os.path.dirname(os.path.abspath(__file__))
def get_google_analytics_data():
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "data/deft-cove-493201-s4-db47c88b6ce1.json"
    PROPERTY_ID = os.getenv("GOOGLE_ANALYTICS_PROPERTY_ID")

    client = BetaAnalyticsDataClient()

    ## Weekly
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="pagePath")],
        metrics=[Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
    )

    response = client.run_report(request)
    page_paths_visitors = {}
    total_users = 0
    for row in response.rows:
        page_path = row.dimension_values[0].value
        users = int(row.metric_values[0].value)
        page_paths_visitors[page_path] = users
        total_users += users

    return total_users, page_paths_visitors

# def g

def get_survey_counts():
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name("data/deft-cove-493201-s4-db47c88b6ce1.json")

    client = gspread.authorize(creds)

    sheet = client.open_by_key(os.getenv("GOOGLE_SHEET_ID")).worksheet("Sheet1")
    data = sheet.get_all_records()
    df = pd.DataFrame(data)
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])

    survey_data = defaultdict(lambda: defaultdict(int))

    # Weekly
    one_week_ago = datetime.now() - timedelta(days=7)
    last_week_df = df[df['Timestamp'] >= one_week_ago]
    survey_data["weekly"]["survey_takers"] =  last_week_df.shape[0]
    survey_data["weekly"]["short_survey_takers"] =  last_week_df[last_week_df['surveyType'] == "short"].shape[0]
    survey_data["weekly"]["long_survey_takers"] =  last_week_df[last_week_df['surveyType'] == "long"].shape[0]

    # All Time
    survey_data["all_time"]["survey_takers"] =  df.shape[0]
    survey_data["all_time"]["short_survey_takers"] =  df[df['surveyType'] == "short"].shape[0]
    survey_data["all_time"]["long_survey_takers"] =  df[df['surveyType'] == "long"].shape[0]

    return survey_data
    

def get_words_search_data():
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name("data/deft-cove-493201-s4-db47c88b6ce1.json")

    client = gspread.authorize(creds)

    sheet = client.open_by_key(os.getenv("GOOGLE_SHEET_WORD_PERSONALITY")).worksheet("Sheet1")
    data = sheet.get_all_records()
    df = pd.DataFrame(data)
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])

    words_search_data = defaultdict(lambda: defaultdict(int))
    one_week_ago = datetime.now() - timedelta(days=7)
    last_week_df = df[df['Timestamp'] >= one_week_ago]

    # Weekly
    
    words_search_data["weekly"]["number_of_queries"] = last_week_df.shape[0]
    search_dict = defaultdict(int)
    for row in last_week_df['Query'].str.split(','):
        
        if isinstance(row, list):
            row = [x.lower().strip() for x in row]
            for word in row:
                search_dict[word] += 1
    search_dict = {k:v for (k,v) in sorted(search_dict.items(), key=lambda x: x[1], reverse=True)}
    search_list = []
    i = 10
    for word, count in search_dict.items():
        if i <= 0:
            break

        search_list.append((word, count))
        i -= 1

    words_search_data["weekly"]["search_list"] = search_list
    
    
    # All Time
    words_search_data["all_time"]["number_of_queries"] = df.shape[0]
    search_dict = defaultdict(int)
    for row in df['Query'].str.split(','):
        
        if isinstance(row, list):
            row = [x.lower().strip() for x in row]
            for word in row:
                search_dict[word] += 1
    search_dict = {k:v for (k,v) in sorted(search_dict.items(), key=lambda x: x[1], reverse=True)}
    search_list = []
    i = 10
    for word, count in search_dict.items():
        if i <= 0:
            break

        search_list.append((word, count))
        i -= 1

    words_search_data["all_time"]["search_list"] = search_list
    return words_search_data

            




def generate_email_html():
    total_users, page_path_visitors = get_google_analytics_data()
    survey_data = get_survey_counts()
    words_search_data = get_words_search_data()

    html = f"""
    <div style="background-color: #f8fafc; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155;">
            
            <h1 style="margin-top: 0; color: #0f172a; font-size: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">Weekly Analytics Report</h1>
            
            <h2 style="color: #0f172a; font-size: 18px; margin-top: 25px;">Web Visitors (Weekly)</h2>
            <p style="font-size: 16px;"><strong>Total Unique Visitors:</strong> {total_users}</p>
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px;">
                <p style="margin-top: 0; font-weight: bold;">PageWise Breakdown:</p>
    """

    for page, visitors in page_path_visitors.items():
        html += f'<p style="margin: 4px 0; font-size: 14px;">{page}: <span style="color: #2563eb;">{visitors}</span></p>'

    html += """
            </div>

            <h2 style="color: #0f172a; font-size: 18px; margin-top: 25px;">Survey Completion Data</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong>Metric</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong>Weekly</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong>All-Time</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-size: 14px;">Total Takers</td>
                    <td style="padding: 8px 0; font-size: 14px;">{w_st}</td>
                    <td style="padding: 8px 0; font-size: 14px;">{a_st}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-size: 14px;">Short Survey Takers</td>
                    <td style="padding: 8px 0; font-size: 14px;">{w_sst}</td>
                    <td style="padding: 8px 0; font-size: 14px;">{a_sst}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-size: 14px;">Long Survey Takers</td>
                    <td style="padding: 8px 0; font-size: 14px;">{w_lst}</td>
                    <td style="padding: 8px 0; font-size: 14px;">{a_lst}</td>
                </tr>
            </table>
    """.format(
        w_st=survey_data['weekly']['survey_takers'],
        a_st=survey_data['all_time']['survey_takers'],
        w_sst=survey_data['weekly']['short_survey_takers'],
        a_sst=survey_data['all_time']['short_survey_takers'],
        w_lst=survey_data['weekly']['long_survey_takers'],
        a_lst=survey_data['all_time']['long_survey_takers'],

    )

    html += """
            <h2 style="color: #0f172a; font-size: 18px; margin-top: 25px;">Top Search Queries (Weekly)</h2>
            <p><strong>Total Queries:</strong> {queries}</p>
    """.format(queries=words_search_data["weekly"]["number_of_queries"])

    for i, (word, count) in enumerate(words_search_data["weekly"]["search_list"][:10]):
        html += f'<p style="margin: 4px 0; font-size: 14px;">{i+1}. {word}: <strong>{count}</strong></p>'

    html += """
            <h2 style="color: #0f172a; font-size: 18px; margin-top: 25px;">Top Search Queries (All Time)</h2>
            <p><strong>Total Queries:</strong> {queries}</p>
    """.format(queries=words_search_data["all_time"]["number_of_queries"])

    for i, (word, count) in enumerate(words_search_data["all_time"]["search_list"][:10]):
        html += f'<p style="margin: 4px 0; font-size: 14px;">{i+1}. {word}: <strong>{count}</strong></p>'



    html += """

        </div>
    </div>
    """
    return html






def send_email():
    website_name = os.getenv("WEBSITE_NAME")
    sender_display_email = os.getenv("SENDER_DISPLAY_EMAIL")
    ses_email_id = os.getenv("SES_EMAIL_ID")
    ses_email_password = os.getenv("SES_EMAIL_PASSWORD")
    ses_endpoint = os.getenv("SES_ENDPOINT")
    user_emails = ["skiena@gmail.com"]
    message = MIMEMultipart("related")
    message["From"] =f"{website_name} <{sender_display_email}>"

    message["To"] = ", ".join(user_emails)
    message["Subject"] = "Weekly Report for Self-Identity Website"

    html_body = generate_email_html()
    msg_alternative = MIMEMultipart("alternative")
    message.attach(msg_alternative)
    msg_alternative.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL(ses_endpoint, 465) as server:
            server.login(ses_email_id, ses_email_password)
            server.sendmail(sender_display_email, user_emails, message.as_string())
        print(f"Email sent successfully to {user_emails}")
    except Exception as e:
        print(f"Error sending email: {e}")


send_email()


