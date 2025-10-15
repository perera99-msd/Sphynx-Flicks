// src/App.jsx - PREMIUM CINEMA BLUE THEME (FULLY CORRECTED)
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
import Footer from './components/Footer/Footer';
import { MovieService } from './services/movieService';
import { AuthService } from './services/authService';
import { FavoritesService } from './services/favoritesService';
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

  // Memoized genre name helper
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
        return genre ? genre.name : 'Unknown';
      }).filter(name => name !== 'Unknown');
    }
    return [];
  }, [genres]);

  // Enhanced trailer loading function
  const loadTrailerData = async (movie) => {
    try {
      const trailerData = await MovieService.getMovieTrailer(movie.id);
      return {
        ...movie,
        trailer: trailerData
      };
    } catch (error) {
      console.warn(`Trailer not available for movie ${movie.id}:`, error.message);
      return movie;
    }
  };

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load genres first
        const genresData = await MovieService.getGenres();
        setGenres(genresData);
        
        // Load initial movies
        await loadMovies(1);
        
        // Check for existing user session
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await AuthService.verifyToken(token);
            setUser(userData.user);
            
            // Load user favorites and watch history
            const [localFavorites, localWatchHistory] = await Promise.all([
              FavoritesService.getFavorites(),
              FavoritesService.getWatchHistory()
            ]);
            
            setFavorites(localFavorites);
            setWatchHistory(localWatchHistory);
          } catch (error) {
            console.error('Token verification failed:', error);
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to load application data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Main movies loading function
  const loadMovies = async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    setError(null);

    try {
      let moviesData;
      
      if (searchQuery) {
        moviesData = await MovieService.searchMovies(searchQuery, page);
      } else {
        moviesData = await MovieService.getPopularMovies(page);
      }
      
      if (append) {
        setMovies(prev => {
          const existingIds = new Set(prev.map(movie => movie.id));
          const newMovies = moviesData.filter(movie => !existingIds.has(movie.id));
          return [...prev, ...newMovies];
        });
      } else {
        setMovies(moviesData);
        
        // Load hero movies with trailers for discover view
        if (page === 1 && !searchQuery && moviesData.length > 0) {
          const heroMoviesSlice = moviesData.slice(0, HERO_MOVIES_COUNT);
          const heroMoviesWithTrailers = await Promise.all(
            heroMoviesSlice.map(movie => loadTrailerData(movie))
          );
          setHeroMovies(heroMoviesWithTrailers);
        }
      }
      
      setHasMoreMovies(moviesData.length === MOVIES_PER_PAGE);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading movies:', error);
      setError('Failed to load movies. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more movies for pagination
  const loadMoreMovies = () => {
    if (!loadingMore && hasMoreMovies) {
      loadMovies(currentPage + 1, true);
    }
  };

  // Filter movies based on current view and filters
  const filteredMovies = useMemo(() => {
    let moviesToFilter;
    
    switch (activeView) {
      case 'favorites':
        moviesToFilter = favorites;
        break;
      case 'profile':
        moviesToFilter = watchHistory.map(item => item.movie);
        break;
      default:
        moviesToFilter = movies;
    }

    return moviesToFilter.filter(movie => {
      const searchMatch = searchQuery ? 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      
      const genreMatch = filters.genre ? 
        movie.genre_ids?.includes(parseInt(filters.genre)) : true;
      
      const yearMatch = filters.year ? 
        movie.release_date?.startsWith(filters.year) : true;
      
      const ratingMatch = filters.rating ? 
        movie.vote_average >= parseFloat(filters.rating) : true;
      
      return searchMatch && genreMatch && yearMatch && ratingMatch;
    });
  }, [movies, favorites, watchHistory, activeView, searchQuery, filters]);

  // Movie click handler with detailed data
  const handleMovieClick = useCallback(async (movie) => {
    try {
      const detailedMovie = await MovieService.getMovieDetails(movie.id);
      setSelectedMovie(detailedMovie);
    } catch (error) {
      console.error(`Error loading details for movie ${movie.id}:`, error);
      setSelectedMovie(movie);
    }
  }, []);

  const handleCloseModal = useCallback(() => setSelectedMovie(null), []);
  
  // Search functionality
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHasMoreMovies(true);
    loadMovies(1, false);
  }, []);
  
  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);
  
  const clearFilters = useCallback(() => {
    setFilters({ genre: '', year: '', rating: '' });
    setSearchQuery('');
    setCurrentPage(1);
    loadMovies(1, false);
  }, []);

  // Authentication handlers
  const handleAuth = async (credentials, mode) => {
    try {
      const result = mode === 'login' 
        ? await AuthService.login(credentials)
        : await AuthService.register(credentials);
      
      // Clear any existing local data
      localStorage.removeItem('favorites');
      localStorage.removeItem('watchHistory');
      
      setUser(result.user);
      setFavorites([]);
      setWatchHistory([]);
      localStorage.setItem('token', result.token);
      setShowAuthModal(false);
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
    localStorage.removeItem('favorites');
    localStorage.removeItem('watchHistory');
    setActiveView('discover');
    setSearchQuery('');
    setFilters({ genre: '', year: '', rating: '' });
    
    // Reload movies if we were in a different view
    if (activeView !== 'discover') {
      loadMovies(1, false);
    }
  };

  // Favorites management
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
        setFavorites(prev => prev.filter(fav => fav.id !== movie.id));
      } else {
        await FavoritesService.addFavorite(movie);
        setFavorites(prev => [...prev, movie]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Failed to update favorites. Please try again.');
    }
  };

  // Watch history management
  const recordWatch = async (movieId) => {
    if (!user) return;
    
    try {
      const movie = movies.find(m => m.id === movieId) || 
                   heroMovies.find(m => m.id === movieId) || 
                   favorites.find(m => m.id === movieId);
      
      if (movie) {
        const newHistoryItem = await FavoritesService.recordWatch(movie);
        setWatchHistory(prev => [
          newHistoryItem, 
          ...prev.filter(item => item.movie_id !== movieId)
        ].slice(0, 50)); // Keep only last 50 items
      }
    } catch (error) {
      console.error('Error recording watch:', error);
    }
  };

  // View navigation
  const handleViewChange = (view) => {
    setActiveView(view);
    setSearchQuery('');
    setFilters({ genre: '', year: '', rating: '' });
    
    // Only reload movies if switching to discover view from another view
    if (view === 'discover' && activeView !== 'discover') {
      loadMovies(1, false);
    }
  };

  // Trailer playback with enhanced error handling
  const handlePlayTrailer = async (movie) => {
    try {
      let trailerMovie = movie;
      
      // Ensure we have trailer data
      if (!movie.trailer) {
        trailerMovie = await loadTrailerData(movie);
      }
      
      if (trailerMovie.trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailerMovie.trailer.key}`, '_blank');
        
        // Record watch if user is logged in
        if (user) {
          await recordWatch(movie.id);
        }
      } else {
        alert('Trailer not available for this movie.');
      }
    } catch (error) {
      console.error('Error playing trailer:', error);
      alert('Unable to play trailer. Please try again later.');
    }
  };

  // Render loading state
  if (loading && activeView === 'discover' && movies.length === 0) {
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
          <LoadingSpinner />
        </main>
      </div>
    );
  }

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
        {/* Hero Section - Only for Discover View */}
        {activeView === 'discover' && (
          <>
            <Hero 
              movies={heroMovies} 
              onMovieClick={handleMovieClick} 
              isLoading={loading && heroMovies.length === 0} 
              user={user} 
              onWatchTrailer={handlePlayTrailer} 
            />
            <FilterSection 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onClearFilters={clearFilters} 
              genres={genres} 
            />
          </>
        )}

        {/* User Profile View */}
        {activeView === 'profile' && user && (
          <UserProfile 
            user={user} 
            favorites={favorites} 
            watchHistory={watchHistory} 
            onMovieClick={handleMovieClick} 
            onToggleFavorite={toggleFavorite} 
          />
        )}

        {/* Error Display */}
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>⚠️ {error}</h3>
            <button onClick={() => loadMovies(1, false)}>Try Again</button>
          </motion.div>
        )}

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeView}-${searchQuery}-${JSON.stringify(filters)}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Movie Grid */}
            {!error && (
              <MovieGrid 
                movies={filteredMovies} 
                onMovieClick={handleMovieClick} 
                onToggleFavorite={toggleFavorite} 
                favorites={favorites} 
                user={user} 
                activeView={activeView} 
                getGenreNames={getGenreNames}
                isLoading={loading}
              />
            )}
            
            {/* Load More Button - Only for Discover View */}
            {activeView === 'discover' && hasMoreMovies && !loadingMore && !error && (
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
            
            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="loading-more">
                <LoadingSpinner />
              </div>
            )}
            
            {/* No Results State */}
            {filteredMovies.length === 0 && !loading && !error && (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3>No movies found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                {activeView === 'discover' && (
                  <button 
                    className="btn-blue" 
                    onClick={clearFilters}
                    style={{ marginTop: '1.5rem' }}
                  >
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Movie Modal */}
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
      
      {/* Auth Modal */}
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