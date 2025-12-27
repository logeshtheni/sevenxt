import requests

API_BASE = "http://localhost:8000/api/v1"

# Login
login_resp = requests.post(
    f"{API_BASE}/auth/login-json",
    json={"email": "admin@ecommerce.com", "password": "admin123"}
)
print(f"Login: {login_resp.status_code}")
token = login_resp.json()["access_token"]

# Fetch B2B/B2C users from 'users' table
print("\n=== Fetching B2B/B2C Users from 'users' table ===")
users_resp = requests.get(
    f"{API_BASE}/auth/users",
    headers={"Authorization": f"Bearer {token}"}
)
print(f"Status: {users_resp.status_code}")

if users_resp.status_code == 200:
    users = users_resp.json()
    print(f"Total B2B/B2C users: {len(users)}")
    
    # Group by role
    b2b_users = [u for u in users if u.get('role') == 'B2B']
    b2c_users = [u for u in users if u.get('role') == 'B2C']
    
    print(f"\nB2B Users: {len(b2b_users)}")
    for user in b2b_users:
        print(f"  - {user['email']} ({user['name']})")
    
    print(f"\nB2C Users: {len(b2c_users)}")
    for user in b2c_users:
        print(f"  - {user['email']} ({user['name']})")
else:
    print(f"Error: {users_resp.text}")

# Fetch Admin/Staff users from 'employee_users' table
print("\n=== Fetching Admin/Staff Users from 'employee_users' table ===")
employees_resp = requests.get(
    f"{API_BASE}/employees",
    headers={"Authorization": f"Bearer {token}"}
)
print(f"Status: {employees_resp.status_code}")

if employees_resp.status_code == 200:
    employees = employees_resp.json()
    print(f"Total Admin/Staff users: {len(employees)}")
    
    # Group by role
    admin_users = [e for e in employees if e.get('role') == 'admin']
    staff_users = [e for e in employees if e.get('role') == 'staff']
    
    print(f"\nAdmin Users: {len(admin_users)}")
    for user in admin_users[:5]:  # Show first 5
        print(f"  - {user['email']} ({user['name']})")
    
    print(f"\nStaff Users: {len(staff_users)}")
    for user in staff_users[:5]:  # Show first 5
        print(f"  - {user['email']} ({user['name']})")
else:
    print(f"Error: {employees_resp.text}")
