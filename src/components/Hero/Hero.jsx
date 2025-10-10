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
    animate: { 
      transition: { 
        staggerChildren: 0.2, 
        delayChildren: 0.5 
      } 
    },
  };

  const itemVariants = {
    initial: { 
      opacity: 0, 
      y: 60, 
      filter: 'blur(15px)' 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 1.4, 
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 1.2 },
        filter: { duration: 1.4 }
      }
    }
  };

  const posterVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: -15,
      x: 100
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      x: 0,
      transition: { 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3
      }
    }
  };

  const backgroundVariants = {
    initial: { scale: 1.1 },
    animate: { 
      scale: 1,
      transition: { 
        duration: 12,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="hero">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1200}
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
                <motion.div 
                  className="slide-background" 
                  variants={backgroundVariants}
                  initial="initial"
                  animate={isActive ? "animate" : "initial"}
                >
                  <img src={movie.backdrop_path} alt="" className="background-image" />
                </motion.div>
                <div className="slide-overlay"></div>

                {/* Enhanced Poster Art with better animations */}
                <motion.div 
                  className="hero-poster-art"
                  style={{ backgroundImage: `url(${movie.poster_path})` }}
                  variants={posterVariants}
                  initial="initial"
                  animate={isActive ? "animate" : "initial"}
                ></motion.div>

                {isActive && (
                  <motion.div 
                    className="hero-content" 
                    variants={contentVariants} 
                    initial="initial" 
                    animate="animate"
                  >
                    <motion.h1 className="hero-title" variants={itemVariants}>
                      {movie.title}
                    </motion.h1>
                    <motion.div className="hero-meta" variants={itemVariants}>
                      <span className="rating">
                        <FiStar /> {movie.vote_average?.toFixed(1)}
                      </span>
                      <span>
                        <FiCalendar /> {getReleaseYear(movie.release_date)}
                      </span>
                      <span>
                        {movie.genre_names?.slice(0, 2).join(' / ')}
                      </span>
                    </motion.div>
                    <motion.p className="hero-description" variants={itemVariants}>
                      {movie.overview}
                    </motion.p>
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
        {/* Enhanced Custom Controls */}
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