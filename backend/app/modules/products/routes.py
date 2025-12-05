from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.modules.auth.routes import get_current_employee
from app.modules.auth.models import EmployeeUser
from . import schemas, service

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

@router.get("", response_model=List[schemas.ProductResponse])
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    # current_user: EmployeeUser = Depends(get_current_employee) # Optional: Protect route
):
    products = service.get_products(db, skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=schemas.ProductResponse)
def read_product(
    product_id: str, 
    db: Session = Depends(get_db),
    # current_user: EmployeeUser = Depends(get_current_employee)
):
    db_product = service.get_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.post("", response_model=schemas.ProductResponse)
def create_product(
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db),
    current_user: EmployeeUser = Depends(get_current_employee)
):
    return service.create_product(db=db, product=product)

@router.put("/{product_id}", response_model=schemas.ProductResponse)
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

# @router.delete("/{product_id}")
# def delete_product(
#     product_id: str, 
#     db: Session = Depends(get_db),
#     current_user: EmployeeUser = Depends(get_current_employee)
# ):
#     success = service.delete_product(db=db, product_id=product_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Product not found")
#     return {"status": "success"}
