// src/services/authService.js
import axios from 'axios';

// For local development - use your worker URL
const API_BASE_URL = 'https://backend.msdperera99.workers.dev/api';

// For production - use your deployed worker URL
// const API_BASE_URL = 'https://your-worker.workers.dev/api';

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const AuthService = {
  async login(credentials) {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('/login', credentials);
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Login failed. Please check your connection.';
      throw new Error(errorMessage);
    }
  },

  async register(credentials) {
    try {
      console.log('Attempting registration with:', credentials.email);
      const response = await api.post('/register', credentials);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  },

  async verifyToken(token) {
    try {
      console.log('Verifying token...');
      const response = await api.get('/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Token verification successful');
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Token verification failed');
    }
  }
};