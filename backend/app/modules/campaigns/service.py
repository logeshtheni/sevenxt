from sqlalchemy.orm import Session
from .models import Coupon, FlashDeal, Banner, AdCampaign

# =========================
# GET
# =========================
def get_coupons(db: Session):
    return db.query(Coupon).order_by(Coupon.id.desc()).all()


# =========================
# CREATE
# =========================
def create_coupon(db: Session, payload):
    coupon = Coupon(
        code=payload.code,
        type=payload.type,
        value=payload.value,
        target=payload.target,
        usage_count="0/1000",
        status="Active",
        expiry=payload.expiry
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


# =========================
# UPDATE (NO CRASH)
# =========================
def update_coupon(db: Session, coupon_id: int, payload):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        return None

    if payload.code is not None:
        coupon.code = payload.code
    if payload.type is not None:
        coupon.type = payload.type
    if payload.value is not None:
        coupon.value = payload.value
    if payload.target is not None:
        coupon.target = payload.target
    if payload.expiry is not None:
        coupon.expiry = payload.expiry

    db.commit()
    db.refresh(coupon)
    return coupon


# =========================
# DELETE
# =========================
def delete_coupon(db: Session, coupon_id: int):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        return False

    db.delete(coupon)
    db.commit()
    return True


# =========================
# OTHERS (UNCHANGED)
# =========================
def get_flash_deals(db: Session):
    return db.query(FlashDeal).all()

def get_banners(db: Session):
    return db.query(Banner).all()

def get_ad_campaigns(db: Session):
    return db.query(AdCampaign).all()


# =================================================
# FLASH DEALS (FROM PRODUCTS)
# =================================================
from datetime import datetime
from app.modules.products.models import Product

def get_flash_deals_from_products(db):
    now = datetime.now()

    products = db.query(Product).filter(
        Product.b2c_active_offer > 0,
        Product.b2c_offer_price > 0,
        Product.b2c_offer_start_date != None,
        Product.b2c_offer_end_date != None,
        Product.b2c_offer_start_date <= now,
        Product.b2c_offer_end_date >= now
    ).all()

    flash_deals = []

    for p in products:
        flash_deals.append({
            "id": p.id,
            "product": p.name,
            "original_price": p.b2c_price,
            "deal_price": p.b2c_offer_price,
            "discount": f"{int(p.b2c_active_offer)}%",
            "ends_in": p.b2c_offer_end_date.isoformat(),
            "status": "Active",
            "target": "B2C"
        })

    return flash_deals
