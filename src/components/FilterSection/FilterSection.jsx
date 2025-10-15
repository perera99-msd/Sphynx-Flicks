// src/components/FilterSection/FilterSection.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFilter, 
  FiX, 
  FiChevronDown,
  FiCheck,
  FiStar,
  FiCalendar,
  FiTag
} from 'react-icons/fi';
import './FilterSection.css';

const FilterSection = ({ filters, onFilterChange, onClearFilters, genres }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
  
  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '9', label: '9+ Excellent' },
    { value: '8', label: '8+ Great' },
    { value: '7', label: '7+ Good' },
    { value: '6', label: '6+ Average' }
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
    <section className="filter-section">
      <div className="filter-container">
        {/* Header */}
        <div className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="header-content">
            <h3>Filters</h3>
            <p>Refine your results</p>
          </div>
          
          <div className="header-right">
            {hasActiveFilters && (
              <span className="active-filters-badge">
                {getActiveFilterCount()} active
              </span>
            )}
            
            <button className={`expand-btn ${isExpanded ? 'expanded' : ''}`}>
              <FiChevronDown />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="filter-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filter-grid">
                {/* Genre Filter */}
                <div className="filter-group">
                  <label className="filter-label">
                    <FiTag />
                    Genre
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
                  </div>
                </div>

                {/* Year Filter */}
                <div className="filter-group">
                  <label className="filter-label">
                    <FiCalendar />
                    Release Year
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
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="filter-group">
                  <label className="filter-label">
                    <FiStar />
                    Minimum Rating
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
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="filter-actions">
                {hasActiveFilters && (
                  <button className="clear-filters-btn" onClick={handleClearFilters}>
                    <FiX />
                    Clear Filters
                  </button>
                )}
                
                <button className="apply-filters-btn" onClick={() => setIsExpanded(false)}>
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="active-filters-bar">
            <span className="active-filters-label">Active:</span>
            <div className="active-filters-list">
              {filters.genre && (
                <span className="active-filter-tag">
                  {genres.find(g => g.id.toString() === filters.genre)?.name}
                  <button onClick={() => handleFilterChange('genre', '')}>×</button>
                </span>
              )}
              
              {filters.year && (
                <span className="active-filter-tag">
                  {filters.year}
                  <button onClick={() => handleFilterChange('year', '')}>×</button>
                </span>
              )}
              
              {filters.rating && (
                <span className="active-filter-tag">
                  {ratingOptions.find(r => r.value === filters.rating)?.label}
                  <button onClick={() => handleFilterChange('rating', '')}>×</button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterSection;