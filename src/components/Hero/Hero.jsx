// src/components/Hero/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { FiPlay, FiInfo, FiStar, FiCalendar } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Hero.css';

const Hero = ({ movies = [], onMovieClick, isLoading, user, onWatchTrailer }) => {
  const handleWatchTrailer = (movie, event) => {
    event.stopPropagation();
    if (user) {
      onWatchTrailer(movie.id);
      alert(`Playing trailer for "${movie.title}"`);
    } else {
      alert('Please login to watch trailers and track your watch history');
    }
  };

  const handleMoreInfo = (movie, event) => {
    event.stopPropagation();
    onMovieClick(movie);
  };

  const getReleaseYear = (date) => date ? new Date(date).getFullYear() : '';

  if (isLoading) {
    return <section className="hero loading-hero" aria-label="Loading..."></section>;
  }
  
  const contentVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 40, filter: 'blur(10px)' },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="hero">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        pagination={{ el: '.hero-pagination', clickable: true }}
        navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
        loop={true}
        className="hero-swiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            {({ isActive }) => (
              <div className="hero-slide">
                <motion.div className="slide-background" animate={{ scale: isActive ? 1.05 : 1 }} transition={{ duration: 10 }}>
                  <img src={movie.backdrop_path} alt="" className="background-image" />
                </motion.div>
                <div className="slide-overlay"></div>

                {/* Layered Poster Art for depth */}
                <motion.div 
                  className="hero-poster-art"
                  style={{ backgroundImage: `url(${movie.poster_path})` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                ></motion.div>

                {isActive && (
                  <motion.div className="hero-content" variants={contentVariants} initial="initial" animate="animate">
                    <motion.h1 className="hero-title" variants={itemVariants}>{movie.title}</motion.h1>
                    <motion.div className="hero-meta" variants={itemVariants}>
                      <span className="rating"><FiStar /> {movie.vote_average?.toFixed(1)}</span>
                      <span><FiCalendar /> {getReleaseYear(movie.release_date)}</span>
                      <span>{movie.genre_names?.slice(0, 2).join(' / ')}</span>
                    </motion.div>
                    <motion.p className="hero-description" variants={itemVariants}>{movie.overview}</motion.p>
                    <motion.div className="hero-actions" variants={itemVariants}>
                      <button className="btn btn-primary" onClick={(e) => handleWatchTrailer(movie, e)}>
                        <FiPlay className="btn-icon" /><span>Play Trailer</span>
                      </button>
                      <button className="btn btn-secondary" onClick={(e) => handleMoreInfo(movie, e)}>
                        <FiInfo className="btn-icon" /><span>Details</span>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
        {/* Custom Controls */}
        <div className="hero-controls">
          <div className="hero-pagination"></div>
          <div className="hero-navigation">
            <button className="swiper-button-prev"></button>
            <button className="swiper-button-next"></button>
          </div>
        </div>
      </Swiper>
    </section>
  );
};

export default Hero;