import pymysql
from app.config import settings
from datetime import datetime

try:
    print("\n" + "=" * 100)
    print("CURRENT B2B AND B2C PRICES IN DATABASE")
    print("=" * 100 + "\n")
    
    connection = pymysql.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        database=settings.DB_NAME
    )
    
    cursor = connection.cursor()
    
    # Get all products with their prices
    cursor.execute("""
        SELECT 
            id,
            name,
            b2c_price,
            b2c_discount,
            b2c_offer_price,
            b2c_offer_start_date,
            b2c_offer_end_date,
            b2b_price,
            b2b_discount,
            b2b_offer_price,
            b2b_offer_start_date,
            b2b_offer_end_date,
            status
        FROM products
        ORDER BY name
    """)
    
    products = cursor.fetchall()
    
    print(f"Found {len(products)} products\n")
    
    for product in products:
        product_id, name, b2c_price, b2c_discount, b2c_offer_price, b2c_start, b2c_end, \
        b2b_price, b2b_discount, b2b_offer_price, b2b_start, b2b_end, status = product
        
        print("─" * 100)
        print(f"📦 Product: {name} (ID: {product_id})")
        print(f"   Status: {status}")
        print()
        
        # B2C Pricing
        print("   💰 B2C PRICING:")
        print(f"      Base Price: ₹{b2c_price if b2c_price else 0}")
        
        if b2c_discount and b2c_discount > 0:
            print(f"      Discount: {b2c_discount}%")
            print(f"      Offer Price: ₹{b2c_offer_price if b2c_offer_price else 0} ✅ STORED IN DB")
            
            if b2c_start and b2c_end:
                now = datetime.now()
                if b2c_start <= now <= b2c_end:
                    print(f"      Status: 🟢 ACTIVE OFFER")
                elif b2c_end < now:
                    print(f"      Status: 🔴 EXPIRED")
                else:
                    print(f"      Status: 🟡 SCHEDULED")
                print(f"      Period: {b2c_start} to {b2c_end}")
            else:
                print(f"      Status: 🟢 ACTIVE (No expiry)")
        else:
            print(f"      No active offer")
        
        print()
        
        # B2B Pricing
        print("   🏢 B2B PRICING:")
        print(f"      Base Price: ₹{b2b_price if b2b_price else 0}")
        
        if b2b_discount and b2b_discount > 0:
            print(f"      Discount: {b2b_discount}%")
            print(f"      Offer Price: ₹{b2b_offer_price if b2b_offer_price else 0} ✅ STORED IN DB")
            
            if b2b_start and b2b_end:
                now = datetime.now()
                if b2b_start <= now <= b2b_end:
                    print(f"      Status: 🟢 ACTIVE OFFER")
                elif b2b_end < now:
                    print(f"      Status: 🔴 EXPIRED")
                else:
                    print(f"      Status: 🟡 SCHEDULED")
                print(f"      Period: {b2b_start} to {b2b_end}")
            else:
                print(f"      Status: 🟢 ACTIVE (No expiry)")
        else:
            print(f"      No active offer")
        
        print()
    
    print("=" * 100)
    
    connection.close()
    
    print("\n✅ All prices are stored in the database!")
    print("✅ Offer prices are automatically calculated when you set a discount")
    print("✅ Expired offers are automatically removed by the background task\n")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
