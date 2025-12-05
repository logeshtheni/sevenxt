from sqlalchemy.orm import Session
from . import models, schemas
import uuid
from datetime import datetime
import pandas as pd
import io

# ... existing functions ...

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def process_bulk_import(db: Session, file_contents: bytes):
    try:
        df = pd.read_excel(io.BytesIO(file_contents))
        
        # Normalize column names
        df.columns = [c.lower().replace(' ', '_') for c in df.columns]
        
        results = {"success": 0, "failed": 0, "errors": []}
        
        for index, row in df.iterrows():
            try:
                # Basic validation
                if pd.isna(row.get('name')):
                    continue
                    
                # Prepare product data
                product_data = schemas.ProductCreate(
                    name=str(row['name']),
                    category=str(row.get('category', 'Uncategorized')),
                    brand=str(row.get('brand', '')) if not pd.isna(row.get('brand')) else None,
                    b2cPrice=float(row.get('b2c_price', 0)),
                    compareAtPrice=float(row.get('mrp', 0)),
                    b2bPrice=float(row.get('b2b_price', 0)),
                    stock=int(row.get('stock', 0)),
                    description=str(row.get('description', '')) if not pd.isna(row.get('description')) else None,
                    status=str(row.get('status', 'Draft')),
                    image=str(row.get('image_url', '')) if not pd.isna(row.get('image_url')) else None,
                    
                    # Offers
                    b2cOfferPercentage=float(row.get('b2c_offer_%', 0)),
                    b2bOfferPercentage=float(row.get('b2b_offer_%', 0))
                )
                
                # Create product
                create_product(db, product_data)
                results["success"] += 1
                
            except Exception as e:
                results["failed"] += 1
                results["errors"].append(f"Row {index + 2}: {str(e)}")
                
        return results
        
    except Exception as e:
        raise Exception(f"Failed to process Excel file: {str(e)}")

def get_product(db: Session, product_id: str):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_product(db: Session, product: schemas.ProductCreate):
    # Generate ID if not provided
    product_id = product.id if product.id else f"prod_{uuid.uuid4().hex[:8]}"
    
    db_product = models.Product(
        id=product_id,
        name=product.name,
        category=product.category,
        brand=product.brand,
        b2c_price=product.b2cPrice,
        compare_at_price=product.compareAtPrice,
        b2b_price=product.b2bPrice,
        b2c_offer_percentage=product.b2cOfferPercentage,
        b2c_offer_start_date=product.b2cOfferStartDate,
        b2c_offer_end_date=product.b2cOfferEndDate,
        b2b_offer_percentage=product.b2bOfferPercentage,
        b2b_offer_start_date=product.b2bOfferStartDate,
        b2b_offer_end_date=product.b2bOfferEndDate,
        description=product.description,
        status=product.status,
        stock=product.stock,
        image=product.image,
        rating=product.rating,
        reviews=product.reviews
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Add Attributes
    for attr in product.attributes:
        db_attr = models.ProductAttribute(
            product_id=product_id,
            name=attr.name,
            value=attr.value
        )
        db.add(db_attr)
    
    # Add Variants
    for variant in product.variants:
        db_variant = models.ProductVariant(
            product_id=product_id,
            color=variant.color,
            color_code=variant.colorCode,
            stock=variant.stock
        )
        db.add(db_variant)
        
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: str, product: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    # Update fields
    update_data = product.model_dump(exclude={'attributes', 'variants', 'id'}, exclude_unset=True)
    
    # Map alias keys back to model keys if needed (pydantic model_dump with by_alias=False gives field names)
    # But we defined aliases in schema. Let's handle manually to be safe or use populate_by_name
    
    db_product.name = product.name
    db_product.category = product.category
    db_product.brand = product.brand
    db_product.b2c_price = product.b2cPrice
    db_product.compare_at_price = product.compareAtPrice
    db_product.b2b_price = product.b2bPrice
    db_product.b2c_offer_percentage = product.b2cOfferPercentage
    db_product.b2c_offer_start_date = product.b2cOfferStartDate
    db_product.b2c_offer_end_date = product.b2cOfferEndDate
    db_product.b2b_offer_percentage = product.b2bOfferPercentage
    db_product.b2b_offer_start_date = product.b2bOfferStartDate
    db_product.b2b_offer_end_date = product.b2bOfferEndDate
    db_product.description = product.description
    db_product.status = product.status
    db_product.stock = product.stock
    db_product.image = product.image
    db_product.rating = product.rating
    db_product.reviews = product.reviews
    
    # Update Attributes (Delete all and recreate)
    if product.attributes is not None:
        db.query(models.ProductAttribute).filter(models.ProductAttribute.product_id == product_id).delete()
        for attr in product.attributes:
            db_attr = models.ProductAttribute(
                product_id=product_id,
                name=attr.name,
                value=attr.value
            )
            db.add(db_attr)
            
    # Update Variants (Delete all and recreate)
    if product.variants is not None:
        db.query(models.ProductVariant).filter(models.ProductVariant.product_id == product_id).delete()
        for variant in product.variants:
            db_variant = models.ProductVariant(
                product_id=product_id,
                color=variant.color,
                color_code=variant.colorCode,
                stock=variant.stock
            )
            db.add(db_variant)
            
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: str):
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False
