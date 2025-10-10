// src/components/MovieModal/MovieModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiCalendar, FiClock, FiHeart, FiPlay } from 'react-icons/fi';
import './MovieModal.css';

const MovieModal = ({ movie, onClose, onToggleFavorite, isFavorite, user }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (user) {
      onToggleFavorite(movie);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getReleaseYear = (date) => {
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="movie-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="movie-modal"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>

          <div className="modal-content">
            <div className="modal-poster">
              <img 
                src={movie.poster_path} 
                alt={movie.title}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=500&h=750&fit=crop';
                }}
              />
              <div className="poster-overlay">
                <button className="play-trailer-btn">
                  <FiPlay />
                  Play Trailer
                </button>
              </div>
            </div>

            <div className="modal-details">
              <div className="modal-header">
                <h1 className="movie-title">{movie.title}</h1>
                <button
                  className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                  onClick={handleFavoriteClick}
                  disabled={!user}
                  title={!user ? 'Login to add favorites' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="movie-meta">
                <div className="meta-item">
                  <FiStar className="meta-icon" />
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <div className="meta-item">
                  <FiCalendar className="meta-icon" />
                  <span>{getReleaseYear(movie.release_date)}</span>
                </div>
                <div className="meta-item">
                  <FiClock className="meta-icon" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="genres">
                  {movie.genres.map(genre => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.overview && (
                <div className="movie-overview">
                  <h3>Overview</h3>
                  <p>{movie.overview}</p>
                </div>
              )}

              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="production-companies">
                  <h3>Production</h3>
                  <div className="companies-list">
                    {movie.production_companies.map(company => (
                      <div key={company.id} className="company">
                        {company.logo_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                            alt={company.name}
                            className="company-logo"
                          />
                        ) : (
                          <span className="company-name">{company.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieModal;