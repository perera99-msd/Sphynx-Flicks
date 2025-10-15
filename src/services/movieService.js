// src/services/movieService.js
import axios from 'axios';

// ✅ Use your actual backend URL with /api prefix
const API_BASE_URL = 'https://movie-app-backend.msdperera99.workers.dev/api';

// For local development, you can uncomment this:
// const API_BASE_URL = 'http://localhost:8787/api';

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
      const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  async getMovieTrailer(movieId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
      const movieData = response.data;
      return movieData.trailer || null;
    } catch (error) {
      console.error('Error fetching movie trailer:', error);
      return null;
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
