from sqlalchemy.orm import Session
from . import models, schemas
import uuid
from datetime import datetime
import pandas as pd
import io

def ensure_datetime(date_val):
    if isinstance(date_val, str):
        try:
            return datetime.fromisoformat(date_val.replace('Z', '+00:00'))
        except:
            return None
    return date_val

def calculate_offer_prices(product: models.Product):
    """
    Calculates and updates the offer prices (b2c_offer_price, b2b_offer_price)
    based on the current base prices (b2c_price, b2b_price) and active offers.
    
    This function is NON-DESTRUCTIVE to the base price.
    It updates:
    - b2c_offer_price
    - b2b_offer_price
    - b2c_discount (syncs with offer percentage)
    - b2b_discount (syncs with offer percentage)
    
    IMPORTANT: Only ACTIVE offers (currently running) are shown.
    Future/scheduled offers are cleared immediately.
    """
    now = datetime.now()
    
    # --- B2C Offer Logic ---
    discount_pct = 0.0
    b2c_offer_pct_val = product.b2c_active_offer if product.b2c_active_offer is not None else 0.0
    
    # Only use active offer percentage for calculation
    if b2c_offer_pct_val > 0:
        discount_pct = float(b2c_offer_pct_val)
    
    # Check if offer is CURRENTLY ACTIVE
    is_b2c_offer_active = False

    if discount_pct > 0:
        # If dates are set, check if we're within the offer period
        start_date = ensure_datetime(product.b2c_offer_start_date)
        end_date = ensure_datetime(product.b2c_offer_end_date)
        
        if start_date and end_date:
            if start_date <= now <= end_date:
                # Offer is ACTIVE NOW
                is_b2c_offer_active = True
                print(f"✅ B2C offer ACTIVE (discount: {discount_pct}%)")
            else:
                # Offer is either scheduled for future OR expired - CLEAR IT
                print(f"🗑️ B2C offer not active (scheduled/expired) - clearing")
                # Do not clear b2c_discount (regular discount)
                product.b2c_active_offer = 0.0
                product.b2c_offer_price = 0.0
                product.b2c_offer_start_date = None
                product.b2c_offer_end_date = None
                is_b2c_offer_active = False
        else:
            # No dates set, but discount is set - treat as active immediately
            is_b2c_offer_active = True
            print(f"B2C offer ACTIVE (no dates, discount: {discount_pct}%)")
    
    # Calculate and store offer price ONLY for ACTIVE offers
    if is_b2c_offer_active and discount_pct > 0:
        product.b2c_offer_price = product.b2c_price * (1 - discount_pct / 100.0)
        print(f" B2C Offer Price: ₹{product.b2c_price} - {discount_pct}% = ₹{product.b2c_offer_price}")
    else:
        product.b2c_offer_price = 0.0

    # --- B2B Offer Logic ---
    discount_pct_b2b = 0.0
    b2b_offer_pct_val = product.b2b_active_offer if product.b2b_active_offer is not None else 0.0
    
    # Only use active offer percentage for calculation
    if b2b_offer_pct_val > 0:
        discount_pct_b2b = float(b2b_offer_pct_val)
    
    # Check if offer is CURRENTLY ACTIVE
    is_b2b_offer_active = False
    
    if discount_pct_b2b > 0:
        start_date_b2b = ensure_datetime(product.b2b_offer_start_date)
        end_date_b2b = ensure_datetime(product.b2b_offer_end_date)
        
        if start_date_b2b and end_date_b2b:
            if start_date_b2b <= now <= end_date_b2b:
                # Offer is ACTIVE NOW
                is_b2b_offer_active = True
                print(f"✅ B2B offer ACTIVE (discount: {discount_pct_b2b}%)")
            else:
                # Offer is either scheduled for future OR expired - CLEAR IT
                print(f"🗑️ B2B offer not active (scheduled/expired) - clearing")
                # Do not clear b2b_discount (regular discount)
                product.b2b_active_offer = 0.0
                product.b2b_offer_price = 0.0
                product.b2b_offer_start_date = None
                product.b2b_offer_end_date = None
                is_b2b_offer_active = False
        else:
            # No dates set, but discount is set - treat as active immediately
            is_b2b_offer_active = True
            print(f"✅ B2B offer ACTIVE (no dates, discount: {discount_pct_b2b}%)")
    
    # Calculate and store offer price ONLY for ACTIVE offers
    if is_b2b_offer_active and discount_pct_b2b > 0:
        product.b2b_offer_price = product.b2b_price * (1 - discount_pct_b2b / 100.0)
        print(f"💰 B2B Offer Price: ₹{product.b2b_price} - {discount_pct_b2b}% = ₹{product.b2b_offer_price}")
    else:
        product.b2b_offer_price = 0.0


