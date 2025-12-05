import requests
import json

# Test the login endpoint
url = "http://localhost:8000/api/v1/auth/login-json"
headers = {"Content-Type": "application/json"}
data = {
    "email": "admin@ecommerce.com",
    "password": "admin123"
}

print(f"Testing login endpoint: {url}")
print(f"Request data: {json.dumps(data, indent=2)}")
print("\n" + "="*50 + "\n")

try:
    response = requests.post(url, json=data, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"\nResponse Body:")
    print(json.dumps(response.json(), indent=2))
    
except requests.exceptions.ConnectionError:
    print("❌ ERROR: Could not connect to the server.")
    print("Make sure the backend server is running on http://localhost:8000")
except Exception as e:
    print(f"❌ ERROR: {e}")
    if hasattr(e, 'response'):
        print(f"Response: {e.response.text}")
