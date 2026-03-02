import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
from dotenv import load_dotenv
from matplotlib import use
import os
load_dotenv()
def send_email_with_report(user_email, report_path):
    sender_email = os.getenv("GMAIL_USER")
    app_password = os.getenv("GMAIL_APP_PASSWORD")

    message = MIMEMultipart()
    message["From"] = os.getenv("REPORT_SENDER_NAME")
    message["To"] = user_email
    message["Subject"] = "Your Personalized Self Identity Report"

    body = "Thank you for participating in our survey. Please find your detailed Identity Report attached as a PDF."
    message.attach(MIMEText(body, "plain"))

    with open(report_path, "rb") as attachment:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read())



    encoders.encode_base64(part)
    part.add_header(
        "Content-Disposition",
        f"attachment; filename= Identity_Report.pdf",
    )
    message.attach(part)


    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.sendmail(sender_email, user_email, message.as_string())
        print(f"Email sent successfully to {user_email}")
    except Exception as e:
        print(f"Error sending email: {e}")