def get_products(db: Session, skip: int = 0, limit: int = 100):
    print(f"DEBUG: Fetching products skip={skip} limit={limit}")
    try:
        products = db.query(models.Product).offset(skip).limit(limit).all()
        print(f"DEBUG: Found {len(products)} products")
        
        for product in products:
            try:
                calculate_offer_prices(product)
                # Check expiration
                b2c_end = ensure_datetime(product.b2c_offer_end_date)
                b2b_end = ensure_datetime(product.b2b_offer_end_date)
                
                if (b2c_end and b2c_end < datetime.now()) or \
                   (b2b_end and b2b_end < datetime.now()):
                    db.add(product)
                    db.commit()
            except Exception as e:
                print(f"ERROR processing product {product.id}: {e}")
                import traceback
                traceback.print_exc()
                # Continue with other products even if one fails calculation
                continue
                
        return products
    except Exception as e:
        print(f"CRITICAL ERROR in get_products: {e}")
        import traceback
        traceback.print_exc()
        raise e

def get_product(db: Session, product_id: str):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product:
        calculate_offer_prices(product)
        if (product.b2c_offer_end_date and product.b2c_offer_end_date < datetime.now()) or \
           (product.b2b_offer_end_date and product.b2b_offer_end_date < datetime.now()):
            db.add(product)
            db.commit()
    return product

def create_product(db: Session, product: schemas.ProductCreate):
    product_id = product.id if product.id else f"prod_{uuid.uuid4().hex[:8]}"
    
    product_data = product.model_dump(exclude={'attributes', 'variants', 'id'}, by_alias=False)
    
    db_product = models.Product(
        id=product_id,
        **product_data
    )
    
    # Calculate offers before adding
    calculate_offer_prices(db_product)
    
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
            color_code=variant.color_code,
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
    
    update_data = product.model_dump(exclude={'attributes', 'variants', 'id'}, exclude_unset=True, by_alias=False)
    
    
    for key, value in update_data.items():
        if hasattr(db_product, key):
            setattr(db_product, key, value)
            
    # Recalculate offers
    calculate_offer_prices(db_product)
    
    # Update Attributes
    if product.attributes is not None:
        db.query(models.ProductAttribute).filter(models.ProductAttribute.product_id == product_id).delete()
        for attr in product.attributes:
            db_attr = models.ProductAttribute(
                product_id=product_id,
                name=attr.name,
                value=attr.value
            )
            db.add(db_attr)
            
    # Update Variants
    if product.variants is not None:
        db.query(models.ProductVariant).filter(models.ProductVariant.product_id == product_id).delete()
        for variant in product.variants:
            db_variant = models.ProductVariant(
                product_id=product_id,
                color=variant.color,
                color_code=variant.color_code,
                stock=variant.stock
            )
            db.add(db_variant)
            
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: str):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False

