<<<<<<< HEAD
from pydantic import BaseModel, Field, field_validator
=======
from pydantic import BaseModel, Field
>>>>>>> 1e65977e (connnect)
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
<<<<<<< HEAD
    color_code: str = Field(..., alias="colorCode")
=======
    colorCode: str = Field(..., alias="color_code")
>>>>>>> 1e65977e (connnect)
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
<<<<<<< HEAD
    
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
=======
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
>>>>>>> 1e65977e (connnect)
    
    description: Optional[str] = None
    status: str = "Draft"
    stock: int = 0
    image: Optional[str] = None
    rating: float = 0.0
    reviews: int = 0
<<<<<<< HEAD
    
    # Tax and Compliance
    sgst: float = 0.0
    cgst: float = 0.0
    hsn: Optional[str] = None
    return_policy: Optional[str] = Field(None, alias="returnPolicy")
    
    # Dimensions (for shipping)
    height: float = 0.0
    weight: float = 0.0
    breadth: float = 0.0
    length: float = 0.0

    @field_validator('b2c_offer_start_date', 'b2c_offer_end_date', 'b2b_offer_start_date', 'b2b_offer_end_date', mode='before')
    @classmethod
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v

    class Config:
        populate_by_name = True
        from_attributes = True
=======
>>>>>>> 1e65977e (connnect)

class ProductCreate(ProductBase):
    id: Optional[str] = None # Optional, if provided use it, else generate
    attributes: List[ProductAttributeCreate] = []
    variants: List[ProductVariantCreate] = []

<<<<<<< HEAD
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
    
    # Tax and Compliance
    sgst: Optional[float] = None
    cgst: Optional[float] = None
    hsn: Optional[str] = None
    return_policy: Optional[str] = Field(None, alias="returnPolicy")
    
    # Dimensions (for shipping)
    height: Optional[float] = None
    weight: Optional[float] = None
    breadth: Optional[float] = None
    length: Optional[float] = None

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

=======
class ProductUpdate(ProductBase):
    attributes: Optional[List[ProductAttributeCreate]] = None
    variants: Optional[List[ProductVariantCreate]] = None

>>>>>>> 1e65977e (connnect)
class ProductResponse(ProductBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    attributes: List[ProductAttribute] = []
    variants: List[ProductVariant] = []

    class Config:
        from_attributes = True
        populate_by_name = True
