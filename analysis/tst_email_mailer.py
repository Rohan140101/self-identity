import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
# Generating Sample Email for TST
def generate_tst_email_html(user_name: str, tst_responses: list):

    user_name_str = f" {user_name}" if user_name else ""
    
    html = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; color: #1e293b; line-height: 1.6;">
        <div style="background-color: #0f172a; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Twenty Statements Test</h1>
            <p style="color: #94a3b8; margin-top: 10px;">Self-Concept Analysis Summary</p>
        </div>
        
        <div style="padding: 40px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; bg-color: #ffffff;">
            <p style="font-size: 16px;">Hi{user_name_str},</p>
            <p style="font-size: 15px; color: #475569;">You recently completed the Twenty Statements Test. Here are the initial responses you provided for <strong>"Who am I?"</strong>:</p>
            
            <div style="margin: 30px 0; background-color: #f8fafc; padding: 20px; border-radius: 12px;">
    """

    for i, response in enumerate(tst_responses):
        html += f"""
            <div style="margin-bottom: 12px; font-size: 15px; display: flex;">
                <span style="color: #94a3b8; min-width: 35px; font-weight: bold;">#{i+1}</span>
                <span style="color: #64748b; font-weight: 500;">I am&nbsp;</span>
                <span style="color: #4f46e5; font-weight: 700; background-color: #eef2ff; padding: 2px 8px; border-radius: 4px; border-bottom: 1px solid #c7d2fe;">
                    {response if response else "..."}
                </span>
            </div>
        """

    html += """
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px dashed #f1f5f9; text-align: center;">
                <p style="font-weight: 700; color: #0f172a; font-size: 16px;">
                    📊 We are currently analyzing your responses.
                </p>
                <p style="color: #64748b; font-size: 14px;">
                    We are processing your results and they will be mailed to you soon.
                </p>
            </div>
        </div>

    </div>
    """
    return html




# Sending TST Confirmation Email
def send_tst_confirmation_email(user_name, user_email, tst_responses):
    website_name = os.getenv("WEBSITE_NAME")
    sender_display_email = os.getenv("SENDER_DISPLAY_EMAIL")
    ses_email_id = os.getenv("SES_EMAIL_ID")
    ses_email_password = os.getenv("SES_EMAIL_PASSWORD")
    ses_endpoint = os.getenv("SES_ENDPOINT")

    message = MIMEMultipart("related")
    message["From"] =f"{website_name} <{sender_display_email}>"

    message["To"] = user_email
    message["Subject"] = "Your Twenty Statements Test Responses"

    html_body = generate_tst_email_html(user_name, tst_responses)
    
    message.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(ses_endpoint, 587) as server:
            server.starttls()
            server.login(ses_email_id, ses_email_password)
            server.sendmail(sender_display_email, user_email, message.as_string())
        print(f"TST Responses sent to {user_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False