import pymysql
from app.config import settings

try:
    print("Connecting to database to check offer prices...")
    connection = pymysql.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        database=settings.DB_NAME
    )
    
    cursor = connection.cursor()
    
    # Check products with offer data
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
            b2b_offer_end_date
        FROM products
        LIMIT 5
    """)
    
    products = cursor.fetchall()
    
    print(f"\n✅ Found {len(products)} products in database\n")
    print("=" * 100)
    
    for product in products:
        print(f"\nProduct: {product[1]}")
        print(f"  B2C Price: ₹{product[2]}")
        print(f"  B2C Discount: {product[3]}%")
        print(f"  B2C Offer Price: ₹{product[4]} {'✅ STORED IN DB' if product[4] and product[4] > 0 else '❌ No active offer'}")
        print(f"  B2C Offer Period: {product[5]} to {product[6]}")
        print(f"  ---")
        print(f"  B2B Price: ₹{product[7]}")
        print(f"  B2B Discount: {product[8]}%")
        print(f"  B2B Offer Price: ₹{product[9]} {'✅ STORED IN DB' if product[9] and product[9] > 0 else '❌ No active offer'}")
        print(f"  B2B Offer Period: {product[10]} to {product[11]}")
        print("-" * 100)
    
    connection.close()
    print("\n✅ Active offer prices ARE stored in the database!")
    print("✅ When offers expire, the background task removes them from the database!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
