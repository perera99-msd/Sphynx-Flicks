// src/components/UserProfile/UserProfile.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './UserProfile.css';

const UserProfile = ({ user, favorites, watchHistory, onMovieClick, onToggleFavorite }) => {
  return (
    <div className="user-profile">
      <div className="profile-header">
        <motion.div
          className="profile-avatar"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {user.username.charAt(0).toUpperCase()}
        </motion.div>
        <div className="profile-info">
          <h1 className="gold-text">{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{favorites.length}</span>
              <span className="stat-label">Favorites</span>
            </div>
            <div className="stat">
              <span className="stat-number">{watchHistory.length}</span>
              <span className="stat-label">Watched</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        <section className="favorites-section">
          <h2>Favorite Movies</h2>
          {favorites.length > 0 ? (
            <div className="favorites-grid">
              {favorites.map(movie => (
                <motion.div
                  key={movie.id}
                  className="favorite-movie-card"
                  whileHover={{ scale: 1.05 }}
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
                      ♥
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="no-data">No favorite movies yet</p>
          )}
        </section>

        <section className="history-section">
          <h2>Recently Watched</h2>
          {watchHistory.length > 0 ? (
            <div className="history-list">
              {watchHistory.slice(0, 10).map((item, index) => (
                <div key={index} className="history-item">
                  <span className="movie-title">
                    Movie ID: {item.movie_id}
                  </span>
                  <span className="watch-date">
                    {new Date(item.watched_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No watch history yet</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;