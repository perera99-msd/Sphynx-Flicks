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
  genres,
  getGenreNames 
}) => {
  return (
    <section className="movie-grid-section">
      <div className="container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieClick}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.some(fav => fav.id === movie.id)}
                  user={user}
                  genres={genres}
                  getGenreNames={getGenreNames}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MovieGrid;