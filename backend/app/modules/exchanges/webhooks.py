from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.modules.exchanges import service as exchange_service
from app.modules.delivery.delhivery_client import delhivery_client
from app.modules.orders.service import get_order_by_id, update_order_awb
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/exchanges", tags=["Exchange Webhooks"])


@router.post("/{exchange_id}/generate-return-awb")
async def generate_return_awb(
    exchange_id: str,
    db: Session = Depends(get_db)
):
    """
    Generate return AWB for customer to send back old product
    """
    try:
        exchange = exchange_service.get_exchange_by_id(db, exchange_id)
        if not exchange:
            raise HTTPException(status_code=404, detail="Exchange not found")
        
        # Get order details
        order = get_order_by_id(db, exchange.order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Create return shipment data
        shipment_data = {
            "name": exchange.customer_name,
            "add": order.address,
            "phone": exchange.customer_phone,
            "pin": order.pincode,
            "city": order.city,
            "state": order.state,
            "payment_mode": "Prepaid",  # Return is always prepaid
            "return_add": "Your Warehouse Address",  # TODO: Get from config
            "return_pin": "600001",  # TODO: Get from config
            "return_phone": "1234567890",  # TODO: Get from config
            "return_name": "SevenXT",
            "order": f"{exchange_id}-RETURN",
            "products_desc": f"Return: {exchange.original_product_name}",
            "hsn_code": "HSN123",  # TODO: Get from product
            "cod_amount": "0",
            "weight": "500",  # TODO: Get from product
            "seller_name": "SevenXT"
        }
        
        # Call Delhivery API to create return shipment
        result = delhivery_client.create_shipment(shipment_data)
        
        if result.get("success"):
            awb_number = result.get("awb_number")
            label_path = result.get("label_path")
            
            # Update exchange with return AWB
            exchange_service.update_return_awb(db, exchange_id, awb_number, label_path)
            
            # TODO: Send email to customer with return label
            
            logger.info(f"Generated return AWB {awb_number} for exchange {exchange_id}")
            
            return {
                "success": True,
                "awb_number": awb_number,
                "label_path": label_path,
                "message": "Return AWB generated successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to generate return AWB")
            
    except Exception as e:
        logger.exception(f"Error generating return AWB for exchange {exchange_id}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{exchange_id}/generate-new-product-awb")
async def generate_new_product_awb(
    exchange_id: str,
    db: Session = Depends(get_db)
):
    """
    Generate forward AWB to send new product to customer
    Only after quality check passes
    """
    try:
        exchange = exchange_service.get_exchange_by_id(db, exchange_id)
        if not exchange:
            raise HTTPException(status_code=404, detail="Exchange not found")
        
        # Check if quality approved
        if not exchange.quality_approved:
            raise HTTPException(status_code=400, detail="Quality check not approved")
        
        # Get order details
        order = get_order_by_id(db, exchange.order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Calculate COD amount if price difference
        cod_amount = "0"
        payment_mode = "Prepaid"
        if exchange.price_difference and exchange.price_difference > 0:
            cod_amount = str(exchange.price_difference)
            payment_mode = "COD"
        
        # Create forward shipment data
        shipment_data = {
            "name": exchange.customer_name,
            "add": order.address,
            "phone": exchange.customer_phone,
            "pin": order.pincode,
            "city": order.city,
            "state": order.state,
            "payment_mode": payment_mode,
            "order": f"{exchange_id}-FORWARD",
            "products_desc": f"Exchange: {exchange.exchange_product_name}",
            "hsn_code": "HSN456",  # TODO: Get from product
            "cod_amount": cod_amount,
            "weight": "500",  # TODO: Get from product
            "seller_name": "SevenXT"
        }
        
        # Call Delhivery API to create forward shipment
        result = delhivery_client.create_shipment(shipment_data)
        
        if result.get("success"):
            awb_number = result.get("awb_number")
            label_path = result.get("label_path")
            
            # Update exchange with new product AWB
            exchange_service.update_new_product_awb(db, exchange_id, awb_number, label_path)
            
            # Update order with new AWB (replace old AWB)
            update_order_awb(db, order.order_id, awb_number, label_path)
            
            logger.info(f"Generated new product AWB {awb_number} for exchange {exchange_id}")
            
            return {
                "success": True,
                "awb_number": awb_number,
                "label_path": label_path,
                "message": "New product AWB generated successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to generate new product AWB")
            
    except Exception as e:
        logger.exception(f"Error generating new product AWB for exchange {exchange_id}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook/delhivery")
async def delhivery_webhook(
    webhook_data: dict,
    db: Session = Depends(get_db)
):
    """
    Handle Delhivery webhook updates for exchange shipments
    """
    try:
        awb_number = webhook_data.get("awb")
        status = webhook_data.get("status")
        
        # Find exchange by AWB number (either return or forward)
        exchanges = db.query(exchange_service.models.Exchange).filter(
            (exchange_service.models.Exchange.return_awb_number == awb_number) |
            (exchange_service.models.Exchange.new_awb_number == awb_number)
        ).all()
        
        for exchange in exchanges:
            if exchange.return_awb_number == awb_number:
                # Update return status
                exchange.return_status = status
                
                if status == "Delivered":
                    # Old product received at warehouse
                    exchange.status = "Return Received"
                    
            elif exchange.new_awb_number == awb_number:
                # Update new product delivery status
                exchange.new_delivery_status = status
                
                if status == "Delivered":
                    # Exchange completed
                    exchange_service.complete_exchange(db, exchange.exchange_id)
        
        db.commit()
        
        return {"success": True, "message": "Webhook processed"}
        
    except Exception as e:
        logger.exception("Error processing Delhivery webhook")
        return {"success": False, "error": str(e)}
