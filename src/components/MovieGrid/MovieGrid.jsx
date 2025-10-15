// src/components/MovieGrid/MovieGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const getGridTitle = () => {
    switch (activeView) {
      case 'favorites':
        return `Your Favorites (${movies.length})`;
      case 'profile':
        return 'Recently Watched';
      default:
        return 'Discover Movies';
    }
  };

  return (
    <section className="movie-grid-section">
      <div className="container">
        {movies.length > 0 && (
          <div className="grid-header">
            <h2 className="grid-title">{getGridTitle()}</h2>
            <div className="grid-stats">
              <span className="movie-count">{movies.length} {movies.length === 1 ? 'movie' : 'movies'}</span>
            </div>
          </div>
        )}
        
        {movies.length > 0 ? (
          <motion.div 
            className="movie-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
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
          <div className="empty-state">
            <h3>No movies found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieGrid;