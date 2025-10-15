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
  genres, 
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
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="movie-grid-section">
      <div className="container">
        {movies.length > 0 && (
          <div className="grid-header">
            <h2 className="grid-title">
              {activeView === 'discover' && 'Discover Movies'}
              {activeView === 'favorites' && `Your Favorites (${movies.length})`}
              {activeView === 'profile' && 'Recently Watched'}
            </h2>
            <div className="grid-stats">
              <span className="movie-count">{movies.length} movies</span>
            </div>
          </div>
        )}
        
        <motion.div 
          className="movie-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {movies.map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}-${activeView}`}
              variants={itemVariants}
              layout
            >
              <MovieCard
                movie={movie}
                onClick={onMovieClick}
                onToggleFavorite={onToggleFavorite}
                isFavorite={isFavorite(movie)}
                user={user}
                genres={genres}
                getGenreNames={getGenreNames}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MovieGrid;