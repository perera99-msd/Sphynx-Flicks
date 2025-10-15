// src/App.jsx - FINAL & COMPLETE
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import MovieGrid from './components/MovieGrid/MovieGrid';
import MovieModal from './components/MovieModal/MovieModal';
import FilterSection from './components/FilterSection/FilterSection';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import AuthModal from './components/AuthModal/AuthModal';
import UserProfile from './components/UserProfile/UserProfile';
import { MovieService } from './services/movieService';
import { AuthService } from './services/authService';
import { FavoritesService } from './services/favoritesService';
import './App.css';

const HERO_MOVIES_COUNT = 5;
const MOVIES_PER_PAGE = 20;

// Custom hook to debounce search input for performance
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

function App() {
  const [movies, setMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [favorites, setFavorites] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [activeView, setActiveView] = useState('discover');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const getGenreNames = useCallback((movie) => {
    if (movie.genre_names && movie.genre_names.length > 0) {
      return movie.genre_names;
    }
    if (movie.genres && movie.genres.length > 0) {
      return movie.genres.map(g => g.name || g);
    }
    if (movie.genre_ids && movie.genre_ids.length > 0 && genres.length > 0) {
      return movie.genre_ids.map(genreId => {
        const genre = genres.find(g => g.id === genreId);
        return genre ? genre.name : null;
      }).filter(Boolean);
    }
    return [];
  }, [genres]);

  const loadMovies = useCallback(async (page = 1, append = false) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    const isSearchingOrFiltering = debouncedSearchQuery || filters.genre || filters.year || filters.rating;

    try {
      // Assumes MovieService.getMovies can handle these parameters
      const moviesData = await MovieService.getMovies({
        query: debouncedSearchQuery,
        filters,
        page
      });

      if (append) {
        setMovies(prev => {
          const existingIds = new Set(prev.map(movie => movie.id));
          const newMovies = moviesData.filter(movie => !existingIds.has(movie.id));
          return [...prev, ...newMovies];
        });
      } else {
        setMovies(moviesData);
        if (page === 1 && !isSearchingOrFiltering && moviesData.length > 0) {
          setHeroMovies(moviesData.slice(0, HERO_MOVIES_COUNT));
        }
      }
      
      setHasMoreMovies(moviesData.length === MOVIES_PER_PAGE);
      setCurrentPage(page);

    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchQuery, filters]);

  // Effect for initial application setup
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        const genresData = await MovieService.getGenres();
        setGenres(genresData);
        
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await AuthService.verifyToken(token);
          setUser(userData.user);
          setFavorites(await FavoritesService.getFavorites());
          setWatchHistory(await FavoritesService.getWatchHistory());
        }
      } catch (error) {
        console.error('Token verification/initialization failed:', error);
        if(localStorage.getItem('token')) handleLogout(); // Logout if token is invalid
        setError('Failed to load essential data.');
      } finally {
        setLoading(false);
      }
    };
    initializeApp();
  }, []);

  // Effect to fetch movies whenever search, filters, or active view changes
  useEffect(() => {
    if (activeView === 'discover') {
       loadMovies(1, false);
    }
  }, [debouncedSearchQuery, filters, activeView, loadMovies]);

  const loadMoreMovies = () => {
    if (!loadingMore && hasMoreMovies) {
      loadMovies(currentPage + 1, true);
    }
  };

  const moviesToDisplay = useMemo(() => {
    if (activeView === 'favorites') return favorites;
    // Assuming watchHistory contains full movie objects or can be mapped to them
    if (activeView === 'profile') return watchHistory.map(item => item.movie).filter(Boolean);
    return movies;
  }, [movies, favorites, watchHistory, activeView]);

  const handleMovieClick = useCallback(async (movie) => {
    try {
      const detailedMovie = await MovieService.getMovieDetails(movie.id);
      setSelectedMovie(detailedMovie);
    } catch (error) {
      console.error(`Error fetching movie details for ${movie.id}:`, error);
      setSelectedMovie(movie); // Fallback to basic movie info
    }
  }, []);

  const handleCloseModal = useCallback(() => setSelectedMovie(null), []);
  
  const handleFilterChange = useCallback((newFilters) => {
    setCurrentPage(1); // Reset page on new filter
    setFilters(newFilters);
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters({ genre: '', year: '', rating: '' });
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const handleAuth = async (credentials, mode) => {
    try {
      const result = mode === 'login' 
        ? await AuthService.login(credentials)
        : await AuthService.register(credentials);
      
      localStorage.setItem('token', result.token);
      setUser(result.user);
      setFavorites([]); // Clear local state, will be fetched if needed
      setWatchHistory([]);
      setShowAuthModal(false);
      setActiveView('discover');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    AuthService.logout(); // Centralize logout logic in the service
    setUser(null);
    setFavorites([]);
    setWatchHistory([]);
    setActiveView('discover');
    clearFilters();
  };

  const toggleFavorite = async (movie) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const isCurrentlyFavorite = favorites.some(fav => fav.id === movie.id);
    if (isCurrentlyFavorite) {
      await FavoritesService.removeFavorite(movie.id);
      setFavorites(prev => prev.filter(fav => fav.id !== movie.id));
    } else {
      await FavoritesService.addFavorite(movie);
      setFavorites(prev => [...prev, movie]);
    }
  };

  const recordWatch = async (movieId) => {
    if (!user) return;
    const movie = movies.find(m => m.id === movieId) || heroMovies.find(m => m.id === movieId);
    if (movie) {
      const newHistoryItem = await FavoritesService.recordWatch(movie);
      setWatchHistory(prev => [newHistoryItem, ...prev.filter(item => item.movie_id !== movieId)]);
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    if (view !== 'discover') {
        clearFilters();
    }
  };

  const handlePlayTrailer = (movie) => {
    if (movie.trailer && movie.trailer.key) {
      window.open(`https://www.youtube.com/watch?v=${movie.trailer.key}`, '_blank');
      if (user) recordWatch(movie.id);
    } else {
      alert('Trailer not available for this movie.');
    }
  };

  return (
    <div className="app">
      <Header 
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        activeView={activeView}
        onViewChange={handleViewChange}
        favoritesCount={favorites.length}
      />
      
      <main className="main-content">
        {activeView === 'discover' && (
          <>
            <Hero movies={heroMovies} onMovieClick={handleMovieClick} isLoading={loading && !movies.length} user={user} onWatchTrailer={recordWatch}/>
            <FilterSection filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} genres={genres} />
          </>
        )}

        {activeView === 'profile' && user && (
            <UserProfile user={user} favorites={favorites} watchHistory={watchHistory} onMovieClick={handleMovieClick} onToggleFavorite={toggleFavorite} />
        )}
        
        {error && !loading && (
          <div className="error-message">
            <h3>⚠️ {error}</h3>
            <button onClick={() => loadMovies(1, false)}>Try Again</button>
          </div>
        )}
        
        {loading && moviesToDisplay.length === 0 ? <LoadingSpinner /> : (
          <MovieGrid 
            movies={moviesToDisplay} 
            onMovieClick={handleMovieClick} 
            onToggleFavorite={toggleFavorite} 
            favorites={favorites} 
            user={user} 
            activeView={activeView} 
            getGenreNames={getGenreNames}
            isLoading={loading}
          />
        )}
        
        {activeView === 'discover' && hasMoreMovies && !loadingMore && movies.length > 0 && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={loadMoreMovies} disabled={loadingMore}>
              {loadingMore ? 'Loading...' : 'Load More Movies'}
            </button>
          </div>
        )}
        {loadingMore && <div className="loading-more"><LoadingSpinner /></div>}
      </main>

      <AnimatePresence>
        {selectedMovie && (
          <MovieModal 
            movie={selectedMovie} 
            onClose={handleCloseModal} 
            onToggleFavorite={toggleFavorite} 
            onWatchTrailer={handlePlayTrailer}
            isFavorite={favorites.some(fav => fav.id === selectedMovie.id)} 
            user={user} 
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            mode={authMode} 
            onModeChange={setAuthMode} 
            onAuth={handleAuth} 
            onClose={() => setShowAuthModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;