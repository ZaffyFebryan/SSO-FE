/**
 * Environment Configuration
 * Centralized configuration untuk environment variables
 */

const config = {
  // API Base URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.bispro.digitaltech.my.id/api',
  
  // API Timeout (in milliseconds)
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 10000,
  
  // Environment
  ENV: import.meta.env.MODE || 'development',
  
  // App Info
  APP_NAME: 'SSO Frontend',
  APP_VERSION: '1.0.0',
};

export default config;
