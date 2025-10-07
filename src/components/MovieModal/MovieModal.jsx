// src/components/MovieModal/MovieModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoviePlayer from '../MoviePlayer/MoviePlayer';
import './MovieModal.css';

const MovieModal = ({ movie, onClose, onToggleFavorite, onWatchTrailer, isFavorite, user }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleWatchMovie = () => {
    setShowPlayer(true);
    if (onWatchTrailer) {
      onWatchTrailer(movie.id);
    }
  };

  const handleWatchTrailer = () => {
    if (onWatchTrailer) {
      onWatchTrailer(movie.id);
    }
    if (movie.trailer) {
      window.open(`https://www.youtube.com/watch?v=${movie.trailer.key}`, '_blank');
    } else {
      // Fallback trailer search
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`, '_blank');
    }
  };

  const handleFavoriteClick = () => {
    if (user) {
      onToggleFavorite(movie);
    }
  };

  const backdropUrl = movie.backdrop_path || movie.poster_path || 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=800&h=450&fit=crop';
  const posterUrl = movie.poster_path || movie.backdrop_path || 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=500&h=750&fit=crop';
  
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
  const genres = movie.genres || movie.genre_names?.map(name => ({ name })) || [];

  return (
    <>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-modal" onClick={onClose}>×</button>
          
          <div 
            className="modal-header"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="header-overlay">
              <h2>{movie.title}</h2>
              {movie.tagline && (
                <p className="movie-tagline">"{movie.tagline}"</p>
              )}
            </div>
          </div>

          <div className="modal-body">
            <div className="movie-poster">
              <img src={posterUrl} alt={`${movie.title} poster`} />
            </div>

            <div className="movie-details">
              <div className="movie-meta">
                <span className="rating">⭐ {rating}</span>
                <span className="year">{releaseYear}</span>
                <span className="runtime">{runtime}</span>
              </div>

              <div className="action-buttons">
                <button className="watch-btn" onClick={handleWatchMovie}>
                  ▶ Watch Movie
                </button>
                <button className="trailer-btn" onClick={handleWatchTrailer}>
                  🎬 Watch Trailer
                </button>
                <button
                  className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                  onClick={handleFavoriteClick}
                  disabled={!user}
                >
                  {isFavorite ? '❤️' : '🤍'} Favorite
                </button>
              </div>

              {!user && (
                <div className="login-prompt">
                  <p>
                    <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>
                      Login
                    </a> to add movies to favorites and track your watch history
                  </p>
                </div>
              )}

              <div className="tab-navigation">
                <button
                  className={activeTab === 'overview' ? 'active' : ''}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={activeTab === 'details' ? 'active' : ''}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                {movie.cast && movie.cast.length > 0 && (
                  <button
                    className={activeTab === 'cast' ? 'active' : ''}
                    onClick={() => setActiveTab('cast')}
                  >
                    Cast
                  </button>
                )}
              </div>

              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="overview">
                    <p className="movie-overview">
                      {movie.overview || 'No overview available.'}
                    </p>
                    {genres.length > 0 && (
                      <div className="movie-genres">
                        {genres.map((genre, index) => (
                          <span key={index} className="genre-tag">
                            {genre.name || genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="details">
                    {movie.director && (
                      <div className="detail-item">
                        <strong>Director:</strong> {movie.director}
                      </div>
                    )}
                    {movie.budget && movie.budget > 0 && (
                      <div className="detail-item">
                        <strong>Budget:</strong> ${movie.budget.toLocaleString()}
                      </div>
                    )}
                    {movie.revenue && movie.revenue > 0 && (
                      <div className="detail-item">
                        <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}
                      </div>
                    )}
                    {movie.production_companies && movie.production_companies.length > 0 && (
                      <div className="detail-item">
                        <strong>Production:</strong>{' '}
                        {movie.production_companies.map(company => company.name).join(', ')}
                      </div>
                    )}
                    {movie.status && (
                      <div className="detail-item">
                        <strong>Status:</strong> {movie.status}
                      </div>
                    )}
                    {movie.original_language && (
                      <div className="detail-item">
                        <strong>Original Language:</strong> {movie.original_language.toUpperCase()}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'cast' && movie.cast && (
                  <div className="cast-grid">
                    {movie.cast.slice(0, 12).map(actor => (
                      <div key={actor.id} className="cast-member">
                        <img
                          src={actor.profile_path 
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
                            : '/default-avatar.png'
                          }
                          alt={actor.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x300/333333/ffffff?text=No+Image';
                          }}
                        />
                        <div className="cast-info">
                          <strong>{actor.name}</strong>
                          <span>{actor.character}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showPlayer && (
          <MoviePlayer
            movie={movie}
            onClose={() => setShowPlayer(false)}
            onRecordWatch={onWatchTrailer}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MovieModal;