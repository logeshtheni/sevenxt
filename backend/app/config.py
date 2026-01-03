# Configuration settings for the application
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # Database Configuration (PostgreSQL)
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432  # PostgreSQL default port
    DB_USER: str = "postgres"  # PostgreSQL default user
    DB_PASSWORD: str = "1234"  # Set your PostgreSQL password
    DB_NAME: str = "sevenext"  # PostgreSQL database name


    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-in-production-09876543211234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 
    
    # CORS Configuration
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8001"]
    

    # Password Reset Configuration
    RESET_TOKEN_EXPIRE_MINUTES: int = 30  # Reset link valid for 30 minutes
    FRONTEND_URL: str = "http://localhost:5173"  # Frontend URL for reset link
    TWILIO_ACCOUNT_SID: str = "ACd0cb471ec5ff7efa0b36e9b602ee05d5"
    TWILIO_AUTH_TOKEN: str = "bdd0d73e5a28e94f75d62e2991b3401f"
    TWILIO_PHONE_NUMBER: str = "+17578632685"



    
    
    # SendGrid configuration
    SENDGRID_API_KEY: str = "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"
    SENDGRID_FROM_EMAIL: str = "musicmagician92@outlook.com"  # Change to your verified sender email
    SENDGRID_FROM_NAME: str = "sdrarunvarshan"

    # -----------------------
    # Razorpay Configuration
    # -----------------------
    RAZORPAY_KEY_ID: str = "rzp_test_RsbvNk5QaP0H82"
    RAZORPAY_KEY_SECRET: str = "GUaTY0kewJ3nQ1UaE7hU2GAr"
    RAZORPAY_WEBHOOK_SECRET: str = "rdksbfbo8ha438heudjf328489y7"

    # -----------------------
    # Delhivery Webhook Security
    # -----------------------
    # IMPORTANT: Get this secret from Delhivery support or generate a strong random string
    # This is used to verify webhook signatures and prevent unauthorized requests
    DELHIVERY_WEBHOOK_SECRET: str = "test-webhook-secret-12345"  # Change in production
    
    # Webhook signature verification
    # ⚠️ TESTING MODE: Set to False to allow testing without signature
    # 🔒 PRODUCTION: MUST set to True for security
    WEBHOOK_SIGNATURE_VERIFICATION_ENABLED: bool = False  # Set True in production
    
    # Allowed IPs for webhook (Delhivery's IPs)
    # Leave empty to allow all IPs (only safe if signature verification is enabled)
    WEBHOOK_ALLOWED_IPS: list = []  # Add Delhivery IPs in production


    
    # -----------------------
    # Pydantic Config
    # -----------------------
    class Config:
        env_file = ".env"
        case_sensitive = True
        # FIX: Allow extra variables from .env to prevent crashes
        extra = "allow" 
    
    

settings = Settings()

   