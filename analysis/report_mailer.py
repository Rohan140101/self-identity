import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.application import MIMEApplication
from email import encoders
from dotenv import load_dotenv
from matplotlib import use
import os
from io import BytesIO

load_dotenv()
def generate_email_html(data, user_name: str):
    user_name_str = f" {user_name}" if user_name else user_name 
    html = f"""
    <p> Hi{user_name_str}, here is your self-identity report.</p>
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: auto; color: #334155;">
        <h1 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Your Identity Report</h1>
        <h2 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; italic;">Identity Optimization Summary</h2>
    """

    for i, (key, result) in enumerate(data['optimized_result'].items()):
        html += f"""
        <div style="margin-top: 40px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
            <h2 style="color: #7c3aed; margin-bottom: 5px;">{i+1}. {key}</h2>
            
            

            <div style="text-align: center; margin: 25px 0;">
                <img src="cid:graph_{i}" style="width: 100%; max-width: 500px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            </div>

            <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                <p style="margin: 0; font-size: 15px; color: #1e293b;">{result['optimization_message']['message']}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
                <thead>
                    <tr style="background-color: #0f172a; color: white;">
                        <th style="padding: 10px; text-align: left;">Rank</th>
                        <th style="padding: 10px; text-align: left;">Current Identity</th>
                        <th style="padding: 10px; text-align: left; color: #86efac;">Better Identity for You</th>
                    </tr>
                </thead>
                <tbody>
        """
        for j in range(5):
            actual = result["actual_top5"][j]
            opt = result["optimized_top5"][j]
            bg = "#f8fafc" if j % 2 == 0 else "#ffffff"
            html += f"""
                <tr style="background-color: {bg};">
                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #94a3b8;">#{j+1}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">{actual}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">{opt}</td>
                </tr>
            """
            
        html += "</tbody></table></div>"


    html += """
    <h2 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; italic;">Expected vs Acutal Identity</h2>
    <div style="margin-top: 40px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
                <thead>
                    <tr style="background-color: #0f172a; color: white;">
                        <th style="padding: 10px; text-align: left;">Identity Component</th>
                        <th style="padding: 10px; text-align: left;">Predicted Rank</th>
                        <th style="padding: 10px; text-align: left; color: #86efac;">Actual Rank</th>
                    </tr>
                </thead>
                <tbody>
    """

    for row in data['expected_vs_actual_rank_table']:
        html += f"""
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #94a3b8;">{row['component']}</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">{row['predicted_rank']}</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">{row['actual_rank']}</td>
            </tr>
        """
        

    html += "</tbody></table></div>"

    html += "</div>"
    return html


def send_email_with_report(data, user_name, user_email, report_path, generated_images):
    sender_email = os.getenv("GMAIL_USER")
    app_password = os.getenv("GMAIL_APP_PASSWORD")

    message = MIMEMultipart("related")
    message["From"] =f"{os.getenv("REPORT_SENDER_NAME")} <{sender_email}>"

    message["To"] = user_email
    message["Subject"] = "Your Personal Self-Identity Analysis"

    # body = "Thank you for participating in our survey. Please find your detailed Identity Report attached as a PDF."
    # message.attach(MIMEText(body, "plain"))

    html_body = generate_email_html(data, user_name)
    msg_alternative = MIMEMultipart("alternative")
    message.attach(msg_alternative)
    msg_alternative.attach(MIMEText(html_body, "html"))

    for i, fig in enumerate(generated_images):
        img_bytes = BytesIO()
        fig.write_image(img_bytes, format="png", scale=2) 
        img_bytes.seek(0)
        
        image = MIMEImage(img_bytes.read())
        image.add_header("Content-ID", f"<graph_{i}>")
        image.add_header("Content-Disposition", "inline", filename=f"graph_{i}.png")
        message.attach(image)

    with open(report_path, "rb") as f:
        pdf_attachment = MIMEApplication(f.read(), _subtype="pdf")
        pdf_attachment.add_header("Content-Disposition", "attachment", filename="Full_Report.pdf")
        message.attach(pdf_attachment)

    # with open(report_path, "rb") as attachment:
    #     part = MIMEBase("application", "octet-stream")
    #     part.set_payload(attachment.read())



    # encoders.encode_base64(part)
    # part.add_header(
    #     "Content-Disposition",
    #     f"attachment; filename= Identity_Report.pdf",
    # )
    # message.attach(part)


    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.sendmail(sender_email, user_email, message.as_string())
        print(f"Email sent successfully to {user_email}")
    except Exception as e:
        print(f"Error sending email: {e}")