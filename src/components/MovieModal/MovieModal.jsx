// src/components/MovieModal/MovieModal.jsx - PREMIUM PROFESSIONAL (REVISED V2)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiStar, 
  FiCalendar, 
  FiClock, 
  FiHeart, 
  FiPlay,
  FiUsers,
  FiDollarSign,
  FiGlobe,
  FiFilm
} from 'react-icons/fi';
import './MovieModal.css';

const MovieModal = ({ 
  movie, 
  onClose, 
  onToggleFavorite, 
  isFavorite, 
  user,
  onWatchTrailer 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

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

  const handlePlayTrailer = () => {
    if (movie.trailer) {
      onWatchTrailer(movie);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getReleaseYear = (date) => {
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const posterImg = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/api/placeholder/500/750?text=No+Image';
  const backdropImg = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : posterImg;

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300, duration: 0.3 }}
        >
          <div 
            className="modal-hero"
            style={{ backgroundImage: `url(${backdropImg})` }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <motion.img 
                  src={posterImg} 
                  alt={movie.title}
                  className="modal-poster"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <div className="hero-details">
                  <motion.h1 
                    className="modal-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {movie.title}
                  </motion.h1>
                  
                  <motion.div 
                    className="modal-meta"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <span className="meta-item"><FiStar /> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                    <span className="meta-item"><FiCalendar /> {getReleaseYear(movie.release_date)}</span>
                    <span className="meta-item"><FiClock /> {formatRuntime(movie.runtime)}</span>
                  </motion.div>
                  
                  {movie.genres && movie.genres.length > 0 && (
                    <motion.div 
                      className="genres"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      {movie.genres.slice(0, 4).map(genre => (
                        <span key={genre.id} className="genre-tag">
                          {genre.name}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  <motion.div 
                    className="modal-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <button 
                      className="play-btn"
                      onClick={handlePlayTrailer}
                      disabled={!movie.trailer}
                    >
                      <FiPlay />
                      <span>{movie.trailer ? 'Watch Trailer' : 'No Trailer'}</span>
                    </button>
                    <button
                      className={`favorite-btn-modal ${isFavorite ? 'active' : ''}`}
                      onClick={handleFavoriteClick}
                      disabled={!user}
                      title={!user ? 'Login to add favorites' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FiHeart />
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="tab-navigation">
              <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
              <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
              {movie.cast && movie.cast.length > 0 && (
                <button className={`tab-btn ${activeTab === 'cast' ? 'active' : ''}`} onClick={() => setActiveTab('cast')}>Cast & Crew</button>
              )}
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3>Storyline</h3>
                  <p className="movie-overview">{movie.overview || 'No overview available.'}</p>
                  {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}
                </motion.div>
              )}

              {activeTab === 'details' && (
                 <motion.div className="details-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="detail-item"><FiDollarSign /><span>Budget:</span> <strong>{formatCurrency(movie.budget)}</strong></div>
                  <div className="detail-item"><FiDollarSign /><span>Revenue:</span> <strong>{formatCurrency(movie.revenue)}</strong></div>
                  <div className="detail-item"><FiGlobe /><span>Language:</span> <strong>{movie.original_language?.toUpperCase()}</strong></div>
                  <div className="detail-item"><FiFilm /><span>Status:</span> <strong>{movie.status}</strong></div>
                  
                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className="production-section">
                      <h4>Production</h4>
                      <div className="companies-list">
                        {movie.production_companies.map(c => c.logo_path && (
                          <div key={c.id} className="company-logo-wrapper" title={c.name}>
                            <img src={`https://image.tmdb.org/t/p/w200${c.logo_path}`} alt={c.name} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                 </motion.div>
              )}

              {activeTab === 'cast' && movie.cast && (
                <motion.div className="cast-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {movie.cast.slice(0, 14).map(person => (
                    <div key={person.cast_id} className="cast-member">
                      <img 
                        src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '/api/placeholder/200/200?text=N/A'}
                        alt={person.name}
                        className="cast-photo"
                      />
                      <div className="cast-info">
                        <p className="cast-name">{person.name}</p>
                        <p className="cast-character">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieModal;