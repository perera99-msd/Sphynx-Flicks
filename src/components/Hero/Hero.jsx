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
    // The existing logic for trailer fetching remains the same
    if (movie.trailer) {
      window.open(`https://www.youtube.com/watch?v=${movie.trailer.key}`, '_blank');
      if (user) onWatchTrailer(movie.id);
    } else {
      alert('Trailer not available for this movie');
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
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading featured movies...</p>
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