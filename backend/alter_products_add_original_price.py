from sqlalchemy import create_engine, text
from app.config import settings

# Construct database URL
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

with engine.connect() as connection:
    try:
        print("Altering products table to add original price columns...")
        connection.execute(text("ALTER TABLE products ADD COLUMN original_b2c_price FLOAT NULL"))
        connection.execute(text("ALTER TABLE products ADD COLUMN original_b2b_price FLOAT NULL"))
        connection.commit()
        print("Successfully altered products table.")
    except Exception as e:
        print(f"Error altering table: {e}")
