"""
Script to reset passwords for all users with bcrypt hashes to a known password.
This will help us test login functionality.
"""
from sqlalchemy import create_engine, text
from app.config import settings
from app.modules.auth.service import get_password_hash

DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}" if settings.DB_PASSWORD else f"mysql+pymysql://{settings.DB_USER}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

engine = create_engine(DATABASE_URL)

# Users to update with new password
users_to_update = [
    "sanjay@example.com",
    "ravi@example.com", 
    "meera@example.com",
    "arun@example.com",
    "priya@example.com",
]

new_password = "password123"
new_hash = get_password_hash(new_password)

print(f"New password hash (PBKDF2): {new_hash[:50]}...")
print()

with engine.connect() as conn:
    for email in users_to_update:
        # Check if user exists
        result = conn.execute(
            text("SELECT id, email, role FROM employee_users WHERE email = :email"),
            {"email": email}
        )
        user = result.fetchone()
        
        if user:
            # Update password
            conn.execute(
                text("UPDATE employee_users SET password = :password WHERE email = :email"),
                {"password": new_hash, "email": email}
            )
            conn.commit()
            print(f"Updated password for: {user.email} (Role: {user.role})")
        else:
            print(f"User not found: {email}")

print()
print("Password reset complete!")
print(f"All updated users can now login with password: {new_password}")
