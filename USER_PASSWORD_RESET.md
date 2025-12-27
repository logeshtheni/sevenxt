# User Password Reset Flow (OTP Based)

This document describes the implementation of the user-facing password reset feature using OTP (One-Time Password).

## Overview

The password reset flow allows users to reset their forgotten passwords by verifying their identity via a 6-digit OTP sent to their email address.

**Key Features:**
- **OTP Verification:** Uses a 6-digit code instead of a link.
- **No Third-Party APIs:** Uses standard SMTP for emails (or console logs for dev).
- **Secure:** OTPs are valid for 10 minutes and invalidated after use.
- **User Friendly:** Entire flow happens within the Login page.

## Flow Diagram

1. **User** clicks "Forgot Password?" on Login screen.
2. **User** enters Email Address.
3. **System** generates 6-digit OTP and sends to Email.
   - *Dev Mode:* OTP is also displayed on screen/console if SMTP is missing.
4. **User** enters OTP and New Password.
5. **System** verifies OTP and updates password.
6. **User** is redirected to Login.

## Backend Implementation

### 1. Database
- Uses existing `employee_users` table.
- `reset_token`: Stores the 6-digit OTP.
- `reset_token_expires`: Stores expiration time (10 mins).

### 2. API Endpoints

#### `POST /api/v1/auth/forgot-password`
- **Input:** `{ "email": "user@example.com" }`
- **Logic:** Generates OTP, saves to DB, sends email.
- **Output:** `{ "message": "OTP sent...", "dev_otp": "123456" }`

#### `POST /api/v1/auth/reset-password-otp`
- **Input:** 
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "new_password": "newPassword123"
  }
  ```
- **Logic:** Verifies OTP matches DB and is not expired. Updates password.
- **Output:** `{ "message": "Password has been reset successfully" }`

## Frontend Implementation

### `LoginView.tsx`
- **State Management:** Handles `login`, `forgot`, `otp`, `success` views.
- **Step 1:** Request OTP form.
- **Step 2:** Verify OTP + New Password form.
- **Dev Mode:** Displays OTP in a yellow box for testing.

## SMTP Configuration (Optional)
To enable real email sending, configure these in `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@sevenxt.com
```
If not configured, OTPs are logged to the backend terminal.
