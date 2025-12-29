import requests
import json

API_BASE = "http://localhost:8000/api/v1"

def test_products():
    # Login
    print("Logging in...")
    login_resp = requests.post(
        f"{API_BASE}/auth/login-json",
        json={"email": "admin@ecommerce.com", "password": "admin123"}
    )
    if login_resp.status_code != 200:
        print(f"Login failed: {login_resp.text}")
        return
    
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Fetch Products
    print("\nFetching products...")
    resp = requests.get(f"{API_BASE}/products", headers=headers)
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        print(f"Current Products Count: {len(resp.json())}")
    else:
        print(f"Error fetching products: {resp.text}")
        # Don't return here, try to create anyway to see if that endpoint works


    # 2. Create Product
    print("\nCreating product...")
    new_product = {
        "name": "Test Product",
        "category": "Electronics",
        "brand": "TestBrand",
        "b2cPrice": 1000,
        "compareAtPrice": 1200,
        "b2bPrice": 800,
        "stock": 50,
        "description": "A test product",
        "attributes": [
            {"name": "Material", "value": "Plastic"}
        ],
        "variants": [
            {"color": "Red", "colorCode": "#FF0000", "stock": 20},
            {"color": "Blue", "colorCode": "#0000FF", "stock": 30}
        ]
    }
    
    resp = requests.post(f"{API_BASE}/products", headers=headers, json=new_product)
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        product_data = resp.json()
        product_id = product_data['id']
        print(f"Created Product ID: {product_id}")
        print(f"Variants: {len(product_data['variants'])}")
    else:
        print(f"Error: {resp.text}")
        return

    # 3. Update Product
    print("\nUpdating product...")
    update_data = {
        "name": "Updated Test Product",
        "category": "Electronics",
        "b2cPrice": 1100,
        "b2cOfferPercentage": 10
    }
    resp = requests.put(f"{API_BASE}/products/{product_id}", headers=headers, json=update_data)
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        print("Update successful")
        print(f"New Name: {resp.json()['name']}")
        print(f"Offer %: {resp.json()['b2cOfferPercentage']}")
    else:
        print(f"Error: {resp.text}")

    # 4. Delete Product (Commented out to keep data for verification)
    # print("\nDeleting product...")
    # resp = requests.delete(f"{API_BASE}/products/{product_id}", headers=headers)
    # print(f"Status: {resp.status_code}")
    
    # 5. Verify Deletion
    # print("\nVerifying deletion...")
    # resp = requests.get(f"{API_BASE}/products/{product_id}", headers=headers)
    # print(f"Status: {resp.status_code}") # Should be 404
    
    print(f"\nTest Complete! Product {product_id} should be in your database.")

if __name__ == "__main__":
    try:
        test_products()
    except Exception as e:
        print(f"Test failed: {e}")
