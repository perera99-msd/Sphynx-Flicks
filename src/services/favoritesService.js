// src/services/favoritesService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

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
        movie_id: movie.id,
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

  async recordWatch(movieId) {
    try {
      // First get movie details to store in history
      const movie = await this.getMovieDetails(movieId);
      const response = await axios.post(`${API_BASE_URL}/watch-history`, {
        movie_id: movieId,
        movie_data: movie
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error recording watch:', error);
      throw error;
    }
  },

  async getMovieDetails(movieId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details for history:', error);
      return { id: movieId, title: 'Unknown Movie' };
    }
  },

  // Watchlist functionality
  async getWatchlist() {
    try {
      const response = await axios.get(`${API_BASE_URL}/watchlist`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
  },

  async addToWatchlist(movie) {
    try {
      const response = await axios.post(`${API_BASE_URL}/watchlist`, {
        movie_id: movie.id,
        movie_data: movie
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  async removeFromWatchlist(movieId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/watchlist/${movieId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }
};