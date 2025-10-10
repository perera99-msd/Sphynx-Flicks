// src/components/MovieCard/MovieCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FavoritesService } from '../../services/favoritesService';
import './MovieCard.css';

const MovieCard = ({ movie, onMovieClick }) => {
  const { user, favorites, updateFavorites } = useAuth();
  const isFavorite = favorites.some(fav => fav.id === movie.id);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please log in to add favorites');
      return;
    }
    
    try {
      const result = await FavoritesService.toggleFavorite(movie);
      updateFavorites(result.favorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error.message);
    }
  };

  return (
    <motion.div
      className="movie-card"
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
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
          <span>★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
        </div>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ♥
        </button>
      </div>
    </motion.div>
  );
};

export default MovieCard;