// src/components/MoviePlayer/MoviePlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MoviePlayer.css';

const MoviePlayer = ({ movie, onClose, onRecordWatch }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    const hideControls = () => {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    if (showControls) {
      hideControls();
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        // Record watch when starting to play
        if (onRecordWatch && currentTime === 0) {
          onRecordWatch(movie.id);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    const container = document.querySelector('.movie-player-container');
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }
  };

  return (
    <motion.div
      className="movie-player-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleMouseMove}
      onMouseMove={handleMouseMove}
    >
      <div className="movie-player-container">
        <div className="movie-player-header">
          <h2>{movie.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="video-container">
          {movie.trailer ? (
            <iframe
              ref={videoRef}
              src={`https://www.youtube.com/embed/${movie.trailer.key}?autoplay=1&enablejsapi=1`}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="movie-video"
              onLoad={() => {
                setIsPlaying(true);
                if (onRecordWatch) {
                  onRecordWatch(movie.id);
                }
              }}
            />
          ) : (
            <div className="video-placeholder">
              <div className="placeholder-content">
                <h3>Movie Streaming</h3>
                <p>This is a demo player. In a real application, this would stream the actual movie.</p>
                <div className="demo-controls">
                  <button onClick={handlePlayPause}>
                    {isPlaying ? 'Pause' : 'Play'} Demo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showControls && (
            <motion.div
              className="player-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="progress-bar">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="progress-slider"
                />
                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="control-buttons">
                <button onClick={handlePlayPause}>
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                
                <div className="volume-control">
                  <span>🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>

                <button onClick={handleFullscreen}>
                  ⛶
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MoviePlayer;