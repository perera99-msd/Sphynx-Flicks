// src/components/FilterSection/FilterSection.jsx
import React from 'react';
import './FilterSection.css';

const FilterSection = ({ filters, onFilterChange, onClearFilters, genres = [] }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  const hasActiveFilters = filters.genre || filters.year || filters.rating;

  return (
    <section className="filter-section">
      <div className="filter-container">
        <h3 className="filter-title">Filter Movies</h3>
        
        <div className="filter-grid">
          {/* Genre Filter */}
          <div className="filter-group">
            <label htmlFor="genre-filter">Genre</label>
            <select
              id="genre-filter"
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
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
            <label htmlFor="year-filter">Release Year</label>
            <select
              id="year-filter"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
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
            <label htmlFor="rating-filter">Minimum Rating</label>
            <select
              id="rating-filter"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="9">9+ Stars</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
              <option value="5">5+ Stars</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="filter-group">
            <label>&nbsp;</label>
            <button
              className={`clear-filters-btn ${hasActiveFilters ? 'active' : ''}`}
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;