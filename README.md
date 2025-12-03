# SSO Frontend

Single Sign-On (SSO) Frontend application built with React + Vite and integrated with Auth V2 API.

## Features

- ✅ User Authentication (Login/Register)
- ✅ Email Verification with OTP
- ✅ Password Reset with OTP
- ✅ Protected Routes
- ✅ Global Auth State Management
- ✅ Axios Integration with Interceptors
- ✅ Responsive UI with Tailwind CSS

## Tech Stack

- **React 19** - UI Framework
- **Vite** - Build Tool
- **React Router v7** - Routing
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling
- **React Icons** - Icons

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   └── ProtectedRoute.jsx
├── context/         # React Context
│   └── AuthContext.jsx
├── pages/          # Page components
│   ├── LoginPage.jsx
│   ├── ResetPassword.jsx
│   ├── VerifyCode.jsx
│   ├── SetNewPassword.jsx
│   └── ...
├── utils/          # Utilities & API
│   ├── axios.js    # Axios configuration
│   └── api/
│       ├── authService.js
│       └── index.js
├── config/         # App configuration
│   └── index.js
├── App.jsx
└── main.jsx
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd SSO-FE
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_BASE_URL=https://api.bispro.digitaltech.my.id/api
VITE_API_TIMEOUT=10000
```

4. Run development server
```bash
npm run dev
```

## API Integration

This project integrates with **Auth V2 API**. All API endpoints are documented in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Auth Endpoints Coverage

✅ **8/8 endpoints implemented:**

1. POST `/api/v2/auth/login` - Login
2. POST `/api/v2/auth/register` - Register
3. POST `/api/v2/auth/verify` - Verify Email
4. POST `/api/v2/auth/logout` - Logout
5. POST `/api/v2/auth/reset-password` - Reset Password
6. POST `/api/v2/auth/confirm-reset-password` - Confirm Reset
7. GET `/api/v2/auth/me` - Get Current User
8. GET `/api/v2/auth/user/{id}` - Get User by ID

### Using Auth in Components

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { login, user, isAuthenticated, logout } = useAuth();
  
  const handleLogin = async () => {
    const result = await login({ 
      email: 'user@example.com', 
      password: 'password' 
    });
    
    if (result.success) {
      console.log('Login successful!');
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

For detailed API documentation, see [src/utils/README.md](./src/utils/README.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Flow

### Login Flow
1. User enters email & password
2. Frontend calls `/api/v2/auth/login`
3. Backend returns token + user data
4. Token saved to localStorage
5. User redirected to dashboard

### Register Flow
1. User fills registration form
2. Frontend calls `/api/v2/auth/register`
3. Backend sends OTP to email
4. User enters OTP code
5. Frontend calls `/api/v2/auth/verify`
6. Email verified, user can login

### Password Reset Flow
1. User enters email
2. Frontend calls `/api/v2/auth/reset-password`
3. Backend sends OTP to email
4. User enters OTP + new password
5. Frontend calls `/api/v2/auth/confirm-reset-password`
6. Password updated, user can login

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
