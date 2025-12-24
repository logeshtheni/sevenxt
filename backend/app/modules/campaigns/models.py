from sqlalchemy import Column, Integer, String, Date, Float
from app.database import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    type = Column(String(20), nullable=False)
    value = Column(String(20), nullable=False)
    target = Column(String(10), nullable=False)
    usage_count = Column(String(20), default="0/1000")
    status = Column(String(20), default="Active")
    expiry = Column(Date, nullable=True)
    
    # --- NEW WORKFLOW FIELDS ---
    min_order_value = Column(String(20), nullable=True, default="0")
    usage_limit = Column(String(20), nullable=True, default="100")
    razorpay_offer_id = Column(String(100), nullable=True)

class FlashDeal(Base):
    __tablename__ = "flash_deals"
    id = Column(Integer, primary_key=True)
    product = Column(String(200))
    original_price = Column(Float)
    deal_price = Column(Float)
    discount = Column(String(10))
    ends_in = Column(String(50))
    status = Column(String(20))
    target = Column(String(10))

# ... Banner and AdCampaign models remain unchanged ...