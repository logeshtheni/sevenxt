# Admin Password Reset - Simple Implementation

## Overview
This is a simplified password reset system where **admins can directly reset user passwords** without email verification.

---

## ✨ How It Works

### Simple Flow:
```
1. Admin logs in
   ↓
2. Admin goes to Password Reset page
   ↓
3. Admin searches and selects a user
   ↓
4. Admin enters new password
   ↓
5. Password is immediately updated in database ✅
   ↓
6. User can login with new password
```

**No email sending, no tokens, no complexity!**

---

## 🎯 Features

✅ **UUID-based tokens** (not JWT)  
✅ **No email sending** required  
✅ **Direct password update** in database  
✅ **Admin-only access** (role-based)  
✅ **User search** by name or email  
✅ **Instant feedback** on success/error  
✅ **Beautiful UI** with user selection  

---

## 📁 Files Created/Modified

### Backend:
- ✅ `backend/app/modules/auth/service.py`
  - `generate_reset_token_for_user()` - Generate UUID token
  - `reset_user_password()` - Directly update password
  - `get_user_with_reset_token()` - Get user with token

- ✅ `backend/app/modules/auth/schemas.py`
  - `ResetPasswordAdminRequest` - Request schema
  - `ResetPasswordResponse` - Response schema

- ✅ `backend/app/modules/auth/routes.py`
  - `POST /api/v1/auth/admin/reset-password` - Admin endpoint

### Frontend:
- ✅ `Frontend/services/api.ts`
  - `adminResetPassword()` - API method

- ✅ `Frontend/components/AdminResetPasswordView.tsx`
  - Complete admin UI for password reset

---

## 🚀 Usage

### For Admins:

1. **Navigate to Password Reset Page**
   - Add route: `/admin/reset-password`

2. **Search for User**
   - Type name or email in search box
   - Click on user to select

3. **Enter New Password**
   - Minimum 6 characters
   - Confirm password

4. **Click "Reset Password"**
   - Password is immediately updated in database
   - Success message shows user email

5. **User Can Login**
   - User can now login with new password immediately

---

## 🔧 Setup

### Step 1: Add Route to Frontend

In your router file (e.g., `App.tsx`):

```typescript
import { AdminResetPasswordView } from './components/AdminResetPasswordView';

// Add route (protected, admin-only):
<Route 
  path="/admin/reset-password" 
  element={<AdminResetPasswordView />} 
/>
```

### Step 2: Add Navigation Link

In your admin menu/sidebar:

```typescript
<Link to="/admin/reset-password">
  <Key size={18} />
  Reset Password
</Link>
```

---

## 🧪 Test It

### Quick Test:

1. Login as admin
2. Go to `/admin/reset-password`
3. Search for a user (e.g., "admin")
4. Click on the user
5. Enter new password: `newpass123`
6. Confirm password: `newpass123`
7. Click "Reset Password"
8. ✅ Success message appears
9. Logout and login with new password

### API Test:

```bash
# Login as admin first to get token
curl -X POST http://localhost:8000/api/v1/auth/login-json \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ecommerce.com", "password": "admin123"}'

# Use the token to reset password
curl -X POST http://localhost:8000/api/v1/auth/admin/reset-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"user_id": 1, "new_password": "newPassword123"}'
```

---

## 🔐 Security

- ✅ **Admin-only access** - Only users with `role="admin"` can reset passwords
- ✅ **Authentication required** - Must be logged in with valid token
- ✅ **PBKDF2 hashing** - Passwords are hashed before storing
- ✅ **Validation** - Minimum 6 characters, password confirmation

---

## 📊 API Endpoint

### POST `/api/v1/auth/admin/reset-password`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "new_password": "newSecurePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully",
  "user_id": 1,
  "email": "user@example.com",
  "password_updated": true
}
```

**Error Responses:**

- **403 Forbidden** - Not an admin
```json
{
  "detail": "Only admins can reset user passwords"
}
```

- **404 Not Found** - User doesn't exist
```json
{
  "detail": "User not found"
}
```

- **401 Unauthorized** - Not logged in
```json
{
  "detail": "Could not validate credentials"
}
```

---

## 🎨 UI Features

### User List:
- ✅ Search by name or email
- ✅ Shows role badge (admin/staff)
- ✅ Shows status badge (active/inactive)
- ✅ Visual selection indicator
- ✅ Scrollable list

### Password Form:
- ✅ Selected user info display
- ✅ Password strength hint
- ✅ Confirmation field
- ✅ Loading state
- ✅ Success/error messages

---

## 💡 Benefits of This Approach

1. **Simple** - No email configuration needed
2. **Fast** - Immediate password update
3. **Admin Control** - Admins have full control
4. **No Waiting** - No email delays
5. **Reliable** - No email delivery issues
6. **Direct** - Straight to database

---

## 📝 Database

The password is stored in:
- **Table:** `employee_users`
- **Column:** `password` (VARCHAR 255)
- **Format:** PBKDF2-HMAC-SHA256 hash

Example:
```
Before: admin123
After:  a1b2c3d4e5f6...:1a2b3c4d5e6f... (hashed)
```

---

## ✅ Summary

**Simple, direct, admin-controlled password reset!**

- ✅ No email setup required
- ✅ No token links to manage
- ✅ Instant password updates
- ✅ Beautiful admin UI
- ✅ Secure and validated

**Perfect for internal admin tools!**

---

**Created:** December 5, 2025  
**Status:** ✅ Ready to Use
