"""
Check all users in both tables
"""
from sqlalchemy import create_engine, text
from app.config import settings

DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}" if settings.DB_PASSWORD else f"mysql+pymysql://{settings.DB_USER}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

engine = create_engine(DATABASE_URL)

print("=" * 80)
print("EMPLOYEE USERS TABLE")
print("=" * 80)
with engine.connect() as conn:
    result = conn.execute(text("SELECT id, email, role, status, deleted_at FROM employee_users"))
    users = result.fetchall()
    print(f"\nFound {len(users)} employees:\n")
    for user in users:
        deleted = " [DELETED]" if user.deleted_at else ""
        print(f"ID: {user.id} | Email: {user.email} | Role: {user.role} | Status: {user.status}{deleted}")

print("\n" + "=" * 80)
print("USERS TABLE (B2B/B2C)")
print("=" * 80)
with engine.connect() as conn:
    result = conn.execute(text("SELECT id, email, role, status, deleted_at FROM users"))
    users = result.fetchall()
    print(f"\nFound {len(users)} users:\n")
    for user in users:
        deleted = " [DELETED]" if user.deleted_at else ""
        print(f"ID: {user.id} | Email: {user.email} | Role: {user.role} | Status: {user.status}{deleted}")

print("\n" + "=" * 80)
