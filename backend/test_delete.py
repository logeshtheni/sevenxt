"""
Simple test to check if delete endpoint works
"""
import requests

# Test with authentication
base_url = "http://localhost:8000/api/v1"

# First login to get token
login_response = requests.post(
    f"{base_url}/auth/login-json",
    json={"email": "admin@ecommerce.com", "password": "admin123"}
)

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"[OK] Login successful! Token: {token[:20]}...")
    
    # Get all users
    headers = {"Authorization": f"Bearer {token}"}
    users_response = requests.get(f"{base_url}/auth/users", headers=headers)
    employees_response = requests.get(f"{base_url}/employees", headers=headers)
    
    print(f"\n[USERS] B2B/B2C: {users_response.status_code}")
    if users_response.status_code == 200:
        users = users_response.json()
        for user in users:
            print(f"  - ID: {user['id']} | Email: {user['email']} | Role: {user['role']}")
    
    print(f"\n[EMPLOYEES] Admin/Staff: {employees_response.status_code}")
    if employees_response.status_code == 200:
        employees = employees_response.json()
        for emp in employees:
            print(f"  - ID: {emp['id']} | Email: {emp['email']} | Role: {emp['role']}")
    
    # Try to delete user ID 5
    print(f"\n[DELETE] Attempting to delete user ID 5...")
    delete_response = requests.delete(f"{base_url}/auth/users/5", headers=headers)
    print(f"Status: {delete_response.status_code}")
    print(f"Response: {delete_response.text}")
    
else:
    print(f"[ERROR] Login failed: {login_response.status_code}")
    print(f"Response: {login_response.text}")
