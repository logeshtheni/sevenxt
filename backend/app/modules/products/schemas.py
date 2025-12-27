from pydantic import BaseModel, Field, field_validator
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
    color_code: str = Field(..., alias="colorCode")
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
    
    b2c_price: float = Field(0.0, alias="b2cPrice")
    compare_at_price: float = Field(0.0, alias="compareAtPrice")
    b2b_price: float = Field(0.0, alias="b2bPrice")
    
    b2c_active_offer: float = Field(0.0, alias="b2cOfferPercentage")
    b2c_discount: float = Field(0.0, alias="b2cDiscount")
    b2c_offer_price: float = Field(0.0, alias="b2cOfferPrice")
    b2c_offer_start_date: Optional[datetime] = Field(None, alias="b2cOfferStartDate")
    b2c_offer_end_date: Optional[datetime] = Field(None, alias="b2cOfferEndDate")
    
    b2b_active_offer: float = Field(0.0, alias="b2bOfferPercentage")
    b2b_discount: float = Field(0.0, alias="b2bDiscount")
    b2b_offer_price: float = Field(0.0, alias="b2bOfferPrice")
    b2b_offer_start_date: Optional[datetime] = Field(None, alias="b2bOfferStartDate")
    b2b_offer_end_date: Optional[datetime] = Field(None, alias="b2bOfferEndDate")
    
    description: Optional[str] = None
    status: str = "Draft"
    stock: int = 0
    image: Optional[str] = None
    rating: float = 0.0
    reviews: int = 0

    @field_validator('b2c_offer_start_date', 'b2c_offer_end_date', 'b2b_offer_start_date', 'b2b_offer_end_date', mode='before')
    @classmethod
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v

    class Config:
        populate_by_name = True
        from_attributes = True

class ProductCreate(ProductBase):
    id: Optional[str] = None # Optional, if provided use it, else generate
    attributes: List[ProductAttributeCreate] = []
    variants: List[ProductVariantCreate] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    
    b2c_price: Optional[float] = Field(None, alias="b2cPrice")
    compare_at_price: Optional[float] = Field(None, alias="compareAtPrice")
    b2b_price: Optional[float] = Field(None, alias="b2bPrice")
    
    b2c_active_offer: Optional[float] = Field(None, alias="b2cOfferPercentage")
    b2c_discount: Optional[float] = Field(None, alias="b2cDiscount")
    b2c_offer_price: Optional[float] = Field(None, alias="b2cOfferPrice")
    b2c_offer_start_date: Optional[datetime] = Field(None, alias="b2cOfferStartDate")
    b2c_offer_end_date: Optional[datetime] = Field(None, alias="b2cOfferEndDate")
    
    b2b_active_offer: Optional[float] = Field(None, alias="b2bOfferPercentage")
    b2b_discount: Optional[float] = Field(None, alias="b2bDiscount")
    b2b_offer_price: Optional[float] = Field(None, alias="b2bOfferPrice")
    b2b_offer_start_date: Optional[datetime] = Field(None, alias="b2bOfferStartDate")
    b2b_offer_end_date: Optional[datetime] = Field(None, alias="b2bOfferEndDate")
    
    description: Optional[str] = None
    status: Optional[str] = None
    stock: Optional[int] = None
    image: Optional[str] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None

    attributes: Optional[List[ProductAttributeCreate]] = None
    variants: Optional[List[ProductVariantCreate]] = None

    @field_validator('b2c_offer_start_date', 'b2c_offer_end_date', 'b2b_offer_start_date', 'b2b_offer_end_date', mode='before')
    @classmethod
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v

    class Config:
        populate_by_name = True

class ProductResponse(ProductBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    attributes: List[ProductAttribute] = []
    variants: List[ProductVariant] = []

    class Config:
        from_attributes = True
        populate_by_name = True
