import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../utils/api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status saat component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        const userData = authService.getUser();

        if (token && userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
      return { success: false, message: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, message: response.message, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      const errors = error.response?.data?.errors || {};
      return { success: false, message: errorMessage, errors };
    }
  };

  // Verify email function
  const verifyEmail = async (verifyData) => {
    try {
      const response = await authService.verify(verifyData);
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verifikasi gagal. Silakan coba lagi.';
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      const response = await authService.resetPassword({ email });
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Reset password gagal. Silakan coba lagi.';
      return { success: false, message: errorMessage };
    }
  };

  // Confirm reset password function
  const confirmResetPassword = async (resetData) => {
    try {
      const response = await authService.confirmResetPassword(resetData);
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Reset password gagal. Silakan coba lagi.';
      const errors = error.response?.data?.errors || {};
      return { success: false, message: errorMessage, errors };
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authService.getMe();
      if (response.success) {
        // Response dari /me: { success: true, data: { user: {...}, menu: [...] } }
        const userData = response.data.user || response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        // Simpan menu jika ada
        if (response.data.menu) {
          localStorage.setItem('menu', JSON.stringify(response.data.menu));
        }
        return response.data;
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    logout,
    resetPassword,
    confirmResetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk menggunakan auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
