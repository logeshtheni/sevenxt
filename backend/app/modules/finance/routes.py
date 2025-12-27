from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from . import service, schemas, models
import razorpay
import json

router = APIRouter(prefix="/finance", tags=["Finance"])

# 1. GET ALL TRANSACTIONS (For your dashboard table)
@router.get("/transactions") 
def read_transactions(db: Session = Depends(get_db)):
    return service.get_all_transactions(db)

# 2. VERIFY PAYMENT (For frontend success page)
@router.post("/verify-payment", response_model=schemas.TransactionResponse)
def verify_razorpay_payment(data: schemas.PaymentVerifyRequest, db: Session = Depends(get_db)):
    return service.verify_payment(db, data)

# 3. WEBHOOK (Syncs payments & refunds automatically)
@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    raw_body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature")
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    
    try:
        client.utility.verify_webhook_signature(raw_body.decode(), signature, settings.RAZORPAY_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Webhook Signature")

    payload = json.loads(raw_body)
    event = payload.get("event")

    # Handle Successful Payments
    if event in ["payment.captured", "payment.authorized"]:
        payment_entity = payload['payload']['payment']['entity']
        existing_tx = db.query(models.Transaction).filter(models.Transaction.razorpay_payment_id == payment_entity['id']).first()

        if not existing_tx:
            new_tx = models.Transaction(
                razorpay_payment_id=payment_entity['id'],
                razorpay_order_id=payment_entity.get('order_id') or f"pay_link_{payment_entity['id']}",
                internal_order_id=payment_entity.get('order_id') or "WEBHOOK_SYNC",
                amount=payment_entity['amount'] / 100,
                currency=payment_entity.get('currency', 'INR'),
                status="SUCCESS",
                method=payment_entity.get('method', 'unknown'),
                user_email=payment_entity.get('email', 'N/A'),
                customer_contact=payment_entity.get('contact', 'N/A'),
                gateway="Razorpay"
            )
            db.add(new_tx)
            db.commit()
            print(f"✅ Webhook: Payment {payment_entity['id']} saved.")

    # Handle Refunds (Updates UI status automatically)
    elif event == "refund.processed":
        refund_entity = payload['payload']['refund']['entity']
        payment_id = refund_entity['payment_id']
        tx = db.query(models.Transaction).filter(models.Transaction.razorpay_payment_id == payment_id).first()
        if tx:
            tx.status = "REFUNDED"
            db.commit()
            print(f"✅ Webhook: Payment {payment_id} marked as REFUNDED.")

    return {"status": "ok"}

# 4. REFUND PROCESSOR (Call this when clicking your UI button)
@router.post("/refund/{payment_id}")
async def process_refund(payment_id: str, db: Session = Depends(get_db)):
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    try:
        # Trigger full refund in Razorpay
        refund = client.refund.create({
            "payment_id": payment_id,
            "notes": {"reason": "Admin processed refund from Dashboard"}
        })

        # Immediately update status in our DB
        tx = db.query(models.Transaction).filter(models.Transaction.razorpay_payment_id == payment_id).first()
        if tx:
            tx.status = "REFUNDED"
            db.commit()

        return {"status": "success", "message": "Refund initiated", "refund_id": refund['id']}
    except Exception as e:
        db.rollback()
        error_msg = str(e)
        print(f"❌ RAZORPAY REFUND ERROR: {error_msg}")
        
        # Friendly message for the frontend
        if "captured" in error_msg.lower():
            friendly_error = "Payment must be 'Captured' before you can refund it. Please capture it in Razorpay Dashboard first."
        else:
            friendly_error = error_msg
            
        raise HTTPException(status_code=400, detail=friendly_error)
    