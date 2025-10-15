// src/components/Hero/Hero.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { FiPlay, FiInfo, FiStar, FiCalendar, FiVolume2, FiVolumeX } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Hero.css';

const Hero = ({ movies = [], onMovieClick, isLoading, user, onWatchTrailer }) => {
  const [muted, setMuted] = useState(true);
  const [currentTrailer, setCurrentTrailer] = useState(null);

  const handleWatchTrailer = async (movie, event) => {
    event.stopPropagation();
    
    if (!movie.trailer) {
      // If no trailer in movie data, try to fetch detailed movie info
      try {
        const detailedMovie = await fetchMovieDetails(movie.id);
        if (detailedMovie.trailer) {
          window.open(`https://www.youtube.com/watch?v=${detailedMovie.trailer.key}`, '_blank');
          if (user) {
            onWatchTrailer(movie.id);
          }
        } else {
          alert('Trailer not available for this movie');
        }
      } catch (error) {
        alert('Trailer not available for this movie');
      }
    } else {
      window.open(`https://www.youtube.com/watch?v=${movie.trailer.key}`, '_blank');
      if (user) {
        onWatchTrailer(movie.id);
      }
    }
  };

  const fetchMovieDetails = async (movieId) => {
    const response = await fetch(`https://backend.msdperera99.workers.dev/api/movies/${movieId}`);
    return await response.json();
  };

  const handleMoreInfo = (movie, event) => {
    event.stopPropagation();
    onMovieClick(movie);
  };

  const getReleaseYear = (date) => date ? new Date(date).getFullYear() : '';

  const toggleMute = () => {
    setMuted(!muted);
  };

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
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1200}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        pagination={{ 
          el: '.hero-pagination', 
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}">
              <span class="pagination-progress"></span>
            </span>`;
          }
        }}
        navigation={{ 
          nextEl: '.swiper-button-next', 
          prevEl: '.swiper-button-prev' 
        }}
        loop={true}
        className="hero-swiper"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id || index}>
            {({ isActive }) => (
              <div className="hero-slide">
                {/* Background with overlay */}
                <div className="slide-background">
                  <img 
                    src={movie.backdrop_path} 
                    alt={movie.title}
                    className="background-image"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=1280&h=720&fit=crop';
                    }}
                  />
                  <div className="background-overlay"></div>
                  <div className="gradient-overlay"></div>
                </div>

                {/* Content */}
                <div className="hero-content">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="content-wrapper"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        {/* Badges */}
                        <div className="hero-badges">
                          <span className="badge premium">PREMIUM</span>
                          <span className="badge rating">
                            <FiStar /> {movie.vote_average?.toFixed(1)}
                          </span>
                          <span className="badge year">
                            <FiCalendar /> {getReleaseYear(movie.release_date)}
                          </span>
                        </div>

                        {/* Title */}
                        <motion.h1 
                          className="hero-title"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        >
                          {movie.title}
                        </motion.h1>

                        {/* Overview */}
                        <motion.p 
                          className="hero-description"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.7 }}
                        >
                          {movie.overview?.length > 200 
                            ? `${movie.overview.substring(0, 200)}...` 
                            : movie.overview
                          }
                        </motion.p>

                        {/* Actions */}
                        <motion.div 
                          className="hero-actions"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.9 }}
                        >
                          <button 
                            className="btn btn-primary"
                            onClick={(e) => handleWatchTrailer(movie, e)}
                          >
                            <FiPlay className="btn-icon" />
                            <span>Watch Trailer</span>
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={(e) => handleMoreInfo(movie, e)}
                          >
                            <FiInfo className="btn-icon" />
                            <span>More Info</span>
                          </button>
                        </motion.div>

                        {/* Additional Info */}
                        <motion.div 
                          className="hero-meta"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 1.1 }}
                        >
                          {movie.genre_names?.slice(0, 3).map((genre, idx) => (
                            <span key={idx} className="genre-tag">{genre}</span>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Poster */}
                <motion.div 
                  className="hero-poster"
                  initial={{ opacity: 0, x: 100, rotateY: 15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title}
                    className="poster-image"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1489599809505-7c8e1c8bfd39?w=500&h=750&fit=crop';
                    }}
                  />
                  <div className="poster-glow"></div>
                </motion.div>
              </div>
            )}
          </SwiperSlide>
        ))}

        {/* Controls */}
        <div className="hero-controls">
          <div className="hero-pagination"></div>
          
          <div className="control-buttons">
            <button className="control-btn mute-btn" onClick={toggleMute}>
              {muted ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            <div className="hero-navigation">
              <button className="swiper-button-prev"></button>
              <button className="swiper-button-next"></button>
            </div>
          </div>
        </div>
      </Swiper>
    </section>
  );
};

export default Hero;