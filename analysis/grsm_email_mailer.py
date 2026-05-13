import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Generating Sample Email for the Bio Grading Test
def generate_bio_grading_email_html(user_name: str, bio_data: dict):
    """
    bio_data expected keys: 'instagram', 'facebook', 'twitter', 'bio'
    """
    user_name_str = f" {user_name}" if user_name else ""
    
    # Header and Introduction
    html = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; color: #1e293b; line-height: 1.6;">
        <div style="background-color: #4f46e5; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Bio Grading Analysis</h1>
            <p style="color: #e0e7ff; margin-top: 10px;">Social Media Identity Verification</p>
        </div>
        
        <div style="padding: 40px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; background-color: #ffffff;">
            <p style="font-size: 16px;">Hi{user_name_str},</p>
            <p style="font-size: 15px; color: #475569;">We have received your social media profiles for grading. Here is a summary of the data currently being analyzed:</p>
            
            <div style="margin: 25px 0; border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    """

    socials = [
        ('Instagram', bio_data.get('instagram'), '#db2777'),
        ('Facebook', bio_data.get('facebook'), '#2563eb'),
        ('Twitter (X)', bio_data.get('twitter'), '#0f172a')
    ]

    for label, value, color in socials:
        if value:
            html += f"""
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 12px 15px; color: #64748b; font-weight: 600; width: 120px;">{label}</td>
                    <td style="padding: 12px 15px; color: {color}; font-weight: bold;">{value}</td>
                </tr>
            """

    html += f"""
                </table>
            </div>

            <div style="margin-top: 30px;">
                <p style="font-size: 14px; font-weight: 600; color: #64748b; margin-bottom: 8px; text-transform: uppercase;">Submitted Bio:</p>
                <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 20px; font-style: italic; color: #334155; border-radius: 4px;">
                    "{bio_data.get('bio', 'No bio provided.')}"
                </div>
            </div>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #eff6ff; border-radius: 12px; text-align: center;">
                <p style="margin: 0; font-weight: 700; color: #1e40af; font-size: 16px;">
                    📊 We are currently analyzing your responses.
                </p>
                <p style="margin-top: 8px; color: #1e40af; font-size: 14px; opacity: 0.8;">
                    We are processing your results and they will be mailed to you soon.
                </p>
            </div>
        </div>
        

    </div>
    """
    return html


# Sending Bio Grading Email to the user
def send_bio_grading_email(user_email, user_name, instagram, facebook, twitter, bio):
    bio_payload = {
        'instagram': instagram,
        'facebook': facebook,
        'twitter': twitter,
        'bio': bio
    }
    
    ses_endpoint = os.getenv("SES_ENDPOINT")
    ses_user = os.getenv("SES_EMAIL_ID")
    ses_pw = os.getenv("SES_EMAIL_PASSWORD")
    sender = os.getenv("SENDER_DISPLAY_EMAIL")
    
    message = MIMEMultipart("alternative")
    message["Subject"] = "Analyzing Your Social Media Bio..."
    message["From"] = f"Self-Identity Project <{sender}>"
    message["To"] = user_email

    html_content = generate_bio_grading_email_html(user_name, bio_payload)
    message.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP(ses_endpoint, 587) as server:
            server.starttls()
            server.login(ses_user, ses_pw)
            server.sendmail(sender, user_email, message.as_string())
        return True
    except Exception as e:
        print(f"Error sending Bio mail: {e}")
        return False
