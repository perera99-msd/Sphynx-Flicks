// src/components/Hero/Hero.jsx - PREMIUM PROFESSIONAL (REVISED)
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

  const handleWatchTrailer = (movie, event) => {
    event.stopPropagation();
    // FIX: Delegate the trailer action to the parent component (App.jsx),
    // which has the central logic for playing trailers. This now matches
    // the working logic from MovieModal.
    if (onWatchTrailer) {
      onWatchTrailer(movie);
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
            <div className="spinner-inner"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="loading-text"
          >
            Loading amazing content...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="loading-subtext"
          >
            Preparing your cinematic experience
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
