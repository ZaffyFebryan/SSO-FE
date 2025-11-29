import axiosInstance from '../axios';

/**
 * Auth Service - Semua endpoint API Auth V2
 * Base URL: http://127.0.0.1:8000/api/v2/auth
 */

const authService = {
  /**
   * Login user dengan email dan password
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Response dengan token dan user data
   */
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/v2/auth/login', credentials);
      
      // Simpan token dan user data ke localStorage
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register user baru
   * @param {Object} userData - { name, email, password, password_confirmation, nip?, phone? }
   * @returns {Promise} Response dengan pesan sukses
   */
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/v2/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verifikasi email dengan OTP
   * @param {Object} data - { email, otp }
   * @returns {Promise} Response dengan pesan sukses
   */
  verify: async (data) => {
    try {
      const response = await axiosInstance.post('/v2/auth/verify', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user - revoke semua token
   * @returns {Promise} Response dengan pesan sukses
   */
  logout: async () => {
    try {
      const response = await axiosInstance.post('/v2/auth/logout');
      
      // Hapus token dan user data dari localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error) {
      // Tetap hapus data lokal meskipun request gagal
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  /**
   * Request password reset - kirim OTP ke email
   * @param {Object} data - { email }
   * @returns {Promise} Response dengan pesan sukses
   */
  resetPassword: async (data) => {
    try {
      const response = await axiosInstance.post('/v2/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirm password reset dengan OTP dan password baru
   * @param {Object} data - { email, otp, password, password_confirmation }
   * @returns {Promise} Response dengan pesan sukses
   */
  confirmResetPassword: async (data) => {
    try {
      const response = await axiosInstance.post('/v2/auth/confirm-reset-password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get authenticated user profile dengan menu
   * @returns {Promise} Response dengan user data dan menu
   */
  getMe: async () => {
    try {
      const response = await axiosInstance.get('/v2/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all users
   * @returns {Promise} Response dengan list users
   */
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/v2/auth/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise} Response dengan user data
   */
  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/v2/auth/user/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user data
   * @param {number} id - User ID
   * @param {Object} userData - { name, email, phone, nip, jenis_kelamin, role_id, dinas_id, unit_kerja_id }
   * @returns {Promise} Response dengan pesan sukses
   */
  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/v2/auth/user/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise} Response dengan pesan sukses
   */
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/v2/auth/user/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check apakah user sudah login (ada token)
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get token dari localStorage
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Get user data dari localStorage
   * @returns {Object|null}
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
