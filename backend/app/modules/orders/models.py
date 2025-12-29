from sqlalchemy import Column, Integer, String, DECIMAL, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class B2BApplication(Base):
    __tablename__ = "b2b_applications"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(Text, nullable=True)
    gstin = Column(String(20), nullable=True)
    pan = Column(String(10), nullable=True)
    email = Column(String(255), nullable=True)
    phone_number = Column(String(20), nullable=True)
    gst_certificate_url = Column(Text, nullable=True)
    business_license_url = Column(Text, nullable=True)
    status = Column(String(30), nullable=True)
    created_at = Column(DateTime, nullable=True)
    address_id = Column(String(36), nullable=True)

class B2CApplication(Base):
    __tablename__ = "b2c_applications"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(Text, nullable=True)  # Actual column name in DB
    phone_number = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    address_id = Column(String(36), nullable=True)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), unique=True, index=True)
    customer_type = Column(String(50))

    # Direct customer name (No Foreign Keys)
    customer_name = Column(String(255), nullable=True)

    products = Column(JSON)
    amount = Column(DECIMAL(10, 2))
    payment = Column(String(50))
    status = Column(String(50))
    awb_number = Column(String(50), nullable=True)
    address = Column(Text)
    email = Column(String(100))
    phone = Column(String(20))
    
    # Location fields
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=True)
    
    # Dimensions
    height = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)
    breadth = Column(Integer, nullable=True)
    length = Column(Integer, nullable=True)

    #return AWb number annd label
    # return_awb_number = Column(String(255), nullable=True)
    # return_label_path = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    exchanges = relationship("Exchange", back_populates="order")

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    
    order = relationship("Order")
    
    weight = Column(DECIMAL(6, 2), nullable=False)
    length = Column(DECIMAL(6, 2), nullable=False)
    breadth = Column(DECIMAL(6, 2), nullable=False)
    height = Column(DECIMAL(6, 2), nullable=False)
    
    awb_number = Column(String(255), nullable=True)
    courier_partner = Column(String(50), default='Delhivery')
    pickup_location = Column(String(100), nullable=False)
    payment = Column(String(11), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    customer_name = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False)
    full_address = Column(Text, nullable=False)
    
    # Location fields
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=True)
    
    item_name = Column(String(255), nullable=True)
    quantity = Column(Integer, nullable=False)
    schedule_pickup = Column(DateTime, nullable=True)
    delivery_status = Column(String(50), default='Ready to Pickup')
    awb_label_path = Column(Text, nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
