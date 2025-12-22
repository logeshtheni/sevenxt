from pydantic import BaseModel
from datetime import date
from typing import Optional

# =========================
# CREATE
# =========================
class CouponCreate(BaseModel):
    code: str
    type: str
    value: str
    target: str
    expiry: Optional[date] = None


# =========================
# UPDATE (CRITICAL FIX)
# =========================
class CouponUpdate(BaseModel):
    code: Optional[str] = None
    type: Optional[str] = None
    value: Optional[str] = None
    target: Optional[str] = None
    expiry: Optional[date] = None


# =========================
# RESPONSE
# =========================
class CouponOut(BaseModel):
    id: int
    code: str
    type: str
    value: str
    target: str
    usage_count: str
    status: str
    expiry: Optional[date]

    class Config:
        from_attributes = True
