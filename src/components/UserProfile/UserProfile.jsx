// src/components/UserProfile/UserProfile.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { FavoritesService } from '../../../services/favoritesService';
import './UserProfile.css';

const UserProfile = ({ onMovieClick }) => {
  const { user, favorites, watchHistory, updateFavorites } = useAuth();

  const handleToggleFavorite = async (movie) => {
    try {
      const result = await FavoritesService.toggleFavorite(movie);
      updateFavorites(result.favorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error.message);
    }
  };

  if (!user) {
    return (
      <div className="user-profile">
        <div className="not-logged-in">
          <h2>Please log in to view your profile</h2>
          <p>You need to be logged in to see your favorites and watch history.</p>
        </div>
      </div>
    );
  }

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
                  onClick={() => onMovieClick && onMovieClick(movie)}
                >
                  <img 
                    src={movie.poster_path || '/placeholder-movie.jpg'} 
                    alt={movie.title} 
                    onError={(e) => {
                      e.target.src = '/placeholder-movie.jpg';
                    }}
                  />
                  <div className="movie-overlay">
                    <h4>{movie.title}</h4>
                    <button
                      className="favorite-btn active"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(movie);
                      }}
                    >
                      ♥
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="no-data">No favorite movies yet. Start adding some!</p>
          )}
        </section>

        <section className="history-section">
          <h2>Recently Watched</h2>
          {watchHistory.length > 0 ? (
            <div className="history-list">
              {watchHistory.slice(0, 10).map((item, index) => (
                <div key={index} className="history-item" onClick={() => onMovieClick && onMovieClick(item)}>
                  <span className="movie-title">
                    {item.title || `Movie ID: ${item.movie_id || item.id}`}
                  </span>
                  <span className="watch-date">
                    {new Date(item.watched_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No watch history yet. Start watching movies!</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;