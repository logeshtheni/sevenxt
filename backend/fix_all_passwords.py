from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.modules.auth.models import EmployeeUser
from app.modules.auth.service import get_password_hash
import bcrypt

# Create database connection
DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}" if settings.DB_PASSWORD else f"mysql+pymysql://{settings.DB_USER}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a database session
db = SessionLocal()

def is_valid_hash(password_hash):
    """Check if a password hash is valid (bcrypt or PBKDF2)"""
    # Check for bcrypt hash
    if password_hash.startswith('$2'):
        return True
    # Check for PBKDF2 hash (contains ':' and is long enough)
    if ':' in password_hash and len(password_hash) > 100:
        return True
    return False

try:
    print("=== Checking all employees for invalid password hashes ===\n")
    
    employees = db.query(EmployeeUser).filter(
        EmployeeUser.deleted_at.is_(None)
    ).all()
    
    fixed_count = 0
    
    for emp in employees:
        if not is_valid_hash(emp.password):
            print(f"⚠️  Found invalid hash for: {emp.name} ({emp.email})")
            print(f"   Current hash: {emp.password[:50]}...")
            
            # For users with plain text passwords, we can't recover them
            # We'll set a default password that they need to change
            default_password = "ChangeMe123!"
            new_hash = get_password_hash(default_password)
            emp.password = new_hash
            
            print(f"   ✅ Updated with default password: {default_password}")
            print(f"   New hash: {new_hash[:50]}...")
            print()
            
            fixed_count += 1
    
    if fixed_count > 0:
        db.commit()
        print(f"\n✅ Fixed {fixed_count} employee(s) with invalid password hashes")
        print("\n⚠️  IMPORTANT: Users with fixed passwords need to login with:")
        print("   Password: ChangeMe123!")
        print("   They should change this password immediately after logging in.")
    else:
        print("✅ All employees have valid password hashes!")
        
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
