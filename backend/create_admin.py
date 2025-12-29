from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.modules.auth.models import EmployeeUser
from app.modules.auth.service import get_password_hash
from app.database import Base

DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}" if settings.DB_PASSWORD else f"mysql+pymysql://{settings.DB_USER}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def create_admin_user():
    email = "admin@ecommerce.com"
    password = "admin123"
    
    # Check if user exists
    existing_user = db.query(EmployeeUser).filter(EmployeeUser.email == email).first()
    if existing_user:
        print(f"User {email} already exists. Updating password...")
        existing_user.password = get_password_hash(password)
        existing_user.role = "admin"
        existing_user.status = "active"
        db.commit()
        print(f"User {email} updated successfully.")
    else:
        print(f"Creating new admin user {email}...")
        new_user = EmployeeUser(
            name="Super Admin",
            email=email,
            password=get_password_hash(password),
            role="admin",
            status="active"
        )
        db.add(new_user)
        db.commit()
        print(f"User {email} created successfully.")

if __name__ == "__main__":
    create_admin_user()
