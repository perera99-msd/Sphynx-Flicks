// src/components/StreamingLinks/StreamingLinks.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiInfo } from 'react-icons/fi';
import { MovieService } from '../../services/movieService';
import './StreamingLinks.css';

const StreamingLinks = ({ movieId, movieTitle }) => {
  const [streamingData, setStreamingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreamingData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await MovieService.getStreamingProviders(movieId);
        setStreamingData(data);
      } catch (err) {
        setError('Failed to load streaming information');
        console.error('Error fetching streaming data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchStreamingData();
    }
  }, [movieId]);

  const ProviderSection = ({ title, providers, type }) => {
    if (!providers || providers.length === 0) return null;

    return (
      <div className="provider-section">
        <h4 className="provider-section-title">{title}</h4>
        <div className="providers-grid">
          {providers.map(provider => (
            <motion.a
              key={provider.provider_id}
              href={`https://www.themoviedb.org/movie/${movieId}/watch?locale=US`}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                alt={provider.provider_name}
                className="provider-logo"
                onError={(e) => {
                  e.target.src = '/api/placeholder/200/200?text=Stream';
                }}
              />
              <span className="provider-name">{provider.provider_name}</span>
              <FiExternalLink className="external-icon" />
            </motion.a>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="streaming-links-loading">
        <div className="loading-spinner"></div>
        <p>Checking availability...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="streaming-links-error">
        <FiInfo />
        <p>{error}</p>
      </div>
    );
  }

  if (!streamingData) {
    return (
      <div className="streaming-links-unavailable">
        <FiInfo />
        <p>Streaming information not available for this movie.</p>
      </div>
    );
  }

  const hasAnyProviders = 
    streamingData.flatrate.length > 0 ||
    streamingData.free.length > 0 ||
    streamingData.rent.length > 0 ||
    streamingData.buy.length > 0;

  if (!hasAnyProviders) {
    return (
      <div className="streaming-links-unavailable">
        <FiInfo />
        <p>This movie is not currently available on major streaming platforms.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="streaming-links-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="streaming-title">Where to Watch</h3>
      
      <ProviderSection 
        title="🎬 Stream with Subscription" 
        providers={streamingData.flatrate} 
        type="subscription"
      />
      
      <ProviderSection 
        title="🆓 Free with Ads" 
        providers={streamingData.free} 
        type="free"
      />
      
      <ProviderSection 
        title="💵 Rent" 
        providers={streamingData.rent} 
        type="rent"
      />
      
      <ProviderSection 
        title="🛒 Buy" 
        providers={streamingData.buy} 
        type="buy"
      />

      <div className="streaming-disclaimer">
        <FiInfo />
        <p>Links redirect to official platforms. Availability may vary by region.</p>
      </div>
    </motion.div>
  );
};

export default StreamingLinks;