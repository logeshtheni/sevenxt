from sqlalchemy.orm import Session
from typing import List, Optional, Union
from app.modules.auth.models import EmployeeUser, User, AdminUser
from app.modules.auth.service import get_password_hash
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all B2B/B2C users for display"""
    return db.query(User).filter(
        User.deleted_at.is_(None)
    ).offset(skip).limit(limit).all()

def get_all_employees(db: Session) -> List[Union[EmployeeUser, AdminUser]]:
    """Get all admin/staff users"""
    staff = db.query(EmployeeUser).filter(EmployeeUser.deleted_at.is_(None)).all()
    admins = db.query(AdminUser).filter(AdminUser.deleted_at.is_(None)).all()
    
    # Combine lists (admins first)
    return admins + staff

def get_employee_by_email(db: Session, email: str) -> Optional[Union[EmployeeUser, AdminUser]]:
    """Get an employee by email (checks both tables)"""
    # Check Admin first
    admin = db.query(AdminUser).filter(
        AdminUser.email == email,
        AdminUser.deleted_at.is_(None)
    ).first()
    if admin: return admin
    
    # Check Staff
    return db.query(EmployeeUser).filter(
        EmployeeUser.email == email,
        EmployeeUser.deleted_at.is_(None)
    ).first()

def create_employee(db: Session, employee_data: dict) -> Union[EmployeeUser, AdminUser]:
    """Create a new employee (admin/staff)"""
    hashed_password = get_password_hash(employee_data['password'])
    role = employee_data.get('role', 'staff').lower()
    
    if role == 'admin':
        new_admin = AdminUser(
            name=employee_data['name'],
            email=employee_data['email'],
            password=hashed_password,
            role='admin',
            status=employee_data.get('status', 'active').lower(),
            address=employee_data.get('address'),
            city=employee_data.get('city'),
            state=employee_data.get('state'),
            pincode=employee_data.get('pincode'),
            permissions=employee_data.get('permissions'),
            updated_at=datetime.utcnow()
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        return new_admin
    else:
        new_employee = EmployeeUser(
            name=employee_data['name'],
            email=employee_data['email'],
            password=hashed_password,
            role=role,
            status=employee_data.get('status', 'active').lower(),
            address=employee_data.get('address'),
            city=employee_data.get('city'),
            state=employee_data.get('state'),
            pincode=employee_data.get('pincode'),
            permissions=employee_data.get('permissions'),
            updated_at=datetime.utcnow()
        )
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
        return new_employee

def reset_user_password(db: Session, user_id: int, new_password: str) -> bool:
    """Reset a user's password (admin action)"""
    # Try employee first
    employee = db.query(EmployeeUser).filter(
        EmployeeUser.id == user_id,
        EmployeeUser.deleted_at.is_(None)
    ).first()
    
    if employee:
        employee.password = get_password_hash(new_password)
        db.commit()
        return True
        
    # Try admin
    admin = db.query(AdminUser).filter(
        AdminUser.id == user_id,
        AdminUser.deleted_at.is_(None)
    ).first()
    
    if admin:
        admin.password = get_password_hash(new_password)
        db.commit()
        return True
        
    # Try regular user
    user = db.query(User).filter(
        User.id == user_id,
        User.deleted_at.is_(None)
    ).first()
    
    if user:
        user.password = get_password_hash(new_password)
        db.commit()
        return True
        
    return False

def update_user(db: Session, user_id: int, user_type: str, update_data: dict) -> Optional[Union[EmployeeUser, AdminUser, User]]:
    """Update a user/employee by ID and type"""
    target = None
    
    # Identify target table
    if user_type in ['Admin', 'Staff']:
        # Check Admin
        if user_type == 'Admin':
            target = db.query(AdminUser).filter(AdminUser.id == user_id).first()
        else:
            target = db.query(EmployeeUser).filter(EmployeeUser.id == user_id).first()
    else:
        # B2B / B2C
        target = db.query(User).filter(User.id == user_id).first()
        
    if not target:
        return None
        
    # Update fields
    for key, value in update_data.items():
        if hasattr(target, key) and value is not None:
            setattr(target, key, value)
            
    db.commit()
    db.refresh(target)
    return target

from app.modules.orders.models import B2CApplication, B2BApplication

def get_all_b2c_users(db: Session):
    return db.query(B2CApplication).all()

def get_all_b2b_users(db: Session):
    return db.query(B2BApplication).all()

def delete_user_by_type(db: Session, user_id: int, user_type: str) -> bool:
    """Delete a user/employee by ID and type"""
    target = None
    
    if user_type in ['Admin', 'Staff']:
        if user_type == 'Admin':
            target = db.query(AdminUser).filter(AdminUser.id == user_id).first()
        else:
            target = db.query(EmployeeUser).filter(EmployeeUser.id == user_id).first()
    elif user_type == 'B2B':
        target = db.query(B2BApplication).filter(B2BApplication.id == user_id).first()
    elif user_type == 'B2C':
        target = db.query(B2CApplication).filter(B2CApplication.id == user_id).first()
    else:
        target = db.query(User).filter(User.id == user_id).first()
        
    if target:
        db.delete(target)
        db.commit()
        return True
        
    return False
