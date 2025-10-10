// src/components/Hero/Hero.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiInfo, FiStar, FiCalendar } from 'react-icons/fi';
import './Hero.css';

const Hero = ({ movies, onMovieClick, isLoading, user }) => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (movies.length === 0 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentMovieIndex((prevIndex) => 
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length, isAutoPlaying]);

  if (isLoading || movies.length === 0) {
    return (
      <section className="hero-section loading">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-skeleton">
            <div className="skeleton-poster"></div>
            <div className="skeleton-info">
              <div className="skeleton-title"></div>
              <div className="skeleton-meta"></div>
              <div className="skeleton-overview"></div>
              <div className="skeleton-buttons">
                <div className="skeleton-button"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentMovie = movies[currentMovieIndex];

  const handleMovieClickWithPause = () => {
    setIsAutoPlaying(false);
    onMovieClick(currentMovie);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentMovieIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getReleaseYear = (date) => {
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const truncateOverview = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <section className="hero-section">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          className="hero-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div 
            className="background-image"
            style={{
              backgroundImage: `linear-gradient(
                to right,
                rgba(10, 10, 10, 0.9) 0%,
                rgba(10, 10, 10, 0.7) 30%,
                rgba(10, 10, 10, 0.4) 50%,
                rgba(10, 10, 10, 0.9) 100%
              ), url(${currentMovie.backdrop_path || currentMovie.poster_path})`
            }}
          />
          <div className="background-overlay"></div>
        </motion.div>
      </AnimatePresence>

      <div className="hero-content">
        <div className="container">
          <div className="hero-grid">
            <motion.div 
              className="hero-poster"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src={currentMovie.poster_path} 
                alt={currentMovie.title}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=400&h=600&fit=crop';
                }}
              />
            </motion.div>

            <motion.div 
              className="hero-info"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {currentMovie.title}
              </motion.h1>

              <motion.div 
                className="hero-meta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="meta-item">
                  <FiStar className="meta-icon" />
                  <span>{currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <div className="meta-item">
                  <FiCalendar className="meta-icon" />
                  <span>{getReleaseYear(currentMovie.release_date)}</span>
                </div>
                {currentMovie.genre_names && currentMovie.genre_names.length > 0 && (
                  <div className="genres">
                    {currentMovie.genre_names.slice(0, 3).map((genre, index) => (
                      <span key={index} className="genre-tag">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.p 
                className="hero-overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                {truncateOverview(currentMovie.overview)}
              </motion.p>

              <motion.div 
                className="hero-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <button 
                  className="play-btn"
                  onClick={handleMovieClickWithPause}
                >
                  <FiPlay />
                  <span>Watch Trailer</span>
                </button>
                <button 
                  className="info-btn"
                  onClick={handleMovieClickWithPause}
                >
                  <FiInfo />
                  <span>More Info</span>
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Navigation Dots */}
          {movies.length > 1 && (
            <motion.div 
              className="hero-navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              {movies.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentMovieIndex ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to movie ${index + 1}`}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;