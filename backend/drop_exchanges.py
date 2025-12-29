from app.database import engine
from sqlalchemy import text

def drop_table():
    with engine.connect() as connection:
        try:
            connection.execute(text("DROP TABLE IF EXISTS exchanges CASCADE"))
            connection.commit()
            print("Successfully dropped 'exchanges' table.")
        except Exception as e:
            print(f"Error dropping table: {e}")

if __name__ == "__main__":
    drop_table()
