// src/services/favoritesService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const FavoritesService = {
  // --- FAVORITES ---
  async getFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return Promise.resolve(favorites);
  },

  async addFavorite(movie) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.some(fav => fav.id === movie.id)) {
      const updatedFavorites = [...favorites, movie];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
    return Promise.resolve({ message: 'Favorite added successfully' });
  },

  async removeFavorite(movieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    return Promise.resolve({ message: 'Favorite removed successfully' });
  },

  // --- WATCH HISTORY ---
  async getWatchHistory() {
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    return Promise.resolve(history);
  },

  async recordWatch(movieId) {
    try {
      const movie = await this.getMovieDetails(movieId);
      let history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      
      // Remove existing entry for this movie to move it to the top
      history = history.filter(item => item.movie_id !== movieId);

      const newHistoryItem = { 
        movie_id: movieId, 
        movie_data: movie, 
        watched_at: new Date().toISOString() 
      };
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 50); // Keep max 50 items
      localStorage.setItem('watchHistory', JSON.stringify(updatedHistory));
      
      return Promise.resolve(newHistoryItem);
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

  // --- WATCHLIST (Unchanged, but would need similar logic if used) ---
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