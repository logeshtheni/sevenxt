from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.modules.auth.models import EmployeeUser

# Create database connection
DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}" if settings.DB_PASSWORD else f"mysql+pymysql://{settings.DB_USER}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a database session
db = SessionLocal()

try:
    print("=== All Active Employees in Database ===\n")
    employees = db.query(EmployeeUser).filter(
        EmployeeUser.deleted_at.is_(None)
    ).all()
    
    if not employees:
        print("No employees found in database!")
    else:
        for emp in employees:
            print(f"ID: {emp.id}")
            print(f"Name: {emp.name}")
            print(f"Email: {emp.email}")
            print(f"Role: {emp.role}")
            print(f"Status: {emp.status}")
            print(f"Password Hash (first 50 chars): {emp.password[:50]}...")
            print("-" * 50)
            
finally:
    db.close()
