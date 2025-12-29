import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.modules.auth.service import verify_password, authenticate_employee

# Create database connection
DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}" if settings.DB_PASSWORD else f"mysql+pymysql://{settings.DB_USER}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Test credentials
test_email = input("Enter email: ")
test_password = input("Enter password: ")

# Create a database session
db = SessionLocal()

try:
    # Test authentication
    print(f"\n=== Testing Authentication ===")
    print(f"Email: {test_email}")
    print(f"Password: {test_password}")
    
    employee = authenticate_employee(db, test_email, test_password)
    
    if employee:
        print(f"\n✅ Authentication SUCCESSFUL!")
        print(f"Employee ID: {employee.id}")
        print(f"Name: {employee.name}")
        print(f"Role: {employee.role}")
        print(f"Status: {employee.status}")
    else:
        print(f"\n❌ Authentication FAILED!")
        
        # Let's debug why
        from app.modules.auth.models import EmployeeUser
        emp = db.query(EmployeeUser).filter(
            EmployeeUser.email == test_email,
            EmployeeUser.deleted_at.is_(None)
        ).first()
        
        if not emp:
            print("Reason: Email not found in database")
        elif emp.status and emp.status.lower() != "active":
            print(f"Reason: Account status is '{emp.status}' (must be 'active')")
        else:
            print(f"Reason: Password verification failed")
            print(f"Stored hash: {emp.password[:50]}...")
            
            # Test password verification
            result = verify_password(test_password, emp.password)
            print(f"verify_password result: {result}")
            
            # Test bcrypt directly
            try:
                bcrypt_result = bcrypt.checkpw(test_password.encode('utf-8'), emp.password.encode('utf-8'))
                print(f"bcrypt.checkpw result: {bcrypt_result}")
            except Exception as e:
                print(f"bcrypt error: {e}")

finally:
    db.close()
