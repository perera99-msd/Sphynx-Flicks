// src/components/MovieModal/MovieModal.jsx
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
  FiGlobe
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
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

          <div className="modal-hero">
            <div 
              className="modal-backdrop"
              style={{
                backgroundImage: `url(${movie.backdrop_path || movie.poster_path})`
              }}
            >
              <div className="backdrop-overlay">
                <div className="hero-content">
                  <div className="poster-section">
                    <img 
                      src={movie.poster_path} 
                      alt={movie.title}
                      className="modal-poster"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=400&h=600&fit=crop';
                      }}
                    />
                    <div className="poster-actions">
                      <button 
                        className="play-btn"
                        onClick={handlePlayTrailer}
                        disabled={!movie.trailer}
                      >
                        <FiPlay />
                        {movie.trailer ? 'Play Trailer' : 'No Trailer'}
                      </button>
                      <button
                        className={`favorite-btn large ${isFavorite ? 'active' : ''}`}
                        onClick={handleFavoriteClick}
                        disabled={!user}
                        title={!user ? 'Login to add favorites' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="hero-details">
                    <h1 className="movie-title">{movie.title}</h1>
                    
                    <div className="movie-meta-grid">
                      <div className="meta-item">
                        <FiStar className="meta-icon" />
                        <div>
                          <span className="meta-value">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                          <span className="meta-label">Rating</span>
                        </div>
                      </div>
                      
                      <div className="meta-item">
                        <FiCalendar className="meta-icon" />
                        <div>
                          <span className="meta-value">{getReleaseYear(movie.release_date)}</span>
                          <span className="meta-label">Release</span>
                        </div>
                      </div>
                      
                      <div className="meta-item">
                        <FiClock className="meta-icon" />
                        <div>
                          <span className="meta-value">{formatRuntime(movie.runtime)}</span>
                          <span className="meta-label">Runtime</span>
                        </div>
                      </div>
                      
                      <div className="meta-item">
                        <FiUsers className="meta-icon" />
                        <div>
                          <span className="meta-value">{movie.vote_count ? (movie.vote_count / 1000).toFixed(1) + 'K' : 'N/A'}</span>
                          <span className="meta-label">Votes</span>
                        </div>
                      </div>
                    </div>

                    {movie.genres && movie.genres.length > 0 && (
                      <div className="genres-section">
                        <h4>Genres</h4>
                        <div className="genres">
                          {movie.genres.map(genre => (
                            <span key={genre.id} className="genre-tag">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              {movie.cast && movie.cast.length > 0 && (
                <button 
                  className={`tab-btn ${activeTab === 'cast' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cast')}
                >
                  Cast
                </button>
              )}
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <h3>Storyline</h3>
                  <p className="movie-overview">{movie.overview || 'No overview available.'}</p>
                  
                  {movie.tagline && (
                    <div className="tagline">
                      <em>"{movie.tagline}"</em>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="details-tab">
                  <div className="details-grid">
                    {movie.budget > 0 && (
                      <div className="detail-item">
                        <FiDollarSign className="detail-icon" />
                        <div>
                          <span className="detail-label">Budget</span>
                          <span className="detail-value">{formatCurrency(movie.budget)}</span>
                        </div>
                      </div>
                    )}
                    
                    {movie.revenue > 0 && (
                      <div className="detail-item">
                        <FiDollarSign className="detail-icon" />
                        <div>
                          <span className="detail-label">Revenue</span>
                          <span className="detail-value">{formatCurrency(movie.revenue)}</span>
                        </div>
                      </div>
                    )}
                    
                    {movie.original_language && (
                      <div className="detail-item">
                        <FiGlobe className="detail-icon" />
                        <div>
                          <span className="detail-label">Language</span>
                          <span className="detail-value">{movie.original_language.toUpperCase()}</span>
                        </div>
                      </div>
                    )}
                    
                    {movie.status && (
                      <div className="detail-item">
                        <div>
                          <span className="detail-label">Status</span>
                          <span className="detail-value">{movie.status}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className="production-section">
                      <h4>Production Companies</h4>
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
              )}

              {activeTab === 'cast' && movie.cast && (
                <div className="cast-tab">
                  <div className="cast-grid">
                    {movie.cast.slice(0, 12).map(person => (
                      <div key={person.id} className="cast-member">
                        <div className="cast-photo">
                          {person.profile_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                              alt={person.name}
                            />
                          ) : (
                            <div className="no-photo">
                              <FiUsers />
                            </div>
                          )}
                        </div>
                        <div className="cast-info">
                          <span className="cast-name">{person.name}</span>
                          <span className="cast-character">{person.character}</span>
                        </div>
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