# Quick Reference Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## 📋 Common Tasks

### Using Authentication

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { 
    user,              // Current user object
    isAuthenticated,   // Boolean: logged in or not
    loading,           // Boolean: checking auth status
    login,             // Function to login
    logout,            // Function to logout
    register,          // Function to register
    verifyEmail,       // Function to verify email
    resetPassword,     // Function to reset password
    confirmResetPassword, // Function to confirm password reset
    refreshUser        // Function to refresh user data
  } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### Making API Calls

```javascript
import { authService } from './utils/api';

// Get current user profile
const profile = await authService.getMe();

// Get user by ID
const user = await authService.getUserById(1);

// Check if authenticated
if (authService.isAuthenticated()) {
  console.log('User is logged in');
}

// Get token
const token = authService.getToken();

// Get user from localStorage
const user = authService.getUser();
```

### Protected Routes

```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Routes>
  <Route path="/" element={<LoginPage />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### Direct Axios Calls (Advanced)

```javascript
import axiosInstance from './utils/axios';

// GET request
const response = await axiosInstance.get('/endpoint');

// POST request
const response = await axiosInstance.post('/endpoint', {
  data: 'value'
});

// PUT request
const response = await axiosInstance.put('/endpoint/1', {
  data: 'updated value'
});

// DELETE request
const response = await axiosInstance.delete('/endpoint/1');
```

## 🔑 API Endpoints Quick Reference

| Method | Endpoint | Function | Auth Required |
|--------|----------|----------|---------------|
| POST | `/api/v2/auth/login` | `authService.login()` | ❌ |
| POST | `/api/v2/auth/register` | `authService.register()` | ❌ |
| POST | `/api/v2/auth/verify` | `authService.verify()` | ❌ |
| POST | `/api/v2/auth/logout` | `authService.logout()` | ✅ |
| POST | `/api/v2/auth/reset-password` | `authService.resetPassword()` | ❌ |
| POST | `/api/v2/auth/confirm-reset-password` | `authService.confirmResetPassword()` | ❌ |
| GET | `/api/v2/auth/me` | `authService.getMe()` | ✅ |
| GET | `/api/v2/auth/user/{id}` | `authService.getUserById()` | ✅ |

## 🎨 Common UI Patterns

### Loading State
```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await someApiCall();
  } finally {
    setLoading(false);
  }
};

return (
  <button disabled={loading}>
    {loading ? 'Loading...' : 'Submit'}
  </button>
);
```

### Error Handling
```javascript
const [error, setError] = useState('');

try {
  const result = await authService.login(credentials);
  if (result.success) {
    // Handle success
  } else {
    setError(result.message);
  }
} catch (err) {
  setError('An error occurred');
}

// Display error
{error && (
  <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded">
    {error}
  </div>
)}
```

### Success Messages
```javascript
const [success, setSuccess] = useState('');

setSuccess('Operation completed successfully!');

{success && (
  <div className="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded">
    {success}
  </div>
)}
```

## 🛠️ Debugging Tips

### Check if user is authenticated
```javascript
console.log('Authenticated:', authService.isAuthenticated());
console.log('Token:', authService.getToken());
console.log('User:', authService.getUser());
```

### Inspect API requests in browser
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Check request/response headers and body

### Common Issues

**Issue: "401 Unauthorized"**
- Solution: Check if token is valid, try logging in again

**Issue: "Network Error"**
- Solution: Ensure backend API is running at correct URL

**Issue: "CORS Error"**
- Solution: Backend must allow CORS from frontend origin

**Issue: Component not updating after login**
- Solution: Make sure component is using `useAuth()` hook

## 📝 Code Snippets

### Login Form
```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login({ email, password });
  if (result.success) {
    navigate('/dashboard');
  }
};
```

### Register Form
```javascript
const { register } = useAuth();

const handleRegister = async (formData) => {
  const result = await register({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    password_confirmation: formData.confirmPassword,
    nip: formData.nip,      // optional
    phone: formData.phone   // optional
  });
  
  if (result.success) {
    navigate('/verify-code', { state: { email: formData.email, type: 'verify' } });
  }
};
```

### Logout Button
```javascript
const { logout } = useAuth();
const navigate = useNavigate();

const handleLogout = async () => {
  await logout();
  navigate('/');
};

return <button onClick={handleLogout}>Logout</button>;
```

### Check Auth on Page Load
```javascript
useEffect(() => {
  const checkAuth = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    // Fetch user data if needed
    try {
      const profile = await authService.getMe();
      console.log('User profile:', profile);
    } catch (error) {
      console.error('Failed to fetch profile');
    }
  };
  
  checkAuth();
}, []);
```

## 🔧 Configuration

### Change API Base URL
```bash
# .env file
VITE_API_BASE_URL=https://your-api-url.com/api
```

### Change API Timeout
```bash
# .env file
VITE_API_TIMEOUT=15000  # 15 seconds
```

## 📚 File Locations

| What | Where |
|------|-------|
| Axios config | `src/utils/axios.js` |
| Auth service | `src/utils/api/authService.js` |
| Auth context | `src/context/AuthContext.jsx` |
| Protected route | `src/components/ProtectedRoute.jsx` |
| Environment config | `src/config/index.js` |
| Environment vars | `.env` |

## 🎯 Best Practices

1. ✅ Always use `useAuth()` instead of direct service calls
2. ✅ Handle loading states in forms
3. ✅ Display user-friendly error messages
4. ✅ Use try-catch for async operations
5. ✅ Clear sensitive data from memory after use
6. ✅ Use ProtectedRoute for authenticated pages
7. ✅ Check authentication status before API calls
8. ✅ Log errors for debugging but don't expose sensitive info to users

## 🚨 Security Reminders

- ⚠️ Never commit `.env` file
- ⚠️ Never log tokens or passwords
- ⚠️ Always validate user input
- ⚠️ Use HTTPS in production
- ⚠️ Consider using httpOnly cookies instead of localStorage for tokens

## 📞 Getting Help

1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for flow diagrams
3. Check [src/utils/README.md](./src/utils/README.md) for utils documentation
4. Review [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for overview

---

**Quick Tip:** Keep this file open while developing for fast reference! 🚀
