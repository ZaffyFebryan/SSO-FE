# API Documentation - Auth V2

Base URL: `http://127.0.0.1:8000/api/v2/auth`

## Authentication Endpoints

### 1. Login
**POST** `/api/v2/auth/login`

Login user dengan email dan password.

**Request Body:**
```json
{
  "email": "admin.kota@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "bearer_token_here",
    "user": {
      // user object
    }
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `403`: Email not verified

---

### 2. Register
**POST** `/api/v2/auth/register`

Registrasi user baru dan kirim OTP ke email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123",
  "password_confirmation": "Password123",
  "nip": "199001012020011001", // optional
  "phone": "081234567890" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification code.",
  "data": {
    // user data
  }
}
```

**Error Responses:**
- `422`: Validation error

---

### 3. Verify Email
**POST** `/api/v2/auth/verify`

Verifikasi email dengan OTP code.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    // user data
  }
}
```

**Error Responses:**
- `400`: Invalid or expired OTP
- `404`: User not found

---

### 4. Logout
**POST** `/api/v2/auth/logout`

Logout user dan revoke semua tokens.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**
- `401`: Unauthenticated

---

### 5. Reset Password
**POST** `/api/v2/auth/reset-password`

Request password reset - kirim OTP ke email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset code has been sent to your email"
}
```

**Error Responses:**
- `404`: User not found

---

### 6. Confirm Reset Password
**POST** `/api/v2/auth/confirm-reset-password`

Reset password menggunakan OTP dan password baru.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "otp": "123456",
  "password": "NewPassword123",
  "password_confirmation": "NewPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses:**
- `400`: Invalid or expired OTP
- `404`: User not found

---

## Protected Endpoints

### 7. Get Current User Profile
**GET** `/api/v2/auth/me`

Get authenticated user profile dengan menu.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      // user object
    },
    "menu": [
      // array of menu objects
    ]
  }
}
```

---

### 8. Get User by ID
**GET** `/api/v2/auth/user/{id}`

Get user data berdasarkan ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `id` (path): User ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    // user object
  }
}
```

**Error Responses:**
- `404`: User not found

---

## Implementation Notes

### Frontend Implementation

1. **Axios Configuration** (`src/utils/axios.js`)
   - Base URL: `http://127.0.0.1:8000/api`
   - Automatic token injection via interceptors
   - Automatic error handling
   - Auto-redirect on 401

2. **Auth Service** (`src/utils/api/authService.js`)
   - Semua endpoint Auth V2 sudah diimplementasikan
   - Automatic localStorage management untuk token dan user data
   - Helper methods: `isAuthenticated()`, `getToken()`, `getUser()`

3. **Auth Context** (`src/context/AuthContext.jsx`)
   - Global state management untuk authentication
   - Functions: `login`, `register`, `verifyEmail`, `logout`, `resetPassword`, `confirmResetPassword`, `refreshUser`
   - Automatic auth check on mount

4. **Protected Routes** (`src/components/ProtectedRoute.jsx`)
   - Component untuk protect routes yang memerlukan authentication
   - Auto-redirect ke login jika tidak authenticated

### Usage Example

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { login, user, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    const result = await login({ email: 'test@example.com', password: '123456' });
    if (result.success) {
      // Login berhasil
    }
  };
}
```

### API Coverage Checklist

✅ Login (`POST /api/v2/auth/login`)
✅ Register (`POST /api/v2/auth/register`)
✅ Verify Email (`POST /api/v2/auth/verify`)
✅ Logout (`POST /api/v2/auth/logout`)
✅ Reset Password (`POST /api/v2/auth/reset-password`)
✅ Confirm Reset Password (`POST /api/v2/auth/confirm-reset-password`)
✅ Get Current User (`GET /api/v2/auth/me`)
✅ Get User by ID (`GET /api/v2/auth/user/{id}`)

**Total: 8/8 endpoints implemented** ✅

---

## Security Notes

1. Token disimpan di localStorage (consider using httpOnly cookies untuk production)
2. Password minimal 8 karakter
3. OTP verification untuk email dan password reset
4. Bearer token authentication untuk protected endpoints
5. Automatic token cleanup on logout dan 401 errors
