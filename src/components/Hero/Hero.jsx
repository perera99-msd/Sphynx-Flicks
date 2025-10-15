// src/components/Hero/Hero.jsx - FIXED VERSION
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { FiPlay, FiInfo, FiStar, FiCalendar } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './Hero.css';

const Hero = ({ movies = [], onMovieClick, isLoading, user, onWatchTrailer }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // CORRECTED: Safe trailer handling
  const handleWatchTrailer = async (movie, event) => {
    event.stopPropagation();
    
    try {
      if (movie.trailer && movie.trailer.key) {
        window.open(`https://www.youtube.com/watch?v=${movie.trailer.key}`, '_blank');
        if (user) {
          onWatchTrailer(movie.id);
        }
      } else {
        // Try to use the onWatchTrailer prop which should handle trailer fetching
        if (onWatchTrailer) {
          onWatchTrailer(movie);
        } else {
          alert('Trailer not available for this movie.');
        }
      }
    } catch (error) {
      console.error("Error playing trailer:", error);
      alert('Could not play trailer. Please try again.');
    }
  };

  const handleMoreInfo = (movie, event) => {
    event.stopPropagation();
    onMovieClick(movie);
  };

  // CORRECTED: Safe year extraction
  const getReleaseYear = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).getFullYear();
    } catch {
      return 'N/A';
    }
  };

  // CORRECTED: Safe genre extraction
  const getGenres = (movie) => {
    if (movie.genre_names && movie.genre_names.length > 0) {
      return movie.genre_names.slice(0, 2);
    }
    if (movie.genres && movie.genres.length > 0) {
      return movie.genres.slice(0, 2).map(g => g.name || g);
    }
    return [];
  };

  // CORRECTED: Safe image URL handling
  const getBackdropImage = (movie) => {
    if (movie.backdrop_path) {
      // Check if it's already a full URL or needs prefix
      if (movie.backdrop_path.startsWith('http')) {
        return movie.backdrop_path;
      }
      return `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
    }
    // Fallback image or empty
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMEEwQTBGIi8+CjxwYXRoIGQ9Ik02NDAgMzYwTDUyMCA1NDBINzYwTDY0MCAzNjBaIiBmaWxsPSIjM0I4MkY2IiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4K';
  };

  const getPosterImage = (movie) => {
    if (movie.poster_path) {
      if (movie.poster_path.startsWith('http')) {
        return movie.poster_path;
      }
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
    return getBackdropImage(movie); // Fallback to backdrop if no poster
  };

  if (isLoading) {
    return (
      <section className="hero loading-hero" aria-label="Loading...">
        <div className="loading-container">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="spinner-ring"></div>
            <div className="spinner-glow"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="loading-text"
          >
            Loading featured movies...
          </motion.p>
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <section className="hero no-movies">
        <div className="no-movies-content">
          <h2>No Featured Movies</h2>
          <p>Check back later for new releases</p>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <Swiper
        modules={[Autoplay, EffectFade]}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1500}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        loop={true}
        className="hero-swiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="hero-slide">
            {({ isActive }) => (
              <div className="hero-slide">
                <div className="slide-background">
                  <img
                    src={getBackdropImage(movie)}
                    alt={movie.title || 'Movie backdrop'}
                    className="background-image"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="gradient-overlay"></div>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="hero-details-container"
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 100 }}
                      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                    >
                      <div className="details-content">
                        <h1 className="hero-title">{movie.title || 'Untitled Movie'}</h1>
                        <div className="hero-meta">
                          <span className="meta-item rating">
                            <FiStar /> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                          </span>
                          <span className="meta-item">
                            <FiCalendar /> {getReleaseYear(movie.release_date)}
                          </span>
                          {getGenres(movie).map((genre, index) => (
                            <span key={index} className="meta-item genre">{genre}</span>
                          ))}
                        </div>
                      </div>
                      <div className="details-actions">
                        <button
                          className="btn btn-primary"
                          onClick={(e) => handleWatchTrailer(movie, e)}
                        >
                          <FiPlay />
                          <span>Watch Trailer</span>
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={(e) => handleMoreInfo(movie, e)}
                        >
                          <FiInfo />
                          <span>More Info</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero-thumbnails">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`thumbnail-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => swiperInstance?.slideToLoop(index)}
          >
            <img 
              src={getPosterImage(movie)} 
              alt={movie.title || 'Movie poster'} 
              onError={(e) => {
                // Hide broken images
                e.target.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;