from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- 1. HOMEPAGE BANNERS ---
class BannerBase(BaseModel):
    title: str
    image: str
    position: str
    status: str

class BannerCreate(BannerBase):
    pass

class BannerResponse(BannerBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- 2. CATEGORY BANNERS ---
class CategoryBannerResponse(BaseModel):
    id: int
    category: Optional[str] = None
    image_url: Optional[str] = None  # Crucial for handling NULLs
    status: bool
    class Config:
        from_attributes = True

# --- 3. NOTIFICATIONS ---
class NotificationCreate(BaseModel):
    title: str
    message: str
    audience: str

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    audience: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# --- 4. STATIC PAGES ---
class PageUpdate(BaseModel):
    title: str
    content: str

class PageResponse(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    status: str
    updated_at: Optional[datetime] = None # For "Last Updated" column
    class Config:
        from_attributes = True