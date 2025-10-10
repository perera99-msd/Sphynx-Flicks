// src/services/favoritesService.js
const API_BASE_URL = 'https://backend.msdperera99.workers.dev/api';

async function fetchFromAPI(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const FavoritesService = {
  async getFavorites() {
    try {
      return await fetchFromAPI('/favorites', {
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  async addFavorite(movie) {
    try {
      return await fetchFromAPI('/favorites', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          movie_id: movie.id,
          movie_data: movie
        })
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(movieId) {
    try {
      return await fetchFromAPI(`/favorites/${movieId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  async getWatchHistory() {
    try {
      return await fetchFromAPI('/watch-history', {
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error('Error fetching watch history:', error);
      return [];
    }
  },

  async recordWatch(movieId) {
    try {
      return await fetchFromAPI('/watch-history', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          movie_id: movieId
        })
      });
    } catch (error) {
      console.error('Error recording watch:', error);
      throw error;
    }
  },

  async getWatchlist() {
    try {
      return await fetchFromAPI('/watchlist', {
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
  },

  async addToWatchlist(movie) {
    try {
      return await fetchFromAPI('/watchlist', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          movie_id: movie.id,
          movie_data: movie
        })
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  async removeFromWatchlist(movieId) {
    try {
      return await fetchFromAPI(`/watchlist/${movieId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }
};