def process_bulk_import(db: Session, file_contents: bytes):
    def safe_float(val, default=0.0):
        """Safely convert value to float, handling NaN and empty values."""
        if pd.isna(val) or val == '' or val is None:
            return default
        try:
            return float(val)
        except (ValueError, TypeError):
            return default
    
    def safe_int(val, default=0):
        """Safely convert value to int, handling NaN and empty values."""
        if pd.isna(val) or val == '' or val is None:
            return default
        try:
            return int(float(val))  # Convert via float first to handle "10.0" cases
        except (ValueError, TypeError):
            return default
    
    def safe_str(val, default=''):
        """Safely convert value to string, handling NaN."""
        if pd.isna(val) or val is None:
            return default
        return str(val).strip()
    
    def get_value(row, possible_keys, default=None):
        """Try multiple possible column names and return the first match."""
        for key in possible_keys:
            if key in row and not pd.isna(row.get(key)):
                return row.get(key)
        return default
    
    try:
        df = pd.read_excel(io.BytesIO(file_contents))
        # Normalize column names: lowercase, replace spaces with underscores
        df.columns = [c.lower().strip().replace(' ', '_') for c in df.columns]
        
        print(f"DEBUG: Excel columns found: {list(df.columns)}")
        
        results = {"success": 0, "failed": 0, "errors": []}
        
        for index, row in df.iterrows():
            try:
                # Get name (required)
                name = safe_str(get_value(row, ['name', 'product_name', 'product', 'title']))
                if not name:
                    results["errors"].append(f"Row {index + 2}: No product name found")
                    continue
                
                # Get category
                category = safe_str(get_value(row, ['category', 'product_category', 'type'], 'Uncategorized'))
                
                # Get prices - try multiple possible column names
                b2c_price = safe_float(get_value(row, [
                    'b2c_price', 'b2cprice', 'b2c', 'selling_price', 'price', 'retail_price', 'sp'
                ]))
                
                b2b_price = safe_float(get_value(row, [
                    'b2b_price', 'b2bprice', 'b2b', 'wholesale_price', 'bulk_price', 'dealer_price'
                ]))
                
                mrp = safe_float(get_value(row, [
                    'mrp', 'compare_at_price', 'original_price', 'actual_price', 'list_price', 'max_price'
                ]))
                
                # Get discounts
                b2c_discount = safe_float(get_value(row, [
                    'b2c_discount', 'b2c_discount_%', 'b2cdiscount', 'discount', 'discount_%'
                ]))
                
                b2b_discount = safe_float(get_value(row, [
                    'b2b_discount', 'b2b_discount_%', 'b2bdiscount', 'bulk_discount'
                ]))
                
                # Get other fields
                stock = safe_int(get_value(row, ['stock', 'quantity', 'qty', 'inventory']))
                description = safe_str(get_value(row, ['description', 'desc', 'product_description', 'details']))
                status = safe_str(get_value(row, ['status', 'product_status'], 'Draft'))
                image = safe_str(get_value(row, ['image', 'image_url', 'img', 'picture', 'photo']))
                
                # Get offer percentages
                b2c_offer = safe_float(get_value(row, [
                    'b2c_offer_%', 'b2c_offer', 'b2coffer', 'offer_%', 'offer'
                ]))
                
                b2b_offer = safe_float(get_value(row, [
                    'b2b_offer_%', 'b2b_offer', 'b2boffer', 'bulk_offer'
                ]))
                
                print(f"DEBUG Row {index + 2}: name={name}, b2c_price={b2c_price}, b2b_price={b2b_price}, mrp={mrp}")
                    
                product_data = schemas.ProductCreate(
                    name=name,
                    category=category,
                    b2cPrice=b2c_price,
                    compareAtPrice=mrp,
                    b2bPrice=b2b_price,
                    b2cDiscount=b2c_discount,
                    b2bDiscount=b2b_discount,
                    stock=stock,
                    description=description or None,
                    status=status if status in ['Active', 'Draft', 'Archived'] else 'Draft',
                    image=image or None,
                    b2cOfferPercentage=b2c_offer,
                    b2bOfferPercentage=b2b_offer
                )
                
                create_product(db, product_data)
                results["success"] += 1
                
            except Exception as e:
                results["failed"] += 1
                results["errors"].append(f"Row {index + 2}: {str(e)}")
                print(f"ERROR Row {index + 2}: {str(e)}")
                
        return results
        
    except Exception as e:
        raise Exception(f"Failed to process Excel file: {str(e)}")


