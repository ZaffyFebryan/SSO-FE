# Architecture & Flow Diagrams

## Project Structure

```
SSO-FE/
│
├── public/                  # Static assets
│
├── src/
│   ├── assets/             # Images, fonts, etc.
│   │
│   ├── components/         # Reusable components
│   │   └── ProtectedRoute.jsx
│   │
│   ├── config/             # App configuration
│   │   └── index.js       # Environment config
│   │
│   ├── context/            # React Context
│   │   └── AuthContext.jsx # Global auth state
│   │
│   ├── pages/              # Page components
│   │   ├── LoginPage.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── VerifyCode.jsx
│   │   ├── SetNewPassword.jsx
│   │   ├── DashboardPage.jsx
│   │   └── ...
│   │
│   ├── utils/              # Utilities & API
│   │   ├── axios.js       # Axios instance
│   │   ├── README.md
│   │   └── api/
│   │       ├── index.js
│   │       └── authService.js
│   │
│   ├── App.jsx             # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── .env                    # Environment variables (git ignored)
├── .env.example           # Environment template
├── API_DOCUMENTATION.md   # API docs
├── IMPLEMENTATION_SUMMARY.md
└── README.md
```

## Authentication Flow

### 1. Login Flow
```
User (Browser)          Frontend              Backend API
     |                     |                      |
     |--[1] Enter Email--->|                      |
     |   & Password        |                      |
     |                     |                      |
     |<---[2] Show Loading-|                      |
     |                     |                      |
     |                     |--[3] POST /login---->|
     |                     |    {email, password} |
     |                     |                      |
     |                     |<--[4] 200 OK---------|
     |                     |    {token, user}     |
     |                     |                      |
     |                     |--[5] Save to-------->|
     |                     |    localStorage      |
     |                     |                      |
     |<---[6] Redirect-----|                      |
     |   to Dashboard      |                      |
     |                     |                      |
```

### 2. Register + Verify Flow
```
User                Frontend                   Backend
 |                     |                          |
 |--[1] Fill Form----->|                          |
 |                     |                          |
 |                     |--[2] POST /register----->|
 |                     |                          |
 |                     |<--[3] 201 Created--------|
 |                     |   "OTP sent to email"    |
 |                     |                          |
 |<--[4] Navigate------|                          |
 |   to VerifyCode     |                          |
 |                     |                          |
 |--[5] Enter OTP----->|                          |
 |                     |                          |
 |                     |--[6] POST /verify------->|
 |                     |    {email, otp}          |
 |                     |                          |
 |                     |<--[7] 200 OK-------------|
 |                     |   "Email verified"       |
 |                     |                          |
 |<--[8] Redirect------|                          |
 |   to Login          |                          |
```

### 3. Password Reset Flow
```
User               Frontend                Backend
 |                    |                       |
 |--[1] Enter Email-->|                       |
 |                    |                       |
 |                    |--[2] POST------------>|
 |                    |  /reset-password      |
 |                    |                       |
 |                    |<--[3] 200 OK----------|
 |                    |   "OTP sent"          |
 |                    |                       |
 |<--[4] Navigate-----|                       |
 |   to VerifyCode    |                       |
 |                    |                       |
 |--[5] Enter OTP---->|                       |
 |                    |                       |
 |<--[6] Navigate-----|                       |
 |   to SetNewPassword|                       |
 |                    |                       |
 |--[7] Enter Pass--->|                       |
 |                    |                       |
 |                    |--[8] POST------------>|
 |                    | /confirm-reset-password
 |                    | {email,otp,password}  |
 |                    |                       |
 |                    |<--[9] 200 OK----------|
 |                    |   "Password reset"    |
 |                    |                       |
 |<--[10] Redirect----|                       |
 |    to Login        |                       |
```

## Component Architecture

