// src/components/FilterSection/FilterSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';
import './FilterSection.css';

const FilterSection = ({ filters, onFilterChange, onClearFilters, genres }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <motion.section 
      className="filter-section"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="filter-container">
        <div className="filter-header">
          <FiFilter className="filter-icon" />
          <h3>Filter Movies</h3>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={onClearFilters}>
              <FiX /> Clear All
            </button>
          )}
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="genre-filter">Genre</label>
            <select 
              id="genre-filter"
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

          <div className="filter-group">
            <label htmlFor="year-filter">Release Year</label>
            <select 
              id="year-filter"
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

          <div className="filter-group">
            <label htmlFor="rating-filter">Minimum Rating</label>
            <select 
              id="rating-filter"
              value={filters.rating} 
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="filter-select"
            >
              <option value="">Any Rating</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
              <option value="5">5+ Stars</option>
            </select>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FilterSection;