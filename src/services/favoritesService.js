// src/services/favoritesService.js
import axios from 'axios';

// Replace with your actual worker URL after deployment
const API_BASE_URL = 'https://backend.msdperera99.workers.dev/api';

// For local testing during development
// const API_BASE_URL = 'http://localhost:8787/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const FavoritesService = {
  async getFavorites() {
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  async addFavorite(movie) {
    try {
      const response = await axios.post(`${API_BASE_URL}/favorites`, {
        movie_data: movie
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(movieId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/favorites/${movieId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  async getWatchHistory() {
    try {
      const response = await axios.get(`${API_BASE_URL}/watch-history`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching watch history:', error);
      return [];
    }
  },

  async recordWatch(movie) {
    try {
      const response = await axios.post(`${API_BASE_URL}/watch-history`, {
        movie_data: movie
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error recording watch:', error);
      throw error;
    }
  }
};