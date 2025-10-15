// src/components/MovieCard/MovieCard.jsx - PREMIUM
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return releaseDate > thirtyDaysAgo;
  };

  const movieGenres = getGenreNames ? getGenreNames(movie) : [];

  return (
    <motion.div
      className="movie-card"
      onClick={handleCardClick}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="card-image">
        <img 
          src={movie.poster_path} 
          alt={movie.title}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=400&h=600&fit=crop&q=80';
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

        {isNewRelease(movie.release_date) && (
          <div className="new-badge">New</div>
        )}
      </div>

      <div className="card-content">
        <h3 className="movie-title">{movie.title}</h3>
        
        {movie.overview && (
          <p className="movie-overview">
            {truncateOverview(movie.overview)}
          </p>
        )}
        
        <div className="movie-stats">
          <div className="stat">
            <FiEye />
            <span>{movie.popularity ? Math.round(movie.popularity) : 'N/A'}</span>
          </div>
          <div className="stat">
            <FiClock />
            <span>{formatRuntime(movie.runtime)}</span>
          </div>
        </div>

        {movieGenres.length > 0 && (
          <div className="genres">
            {movieGenres.slice(0, 3).map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
            {movieGenres.length > 3 && (
              <span className="genre-tag">+{movieGenres.length - 3}</span>
            )}
          </div>
        )}
        
        <div className="movie-meta">
          <span className="release-year">{getReleaseYear(movie.release_date)}</span>
          <span className="runtime">
            <FiClock />
            {formatRuntime(movie.runtime)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;