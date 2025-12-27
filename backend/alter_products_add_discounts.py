from sqlalchemy import create_engine, text
from app.config import settings

# Construct database URL
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

with engine.connect() as connection:
    try:
        print("Altering products table to add b2c_discount and b2b_discount columns...")
        connection.execute(text("ALTER TABLE products ADD COLUMN b2c_discount FLOAT DEFAULT 0.0"))
        connection.execute(text("ALTER TABLE products ADD COLUMN b2b_discount FLOAT DEFAULT 0.0"))
        connection.commit()
        print("Successfully altered products table.")
    except Exception as e:
        print(f"Error altering table: {e}")
