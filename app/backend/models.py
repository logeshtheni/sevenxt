from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    business_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AddressCreate(BaseModel):
    street: str
    city: str
    postal_code: Optional[int] = None
    state: Optional[str] = None
    country: str
    name: str = "Home"
    is_default: bool = False

class B2BApplicationCreate(BaseModel):
    business_name: str
    gstin: str
    pan: str
    phone_number: str
    gst_certificate_url: str
    business_license_url: str
    address_id: str


class AddressPayload(BaseModel):
    street: str
    city: str
    postal_code: Optional[int] = None
    state: Optional[str] = None
    country: Optional[str] = ""
    name: Optional[str] = "Home"
    is_default: Optional[bool] = False


class B2CRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    raw_user_meta_data: Optional[dict] = None
    address: Optional[AddressPayload] = None