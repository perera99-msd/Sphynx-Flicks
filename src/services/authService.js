// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const AuthService = {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      
      // Store token and user data in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('favorites', JSON.stringify(response.data.favorites || []));
        localStorage.setItem('watchlist', JSON.stringify(response.data.watchlist || []));
        localStorage.setItem('watchHistory', JSON.stringify(response.data.watchHistory || []));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  async register(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, credentials);
      
      // Store token and user data in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('favorites', JSON.stringify(response.data.favorites || []));
        localStorage.setItem('watchlist', JSON.stringify(response.data.watchlist || []));
        localStorage.setItem('watchHistory', JSON.stringify(response.data.watchHistory || []));
      }
      
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
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('favorites');
    localStorage.removeItem('watchlist');
    localStorage.removeItem('watchHistory');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  },

  updateFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
};