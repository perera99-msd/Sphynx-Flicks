// src/components/Hero/Hero.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { FiPlay, FiInfo, FiStar, FiCalendar } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Hero.css';

const Hero = ({ movies = [], onMovieClick, isLoading, user, onWatchTrailer }) => {
  // Logic from original Hero.jsx to fetch trailer if needed
  const fetchMovieDetails = async (movieId) => {
    // Using the same API base as your other services
    const response = await fetch(`https://backend.msdperera99.workers.dev/api/movies/${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    return await response.json();
  };

  const handleWatchTrailer = async (movie, event) => {
    event.stopPropagation();
    
    // Helper function to open trailer and record history
    const playTrailer = (trailerKey) => {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
      if (user) {
        onWatchTrailer(movie.id);
      }
    };

    try {
      if (movie.trailer && movie.trailer.key) {
        playTrailer(movie.trailer.key);
      } else {
        // If no trailer in movie data, fetch detailed movie info
        const detailedMovie = await fetchMovieDetails(movie.id);
        if (detailedMovie.trailer && detailedMovie.trailer.key) {
          playTrailer(detailedMovie.trailer.key);
        } else {
          alert('Trailer not available for this movie.');
        }
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      alert('Could not retrieve trailer for this movie.');
    }
  };

  const handleMoreInfo = (movie, event) => {
    event.stopPropagation();
    onMovieClick(movie);
  };

  const getReleaseYear = (date) => (date ? new Date(date).getFullYear() : 'N/A');

  // Framer Motion variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      },
    },
  };

  if (isLoading) {
    return (
      <section className="hero loading-hero" aria-label="Loading featured movies">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Curating the best features for you...</p>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <section className="hero no-movies">
        <div className="no-movies-content">
          <h2>No Featured Movies Available</h2>
          <p>Please check back later for exciting new content.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="hero" aria-label="Featured movies carousel">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1500}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        pagination={{ el: '.hero-pagination', clickable: true }}
        navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
        loop={true}
        className="hero-swiper"
        watchSlidesProgress
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            {({ isActive, isPrev, isNext }) => (
              <div className="hero-slide">
                <div className="slide-background">
                  <motion.img
                    src={movie.backdrop_path}
                    alt={`${movie.title} backdrop`}
                    className="background-image"
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: isActive ? 1.05 : 1.2, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    onError={(e) => { e.target.src = 'https://placehold.co/1280x720/0a0a0f/1e293b?text=Image+Not+Found'; }}
                  />
                  <div className="background-overlay noise-overlay"></div>
                  <div className="gradient-overlay"></div>
                </div>

                <div className="hero-content">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="content-wrapper"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <motion.div className="hero-badges" variants={itemVariants}>
                          <span className="badge rating">
                            <FiStar /> {movie.vote_average?.toFixed(1)}
                          </span>
                          <span className="badge year">
                            <FiCalendar /> {getReleaseYear(movie.release_date)}
                          </span>
                        </motion.div>

                        <motion.h1 className="hero-title" variants={itemVariants}>
                          {movie.title}
                        </motion.h1>

                        <motion.p className="hero-description" variants={itemVariants}>
                          {movie.overview?.length > 180
                            ? `${movie.overview.substring(0, 180)}...`
                            : movie.overview}
                        </motion.p>
                        
                        <motion.div className="hero-meta" variants={itemVariants}>
                          {movie.genre_names?.slice(0, 3).map((genre) => (
                            <span key={genre} className="genre-tag">{genre}</span>
                          ))}
                        </motion.div>

                        <motion.div className="hero-actions" variants={itemVariants}>
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

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div
                  className="hero-poster"
                  initial={{ opacity: 0, x: 100, rotateY: 30 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0, 
                    x: isActive ? 0 : (isPrev ? -100 : 100), 
                    rotateY: isActive ? -15 : (isPrev ? -45 : 45)
                  }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img
                    src={movie.poster_path}
                    alt={`${movie.title} poster`}
                    className="poster-image"
                    onError={(e) => { e.target.src = 'https://placehold.co/500x750/0a0a0f/1e293b?text=Poster'; }}
                  />
                  <div className="poster-glow"></div>
                </motion.div>
              </div>
            )}
          </SwiperSlide>
        ))}

        <div className="hero-controls">
          <div className="hero-pagination"></div>
          <div className="hero-navigation">
            <button className="swiper-button-prev" aria-label="Previous slide"></button>
            <button className="swiper-button-next" aria-label="Next slide"></button>
          </div>
        </div>
      </Swiper>
    </section>
  );
};

export default Hero;