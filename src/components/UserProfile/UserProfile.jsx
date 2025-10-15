// src/components/UserProfile/UserProfile.jsx - PREMIUM REDESIGN
import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiClock, FiFilm, FiEye } from 'react-icons/fi';
import './UserProfile.css';

const UserProfile = ({ user, favorites, watchHistory, onMovieClick, onToggleFavorite }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const getReleaseYear = (date) => {
    return date ? new Date(date).getFullYear() : '';
  };

  const formatWatchDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="user-profile"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Header */}
      <motion.div className="profile-header" variants={itemVariants}>
        <motion.div 
          className="profile-avatar"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {user.username.charAt(0).toUpperCase()}
        </motion.div>
        
        <div className="profile-info">
          <motion.h1 variants={itemVariants}>
            {user.username}
          </motion.h1>
          
          <motion.p className="profile-email" variants={itemVariants}>
            {user.email}
          </motion.p>
          
          <motion.div className="profile-stats" variants={itemVariants}>
            <motion.div 
              className="stat"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="stat-number">{favorites.length}</span>
              <span className="stat-label">
                <FiHeart style={{ marginRight: '0.5rem' }} />
                Favorites
              </span>
            </motion.div>
            
            <motion.div 
              className="stat"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="stat-number">{watchHistory.length}</span>
              <span className="stat-label">
                <FiEye style={{ marginRight: '0.5rem' }} />
                Watched
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Profile Sections */}
      <motion.div className="profile-sections" variants={containerVariants}>
        {/* Favorites Section */}
        <motion.section className="favorites-section" variants={itemVariants}>
          <div className="section-header">
            <h2>
              <FiHeart style={{ marginRight: '0.75rem' }} />
              Favorite Movies
            </h2>
            <span className="section-count">{favorites.length} items</span>
          </div>
          
          {favorites.length > 0 ? (
            <motion.div 
              className="favorites-grid"
              layout
            >
              {favorites.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  className="favorite-movie-card"
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onMovieClick(movie)}
                  layoutId={`favorite-${movie.id}`}
                >
                  <img 
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/api/placeholder/500/750?text=No+Image'
                    }
                    alt={movie.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/500/750?text=No+Image';
                    }}
                  />
                  
                  <div className="movie-overlay">
                    <div className="movie-info">
                      <h4>{movie.title}</h4>
                      {movie.release_date && (
                        <span className="movie-year">
                          {getReleaseYear(movie.release_date)}
                        </span>
                      )}
                    </div>
                    
                    <motion.button
                      className={`favorite-btn active`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(movie);
                      }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      title="Remove from favorites"
                    >
                      <FiHeart fill="currentColor" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="no-data"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <FiFilm size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No Favorite Movies Yet</h3>
              <p>Start adding movies to your favorites to see them here</p>
            </motion.div>
          )}
        </motion.section>

        {/* Watch History Section */}
        <motion.section className="history-section" variants={itemVariants}>
          <div className="section-header">
            <h2>
              <FiClock style={{ marginRight: '0.75rem' }} />
              Recently Watched
            </h2>
            <span className="section-count">{watchHistory.length} items</span>
          </div>
          
          {watchHistory.length > 0 ? (
            <motion.div 
              className="history-list"
              layout
            >
              {watchHistory.slice(0, 10).map((item, index) => (
                <motion.div 
                  key={`${item.movie_id}-${item.watched_at}`}
                  className="history-item"
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    x: 8,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onMovieClick(item.movie_data || { id: item.movie_id, title: `Movie ${item.movie_id}` })}
                >
                  <span className="movie-title">
                    {item.movie_data?.title || `Movie ${item.movie_id}`}
                  </span>
                  <span className="watch-date">
                    {formatWatchDate(item.watched_at)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="no-data"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <FiEye size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No Watch History</h3>
              <p>Your watched movies will appear here</p>
            </motion.div>
          )}
        </motion.section>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;