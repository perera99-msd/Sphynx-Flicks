// src/services/authService.js
import axios from 'axios';

// Replace with your actual worker URL after deployment
const API_BASE_URL = 'https://backend.msdperera99.workers.dev/api';

// For local testing during development
// const API_BASE_URL = 'http://localhost:8787/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const AuthService = {
  async login(credentials) {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('/login', credentials);
      console.log('Login successful');
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
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
      console.log('Registration successful');
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Registration failed. Please try again.';
      throw new Error(errorMessage);
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
      console.error('Token verification error:', error.response?.data || error.message);
      throw new Error('Token verification failed');
    }
  }
};