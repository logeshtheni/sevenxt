# Configuration settings for the application
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database Configuration (PostgreSQL)
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432  # PostgreSQL default port
    DB_USER: str = "postgres"  # PostgreSQL default user
    DB_PASSWORD: str = "1234"  # Set your PostgreSQL password
    DB_NAME: str = "sevenext"
    
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

    
    
    # SendGrid configuration
    SENDGRID_API_KEY: str = "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"
    SENDGRID_FROM_EMAIL: str = "musicmagician92@outlook.com"  # Change to your verified sender email
    SENDGRID_FROM_NAME: str = "sdrarunvarshan"
    
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
