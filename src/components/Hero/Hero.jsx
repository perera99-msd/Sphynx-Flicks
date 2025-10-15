// src/components/Hero/Hero.jsx - PREMIUM PROFESSIONAL (REVISED & FIXED)
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

  // Helper function to fetch full movie details
  const fetchMovieDetails = async (movieId) => {
    // This is the API endpoint from your original App.jsx to get detailed movie info
    const response = await fetch(`https://backend.msdperera99.workers.dev/api/movies/${movieId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch movie details');
    }
    return await response.json();
  };

  // CORRECTED: Restored the original, robust trailer handling logic
  const handleWatchTrailer = async (movie, event) => {
    event.stopPropagation();
    
    // First, check if the trailer link is already in the movie object
    if (movie.trailer) {
      window.open(`https://www.youtube.com/watch?v=${movie.trailer.key}`, '_blank');
      if (user) {
        onWatchTrailer(movie.id);
      }
      return;
    }

    // If not, fetch the full details for the movie
    try {
      const detailedMovie = await fetchMovieDetails(movie.id);
      if (detailedMovie && detailedMovie.trailer) {
        window.open(`https://www.youtube.com/watch?v=${detailedMovie.trailer.key}`, '_blank');
        if (user) {
          onWatchTrailer(movie.id);
        }
      } else {
        alert('Trailer not available for this movie.');
      }
    } catch (error) {
      console.error("Error fetching movie details for trailer:", error);
      alert('Could not retrieve trailer information.');
    }
  };

  const handleMoreInfo = (movie, event) => {
    event.stopPropagation();
    onMovieClick(movie);
  };

  const getReleaseYear = (date) => (date ? new Date(date).getFullYear() : '');

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
          <SwiperSlide key={movie.id}>
            {({ isActive }) => (
              <div className="hero-slide">
                <div className="slide-background">
                  <img
                    src={movie.backdrop_path}
                    alt={movie.title}
                    className="background-image"
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
                        <h1 className="hero-title">{movie.title}</h1>
                        <div className="hero-meta">
                          <span className="meta-item rating">
                            <FiStar /> {movie.vote_average?.toFixed(1)}
                          </span>
                          <span className="meta-item">
                            <FiCalendar /> {getReleaseYear(movie.release_date)}
                          </span>
                          {movie.genre_names?.slice(0, 2).map((genre) => (
                            <span key={genre} className="meta-item genre">{genre}</span>
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
            <img src={movie.poster_path} alt={movie.title} />
            <div className="thumbnail-overlay"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;