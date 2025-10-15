// src/components/MovieModal/MovieModal.jsx - PREMIUM PROFESSIONAL (REVISED V4 - INTERACTIVE GRID)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiStar, 
  FiCalendar, 
  FiClock, 
  FiHeart, 
  FiPlay,
  FiChevronDown
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
  const [isCastExpanded, setIsCastExpanded] = useState(false);

  const toggleCastView = () => setIsCastExpanded(!isCastExpanded);

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

  const getReleaseYear = (date) => {
    return date ? new Date(date).getFullYear() : 'N/A';
  };
  
  const posterImg = movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : '/api/placeholder/500/750?text=No+Image';
  const backdropImg = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : posterImg;

  const castToShow = isCastExpanded ? movie.cast : movie.cast?.slice(0, 6);

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
          style={{ backgroundImage: `url(${backdropImg})` }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100vh", opacity: 0 }}
          transition={{ type: "spring", damping: 40, stiffness: 300 }}
        >
          <div className="modal-content-wrapper">
            {/* LEFT PANE - VISUALS */}
            <motion.div 
              className="modal-left-pane"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <img src={posterImg} alt={movie.title} className="modal-poster" />
              <div className="poster-actions">
                <button 
                  className="play-trailer-btn"
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
                    <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                </button>
              </div>
            </motion.div>

            {/* RIGHT PANE - DETAILS */}
            <motion.div 
              className="modal-right-pane"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="right-pane-header">
                <h1 className="modal-title">{movie.title}</h1>
                <p className="tagline">{movie.tagline}</p>
                <div className="modal-meta">
                  <span className="meta-item rating"><FiStar /> {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  <span className="meta-item"><FiCalendar /> {getReleaseYear(movie.release_date)}</span>
                  <span className="meta-item"><FiClock /> {formatRuntime(movie.runtime)}</span>
                  <span className="meta-item status">{movie.status}</span>
                </div>
                <div className="genres">
                  {movie.genres?.map(genre => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>
              </div>

              <div className="right-pane-body">
                <h3>Synopsis</h3>
                <p className="movie-overview">{movie.overview || 'No overview available.'}</p>
                
                <h3>Cast</h3>
                <motion.div layout className="cast-section">
                  <div className="cast-grid">
                    {castToShow?.map(person => (
                       <motion.div 
                          key={person.cast_id} 
                          className="cast-member"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                       >
                          <img 
                            src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '/api/placeholder/200/200?text=N/A'}
                            alt={person.name}
                            className="cast-photo"
                          />
                          <div className="cast-info">
                            <p className="cast-name">{person.name}</p>
                            <p className="cast-character">{person.character}</p>
                          </div>
                       </motion.div>
                    ))}
                  </div>

                  {movie.cast && movie.cast.length > 6 && (
                    <button onClick={toggleCastView} className={`view-cast-btn ${isCastExpanded ? 'expanded' : ''}`}>
                      <span>{isCastExpanded ? 'Show Less' : 'View All Cast'}</span>
                      <FiChevronDown />
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>
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