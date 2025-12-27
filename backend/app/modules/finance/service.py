import razorpay
from sqlalchemy.orm import Session
from . import models, schemas
from app.config import settings
from fastapi import HTTPException

# Initialize Razorpay Client
client = razorpay.Client(auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)) 
# Note: Use your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET here from settings

def get_all_transactions(db: Session):
    return db.query(models.Transaction).order_by(models.Transaction.created_at.desc()).all()

def verify_payment(db: Session, data: schemas.PaymentVerifyRequest):
    # 1. Verify Signature
    params_dict = {
        'razorpay_order_id': data.razorpay_order_id,
        'razorpay_payment_id': data.razorpay_payment_id,
        'razorpay_signature': data.razorpay_signature
    }

    try:
        # This will raise an error if the signature is fake
        # Use settings.RAZORPAY_KEY_SECRET (Add this to your config.py)
        client.utility.verify_payment_signature(params_dict)
        
        # 2. Update/Create Transaction in DB
        txn = db.query(models.Transaction).filter(
            models.Transaction.razorpay_order_id == data.razorpay_order_id
        ).first()

        if not txn:
            txn = models.Transaction(
                razorpay_order_id=data.razorpay_order_id,
                internal_order_id=data.internal_order_id,
                user_email=data.user_email,
                amount=data.amount
            )
            db.add(txn)

        txn.razorpay_payment_id = data.razorpay_payment_id
        txn.razorpay_signature = data.razorpay_signature
        txn.status = "SUCCESS"
        
        db.commit()
        db.refresh(txn)
        return txn

    except Exception as e:
        # If verification fails, mark as FAILED
        db_txn = db.query(models.Transaction).filter(
            models.Transaction.razorpay_order_id == data.razorpay_order_id
        ).first()
        if db_txn:
            db_txn.status = "FAILED"
            db.commit()
        
        raise HTTPException(status_code=400, detail="Payment verification failed")