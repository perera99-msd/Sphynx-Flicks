// src/components/MovieCard/MovieCard.jsx - PREMIUM PROFESSIONAL (REVISED)
import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiClock, FiPlayCircle } from 'react-icons/fi';
import './MovieCard.css';

const MovieCard = ({ movie, onClick, onToggleFavorite, isFavorite, user, getGenreNames }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (user) {
      onToggleFavorite(movie);
    } else {
      // You might want to trigger an auth modal here
      console.log("User not logged in");
    }
  };

  const handleCardClick = () => {
    onClick(movie);
  };

  const getReleaseYear = (date) => {
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const genres = getGenreNames(movie).slice(0, 2); // Show max 2 genres for a cleaner look

  return (
    <motion.div
      className="movie-card"
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      layout
    >
      <div className="card-image-container">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/api/placeholder/500/750?text=No+Image'
          }
          alt={movie.title}
          className="card-image"
          loading="lazy"
        />
        <div className="card-overlay" />
      </div>

      <div className="card-content">
        <div className="card-header">
          <motion.div 
            className="rating-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <FiStar fill="currentColor" />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
          </motion.div>
          <motion.button
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle Favorite"
          >
            <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
        
        <div className="card-details">
          <motion.h3 
            className="movie-title"
            layout="position"
          >
            {movie.title}
          </motion.h3>
          <div className="movie-meta">
            <span className="release-year">{getReleaseYear(movie.release_date)}</span>
            {genres.length > 0 && (
              <div className="genres">
                {genres.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="play-icon-container">
          <FiPlayCircle size="50px" />
      </div>

    </motion.div>
  );
};

export default MovieCard;