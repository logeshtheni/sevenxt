from app.database import engine
from sqlalchemy import text

def fix_database():
    with engine.connect() as connection:
        try:
            # 1. Check if unique constraint exists (optional, but good practice)
            # For now, just try to add it. If it fails due to duplicates, we'll know.
            
            print("Attempting to add UNIQUE constraint to orders(order_id)...")
            connection.execute(text("ALTER TABLE orders ADD CONSTRAINT unique_order_id UNIQUE (order_id)"))
            connection.commit()
            print("Successfully added UNIQUE constraint.")
            
        except Exception as e:
            print(f"Error adding constraint: {e}")
            # If it failed, maybe it already exists or there are duplicates?
            # Let's try to create the exchanges table anyway, maybe the error was transient?
            # No, the error was explicit.

if __name__ == "__main__":
    fix_database()
