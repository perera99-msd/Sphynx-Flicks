// src/components/MovieCard/MovieCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiStar } from 'react-icons/fi';
import './MovieCard.css';

const MovieCard = ({ movie, onClick, onToggleFavorite, isFavorite, user, getGenreNames }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click event when favoriting
    if (user) {
      onToggleFavorite(movie);
    }
    // Optionally, you could trigger the auth modal if the user is not logged in
    // else { onShowAuthModal(); }
  };

  const handleCardClick = () => {
    onClick(movie);
  };

  const getReleaseYear = (date) => (date ? new Date(date).getFullYear() : 'N/A');

  const movieGenres = getGenreNames(movie);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      className="movie-card"
      onClick={handleCardClick}
      variants={cardVariants}
      layout
    >
      <div className="card-image-wrapper">
        <motion.img
          src={movie.poster_path}
          alt={movie.title}
          className="card-image"
          onError={(e) => {
            e.target.src = 'https://placehold.co/500x750/0f172a/3b82f6?text=Poster+Not+Found';
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        <div className="card-image-overlay" />

        <motion.button
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          disabled={!user}
          title={!user ? 'Login to add favorites' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
        </motion.button>

        {movie.vote_average > 0 && (
          <div className="rating-badge">
            <FiStar fill="currentColor" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        <div className="movie-meta">
          <span className="meta-year">{getReleaseYear(movie.release_date)}</span>
          {movieGenres.length > 0 && (
            <>
              <span className="meta-divider" />
              <span className="meta-genre">{movieGenres[0]}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;