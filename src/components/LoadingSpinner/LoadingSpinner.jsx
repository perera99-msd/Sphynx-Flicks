// src/components/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

const spinnerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const pathVariants = {
  start: {
    pathLength: 0,
    opacity: 0,
  },
  end: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0.5,
    },
  },
};

const textVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

const LoadingSpinner = ({ text = 'Loading amazing content...' }) => {
  return (
    <div className="loading-container" aria-label={text}>
      <motion.svg
        className="loading-svg"
        width="80"
        height="80"
        viewBox="0 0 50 50"
        initial="start"
        animate="end"
        variants={spinnerVariants}
      >
        <motion.path
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          stroke="#3b82f6"
          variants={pathVariants}
          d="M5,25 a20,20 0 1,1 40,0 a20,20 0 1,1 -40,0"
        />
        <motion.path
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          stroke="#93c5fd"
          variants={pathVariants}
          d="M15,25 a10,10 0 1,1 20,0 a10,10 0 1,1 -20,0"
        />
         <motion.path
          fill="#3b82f6"
          strokeWidth="1"
          strokeLinecap="round"
          stroke="#3b82f6"
          variants={{
            start: { scale: 0, opacity: 0 },
            end: { 
              scale: 1, 
              opacity: 1,
              transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeOut'
              }
            }
          }}
          d="M25,25 m-3,0 a3,3 0 1,1 6,0 a3,3 0 1,1 -6,0"
        />
      </motion.svg>
      <motion.p
        className="loading-text"
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        {text}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
