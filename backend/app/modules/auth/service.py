from datetime import datetime, timedelta
from typing import Optional, List
from jose import JWTError, jwt
# from passlib.context import CryptContext  # Causing crashes on Windows
from sqlalchemy.orm import Session
from app.config import settings
from app.modules.auth.models import EmployeeUser, User

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

import hashlib
import os

def get_password_hash(password: str) -> str:
    """Hash a password using SHA-256 with a salt"""
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt.hex() + ':' + key.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        # Check for bcrypt hash (starts with $2b$ or $2a$ or $2y$)
        if hashed_password.startswith('$2'):
            import bcrypt
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
        
        # Check for PBKDF2 hash (contains ':')
        if ':' in hashed_password:
            salt_hex, key_hex = hashed_password.split(':')
            salt = bytes.fromhex(salt_hex)
            key = bytes.fromhex(key_hex)
            new_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
            return new_key == key
        
        # Check for plain text (legacy/temporary)
        return plain_password == hashed_password
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def authenticate_employee(db: Session, email: str, password: str) -> Optional[EmployeeUser]:
    """Authenticate an employee (admin/staff) by email and password"""
    # Check if employee exists and is not deleted
    employee = db.query(EmployeeUser).filter(
        EmployeeUser.email == email,
        EmployeeUser.deleted_at.is_(None)
    ).first()
    
    if not employee:
        return None
    
    # Check if employee is active
    if employee.status and employee.status.lower() != "active":
        return None
    
    # Verify password
    if not verify_password(password, employee.password):
        return None
    
    # Update last login
    try:
        employee.last_login = datetime.utcnow()
        db.commit()
        db.refresh(employee)
    except Exception:
        db.rollback()
    
    return employee

def get_employee_by_email(db: Session, email: str) -> Optional[EmployeeUser]:
    """Get an employee by email"""
    return db.query(EmployeeUser).filter(
        EmployeeUser.email == email,
        EmployeeUser.deleted_at.is_(None)
    ).first()

def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all B2B/B2C users for display"""
    return db.query(User).filter(
        User.deleted_at.is_(None)
    ).offset(skip).limit(limit).all()

def get_all_employees(db: Session) -> List[EmployeeUser]:
    """Get all admin/staff users"""
    return db.query(EmployeeUser).filter(
        EmployeeUser.deleted_at.is_(None)
    ).all()

def create_employee(db: Session, employee_data: dict) -> EmployeeUser:
    """Create a new employee (admin/staff)"""
    # Hash the password
    hashed_password = get_password_hash(employee_data['password'])
    
    # Create employee object
    new_employee = EmployeeUser(
        name=employee_data['name'],
        email=employee_data['email'],
        password=hashed_password,
        role=employee_data.get('role', 'staff'),
        status=employee_data.get('status', 'active'),
        address=employee_data.get('address'),
        city=employee_data.get('city'),
        state=employee_data.get('state'),
        pincode=employee_data.get('pincode'),
        permissions=employee_data.get('permissions')
    )
    
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    return new_employee

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get a B2B/B2C user by email"""
    return db.query(User).filter(
        User.email == email,
        User.deleted_at.is_(None)
    ).first()

def create_user(db: Session, user_data: dict) -> User:
    """Create a new B2B/B2C user"""
    # Hash the password
    hashed_password = get_password_hash(user_data['password'])
    
    # Create user object
    new_user = User(
        name=user_data['name'],
        email=user_data['email'],
        password=hashed_password,
        role=user_data.get('role', 'user'),
        status=user_data.get('status', 'active'),
        address=user_data.get('address'),
        city=user_data.get('city'),
        state=user_data.get('state'),
        pincode=user_data.get('pincode'),
        permissions=user_data.get('permissions')
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# ========== OTP PASSWORD RESET (SENDGRID) ==========

from app.modules.auth.sendgrid_utils import sendgrid_service

def request_password_reset_otp(db: Session, email: str) -> Optional[str]:
    """Generate OTP, store it in DB, and send via SendGrid"""
    
    # Check if user exists in Employee table
    employee = db.query(EmployeeUser).filter(
        EmployeeUser.email == email,
        EmployeeUser.deleted_at.is_(None)
    ).first()
    
    # Check if user exists in User table (if not found in Employee)
    user = None
    if not employee:
        user = db.query(User).filter(
            User.email == email,
            User.deleted_at.is_(None)
        ).first()
    
    if not employee and not user:
        return None
    
    # Generate a 6-digit OTP
    otp = generate_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=10)
    
    # Store OTP in database (using reset_token field)
    if employee:
        employee.reset_token = otp
        employee.reset_token_expires = otp_expires
    if user:
        user.reset_token = otp
        user.reset_token_expires = otp_expires
    
    db.commit()
    
    # Send OTP via SendGrid
    sent = sendgrid_service.send_otp_email(email, otp)
    print(f"🔐 OTP for {email}: {otp}")  # KEEP THIS FOR DEBUGGING
    print(f"ℹ️  If email is not received, please check SPAM folder or use the code above.")
    
    if not sent:
        print(f"⚠️ SendGrid failed, but OTP stored. OTP for {email}: {otp}")
        # Still return success since OTP is generated and stored
        # The OTP will be shown in console for testing
        return "sent_fallback"
        
    return "sent_via_sendgrid"

def reset_password_with_otp(db: Session, email: str, otp: str, new_password: str) -> bool:
    """Verify OTP from database and reset password"""
    
    employee = db.query(EmployeeUser).filter(
        EmployeeUser.email == email,
        EmployeeUser.deleted_at.is_(None)
    ).first()
    
    user = db.query(User).filter(
        User.email == email,
        User.deleted_at.is_(None)
    ).first()
    
    if not employee and not user:
        return False
    
    # Check OTP for employee
    if employee:
        if not employee.reset_token or employee.reset_token != otp:
            print(f"❌ Invalid OTP for employee. Expected: {employee.reset_token}, Got: {otp}")
            return False
        if employee.reset_token_expires and employee.reset_token_expires < datetime.utcnow():
            print(f"❌ OTP expired for employee")
            return False
    
    # Check OTP for user (if no employee found)
    if user and not employee:
        if not user.reset_token or user.reset_token != otp:
            print(f"❌ Invalid OTP for user. Expected: {user.reset_token}, Got: {otp}")
            return False
        if user.reset_token_expires and user.reset_token_expires < datetime.utcnow():
            print(f"❌ OTP expired for user")
            return False
        
    # Update Password
    hashed_password = get_password_hash(new_password)
    
    if employee:
        employee.password = hashed_password
        employee.reset_token = None
        employee.reset_token_expires = None
        
    if user:
        user.password = hashed_password
        user.reset_token = None
        user.reset_token_expires = None
    
    db.commit()
    print(f"✅ Password reset successfully for {email}")
    
    return True

