// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import MovieGrid from './components/MovieGrid/MovieGrid';
import MovieModal from './components/MovieModal/MovieModal';
import FilterSection from './components/FilterSection/FilterSection';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import AuthModal from './components/AuthModal/AuthModal';
import UserProfile from './components/UserProfile/UserProfile';
import { MovieService } from './services/movieService';
import { FavoritesService } from './services/favoritesService';
import './App.css';

const HERO_MOVIES_COUNT = 5;
const MOVIES_PER_PAGE = 20;

// Main App Content Component
const AppContent = () => {
  const { user, logout, favorites, watchHistory, updateFavorites, addToWatchHistory } = useAuth();
  const [movies, setMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeView, setActiveView] = useState('discover');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        // Load genres first
        const genresData = await MovieService.getGenres();
        setGenres(genresData);
        
        // Load initial movies
        await loadMovies(1);
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
        ? movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const genreMatch = filters.genre
        ? movie.genre_ids?.includes(parseInt(filters.genre)) || 
          movie.genre_names?.some(name => name.toLowerCase().includes(filters.genre.toLowerCase()))
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
      
      // Record watch history if user is logged in
      if (user) {
        try {
          await FavoritesService.recordWatch(detailedMovie);
          // Update local watch history
          addToWatchHistory({ ...detailedMovie, watched_at: new Date().toISOString() });
        } catch (error) {
          console.error('Error recording watch history:', error);
        }
      }
    } catch (error) {
      console.error(`Error loading details for movie ${movie.id}:`, error);
      // Fallback to basic movie data if details fail
      setSelectedMovie(movie);
    }
  }, [user, addToWatchHistory]);

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
      
      setShowAuthModal(false);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    setActiveView('discover');
    setSearchQuery('');
    setFilters({ genre: '', year: '', rating: '' });
    setCurrentPage(1);
    loadMovies(1, false);
  };

  const toggleFavorite = async (movie) => {
    if (!user) {
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }

    try {
      const isCurrentlyFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (isCurrentlyFavorite) {
        await FavoritesService.removeFavorite(movie.id);
        updateFavorites(favorites.filter(fav => fav.id !== movie.id));
      } else {
        await FavoritesService.addFavorite(movie);
        updateFavorites([...favorites, movie]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // If there's an error, show auth modal (token might be expired)
      if (error.response?.status === 401) {
        setShowAuthModal(true);
        setAuthMode('login');
      }
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

  // Get genre names for movies
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

  return (
    <div className="app">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        user={user}
        onAuthClick={() => {
          setShowAuthModal(true);
          setAuthMode('login');
        }}
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
              onWatchTrailer={(movie) => {
                if (user && movie) {
                  FavoritesService.recordWatch(movie).catch(console.error);
                }
              }}
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
        
        {activeView === 'favorites' && (
          <div className="favorites-header">
            <h2>Your Favorite Movies</h2>
            <p>{favorites.length} movies in your collection</p>
          </div>
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
                getGenreNames={getGenreNames}
              />
              
              {/* Load More Button - Only show for discover view with no active search/filters */}
              {activeView === 'discover' && hasMoreMovies && !searchQuery && Object.values(filters).every(val => !val) && (
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

              {filteredMovies.length === 0 && !loading && (
                <div className="no-results">
                  <h3>
                    {activeView === 'favorites' ? 'No favorite movies yet' : 
                     activeView === 'profile' ? 'No movies to display' : 
                     'No movies found'}
                  </h3>
                  <p>
                    {activeView === 'favorites' ? 'Start adding movies to your favorites!' : 
                     activeView === 'profile' ? 'Your watch history and favorites will appear here' : 
                     'Try adjusting your search or filters.'}
                  </p>
                  {activeView === 'favorites' && !user && (
                    <button 
                      className="auth-prompt-btn"
                      onClick={() => {
                        setShowAuthModal(true);
                        setAuthMode('login');
                      }}
                    >
                      Log in to add favorites
                    </button>
                  )}
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
            onWatchTrailer={(movie) => {
              if (user && movie) {
                FavoritesService.recordWatch(movie).catch(console.error);
              }
            }}
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
};

// Main App Component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;