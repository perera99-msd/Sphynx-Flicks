// src/services/movieService.js - UPDATED WITH STREAMING
import axios from 'axios';

const API_BASE_URL = 'https://movie-app-backend.msdperera99.workers.dev/api';

const convertGenreIdsToNames = (movies, genres) => {
  return movies.map(movie => ({
    ...movie,
    genre_names: movie.genre_ids?.map(genreId => {
      const genre = genres.find(g => g.id === genreId);
      return genre ? genre.name : 'Unknown';
    }).filter(name => name !== 'Unknown') || []
  }));
};

export const MovieService = {
  genres: [],

  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/popular?page=${page}`);
      const movies = response.data;
      
      if (this.genres && this.genres.length > 0) {
        return convertGenreIdsToNames(movies, this.genres);
      }
      
      return movies;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },
  
  async searchMovies(query, page = 1) {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
      const movies = response.data;
      
      if (this.genres && this.genres.length > 0) {
        return convertGenreIdsToNames(movies, this.genres);
      }
      
      return movies;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  async getMovieDetails(movieId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${movieId}/details`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  async getMovieTrailer(movieId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${movieId}/details`);
      const movieData = response.data;
      
      // Extract trailer from videos
      if (movieData.videos && movieData.videos.results) {
        const trailer = movieData.videos.results.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        );
        return trailer || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching movie trailer:', error);
      return null;
    }
  },

  // NEW: Get streaming providers
  async getStreamingProviders(movieId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${movieId}/streaming`);
      const data = response.data;
      
      // Format the data for easier use
      return this.formatStreamingData(data);
    } catch (error) {
      console.error('Error fetching streaming providers:', error);
      return null;
    }
  },

  formatStreamingData(streamingData) {
    if (!streamingData) return null;

    return {
      flatrate: streamingData.flatrate || [], // Subscription services (Netflix, Prime)
      free: streamingData.free || [],         // Free with ads (Tubi, Pluto TV)
      rent: streamingData.rent || [],         // Rent (Amazon, Apple TV)
      buy: streamingData.buy || []            // Purchase
    };
  },

  async getTrendingMovies() {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/trending`);
      const movies = response.data;
      
      if (this.genres && this.genres.length > 0) {
        return convertGenreIdsToNames(movies, this.genres);
      }
      
      return movies;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  async getGenres() {
    try {
      const response = await axios.get(`${API_BASE_URL}/genres`);
      const genresData = response.data;
      this.genres = genresData;
      return genresData;
    } catch (error) {
      console.error('Error fetching genres:', error);
      this.genres = FALLBACK_GENRES;
      return FALLBACK_GENRES;
    }
  }
};

const FALLBACK_GENRES = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' }, { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' }, { id: 53, name: 'Thriller' }
];