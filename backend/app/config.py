# Configuration settings for the application
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database Configuration
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "sevenext"
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-in-production-09876543211234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 
    
    # CORS Configuration
    CORS_ORIGINS: list = ["*"]
    

    # Password Reset Configuration
    RESET_TOKEN_EXPIRE_MINUTES: int = 30  # Reset link valid for 30 minutes
    FRONTEND_URL: str = "http://localhost:5173"  # Frontend URL for reset link

    
    
    # SendGrid Configuration
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = ""  # Change to your verified sender email
    SENDGRID_FROM_NAME: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
