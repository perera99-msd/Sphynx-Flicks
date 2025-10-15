// src/components/FilterSection/FilterSection.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFilter, 
  FiX, 
  FiChevronDown,
  FiStar,
  FiCalendar,
  FiTag,
  FiSliders
} from 'react-icons/fi';
import './FilterSection.css';

const FilterSection = ({ filters, onFilterChange, onClearFilters, genres }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  const ratingOptions = [
    { value: '', label: 'Any Rating', color: '#94a3b8' },
    { value: '9', label: '9+ Excellent', color: '#10b981' },
    { value: '8', label: '8+ Great', color: '#3b82f6' },
    { value: '7', label: '7+ Good', color: '#8b5cf6' },
    { value: '6', label: '6+ Average', color: '#f59e0b' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const handleClearFilters = () => {
    onClearFilters();
    setIsExpanded(false);
  };

  const getFilterDisplayValue = (key, value) => {
    if (!value) return '';
    
    switch (key) {
      case 'genre':
        return genres.find(g => g.id.toString() === value)?.name;
      case 'rating':
        return ratingOptions.find(r => r.value === value)?.label;
      case 'year':
        return value;
      default:
        return value;
    }
  };

  return (
    <section className="filter-section">
      <div className="filter-container">
        {/* Premium Header */}
        <motion.div 
          className="filter-header"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="header-left">
            <div className="header-icon">
              <FiSliders />
            </div>
            <div className="header-content">
              <h3>Advanced Filters</h3>
              <p>Refine your movie discovery</p>
            </div>
          </div>
          
          <div className="header-right">
            {hasActiveFilters && (
              <motion.span 
                className="active-filters-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {getActiveFilterCount()} active
              </motion.span>
            )}
            
            <motion.button 
              className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronDown />
            </motion.button>
          </div>
        </motion.div>

        {/* Premium Filter Controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="filter-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="filter-grid">
                {/* Genre Filter */}
                <motion.div 
                  className="filter-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="filter-label">
                    <div className="filter-icon">
                      <FiTag />
                    </div>
                    <span>Genre</span>
                    {filters.genre && (
                      <span className="filter-indicator"></span>
                    )}
                  </label>
                  <div className="filter-select-wrapper">
                    <select 
                      value={filters.genre} 
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Genres</option>
                      {genres.map(genre => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">
                      <FiChevronDown />
                    </div>
                  </div>
                </motion.div>

                {/* Year Filter */}
                <motion.div 
                  className="filter-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="filter-label">
                    <div className="filter-icon">
                      <FiCalendar />
                    </div>
                    <span>Release Year</span>
                    {filters.year && (
                      <span className="filter-indicator"></span>
                    )}
                  </label>
                  <div className="filter-select-wrapper">
                    <select 
                      value={filters.year} 
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Years</option>
                      {years.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">
                      <FiChevronDown />
                    </div>
                  </div>
                </motion.div>

                {/* Rating Filter */}
                <motion.div 
                  className="filter-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="filter-label">
                    <div className="filter-icon">
                      <FiStar />
                    </div>
                    <span>Minimum Rating</span>
                    {filters.rating && (
                      <span className="filter-indicator"></span>
                    )}
                  </label>
                  <div className="filter-select-wrapper">
                    <select 
                      value={filters.rating} 
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="filter-select"
                    >
                      {ratingOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">
                      <FiChevronDown />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Premium Action Buttons */}
              <motion.div 
                className="filter-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {hasActiveFilters && (
                  <motion.button 
                    className="clear-filters-btn"
                    onClick={handleClearFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiX />
                    Clear All Filters
                  </motion.button>
                )}
                
                <motion.button 
                  className="apply-filters-btn"
                  onClick={() => setIsExpanded(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Filters
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Active Filters Bar */}
        {hasActiveFilters && (
          <motion.div 
            className="active-filters-bar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="active-filters-header">
              <span className="active-filters-label">Active Filters</span>
              <button 
                className="clear-all-btn"
                onClick={handleClearFilters}
              >
                Clear All
              </button>
            </div>
            <div className="active-filters-list">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                
                return (
                  <motion.span 
                    key={key}
                    className="active-filter-tag"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <span className="filter-tag-content">
                      {getFilterDisplayValue(key, value)}
                    </span>
                    <button 
                      onClick={() => handleFilterChange(key, '')}
                      className="remove-filter-btn"
                    >
                      <FiX />
                    </button>
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FilterSection;