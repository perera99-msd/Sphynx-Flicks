// src/components/LoadingSpinner/LoadingSpinner.jsx - PREMIUM BLUE THEME
import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading amazing content...", subMessage = "Please wait while we prepare your cinematic experience" }) => {
  return (
    <div className="loading-container glass">
      <motion.div 
        className="loading-spinner"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="spinner-ring"></div>
        <div className="spinner-glow"></div>
        <div className="spinner-core"></div>
        <div className="spinner-orbit"></div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="loading-content"
      >
        <motion.p
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>
        
        <motion.p
          className="loading-subtext"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {subMessage}
        </motion.p>
        
        <motion.div 
          className="loading-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="loading-progress-bar"></div>
        </motion.div>
        
        <motion.div 
          className="loading-dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;