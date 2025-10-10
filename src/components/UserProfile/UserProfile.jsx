// src/components/UserProfile/UserProfile.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FavoritesService } from '../../services/favoritesService';
import './UserProfile.css';

const UserProfile = ({ onMovieClick }) => {
  const { user, favorites, watchHistory, updateFavorites } = useAuth();

  const handleToggleFavorite = async (movie) => {
    try {
      await FavoritesService.toggleFavorite(movie);
      // Refresh favorites list
      const updatedFavorites = await FavoritesService.getFavorites();
      updateFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="user-profile">
      {/* ... rest of your component ... */}
    </div>
  );
};

export default UserProfile;