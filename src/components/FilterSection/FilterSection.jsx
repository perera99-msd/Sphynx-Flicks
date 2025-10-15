// src/components/FilterSection/FilterSection.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiSliders,
  FiCheck,
  FiStar,
  FiCalendar,
  FiTag
} from 'react-icons/fi';
import './FilterSection.css';

const FilterSection = ({ filters, onFilterChange, onClearFilters, genres }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  
  const ratingOptions = [
    { value: '', label: 'Any Rating', icon: FiStar },
    { value: '9', label: '9+ Excellent', color: '#10b981' },
    { value: '8', label: '8+ Great', color: '#3b82f6' },
    { value: '7', label: '7+ Good', color: '#8b5cf6' },
    { value: '6', label: '6+ Average', color: '#f59e0b' },
    { value: '5', label: '5+ Fair', color: '#ef4444' }
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

  return (
    <motion.section 
      className="filter-section"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="filter-container">
        {/* Header with Expand/Collapse */}
        <motion.div 
          className="filter-header"
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
              <motion.div 
                className="active-filters-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {getActiveFilterCount()} active
              </motion.div>
            )}
            
            <button 
              className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <FiChevronDown />
            </button>
          </div>
        </motion.div>

        {/* Filter Controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="filter-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="filter-grid">
                {/* Genre Filter */}
                <motion.div 
                  className="filter-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="filter-label">
                    <FiTag className="label-icon" />
                    <span>Genre</span>
                  </div>
                  <div className="genre-grid">
                    <button
                      className={`genre-option ${!filters.genre ? 'active' : ''}`}
                      onClick={() => handleFilterChange('genre', '')}
                    >
                      <FiCheck className="check-icon" />
                      All Genres
                    </button>
                    {genres.map(genre => (
                      <button
                        key={genre.id}
                        className={`genre-option ${filters.genre === genre.id.toString() ? 'active' : ''}`}
                        onClick={() => handleFilterChange('genre', genre.id.toString())}
                      >
                        <FiCheck className="check-icon" />
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Year Filter */}
                <motion.div 
                  className="filter-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="filter-label">
                    <FiCalendar className="label-icon" />
                    <span>Release Year</span>
                  </div>
                  <div className="year-selector">
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
                    <FiChevronDown className="select-arrow" />
                  </div>
                </motion.div>

                {/* Rating Filter */}
                <motion.div 
                  className="filter-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="filter-label">
                    <FiStar className="label-icon" />
                    <span>Minimum Rating</span>
                  </div>
                  <div className="rating-options">
                    {ratingOptions.map((option, index) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          className={`rating-option ${filters.rating === option.value ? 'active' : ''}`}
                          onClick={() => handleFilterChange('rating', option.value)}
                          style={{ '--rating-color': option.color }}
                        >
                          <IconComponent className="rating-icon" />
                          <span>{option.label}</span>
                          {filters.rating === option.value && (
                            <motion.div 
                              className="active-indicator"
                              layoutId="activeRating"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="filter-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {hasActiveFilters && (
                  <button className="clear-filters-btn" onClick={handleClearFilters}>
                    <FiX />
                    Clear All Filters
                  </button>
                )}
                
                <motion.button 
                  className="apply-filters-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(false)}
                >
                  <FiFilter />
                  Apply Filters
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <motion.div 
            className="active-filters-bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="active-filters-label">
              <span>Active Filters:</span>
            </div>
            <div className="active-filters-list">
              {filters.genre && (
                <motion.span 
                  className="active-filter-tag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {genres.find(g => g.id.toString() === filters.genre)?.name}
                  <button onClick={() => handleFilterChange('genre', '')}>×</button>
                </motion.span>
              )}
              
              {filters.year && (
                <motion.span 
                  className="active-filter-tag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                >
                  {filters.year}
                  <button onClick={() => handleFilterChange('year', '')}>×</button>
                </motion.span>
              )}
              
              {filters.rating && (
                <motion.span 
                  className="active-filter-tag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 }}
                >
                  {ratingOptions.find(r => r.value === filters.rating)?.label}
                  <button onClick={() => handleFilterChange('rating', '')}>×</button>
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default FilterSection;