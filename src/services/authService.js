// src/services/authService.js - UPDATED
import axios from 'axios';

const API_BASE_URL = 'https://movie-app-backend.msdperera99.workers.dev/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your connection.';
    } else if (error.response) {
      // Server responded with error status
      const serverError = error.response.data?.error || 'Server error occurred';
      error.message = serverError;
    } else if (error.request) {
      // Request made but no response received
      error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

export const AuthService = {
  async login(credentials) {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('/login', credentials);
      console.log('Login successful');
      return response.data;
    } catch (error) {
      console.error('Login error:', error.message);
      throw new Error(error.message);
    }
  },

  async register(credentials) {
    try {
      console.log('Attempting registration with:', credentials.email);
      const response = await api.post('/register', credentials);
      console.log('Registration successful');
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.message);
      throw new Error(error.message);
    }
  },

  async verifyToken(token) {
    try {
      const response = await api.get('/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error.message);
      throw new Error('Token verification failed');
    }
  }
};