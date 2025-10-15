// src/components/MovieGrid/MovieGrid.jsx - PREMIUM
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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getGridTitle = () => {
    switch (activeView) {
      case 'favorites':
        return `Your Premium Collection`;
      case 'profile':
        return 'Recently Watched';
      default:
        return 'Premium Cinema';
    }
  };

  const getGridSubtitle = () => {
    switch (activeView) {
      case 'favorites':
        return `Your curated collection of ${movies.length} exceptional films`;
      case 'profile':
        return 'Your recently enjoyed cinematic experiences';
      default:
        return 'Discover the finest selection of premium movies and cinematic masterpieces';
    }
  };

  return (
    <section className="movie-grid-section">
      <div className="container">
        {movies.length > 0 && (
          <motion.div 
            className="grid-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="grid-title">{getGridTitle()}</h2>
              <p className="grid-subtitle">{getGridSubtitle()}</p>
            </div>
            <div className="grid-stats">
              <span className="movie-count">{movies.length} {movies.length === 1 ? 'Masterpiece' : 'Masterpieces'}</span>
            </div>
          </motion.div>
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
                  whileHover={{ 
                    transition: { duration: 0.3 } 
                  }}
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="empty-state-icon">🎭</div>
              <h3>No Cinematic Masterpieces Found</h3>
              <p>Refine your search criteria or explore different categories to discover exceptional films that match your taste.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MovieGrid;