from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Attributes ---
class ProductAttributeBase(BaseModel):
    name: str
    value: str

class ProductAttributeCreate(ProductAttributeBase):
    pass

class ProductAttribute(ProductAttributeBase):
    id: int
    product_id: str

    class Config:
        from_attributes = True

# --- Variants ---
class ProductVariantBase(BaseModel):
    color: str
    colorCode: str = Field(..., alias="color_code")
    stock: int

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariant(ProductVariantBase):
    id: int
    product_id: str

    class Config:
        from_attributes = True
        populate_by_name = True

# --- Product ---
class ProductBase(BaseModel):
    name: str
    category: str
    brand: Optional[str] = None
    
    b2cPrice: float = Field(0.0, alias="b2c_price")
    compareAtPrice: float = Field(0.0, alias="compare_at_price")
    b2bPrice: float = Field(0.0, alias="b2b_price")
    
    b2cOfferPercentage: float = Field(0.0, alias="b2c_offer_percentage")
    b2cOfferStartDate: Optional[datetime] = Field(None, alias="b2c_offer_start_date")
    b2cOfferEndDate: Optional[datetime] = Field(None, alias="b2c_offer_end_date")
    
    b2bOfferPercentage: float = Field(0.0, alias="b2b_offer_percentage")
    b2bOfferStartDate: Optional[datetime] = Field(None, alias="b2b_offer_start_date")
    b2bOfferEndDate: Optional[datetime] = Field(None, alias="b2b_offer_end_date")
    
    description: Optional[str] = None
    status: str = "Draft"
    stock: int = 0
    image: Optional[str] = None
    rating: float = 0.0
    reviews: int = 0

class ProductCreate(ProductBase):
    id: Optional[str] = None # Optional, if provided use it, else generate
    attributes: List[ProductAttributeCreate] = []
    variants: List[ProductVariantCreate] = []

class ProductUpdate(ProductBase):
    attributes: Optional[List[ProductAttributeCreate]] = None
    variants: Optional[List[ProductVariantCreate]] = None

class ProductResponse(ProductBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    attributes: List[ProductAttribute] = []
    variants: List[ProductVariant] = []

    class Config:
        from_attributes = True
        populate_by_name = True
