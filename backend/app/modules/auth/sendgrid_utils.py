# SendGrid Email Utility for sending OTP emails
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, HtmlContent
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class SendGridService:
    def __init__(self):
        self.client = None
        self.from_email = settings.SENDGRID_FROM_EMAIL
        self.from_name = settings.SENDGRID_FROM_NAME
        
        if settings.SENDGRID_API_KEY:
            try:
                self.client = SendGridAPIClient(settings.SENDGRID_API_KEY)
                logger.info("SendGrid client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize SendGrid Client: {e}")

    def send_otp_email(self, to_email: str, otp: str) -> bool:
        """Send OTP via SendGrid"""
        if not self.client:
            logger.warning("SendGrid Client not initialized. Cannot send OTP.")
            print(f"⚠️ SendGrid not configured. OTP for {to_email}: {otp}")
            return False
            
        try:
            # Simplified HTML to improve deliverability
            html_content = f"""
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Password Reset Request</h2>
                <p>Your OTP code is:</p>
                <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px;">{otp}</h1>
                <p>This code is valid for 10 minutes.</p>
                <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
            </div>
            """
            
            message = Mail(
                from_email=(self.from_email, self.from_name),
                to_emails=to_email,
                subject="Your SevenNXT Password Reset Code", # Simpler subject
                html_content=html_content
            )
            
            response = self.client.send(message)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"OTP email sent successfully to {to_email}")
                print(f"✅ OTP email sent successfully to {to_email}")
                return True
            else:
                logger.error(f"SendGrid returned status {response.status_code}")
                print(f"❌ SendGrid returned status {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending OTP email via SendGrid: {e}")
            print(f"❌ Error sending OTP email: {e}")
            # Print OTP to console for debugging
            print(f"🔐 OTP for {to_email}: {otp}")
            return False


sendgrid_service = SendGridService()
