// src/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiLogOut, FiHeart, FiMenu, FiX, FiHome, FiUserCheck } from 'react-icons/fi';
import './Header.css';

const Header = ({ onSearch, searchQuery, user, onAuthClick, onLogout, activeView, onViewChange, favoritesCount }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const searchInputRef = useRef(null);

  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(localSearchQuery);
    if (window.innerWidth < 768) {
      setIsSearchOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setLocalSearchQuery('');
      onSearch('');
    }
  };

  const handleViewSelect = (view) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: 'discover', label: 'Discover', icon: FiHome },
    { id: 'favorites', label: 'Favorites', icon: FiHeart, count: favoritesCount },
    { id: 'profile', label: 'Profile', icon: FiUserCheck }
  ];

  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="header-container">
        {/* Logo */}
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h1>
            <span className="logo-gradient">Cine</span>Elite
          </h1>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => handleViewSelect(item.id)}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="nav-badge">{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="desktop-actions">
          {/* Search */}
          <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search movies..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="search-submit">
                <FiSearch />
              </button>
            </form>
          </div>

          <button 
            className="search-toggle"
            onClick={handleSearchToggle}
            aria-label="Toggle search"
          >
            <FiSearch />
          </button>

          {/* User Actions */}
          {user ? (
            <div className="user-menu">
              <motion.button 
                className="user-avatar"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewSelect('profile')}
              >
                <FiUser />
                <span className="user-name">{user.username}</span>
              </motion.button>
              
              <motion.button 
                className="logout-btn"
                onClick={onLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
              >
                <FiLogOut />
              </motion.button>
            </div>
          ) : (
            <motion.button 
              className="auth-btn"
              onClick={onAuthClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiUser />
              <span>Sign In</span>
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-search">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <button type="submit" className="search-submit">
                  <FiSearch />
                </button>
              </form>
            </div>

            <nav className="mobile-nav">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`mobile-nav-item ${activeView === item.id ? 'active' : ''}`}
                    onClick={() => handleViewSelect(item.id)}
                  >
                    <Icon className="nav-icon" />
                    <span>{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="nav-badge">{item.count}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mobile-actions">
              {user ? (
                <>
                  <div className="mobile-user-info">
                    <FiUser />
                    <span>{user.username}</span>
                  </div>
                  <button className="mobile-logout-btn" onClick={onLogout}>
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button className="mobile-auth-btn" onClick={onAuthClick}>
                  <FiUser />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;