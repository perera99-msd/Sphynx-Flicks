// src/components/MovieGrid/MovieGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../MovieCard/MovieCard';
import './MovieGrid.css';

const MovieGrid = ({ movies, onMovieClick, onToggleFavorite, favorites, user, activeView, genres, getGenreNames }) => {
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

  return (
    <section className="movie-grid-section">
      <div className="container">
        <motion.div 
          className="movie-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              onClick={onMovieClick}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite(movie)}
              user={user}
              genres={genres}
              getGenreNames={getGenreNames}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MovieGrid;