// src/components/MovieGrid/MovieGrid.jsx - PREMIUM BLUE THEME
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilm } from 'react-icons/fi';
import MovieCard from '../MovieCard/MovieCard';
import './MovieGrid.css';

const MovieGrid = ({ 
  movies, 
  onMovieClick, 
  onToggleFavorite, 
  favorites, 
  user, 
  activeView,
  getGenreNames,
  isLoading
}) => {
  const isFavorite = (movie) => favorites.some(fav => fav.id === movie.id);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'favorites': return "My List";
      case 'profile': return 'Watch History';
      default: return 'Discover';
    }
  };
  
  const getSubtitle = () => {
    const count = movies.length;
    switch (activeView) {
        case 'favorites': return `You have ${count} ${count === 1 ? 'movie' : 'movies'} saved.`;
        case 'profile': return `You have watched ${count} ${count === 1 ? 'movie' : 'movies'}.`;
        default: return 'Explore a world of cinematic wonders.';
    }
  };

  const showEmptyState = !isLoading && movies.length === 0;

  return (
    <section className="movie-grid-section">
      <div className="container">
        <motion.div 
          className="grid-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="grid-title">{getTitle()}</h2>
            <p className="grid-subtitle">{getSubtitle()}</p>
          </div>
        </motion.div>
        
        {showEmptyState ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FiFilm className="empty-state-icon" />
            <h3>No Movies Found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
          </motion.div>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default MovieGrid;