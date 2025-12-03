# Utils Directory

Directory ini berisi konfigurasi dan service untuk API calls menggunakan Axios.

## Struktur

```
utils/
├── axios.js           # Konfigurasi Axios instance
└── api/
    ├── index.js       # Central export untuk semua services
    └── authService.js # Auth V2 API endpoints
```

## Axios Configuration (`axios.js`)

File ini berisi konfigurasi dasar untuk Axios instance yang digunakan di seluruh aplikasi.

### Features:
- **Base URL**: `https://api.bispro.digitaltech.my.id/api`
- **Timeout**: 10 detik
- **Auto Token Injection**: Token otomatis ditambahkan ke setiap request dari localStorage
- **Error Handling**: Global error handling untuk semua response
- **Auto Redirect**: Redirect ke login pada 401 (Unauthorized)

### Usage:
```javascript
import axiosInstance from '../utils/axios';

// GET request
const response = await axiosInstance.get('/endpoint');

// POST request
const response = await axiosInstance.post('/endpoint', data);
```

## API Services (`api/`)

### Auth Service (`api/authService.js`)

Service untuk semua endpoint Auth V2.

#### Available Methods:

**Authentication:**
- `login(credentials)` - Login user
- `register(userData)` - Register user baru
- `verify(data)` - Verify email dengan OTP
- `logout()` - Logout user

**Password Management:**
- `resetPassword(data)` - Request password reset
- `confirmResetPassword(data)` - Konfirmasi reset password dengan OTP

**User Data:**
- `getMe()` - Get current user profile + menu
- `getUserById(id)` - Get user by ID

**Helper Methods:**
- `isAuthenticated()` - Check apakah user sudah login
- `getToken()` - Get token dari localStorage
- `getUser()` - Get user data dari localStorage

### Usage Example:

```javascript
import authService from '../utils/api/authService';

// Login
try {
  const response = await authService.login({ 
    email: 'user@example.com', 
    password: 'password123' 
  });
  console.log(response.data);
} catch (error) {
  console.error('Login failed:', error);
}

// Check if authenticated
if (authService.isAuthenticated()) {
  const user = authService.getUser();
  console.log('Current user:', user);
}
```

### Better Way: Using Auth Context

Lebih baik menggunakan Auth Context daripada memanggil service langsung:

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { login, user, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    const result = await login({ 
      email: 'user@example.com', 
      password: 'password123' 
    });
    
    if (result.success) {
      console.log('Login successful!');
    } else {
      console.error('Login failed:', result.message);
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Adding New Services

Untuk menambahkan service baru (misal: userService, adminService):

1. Buat file baru di `api/` folder (contoh: `userService.js`)
2. Import `axiosInstance` dari `../axios`
3. Export service object dengan methods
4. Tambahkan export di `api/index.js`

Example:

```javascript
// api/userService.js
import axiosInstance from '../axios';

const userService = {
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },
  
  updateUser: async (id, data) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },
};

export default userService;
```

```javascript
// api/index.js
export { default as authService } from './authService';
export { default as userService } from './userService'; // tambahkan ini
```

## Best Practices

1. **Selalu gunakan try-catch** saat memanggil API
2. **Gunakan Auth Context** untuk authentication operations
3. **Jangan hardcode URLs** - gunakan axiosInstance
4. **Handle errors gracefully** - tampilkan pesan yang user-friendly
5. **Check authentication** sebelum mengakses protected routes
6. **Gunakan TypeScript** untuk type safety (future improvement)

## Error Handling

Axios interceptor sudah handle error secara global:

- **401**: Auto redirect ke login + clear localStorage
- **403**: Log error (access forbidden)
- **404**: Log error (not found)
- **422**: Log validation errors
- **500**: Log server error

Anda tetap bisa handle error secara spesifik di component:

```javascript
try {
  const response = await authService.login(credentials);
} catch (error) {
  if (error.response?.status === 422) {
    // Handle validation errors
    console.log(error.response.data.errors);
  }
}
```
