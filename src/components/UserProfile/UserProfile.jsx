// src/components/UserProfile/UserProfile.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiHeart, FiClock, FiSettings, FiLogOut } from 'react-icons/fi';
import MovieGrid from '../MovieGrid/MovieGrid';
import './UserProfile.css';

const UserProfile = ({ user, favorites, watchHistory, onMovieClick, onToggleFavorite }) => {
  const stats = [
    {
      icon: FiHeart,
      label: 'Favorites',
      value: favorites.length,
      color: '#ff4757'
    },
    {
      icon: FiClock,
      label: 'Watch History',
      value: watchHistory.length,
      color: '#2ed573'
    }
  ];

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
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="user-profile"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="profile-container">
        {/* Profile Header */}
        <motion.section className="profile-header" variants={itemVariants}>
          <div className="profile-avatar">
            <FiUser />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-join-date">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section className="stats-grid" variants={itemVariants}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="stat-card">
                <div 
                  className="stat-icon"
                  style={{ backgroundColor: `${stat.color}20`, borderColor: stat.color }}
                >
                  <Icon style={{ color: stat.color }} />
                </div>
                <div className="stat-info">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </motion.section>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <motion.section className="profile-section" variants={itemVariants}>
            <div className="section-header">
              <FiHeart className="section-icon" />
              <h2>Favorite Movies</h2>
              <span className="section-count">{favorites.length}</span>
            </div>
            <MovieGrid
              movies={favorites}
              onMovieClick={onMovieClick}
              onToggleFavorite={onToggleFavorite}
              favorites={favorites}
              user={user}
              activeView="favorites"
            />
          </motion.section>
        )}

        {/* Watch History Section */}
        {watchHistory.length > 0 && (
          <motion.section className="profile-section" variants={itemVariants}>
            <div className="section-header">
              <FiClock className="section-icon" />
              <h2>Watch History</h2>
              <span className="section-count">{watchHistory.length}</span>
            </div>
            <MovieGrid
              movies={watchHistory}
              onMovieClick={onMovieClick}
              onToggleFavorite={onToggleFavorite}
              favorites={favorites}
              user={user}
              activeView="history"
            />
          </motion.section>
        )}

        {/* Empty States */}
        {favorites.length === 0 && watchHistory.length === 0 && (
          <motion.section className="empty-state" variants={itemVariants}>
            <div className="empty-icon">
              <FiUser />
            </div>
            <h3>Your Profile is Empty</h3>
            <p>Start exploring movies and add them to your favorites!</p>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;