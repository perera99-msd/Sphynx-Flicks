// src/services/movieService.js
import axios from 'axios';

// Change this to your local backend
const API_BASE_URL = 'http://backend.msdperera99.workers.dev/api';

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
      console.log('Fetching popular movies from:', `${API_BASE_URL}/movies/popular?page=${page}`);
      const response = await axios.get(`${API_BASE_URL}/movies/popular?page=${page}`);
      const movies = response.data;
      console.log('Popular movies response:', movies);
      
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

  async getMovieDetails(movieId, source = 'TMDB') {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${movieId}?source=${source}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
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

  async getMoviesByGenre(genreId, page = 1) {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/genre/${genreId}?page=${page}`);
      const movies = response.data;
      
      if (this.genres && this.genres.length > 0) {
        return convertGenreIdsToNames(movies, this.genres);
      }
      
      return movies;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
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

// Fallback genres
const FALLBACK_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];