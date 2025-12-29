from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.modules.refunds.models import Refund
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/webhooks/delhivery/return")
async def delhivery_return_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook endpoint to receive return shipment status updates from Delhivery
    """
    try:
        payload = await request.json()
        logger.info(f"[WEBHOOK] Received Delhivery return webhook: {payload}")
        
        # Extract data from webhook payload
        # Delhivery webhook format may vary, adjust based on actual payload structure
        waybill = payload.get('waybill') or payload.get('awb')
        status = payload.get('status') or payload.get('Status')
        
        if not waybill:
            logger.error("[WEBHOOK] No waybill found in payload")
            return {"status": "error", "message": "No waybill in payload"}
        
        # Find refund by return AWB number
        refund = db.query(Refund).filter(
            Refund.return_awb_number == waybill
        ).first()
        
        if not refund:
            logger.warning(f"[WEBHOOK] No refund found for return AWB: {waybill}")
            return {"status": "not_found", "message": f"No refund found for AWB {waybill}"}
        
        # Update return delivery status
        old_status = refund.return_delivery_status
        refund.return_delivery_status = status
        
        logger.info(f"[WEBHOOK] Updating refund {refund.id} return status: {old_status} → {status}")
        
        # If delivered to warehouse, notify admin (you can add email/notification here)
        if status in ['Delivered', 'DELIVERED', 'delivered']:
            logger.info(f"[WEBHOOK] Return package delivered to warehouse for refund {refund.id}")
            # TODO: Send notification to admin to verify product and mark as Completed
            # You can add email notification or in-app notification here
        
        # Commit changes to database
        try:
            db.add(refund)  # Explicitly add to session
            db.flush()      # Flush to ensure changes are staged
            db.commit()     # Commit to database
            logger.info(f"[WEBHOOK] ✅ Database updated successfully for refund {refund.id}")
        except Exception as commit_error:
            db.rollback()
            logger.error(f"[WEBHOOK] ❌ Database commit failed: {commit_error}")
            raise Exception(f"Failed to update database: {commit_error}")
        
        # Verify the update
        db.refresh(refund)
        logger.info(f"[WEBHOOK] Verified status in DB: {refund.return_delivery_status}")
        
        return {
            "status": "success",
            "message": f"Updated refund {refund.id} status to {status}",
            "refund_id": refund.id,
            "awb": waybill,
            "new_status": status,
            "old_status": old_status,
            "verified_status": refund.return_delivery_status
        }
        
    except Exception as e:
        logger.exception(f"[WEBHOOK] Error processing webhook: {e}")
        db.rollback()
        return {"status": "error", "message": str(e)}


@router.get("/webhooks/test")
async def test_webhook():
    """Test endpoint to verify webhook is accessible"""
    return {"status": "ok", "message": "Webhook endpoint is working"}
