"""
Test script to create sample activity logs
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.modules.activity_logs.service import log_activity

def create_sample_logs():
    db = SessionLocal()
    try:
        # Sample log 1: User created
        log_activity(
            db=db,
            action="Created Employee",
            module="Users",
            user_name="Admin User",
            user_type="Admin",
            details="Created new staff employee: John Doe (john@example.com)",
            status="Success",
            affected_entity_type="Employee",
            affected_entity_id="123"
        )
        
        # Sample log 2: Order status updated
        log_activity(
            db=db,
            action="Updated Order Status",
            module="Orders",
            user_name="Staff User",
            user_type="Staff",
            details="Changed order #ORD-001 status from 'Pending' to 'Confirmed'",
            status="Success",
            affected_entity_type="Order",
            affected_entity_id="ORD-001"
        )
        
        # Sample log 3: Failed login
        log_activity(
            db=db,
            action="Login Failed",
            module="Authentication",
            user_name="Unknown",
            user_type="B2C",
            details="Invalid password attempt for user@example.com",
            status="Failed",
            ip_address="192.168.1.100"
        )
        
        # Sample log 4: Product updated
        log_activity(
            db=db,
            action="Updated Product",
            module="Products",
            user_name="Admin User",
            user_type="Admin",
            details="Updated product: Sample Product - Changed price from ₹1000 to ₹1200",
            status="Success",
            affected_entity_type="Product",
            affected_entity_id="PROD-456"
        )
        
        # Sample log 5: Refund approved
        log_activity(
            db=db,
            action="Approved Refund",
            module="Refunds",
            user_name="Admin User",
            user_type="Admin",
            details="Approved refund request #REF-789 for ₹2500",
            status="Success",
            affected_entity_type="Refund",
            affected_entity_id="REF-789"
        )
        
        print("✅ Successfully created 5 sample activity logs!")
        
    except Exception as e:
        print(f"❌ Error creating sample logs: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_logs()
