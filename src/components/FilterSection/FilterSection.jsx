// src/components/FilterSection/FilterSection.jsx - SIMPLE & CLEAN
import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiFilter } from 'react-icons/fi';
import './FilterSection.css';

const FilterSection = ({ filters, onFilterChange, onClearFilters, genres }) => {
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
      <div className="filter-header">
        <div className="filter-title">
          <FiFilter className="filter-icon" />
          <span>Filters</span>
        </div>
        
        {hasActiveFilters && (
          <motion.button
            className="clear-btn"
            onClick={onClearFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiX />
            Clear All
          </motion.button>
        )}
      </div>

      <div className="filter-controls">
        {/* Genre Filter */}
        <div className="filter-group">
          <label className="filter-label">Genre</label>
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

        {/* Year Filter */}
        <div className="filter-group">
          <label className="filter-label">Release Year</label>
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

        {/* Rating Filter */}
        <div className="filter-group">
          <label className="filter-label">Minimum Rating</label>
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

      {/* Active Filters */}
      {hasActiveFilters && (
        <motion.div 
          className="active-filters"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            
            return (
              <motion.span 
                key={key}
                className="filter-tag"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <span>{getFilterDisplayValue(key, value)}</span>
                <button 
                  onClick={() => handleFilterChange(key, '')}
                  className="remove-filter"
                >
                  <FiX size={14} />
                </button>
              </motion.span>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};

export default FilterSection;