from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.modules.auth.models import EmployeeUser
from app.modules.auth.service import get_password_hash

# Create database connection
DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}" if settings.DB_PASSWORD else f"mysql+pymysql://{settings.DB_USER}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a database session
db = SessionLocal()

try:
    print("=== Fixing admin@ecommerce.com password ===\n")
    
    # Find the admin user
    admin = db.query(EmployeeUser).filter(
        EmployeeUser.email == "admin@ecommerce.com",
        EmployeeUser.deleted_at.is_(None)
    ).first()
    
    if not admin:
        print("❌ Admin user not found!")
    else:
        print(f"Found user: {admin.name} ({admin.email})")
        print(f"Current password hash: {admin.password[:50]}...")
        
        # Hash the password properly
        new_password_hash = get_password_hash("admin123")
        admin.password = new_password_hash
        
        db.commit()
        db.refresh(admin)
        
        print(f"\n✅ Password updated successfully!")
        print(f"New password hash: {admin.password[:50]}...")
        print("\nYou can now login with:")
        print(f"  Email: {admin.email}")
        print(f"  Password: admin123")
        
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
