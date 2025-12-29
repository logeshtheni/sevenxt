from sqlalchemy import Column, Integer, String, DECIMAL, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Refund(Base):
    __tablename__ = "refunds"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    
    # Refund request details
    reason = Column(Text, nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String(50), default='Pending')  # Pending, Approved, Rejected, Completed
    proof_image_path = Column(Text, nullable=True)
    
    # Return AWB details (for return shipment)
    return_awb_number = Column(String(255), nullable=True)
    return_label_path = Column(String(500), nullable=True)
    return_delivery_status = Column(String(50), nullable=True)  # Track Delhivery status: Manifested, Picked Up, In Transit, Delivered
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    approved_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationship
    order = relationship("Order", backref="refunds")
