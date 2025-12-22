# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # -----------------------
    # Database Configuration
    # -----------------------
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "sevenext"

    # -----------------------
    # API Configuration
    # -----------------------
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-in-production-09876543211234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # -----------------------
    # CORS Configuration
    # -----------------------
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8001",
    ]

    # -----------------------
    # Password Reset
    # -----------------------
    RESET_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_URL: str = "http://localhost:5173"
    

    # -----------------------
    # SendGrid (Email)
    # -----------------------
    SENDGRID_API_KEY: str = ""  # Bro, keep these as empty strings if not used
    SENDGRID_FROM_EMAIL: str = ""
    SENDGRID_FROM_NAME: str = ""

    # -----------------------
    # TWILIO CONFIGURATION (Merged Here!)
    # -----------------------
    TWILIO_ACCOUNT_SID: str = "ACd0cb471ec5ff7efa0b36e9b602ee05d5"
    TWILIO_AUTH_TOKEN: str = "bdd0d73e5a28e94f75d62e2991b3401f"
    TWILIO_PHONE_NUMBER: str = "+17578632685"


    #---------------------------
    # Razorpay Configuration
    #---------------------------



    # FIX: You must add ': str' before the '=' sign
    RAZORPAY_KEY_ID: str = "rzp_test_RsbvNk5QaP0H82"
    RAZORPAY_KEY_SECRET: str = "GUaTY0kewJ3nQ1UaE7hU2GAr"
    RAZORPAY_WEBHOOK_SECRET: str = "rdksbfbo8ha438heudjf328489y7"



    # -----------------------
    # Pydantic Config
    # -----------------------
    class Config:
        env_file = ".env" # It will look for .env but use defaults if file is missing
        case_sensitive = True

# Create one single instance
settings = Settings()