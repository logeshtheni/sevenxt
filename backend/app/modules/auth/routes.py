from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime
from app.database import get_db
from app.config import settings
from app.modules.auth import schemas, service
from app.modules.auth.models import EmployeeUser, User

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login-json")

def get_current_employee(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Get the current authenticated employee"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    employee = service.get_employee_by_email(db, email=email)
    if employee is None:
        raise credentials_exception
    
    return employee

@router.post("/login-json", response_model=schemas.Token)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint for admin/staff"""
    employee = service.authenticate_employee(db, login_data.email, login_data.password)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = service.create_access_token(
        data={"sub": employee.email, "role": employee.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": employee
    }

@router.post("/register", response_model=schemas.UserResponse)
def register(
    user_data: schemas.EmployeeCreate,
    db: Session = Depends(get_db)
):
    """Register a new B2B/B2C user"""
    # Check if email already exists
    existing = service.get_user_by_email(db, user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    new_user = service.create_user(db, user_data.dict())
    return new_user

@router.get("/me", response_model=schemas.EmployeeResponse)
def read_users_me(current_employee: EmployeeUser = Depends(get_current_employee)):
    """Get current logged in employee details"""
    return current_employee

@router.get("/users", response_model=list[schemas.UserResponse])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    current_employee: EmployeeUser = Depends(get_current_employee),
    db: Session = Depends(get_db)
):
    """Get all B2B/B2C users (Display only)"""
    users = service.get_all_users(db, skip=skip, limit=limit)
    return users

# Create a separate router for employees to match frontend expectations
employees_router = APIRouter(prefix="/employees", tags=["Employees"])

@employees_router.get("", response_model=list[schemas.EmployeeResponse])
def get_employees(
    current_employee: EmployeeUser = Depends(get_current_employee),
    db: Session = Depends(get_db)
):
    """Get all employees (Admin/Staff)"""
    employees = service.get_all_employees(db)
    return employees

@employees_router.post("/create", response_model=schemas.EmployeeResponse)
def create_employee(
    employee_data: schemas.EmployeeCreate,
    db: Session = Depends(get_db),
    current_employee: EmployeeUser = Depends(get_current_employee)
):
    """Create a new employee (admin/staff)"""
    # Check if email already exists
    existing = service.get_employee_by_email(db, employee_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create employee
    new_employee = service.create_employee(db, employee_data.dict())
    return new_employee


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_employee: EmployeeUser = Depends(get_current_employee)
):
    """Delete a user (soft delete by setting deleted_at timestamp)"""
    
    # Try to find in employee_users table first (Admin/Staff)
    employee = db.query(EmployeeUser).filter(
        EmployeeUser.id == user_id,
        EmployeeUser.deleted_at.is_(None)
    ).first()
    
    if employee:
        # Soft delete employee
        employee.deleted_at = datetime.utcnow()
        db.commit()
        return {"message": "Employee deleted successfully", "type": "employee"}
    
    # Try to find in users table (B2B/B2C)
    user = db.query(User).filter(
        User.id == user_id,
        User.deleted_at.is_(None)
    ).first()
    
    if user:
        # Soft delete user
        user.deleted_at = datetime.utcnow()
        db.commit()
        return {"message": "User deleted successfully", "type": "user"}
    
    # Not found in either table
    raise HTTPException(status_code=404, detail="User not found")
