// src/components/MovieCard/MovieCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiStar } from 'react-icons/fi';
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

  const truncateOverview = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const movieGenres = getGenreNames ? getGenreNames(movie) : [];

  return (
    <motion.div
      className="movie-card"
      onClick={handleCardClick}
      whileHover={{ 
        y: -6,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card-image">
        <img 
          src={movie.poster_path} 
          alt={movie.title}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=400&h=600&fit=crop';
          }}
        />
        
        <div className="image-overlay" />
        
        <div className="card-actions">
          <button 
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            disabled={!user}
            title={!user ? 'Login to add favorites' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {movie.vote_average > 0 && (
          <div className="rating-badge">
            <FiStar />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <h3 className="movie-title">{movie.title}</h3>
        
        {movie.overview && (
          <p className="movie-overview">
            {truncateOverview(movie.overview)}
          </p>
        )}
        
        <div className="movie-meta">
          <span className="release-year">{getReleaseYear(movie.release_date)}</span>
          {movieGenres.length > 0 && (
            <span className="genre-preview">
              {movieGenres[0]}
            </span>
          )}
        </div>

        {movieGenres.length > 0 && (
          <div className="genres">
            {movieGenres.slice(0, 2).map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
            {movieGenres.length > 2 && (
              <span className="genre-tag">+{movieGenres.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;