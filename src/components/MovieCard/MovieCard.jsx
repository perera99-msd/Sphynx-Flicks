// src/components/MovieCard/MovieCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiEye, FiHeart } from 'react-icons/fi';
import './MovieCard.css';

const MovieCard = ({ movie, onClick, onToggleFavorite, isFavorite, user, genres = [], getGenreNames }) => {
  const [hasImageError, setHasImageError] = useState(false);

  const placeholderImage = 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=500&h=750&fit=crop';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (user) {
      onToggleFavorite(movie);
    }
  };

  const handleCardClick = () => {
    onClick(movie);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  // Fixed getMovieGenres function
  const getMovieGenres = () => {
    // First priority: Use provided getGenreNames function
    if (getGenreNames) {
      const result = getGenreNames(movie);
      if (result && result.length > 0) return result;
    }
    
    // Second priority: Check if genre_names is already available
    if (movie.genre_names && movie.genre_names.length > 0) {
      return movie.genre_names;
    }
    
    // Third priority: Check if genres array with names is available
    if (movie.genres && movie.genres.length > 0) {
      return movie.genres.map(g => g.name || g);
    }
    
    // Fourth priority: Use genre_ids with genres prop
    if (movie.genre_ids && movie.genre_ids.length > 0 && genres && genres.length > 0) {
      const genreNames = movie.genre_ids.map(genreId => {
        const genre = genres.find(g => g.id === genreId);
        return genre ? genre.name : 'Unknown';
      }).filter(name => name !== 'Unknown');
      
      if (genreNames.length > 0) return genreNames;
    }
    
    // Fallback: Return some default based on movie data
    if (movie.vote_average >= 7.5) {
      return ['Popular'];
    } else if (movie.release_date && new Date(movie.release_date).getFullYear() >= 2020) {
      return ['New Release'];
    } else {
      return ['Movie'];
    }
  };
  
  const posterPath = hasImageError ? placeholderImage : (movie.poster_path || placeholderImage);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const movieGenres = getMovieGenres();

  return (
    <motion.article
      className="movie-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyPress}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      layout
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.title}. Rating: ${rating}. Release year: ${releaseYear}. ${movieGenres.length > 0 ? `Genres: ${movieGenres.join(', ')}` : ''}`}
    >
      <div className="card-image-container">
        <motion.img
          src={posterPath}
          alt={`Poster for ${movie.title}`}
          className="card-image"
          onError={() => setHasImageError(true)}
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        <div className="card-overlay">
          <motion.button 
            className="view-details-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <FiEye /> View Details
          </motion.button>
        </div>

        <motion.button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          disabled={!user}
          whileHover={{ scale: user ? 1.1 : 1 }}
          whileTap={{ scale: user ? 0.9 : 1 }}
          aria-label={isFavorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          title={!user ? 'Login to add favorites' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
        </motion.button>

        {!user && (
          <div className="login-tooltip">
            Login to add favorites
          </div>
        )}
        
        <div className="rating-badge">
          <FiStar fill="currentColor" stroke="none" />
          <span>{rating}</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{releaseYear}</p>
        
        {movieGenres.length > 0 && (
          <div className="movie-genres">
            {movieGenres.slice(0, 2).map((genre, index) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
            {movieGenres.length > 2 && (
              <span className="genre-tag">+{movieGenres.length - 2} more</span>
            )}
          </div>
        )}
      </div>

      <div className="card-glow"></div>
    </motion.article>
  );
};

export default MovieCard;