// src/components/UserProfile/UserProfile.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiCalendar, FiHeart, FiEye } from 'react-icons/fi';
import './UserProfile.css';

const UserProfile = ({ user, favorites, watchHistory, onMovieClick, onToggleFavorite }) => {
  const getReleaseYear = (date) => (date ? new Date(date).getFullYear() : 'N/A');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="user-profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="profile-header" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="profile-avatar" variants={itemVariants}>
          {user.username.charAt(0).toUpperCase()}
        </motion.div>
        <motion.div className="profile-info" variants={itemVariants}>
          <h1>{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number"><FiHeart /> {favorites.length}</span>
              <span className="stat-label">Favorites</span>
            </div>
            <div className="stat">
              <span className="stat-number"><FiEye /> {watchHistory.length}</span>
              <span className="stat-label">Watched</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="profile-sections">
        <motion.section className="profile-section" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2><FiHeart /> Favorite Movies</h2>
          {favorites.length > 0 ? (
            <motion.div className="favorites-grid" variants={containerVariants} initial="hidden" animate="visible">
              {favorites.map(movie => (
                <motion.div
                  key={movie.id}
                  className="favorite-movie-card"
                  variants={itemVariants}
                  layout
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => onMovieClick(movie)}
                >
                  <img src={movie.poster_path} alt={movie.title} />
                  <div className="movie-overlay">
                    <h4>{movie.title}</h4>
                    <button
                      className="favorite-btn active"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(movie);
                      }}
                    >
                      <FiHeart />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="no-data">Browse and add some movies to your favorites!</p>
          )}
        </motion.section>

        <motion.section className="profile-section" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2><FiEye /> Recently Watched</h2>
          {watchHistory.length > 0 ? (
            <motion.div className="history-list" variants={containerVariants} initial="hidden" animate="visible">
              {watchHistory.slice(0, 10).map((item) => (
                <motion.div key={`${item.id}-${item.watched_at}`} className="history-item" variants={itemVariants} onClick={() => onMovieClick(item)}>
                  <img src={item.poster_path} alt={item.title} className="history-poster" />
                  <div className="history-details">
                    <h4 className="history-title">{item.title}</h4>
                    <div className="history-meta">
                      <span><FiStar /> {item.vote_average?.toFixed(1)}</span>
                      <span><FiCalendar /> {getReleaseYear(item.release_date)}</span>
                    </div>
                  </div>
                  <span className="watch-date">
                    {new Date(item.watched_at).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="no-data">Your watch history is empty.</p>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
};

export default UserProfile;