from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.modules.orders.models import Order
from app.modules.refunds.models import Refund
from app.modules.exchanges.models import Exchange
from datetime import datetime, timedelta
from typing import List, Dict, Any

router = APIRouter()

@router.get("/today")
def get_today_notifications(db: Session = Depends(get_db)):
    """
    Get all notifications for today (new orders, refunds, exchanges)
    """
    try:
        # Get today's date range
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = datetime.now().replace(hour=23, minute=59, second=59, microsecond=999999)
        
        notifications = []
        
        # Fetch today's orders
        orders = db.query(Order).filter(
            Order.created_at >= today_start,
            Order.created_at <= today_end
        ).order_by(Order.created_at.desc()).all()
        
        for order in orders:
            notifications.append({
                "id": f"order_{order.id}",
                "type": "order",
                "title": "New Order Placed",
                "description": f"Order {order.order_id} placed by {order.customer_name or 'Customer'}",
                "timestamp": order.created_at.isoformat(),
                "status": "unread",
                "reference_id": order.order_id,
                "amount": float(order.amount) if order.amount else 0
            })
        
        # Fetch today's refunds
        refunds = db.query(Refund).filter(
            Refund.created_at >= today_start,
            Refund.created_at <= today_end
        ).order_by(Refund.created_at.desc()).all()
        
        for refund in refunds:
            order = db.query(Order).filter(Order.id == refund.order_id).first()
            notifications.append({
                "id": f"refund_{refund.id}",
                "type": "refund",
                "title": "Refund Requested",
                "description": f"Refund request for Order {order.order_id if order else 'N/A'} - ₹{float(refund.amount)}",
                "timestamp": refund.created_at.isoformat(),
                "status": "unread",
                "reference_id": order.order_id if order else None,
                "amount": float(refund.amount) if refund.amount else 0
            })
        
        # Fetch today's exchanges
        exchanges = db.query(Exchange).filter(
            Exchange.created_at >= today_start,
            Exchange.created_at <= today_end
        ).order_by(Exchange.created_at.desc()).all()
        
        for exchange in exchanges:
            notifications.append({
                "id": f"exchange_{exchange.id}",
                "type": "exchange",
                "title": "Exchange Requested",
                "description": f"Exchange request for Order {exchange.order_id} - {exchange.product_name}",
                "timestamp": exchange.created_at.isoformat(),
                "status": "unread",
                "reference_id": exchange.order_id,
                "reason": exchange.reason
            })
        
        # Sort all notifications by timestamp (newest first)
        notifications.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return {
            "success": True,
            "notifications": notifications,
            "count": len(notifications)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch notifications: {str(e)}")


@router.get("/recent")
def get_recent_notifications(limit: int = 50, db: Session = Depends(get_db)):
    """
    Get recent notifications (last 50 by default)
    """
    try:
        notifications = []
        
        # Fetch recent orders
        orders = db.query(Order).order_by(Order.created_at.desc()).limit(limit).all()
        
        for order in orders:
            notifications.append({
                "id": f"order_{order.id}",
                "type": "order",
                "title": "New Order Placed",
                "description": f"Order {order.order_id} placed by {order.customer_name or 'Customer'}",
                "timestamp": order.created_at.isoformat(),
                "status": "read",
                "reference_id": order.order_id,
                "amount": float(order.amount) if order.amount else 0
            })
        
        # Fetch recent refunds
        refunds = db.query(Refund).order_by(Refund.created_at.desc()).limit(limit).all()
        
        for refund in refunds:
            order = db.query(Order).filter(Order.id == refund.order_id).first()
            notifications.append({
                "id": f"refund_{refund.id}",
                "type": "refund",
                "title": "Refund Requested",
                "description": f"Refund request for Order {order.order_id if order else 'N/A'} - ₹{float(refund.amount)}",
                "timestamp": refund.created_at.isoformat(),
                "status": "read",
                "reference_id": order.order_id if order else None,
                "amount": float(refund.amount) if refund.amount else 0
            })
        
        # Fetch recent exchanges
        exchanges = db.query(Exchange).order_by(Exchange.created_at.desc()).limit(limit).all()
        
        for exchange in exchanges:
            notifications.append({
                "id": f"exchange_{exchange.id}",
                "type": "exchange",
                "title": "Exchange Requested",
                "description": f"Exchange request for Order {exchange.order_id} - {exchange.product_name}",
                "timestamp": exchange.created_at.isoformat(),
                "status": "read",
                "reference_id": exchange.order_id,
                "reason": exchange.reason
            })
        
        # Sort all notifications by timestamp (newest first)
        notifications.sort(key=lambda x: x['timestamp'], reverse=True)
        
        # Limit to the requested number
        notifications = notifications[:limit]
        
        return {
            "success": True,
            "notifications": notifications,
            "count": len(notifications)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch notifications: {str(e)}")
