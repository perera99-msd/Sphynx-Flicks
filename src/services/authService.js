// src/services/authService.js
import axios from 'axios';

// Update the API_BASE_URL to your Cloudflare Worker URL
const API_BASE_URL = 'https://backend.medperera99.workers.dev/api';
// or if you're using the other domain:
// const API_BASE_URL = 'https://backend.msdperera99.workers.dev/api';


export const AuthService = {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  async register(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  async verifyToken(token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }
};