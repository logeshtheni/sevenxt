from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.modules.auth.routes import get_current_employee
from app.modules.auth.models import EmployeeUser
from . import schemas, service
from datetime import datetime

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/import")
async def import_products(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: EmployeeUser = Depends(get_current_employee)
):
    """
    Bulk import products from Excel file.
    """
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel file.")
    
    try:
        contents = await file.read()
        result = service.process_bulk_import(db, contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@router.get("")
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    # current_user: EmployeeUser = Depends(get_current_employee) # Optional: Protect route
):
    try:
        print(f"DEBUG ROUTE: Fetching products with skip={skip}, limit={limit}")
        products = service.get_products(db, skip=skip, limit=limit)
        print(f"DEBUG ROUTE: Successfully fetched {len(products)} products")
        
        # Manually serialize to ensure all fields are included
        result = []
        for product in products:
            product_dict = {
                "id": product.id,
                "name": product.name,
                "category": product.category,
                
                "b2cPrice": product.b2c_price,
                "compareAtPrice": product.compare_at_price,
                "b2bPrice": product.b2b_price,
                "b2cOfferPercentage": product.b2c_active_offer if product.b2c_active_offer is not None else 0.0,
                "b2cDiscount": product.b2c_discount if product.b2c_discount is not None else 0.0,
                "b2cOfferPrice": product.b2c_offer_price if product.b2c_offer_price is not None else 0.0,
                "b2cOfferStartDate": (product.b2c_offer_start_date.isoformat() if hasattr(product.b2c_offer_start_date, 'isoformat') else str(product.b2c_offer_start_date)) if product.b2c_offer_start_date else None,
                "b2cOfferEndDate": (product.b2c_offer_end_date.isoformat() if hasattr(product.b2c_offer_end_date, 'isoformat') else str(product.b2c_offer_end_date)) if product.b2c_offer_end_date else None,
                "b2bOfferPercentage": product.b2b_active_offer if product.b2b_active_offer is not None else 0.0,
                "b2bDiscount": product.b2b_discount if product.b2b_discount is not None else 0.0,
                "b2bOfferPrice": product.b2b_offer_price if product.b2b_offer_price is not None else 0.0,
                "b2bOfferStartDate": (product.b2b_offer_start_date.isoformat() if hasattr(product.b2b_offer_start_date, 'isoformat') else str(product.b2b_offer_start_date)) if product.b2b_offer_start_date else None,
                "b2bOfferEndDate": (product.b2b_offer_end_date.isoformat() if hasattr(product.b2b_offer_end_date, 'isoformat') else str(product.b2b_offer_end_date)) if product.b2b_offer_end_date else None,
                "description": product.description,
                "status": product.status,
                "stock": product.stock,
                "image": product.image,
                "rating": product.rating if product.rating is not None else 0.0,
                "reviews": product.reviews if product.reviews is not None else 0,
                "createdAt": (product.created_at.isoformat() if hasattr(product.created_at, 'isoformat') else str(product.created_at)) if product.created_at else None,
                "updatedAt": (product.updated_at.isoformat() if hasattr(product.updated_at, 'isoformat') else str(product.updated_at)) if product.updated_at else None,
                "attributes": [{"name": attr.name, "value": attr.value} for attr in product.attributes],
                "variants": [{"color": v.color, "colorCode": v.color_code, "stock": v.stock} for v in product.variants]
            }
            result.append(product_dict)
        
        return result
    except Exception as e:
        print(f"ERROR in read_products route: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")

@router.get("/{product_id}", response_model=schemas.ProductResponse, response_model_by_alias=True)
def read_product(
    product_id: str, 
    db: Session = Depends(get_db),
    # current_user: EmployeeUser = Depends(get_current_employee)
):
    db_product = service.get_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.post("", response_model=schemas.ProductResponse, response_model_by_alias=True)
def create_product(
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db),
    current_user: EmployeeUser = Depends(get_current_employee)
):
    return service.create_product(db=db, product=product)

@router.put("/{product_id}", response_model=schemas.ProductResponse, response_model_by_alias=True)
def update_product(
    product_id: str, 
    product: schemas.ProductUpdate, 
    db: Session = Depends(get_db),
    current_user: EmployeeUser = Depends(get_current_employee)
):
    db_product = service.update_product(db=db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}")
def delete_product(
    product_id: str, 
    db: Session = Depends(get_db),
    current_user: EmployeeUser = Depends(get_current_employee)
):
    success = service.delete_product(db=db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success"}
