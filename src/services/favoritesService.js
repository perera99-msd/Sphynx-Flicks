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
      // Ensure movie has all required fields
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview
      };

      const response = await axios.post(`${API_BASE_URL}/favorites`, {
        movie_id: movie.id,
        movie_data: movieData
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

  async toggleFavorite(movie) {
    try {
      const favorites = await this.getFavorites();
      const isFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (isFavorite) {
        await this.removeFavorite(movie.id);
        return false;
      } else {
        await this.addFavorite(movie);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
};