// src/App.jsx
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
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const HERO_MOVIES_COUNT = 5;
const MOVIES_PER_PAGE = 20;

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


  function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
  // Add getGenreNames function
  const getGenreNames = useCallback((movie) => {
    if (movie.genre_names && movie.genre_names.length > 0) {
      return movie.genre_names;
    }
    
    if (movie.genres && movie.genres.length > 0) {
      return movie.genres.map(g => g.name || g);
    }
    
    if (movie.genre_ids && movie.genre_ids.length > 0 && genres.length > 0) {
      const genreNames = movie.genre_ids.map(genreId => {
        const genre = genres.find(g => g.id === genreId);
        return genre ? genre.name : 'Unknown';
      }).filter(name => name !== 'Unknown');
      
      return genreNames;
    }
    
    return [];
  }, [genres]);

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        // Load genres first
        const genresData = await MovieService.getGenres();
        setGenres(genresData);
        
        // Load initial movies
        await loadMovies(1);
        
        // Check for authenticated user
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await AuthService.verifyToken(token);
            setUser(userData.user);
            setFavorites(userData.favorites || []);
            setWatchHistory(userData.watchHistory || []);
          } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
            setUser(null);
            setFavorites([]);
            setWatchHistory([]);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to load movies. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadMovies = async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      let moviesData;
      
      if (searchQuery) {
        moviesData = await MovieService.searchMovies(searchQuery, page);
      } else {
        moviesData = await MovieService.getPopularMovies(page);
      }

      if (append) {
        setMovies(prev => [...prev, ...moviesData]);
      } else {
        setMovies(moviesData);
        // Set hero movies only for first page and no search
        if (page === 1 && !searchQuery && moviesData.length > 0) {
          setHeroMovies(moviesData.slice(0, HERO_MOVIES_COUNT));
        }
      }

      // Check if there are more movies to load
      setHasMoreMovies(moviesData.length === MOVIES_PER_PAGE);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading movies:', error);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreMovies = async () => {
    if (!loadingMore && hasMoreMovies) {
      await loadMovies(currentPage + 1, true);
    }
  };

  const filteredMovies = useMemo(() => {
    const moviesToFilter = activeView === 'favorites' ? favorites : movies;
    
    return moviesToFilter.filter(movie => {
      const searchMatch = searchQuery
        ? movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const genreMatch = filters.genre
        ? movie.genre_ids?.includes(parseInt(filters.genre))
        : true;
      
      const yearMatch = filters.year
        ? movie.release_date?.startsWith(filters.year)
        : true;
      
      const ratingMatch = filters.rating
        ? movie.vote_average >= parseFloat(filters.rating)
        : true;
        
      return searchMatch && genreMatch && yearMatch && ratingMatch;
    });
  }, [movies, favorites, activeView, searchQuery, filters]);

  const handleMovieClick = useCallback(async (movie) => {
    try {
      const detailedMovie = await MovieService.getMovieDetails(movie.id, movie.source);
      setSelectedMovie(detailedMovie);
    } catch (error) {
      console.error(`Error loading details for movie ${movie.id}:`, error);
      // Fallback to basic movie data if details fail
      setSelectedMovie(movie);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHasMoreMovies(true);
    loadMovies(1, false);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ genre: '', year: '', rating: '' });
    setSearchQuery('');
    setCurrentPage(1);
    loadMovies(1, false);
  }, []);

  const handleAuth = async (credentials, mode) => {
    try {
      const result = mode === 'login' 
        ? await AuthService.login(credentials)
        : await AuthService.register(credentials);
      
      setUser(result.user);
      setFavorites(result.favorites || []);
      setWatchHistory(result.watchHistory || []);
      localStorage.setItem('token', result.token);
      setShowAuthModal(false);
      
      // Switch to discover view after login
      setActiveView('discover');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    setWatchHistory([]);
    localStorage.removeItem('token');
    setActiveView('discover');
    setSearchQuery('');
    setFilters({ genre: '', year: '', rating: '' });
    setCurrentPage(1);
    loadMovies(1, false);
  };

  const toggleFavorite = async (movie) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const isCurrentlyFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (isCurrentlyFavorite) {
        await FavoritesService.removeFavorite(movie.id);
        setFavorites(prev => prev.filter(fav => fav.id !== movie.id));
      } else {
        await FavoritesService.addFavorite(movie);
        setFavorites(prev => [...prev, movie]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const recordWatch = async (movieId) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await FavoritesService.recordWatch(movieId);
      // Update local watch history
      const historyItem = await FavoritesService.getMovieDetails(movieId);
      setWatchHistory(prev => [
        { ...historyItem, watched_at: new Date().toISOString() },
        ...prev.slice(0, 49)
      ]);
    } catch (error) {
      console.error('Error recording watch:', error);
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    // Clear search and filters when switching to favorites or profile
    if (view !== 'discover') {
      setSearchQuery('');
      setFilters({ genre: '', year: '', rating: '' });
    } else {
      // Reload movies when switching back to discover
      setCurrentPage(1);
      loadMovies(1, false);
    }
  };

  return (
    <div className="app">
      <Header 
        onSearch={handleSearch}
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
            <Hero
              movies={heroMovies}
              onMovieClick={handleMovieClick}
              isLoading={loading}
              user={user}
              onWatchTrailer={recordWatch}
            />
            
            <FilterSection 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              genres={genres}
            />
          </>
        )}

        {activeView === 'profile' && user && (
          <UserProfile
            user={user}
            favorites={favorites}
            watchHistory={watchHistory}
            onMovieClick={handleMovieClick}
            onToggleFavorite={toggleFavorite}
          />
        )}
        
        {error && (
          <div className="error-message">
            <h3>⚠️ {error}</h3>
            <button onClick={() => loadMovies(1, false)}>Try Again</button>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeView}-${searchQuery}-${JSON.stringify(filters)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MovieGrid
                movies={filteredMovies}
                onMovieClick={handleMovieClick}
                onToggleFavorite={toggleFavorite}
                favorites={favorites}
                user={user}
                activeView={activeView}
                genres={genres}
                getGenreNames={getGenreNames}
              />
              
              {/* Load More Button */}
              {activeView === 'discover' && hasMoreMovies && !searchQuery && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn"
                    onClick={loadMoreMovies}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Movies'}
                  </button>
                </div>
              )}

              {loadingMore && (
                <div className="loading-more">
                  <LoadingSpinner />
                </div>
              )}

              {filteredMovies.length === 0 && !loading && !error && (
                <div className="no-results">
                  <h3>No movies found</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={handleCloseModal}
            onToggleFavorite={toggleFavorite}
            onWatchTrailer={recordWatch}
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