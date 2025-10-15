// src/components/Hero/Hero.jsx - PROFESSIONAL REDESIGN (NO TRAILER BUTTON)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { FiInfo, FiStar, FiCalendar, FiPlayCircle } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './Hero.css';

const Hero = ({ movies = [], onMovieClick, isLoading, user }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMoreInfo = (movie, event) => {
    event.stopPropagation();
    onMovieClick(movie);
  };

  const getReleaseYear = (date) => (date ? new Date(date).getFullYear() : '');

  const truncateOverview = (overview, maxLength = 200) => {
    if (!overview) return '';
    if (overview.length <= maxLength) return overview;
    return overview.substring(0, maxLength) + '...';
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
            <div className="spinner-inner"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="loading-text"
          >
            Curating Cinematic Excellence
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="loading-subtext"
          >
            Preparing your premium viewing experience
          </motion.p>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <section className="hero no-movies">
        <div className="no-movies-content">
          <FiPlayCircle size={64} className="no-movies-icon" />
          <h2>Featured Content Coming Soon</h2>
          <p>Stay tuned for our premium movie selections</p>
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
        speed={1800}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
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
                    loading="eager"
                  />
                  <div className="gradient-overlay"></div>
                  <div className="vignette-overlay"></div>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="hero-content"
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 60 }}
                      transition={{ 
                        type: 'spring', 
                        damping: 25, 
                        stiffness: 200,
                        delay: 0.3
                      }}
                    >
                      <div className="hero-text-content">
                        <motion.div
                          className="featured-badge"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <FiPlayCircle />
                          <span>Featured Presentation</span>
                        </motion.div>

                        <motion.h1 
                          className="hero-title"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          {movie.title}
                        </motion.h1>

                        <motion.div
                          className="hero-meta"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <span className="meta-item rating">
                            <FiStar /> {movie.vote_average?.toFixed(1)}
                          </span>
                          <span className="meta-item year">
                            <FiCalendar /> {getReleaseYear(movie.release_date)}
                          </span>
                          <div className="genre-tags">
                            {movie.genre_names?.slice(0, 3).map((genre) => (
                              <span key={genre} className="genre-tag">{genre}</span>
                            ))}
                          </div>
                        </motion.div>

                        <motion.p
                          className="hero-overview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          {truncateOverview(movie.overview)}
                        </motion.p>

                        <motion.div
                          className="hero-actions"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                        >
                          <button
                            className="btn btn-primary"
                            onClick={(e) => handleMoreInfo(movie, e)}
                          >
                            <FiInfo />
                            <span>Explore Movie</span>
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress Indicator */}
      <div className="hero-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${((activeIndex + 1) / movies.length) * 100}%` 
            }}
          ></div>
        </div>
        <div className="progress-text">
          {activeIndex + 1} / {movies.length}
        </div>
      </div>
    </section>
  );
};

export default Hero;