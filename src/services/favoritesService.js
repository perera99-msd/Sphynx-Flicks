// src/services/favoritesService.js
import axios from 'axios';
import { AuthService } from './authService';

// Use HTTPS URL for your Cloudflare Worker backend
const API_BASE_URL = 'https://backend.msdperera99.workers.dev/api';

const getAuthHeader = () => {
  const token = AuthService.getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const FavoritesService = {
  async getFavorites() {
    try {
      const token = AuthService.getToken();
      if (!token) {
        return AuthService.getFavorites();
      }

      const response = await axios.get(`${API_BASE_URL}/favorites`, {
        headers: getAuthHeader()
      });
      
      // Update localStorage
      AuthService.updateFavorites(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return AuthService.getFavorites();
    }
  },

  async addFavorite(movie) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Please log in to add favorites');
      }

      // Ensure movie has all required fields
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview,
        genre_ids: movie.genre_ids || []
      };

      const response = await axios.post(`${API_BASE_URL}/favorites`, {
        movie_id: movie.id.toString(),
        movie_data: movieData
      }, {
        headers: getAuthHeader()
      });

      // Update local favorites
      const currentFavorites = AuthService.getFavorites();
      const newFavorites = [...currentFavorites, movieData];
      AuthService.updateFavorites(newFavorites);

      return response.data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(movieId) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Please log in to remove favorites');
      }

      const response = await axios.delete(`${API_BASE_URL}/favorites/${movieId}`, {
        headers: getAuthHeader()
      });

      // Update local favorites
      const currentFavorites = AuthService.getFavorites();
      const newFavorites = currentFavorites.filter(fav => fav.id !== movieId);
      AuthService.updateFavorites(newFavorites);

      return response.data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  async toggleFavorite(movie) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Please log in to manage favorites');
      }

      const currentFavorites = await this.getFavorites();
      const isFavorite = currentFavorites.some(fav => fav.id === movie.id);
      
      if (isFavorite) {
        await this.removeFavorite(movie.id);
        return { added: false, favorites: currentFavorites.filter(fav => fav.id !== movie.id) };
      } else {
        await this.addFavorite(movie);
        return { added: true, favorites: [...currentFavorites, movie] };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview
      };

      const response = await axios.post(`${API_BASE_URL}/watch-history`, {
        movie_id: movie.id.toString(),
        movie_data: movieData
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error recording watch:', error);
      throw error;
    }
  },

  // Watchlist functionality (simplified for worker)
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
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview
      };

      const response = await axios.post(`${API_BASE_URL}/watchlist`, {
        movie_id: movie.id.toString(),
        movie_data: movieData
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