from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.modules.orders.models import Delivery, Order
from app.modules.exchanges.models import Exchange
from datetime import datetime
import logging

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])
logger = logging.getLogger(__name__)

@router.post("/delhivery")
async def delhivery_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Production-safe Delhivery Webhook Handler
    Handles Pickup → In-Transit → Delivered updates
    """
    payload = await request.json()
    logger.info(f"[WEBHOOK] Payload received: {payload}")

    # -------------------------
    # 1️⃣ Extract AWB & Status
    # -------------------------
    awb = None
    raw_status = None

    if "Shipment" in payload:
        shipment = payload.get("Shipment", {})
        awb = shipment.get("AWB") or shipment.get("waybill")

        status_block = shipment.get("Status")
        if isinstance(status_block, dict):
            raw_status = status_block.get("Status")
        elif isinstance(status_block, str):
            raw_status = status_block
    else:
        awb = payload.get("AWB") or payload.get("waybill")
        raw_status = payload.get("status")

    if not awb or not raw_status:
        logger.warning("[WEBHOOK] Missing AWB or Status, ignoring")
        return {"ok": True}

    # -------------------------
    # 2️⃣ Normalize Status
    # -------------------------
    STATUS_MAP = {
        "PICKED UP": "PICKED_UP",
        "IN TRANSIT": "IN_TRANSIT",
        "OUT FOR DELIVERY": "OUT_FOR_DELIVERY",
        "DELIVERED": "DELIVERED",
        "RTO INITIATED": "RTO",
        "DELIVERY FAILED": "FAILED",
    }

    normalized = raw_status.strip().upper().replace("-", " ")
    internal_status = STATUS_MAP.get(normalized)

    if not internal_status:
        logger.info(f"[WEBHOOK] Unhandled status '{raw_status}', ignored")
        return {"ok": True}

    # -------------------------
    # 3️⃣ Find Delivery
    # -------------------------
    delivery = db.query(Delivery).filter(
        Delivery.awb_number == awb
    ).first()

    if not delivery:
        logger.warning(f"[WEBHOOK] No delivery found for AWB {awb}")
        # Continue to check Exchanges, as it might be a return shipment not in Delivery table
    else:
        # -------------------------
        # 4️⃣ Prevent Backward Updates (Only for Delivery table)
        # -------------------------
        STATUS_ORDER = [
            "AWB_GENERATED",
            "PICKUP_REQUESTED",
            "PICKED_UP",
            "IN_TRANSIT",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
        ]

        try:
            current_index = STATUS_ORDER.index(delivery.delivery_status)
            new_index = STATUS_ORDER.index(internal_status)
        except ValueError:
            current_index = -1
            new_index = -1

        if new_index < current_index:
            logger.info(
                f"[WEBHOOK] Ignored backward status {internal_status} for AWB {awb}"
            )
        else:
            # -------------------------
            # 5️⃣ Update DB (Delivery)
            # -------------------------
            delivery.delivery_status = internal_status

            if delivery.order:
                delivery.order.status = internal_status

            db.commit()
            logger.info(f"[WEBHOOK] Updated Delivery AWB {awb} → {internal_status}")

    # -------------------------
    # 6️⃣ Update Exchange (if applicable)
    # -------------------------
    # Check for Exchange Return
    exchange_return = db.query(Exchange).filter(Exchange.return_awb_number == awb).first()
    if exchange_return:
        exchange_return.return_delivery_status = internal_status
        if internal_status == 'DELIVERED':
             exchange_return.status = 'Return Received'
        db.commit()
        logger.info(f"[WEBHOOK] Updated Exchange Return AWB {awb} -> {internal_status}")

    # Check for Exchange New Shipment
    exchange_new = db.query(Exchange).filter(Exchange.new_awb_number == awb).first()
    if exchange_new:
        exchange_new.new_delivery_status = internal_status
        
        # Sync Order Status with Exchange New Delivery Status
        if exchange_new.order:
             exchange_new.order.status = internal_status
             logger.info(f"[WEBHOOK] Synced Order {exchange_new.order_id} status to {internal_status}")

        if internal_status == 'DELIVERED':
             exchange_new.status = 'Completed'
             exchange_new.completed_at = datetime.utcnow()
        db.commit()
        logger.info(f"[WEBHOOK] Updated Exchange New AWB {awb} -> {internal_status}")

    return {"ok": True}
