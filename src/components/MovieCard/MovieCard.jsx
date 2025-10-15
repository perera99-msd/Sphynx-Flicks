// src/components/MovieCard/MovieCard.jsx - PREMIUM BLUE
import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiClock, FiEye } from 'react-icons/fi';
import './MovieCard.css';

const MovieCard = ({ movie, onClick, onToggleFavorite, isFavorite, user, getGenreNames }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (user) {
      onToggleFavorite(movie);
    }
  };

  const handleCardClick = () => {
    onClick(movie);
  };

  const getReleaseYear = (date) => {
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const truncateOverview = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const isNewRelease = (date) => {
    if (!date) return false;
    const releaseDate = new Date(date);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - releaseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const genres = getGenreNames(movie);
  const releaseYear = getReleaseYear(movie.release_date);
  const isNew = isNewRelease(movie.release_date);

  return (
    <motion.div
      className="movie-card"
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      {isNew && (
        <div className="new-badge">New</div>
      )}
      
      <div className="card-image">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/api/placeholder/300/450?text=No+Image'
          }
          alt={movie.title}
          loading="lazy"
        />
        <div className="image-overlay" />
        
        <div className="card-actions">
          <motion.button
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
        
        <div className="rating-badge">
          <FiStar fill="currentColor" />
          {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="movie-title">{movie.title}</h3>
        
        {genres.length > 0 && (
          <div className="genre-section">
            <div className="genres">
              {genres.slice(0, 2).map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
              {genres.length > 2 && (
                <span className="genre-tag">+{genres.length - 2}</span>
              )}
            </div>
          </div>
        )}
        
        <p className="movie-overview">
          {truncateOverview(movie.overview, 90)}
        </p>
        
        <div className="movie-meta">
          <div className="release-year">{releaseYear}</div>
          <div className="movie-stats">
            <div className="stat">
              <FiClock />
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
            <div className="stat">
              <FiEye />
              <span>{movie.vote_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;