```
┌─────────────────────────────────────────────────┐
│                   App.jsx                       │
│  ┌───────────────────────────────────────────┐ │
│  │          AuthProvider                     │ │
│  │  (Global Auth State)                      │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │         Router                      │ │ │
│  │  │  ┌───────────────────────────────┐ │ │ │
│  │  │  │        Routes                 │ │ │ │
│  │  │  │                               │ │ │ │
│  │  │  │  /              -> Login      │ │ │ │
│  │  │  │  /dashboard     -> Protected  │ │ │ │
│  │  │  │  /reset-pass    -> Reset      │ │ │ │
│  │  │  │  /verify-code   -> Verify     │ │ │ │
│  │  │  │  /set-password  -> SetPass    │ │ │ │
│  │  │  └───────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────┐
│   Page      │ (e.g., LoginPage.jsx)
│  Component  │
└──────┬──────┘
       │
       │ useAuth()
       ▼
┌─────────────┐
│   Auth      │ (AuthContext.jsx)
│   Context   │
└──────┬──────┘
       │
       │ authService.login()
       ▼
┌─────────────┐
│   Auth      │ (authService.js)
│   Service   │
└──────┬──────┘
       │
       │ axiosInstance.post()
       ▼
┌─────────────┐
│   Axios     │ (axios.js)
│  Instance   │ + Interceptors
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────┐
│   Backend   │
│   API       │ (http://127.0.0.1:8000/api)
└─────────────┘
```

## Axios Interceptor Flow

### Request Interceptor
```
Request
   │
   ▼
┌──────────────────┐
│  Get token from  │
│  localStorage    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Add Bearer      │
│  token to header │
└────────┬─────────┘
         │
         ▼
    Continue Request
    to Backend
```

### Response Interceptor
```
Response
   │
   ▼
┌──────────────────┐
│  Check Status    │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
  2xx        Error
    │         │
    ▼         ▼
 Return   ┌──────────────┐
  Data    │ Check Status │
          └──────┬───────┘
                 │
        ┌────────┼────────┬─────────┐
        │        │        │         │
       401      403      404       422
        │        │        │         │
        ▼        ▼        ▼         ▼
    Clear    Log     Log      Log
   Storage  Error   Error   Validation
      +                      Errors
   Redirect
   to Login
```

## State Management

```
┌─────────────────────────────────────────┐
│         AuthContext State               │
├─────────────────────────────────────────┤
│                                         │
│  - user: Object | null                  │
│  - loading: boolean                     │
│  - isAuthenticated: boolean             │
│                                         │
├─────────────────────────────────────────┤
│             Methods                     │
├─────────────────────────────────────────┤
│                                         │
│  - login(credentials)                   │
│  - register(userData)                   │
│  - verifyEmail(data)                    │
│  - logout()                             │
│  - resetPassword(email)                 │
│  - confirmResetPassword(data)           │
│  - refreshUser()                        │
│                                         │
└─────────────────────────────────────────┘
```

## LocalStorage Structure

```javascript
// After successful login:
localStorage = {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  
  // Temporary data (cleared after use)
  "resetEmail": "john@example.com",  // During password reset
  "resetOTP": "123456"               // During password reset
}
```

## Error Handling Strategy

```
┌────────────────────────────────────────┐
│         Error Occurs                   │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│   Axios Response Interceptor           │
│   (Global Error Handler)               │
└───────────────┬────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
   Auto Handle      Pass to
   (401, 500)       Component
        │                │
        ▼                ▼
   ┌─────────┐    ┌──────────┐
   │ Redirect│    │  Show    │
   │   or    │    │  User    │
   │  Log    │    │ Message  │
   └─────────┘    └──────────┘
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. HTTPS (Production)                  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  2. Bearer Token Authentication         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  3. OTP Verification                    │
│     - Email verification                │
│     - Password reset                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  4. Protected Routes                    │
│     - Check authentication before       │
│       allowing access                   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  5. Auto Token Expiry Handling          │
│     - 401 -> Clear storage & redirect   │
└─────────────────────────────────────────┘
```

## API Service Pattern

```javascript
// Pattern used in authService.js

const serviceMethod = async (params) => {
  try {
    // 1. Make API call
    const response = await axiosInstance.method(endpoint, data);
    
    // 2. Handle success (optional)
    // e.g., save to localStorage
    
    // 3. Return data
    return response.data;
    
  } catch (error) {
    // 4. Error is already handled by interceptor
    // Just throw to let caller handle it
    throw error;
  }
};
```

## Environment Configuration Flow

```
.env file
   │
   │ VITE_API_BASE_URL=...
   │ VITE_API_TIMEOUT=...
   │
   ▼
┌────────────────┐
│  config/       │
│  index.js      │  → Reads import.meta.env
└───────┬────────┘
        │
        │ export config
        ▼
┌────────────────┐
│  utils/        │
│  axios.js      │  → Uses config.API_BASE_URL
└───────┬────────┘
        │
        ▼
    API Calls
```

---

**Note:** All diagrams show the complete flow of authentication and API integration in the SSO Frontend application.
