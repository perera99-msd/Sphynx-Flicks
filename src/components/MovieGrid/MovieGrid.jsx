// src/components/MovieGrid/MovieGrid.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '../MovieCard/MovieCard';
import './MovieGrid.css';

const MovieGrid = ({ 
  movies, 
  onMovieClick, 
  onToggleFavorite, 
  favorites, 
  user, 
  activeView,
  getGenreNames
}) => {
  const isFavorite = (movie) => favorites.some(fav => fav.id === movie.id);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const getGridTitle = () => {
    switch (activeView) {
      case 'favorites':
        return `Your Favorites`;
      case 'profile':
        return 'Recently Watched';
      default:
        return 'Discover Movies';
    }
  };

  const getGridSubtitle = () => {
    switch (activeView) {
      case 'favorites':
        return `Your personal collection of ${movies.length} favorite movies`;
      case 'profile':
        return 'Movies you recently watched';
      default:
        return 'Explore our curated selection of popular movies';
    }
  };

  return (
    <section className="movie-grid-section">
      <div className="container">
        {movies.length > 0 && (
          <div className="grid-header">
            <div>
              <h2 className="grid-title">{getGridTitle()}</h2>
              <p className="grid-subtitle">{getGridSubtitle()}</p>
            </div>
            <div className="grid-stats">
              <span className="movie-count">{movies.length} {movies.length === 1 ? 'movie' : 'movies'}</span>
            </div>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {movies.length > 0 ? (
            <motion.div 
              className="movie-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={`grid-${activeView}-${movies.length}`}
            >
              {movies.map((movie) => (
                <motion.div
                  key={`${movie.id}-${activeView}`}
                  variants={itemVariants}
                  layout
                >
                  <MovieCard
                    movie={movie}
                    onClick={onMovieClick}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={isFavorite(movie)}
                    user={user}
                    getGenreNames={getGenreNames}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="empty-state-icon">🎬</div>
              <h3>No movies found</h3>
              <p>Try adjusting your search criteria or explore different categories to find what you're looking for.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MovieGrid;