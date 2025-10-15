// src/components/Header/Header.jsx - PROFESSIONAL REDESIGN
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiUser, 
  FiHeart, 
  FiLogOut, 
  FiBookmark, 
  FiMenu, 
  FiX,
  FiHome
} from 'react-icons/fi';
import './Header.css';

const Header = ({
  onSearch,
  searchQuery,
  user,
  onAuthClick,
  onLogout,
  activeView,
  onViewChange,
  favoritesCount
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);

  // Handle header scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle clicking outside the profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  const handleViewChange = (view) => {
    onViewChange(view);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    onLogout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }

  const navItems = [
    { key: 'discover', label: 'Discover', icon: <FiHome /> },
    ...(user ? [{ key: 'favorites', label: 'My List', icon: <FiBookmark/> }] : []),
    ...(user ? [{ key: 'profile', label: 'Profile', icon: <FiUser/> }] : [])
  ];

  const renderNavLinks = (isMobile = false) => (
    <nav className={isMobile ? "nav-mobile" : "nav-desktop"}>
      {navItems.map((item) => (
        <motion.button
          key={item.key}
          className={`nav-link ${activeView === item.key ? 'active' : ''}`}
          onClick={() => handleViewChange(item.key)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobile && <span className="nav-icon">{item.icon}</span>}
          <span className="nav-label">{item.label}</span>
          {activeView === item.key && !isMobile && (
            <motion.div
              className="active-indicator"
              layoutId="activeIndicator"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </nav>
  );

  return (
    <>
      <motion.header
        className={`header ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="header-content">
          {/* Left Section - Logo & Navigation */}
          <div className="header-left">
            <motion.div 
              className="logo-container"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="logo" onClick={() => handleViewChange('discover')}>
                <img 
                  src="logo.jpg"
                  alt="Sphynx Flicks Logo" 
                  className="logo-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span style={{display: 'none'}}>🎬</span>
                SPHYNX FLICKS
              </div>
            </motion.div>
            {renderNavLinks()}
          </div>

          {/* Right Section - Search & User */}
          <div className="header-right">
            {/* Professional Search Bar */}
            <motion.div 
              className={`header-search ${searchFocused ? 'focused' : ''}`}
              initial={false}
              animate={{ width: searchFocused ? 320 : 280 }}
            >
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search movies..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {searchQuery && (
                <motion.div 
                  className="search-active-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.div>

            {/* User Section */}
            {user ? (
              <div className="profile-menu" ref={profileRef}>
                <motion.button 
                  className="profile-trigger"
                  onClick={() => setIsProfileOpen(p => !p)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                    {favoritesCount > 0 && (
                      <motion.span 
                        className="favorite-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {favoritesCount}
                      </motion.span>
                    )}
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      className="profile-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div className="dropdown-header">
                        <div className="user-avatar-small">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{user.username}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                      
                      <div className="dropdown-stats">
                        <div className="stat-item">
                          <FiHeart className="stat-icon" />
                          <span>{favoritesCount} Favorites</span>
                        </div>
                      </div>

                      <div className="dropdown-divider"></div>
                      
                      <button onClick={() => handleViewChange('profile')}>
                        <FiUser/>
                        <span>Profile</span>
                      </button>
                      <button onClick={() => handleViewChange('favorites')}>
                        <FiBookmark/>
                        <span>My List</span>
                      </button>
                      
                      <div className="dropdown-divider"></div>
                      
                      <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut/>
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                className="auth-button"
                onClick={onAuthClick}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUser className="auth-icon" />
                Sign In
              </motion.button>
            )}
            
            {/* Mobile Menu Toggle */}
            <motion.button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiMenu />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              className="mobile-menu-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-menu-header">
                <div className="mobile-logo">
                  <img 
                    src="logo.jpg" 
                    alt="Sphynx Flicks Logo" 
                    className="mobile-logo-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span style={{display: 'none'}}>🎬</span>
                  SPHYNX FLICKS
                </div>
                <motion.button 
                  className="mobile-menu-close"
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX />
                </motion.button>
              </div>

              {renderNavLinks(true)}

              {!user && (
                <div className="mobile-auth-section">
                  <motion.button
                    className="mobile-auth-button"
                    onClick={onAuthClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiUser className="auth-icon" />
                    Sign In
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;