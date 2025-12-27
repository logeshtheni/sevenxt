from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # -----------------------
    # Database Configuration
    # -----------------------
    # FIX: Added DATABASE_URL to match your .env file
    DATABASE_URL: str = "mysql+pymysql://root:@localhost:3306/sevenext"
    
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
    # Password Reset & Twilio
    # -----------------------
    RESET_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_URL: str = "http://localhost:3000"
    TWILIO_ACCOUNT_SID: str = "ACd0cb471ec5ff7efa0b36e9b602ee05d5"
    TWILIO_AUTH_TOKEN: str = "bdd0d73e5a28e94f75d62e2991b3401f"
    TWILIO_PHONE_NUMBER: str = "+17578632685"


    
      # SendGrid Configuration
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
    # Pydantic Config
    # -----------------------
    class Config:
        env_file = ".env"
        case_sensitive = True
        # FIX: Allow extra variables from .env to prevent crashes
        extra = "allow" 

# Create one single instance
settings = Settings()