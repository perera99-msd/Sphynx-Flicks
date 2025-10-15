// src/components/Header/Header.jsx - PREMIUM PROFESSIONAL (REVISED)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiUser, FiHeart, FiLogOut, FiGrid, FiBookmark } from 'react-icons/fi';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewChange = (view) => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  const navItems = [
    { key: 'discover', label: 'Discover', icon: <FiGrid/> },
    ...(user ? [{ key: 'favorites', label: 'My List', icon: <FiBookmark/> }] : [])
  ];

  return (
    <>
      <motion.header
        className={`header ${isScrolled ? 'scrolled' : ''} ${isSearchActive ? 'search-focused' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="header-content">
          <div className="header-left">
            <motion.div 
              className="logo"
              onClick={() => handleViewChange('discover')}
              aria-label="SPHYNX-FLICKS Home"
            >
              SPHYNX
            </motion.div>
            <nav className="nav-main">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  className={`nav-item ${activeView === item.key ? 'active' : ''}`}
                  onClick={() => handleViewChange(item.key)}
                >
                  {item.label}
                  {activeView === item.key && <motion.div className="active-indicator" layoutId="activeNavIndicator" />}
                </button>
              ))}
            </nav>
          </div>

          <div className="header-right">
            <div className="search-container">
              <motion.input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => onSearch(e.target.value)} 
                className="search-input"
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setIsSearchActive(false)}
                aria-label="Search movies"
                transition={{ duration: 0.4 }}
              />
              <FiSearch className="search-icon" />
            </div>

            {user ? (
              <div className="user-actions">
                <motion.button 
                  className="action-btn favorites-badge"
                  onClick={() => handleViewChange('favorites')}
                  data-count={favoritesCount > 9 ? '9+' : favoritesCount}
                  title="My Favorites"
                >
                  <FiHeart />
                </motion.button>
                <div className="profile-menu">
                  <button className="profile-trigger" onClick={() => handleViewChange('profile')}>
                    <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                  </button>
                </div>
                 <motion.button 
                  className="action-btn logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <FiLogOut />
                </motion.button>
              </div>
            ) : (
              <motion.button 
                className="auth-btn"
                onClick={onAuthClick}
                whileHover={{ y: -2 }}
              >
                Sign In
              </motion.button>
            )}

            <motion.button 
              className="mobile-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 40, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              {user && (
                <div className="mobile-user-profile">
                  <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                  <span className="user-name">{user.username}</span>
                </div>
              )}
              <div className="mobile-nav">
                {navItems.map((item) => (
                  <button key={item.key} className="mobile-nav-item" onClick={() => handleViewChange(item.key)}>
                    {item.icon}<span>{item.label}</span>
                  </button>
                ))}
                {user && (
                    <button className="mobile-nav-item" onClick={() => handleViewChange('profile')}>
                        <FiUser/><span>Profile</span>
                    </button>
                )}
              </div>
              <div className="mobile-actions">
                {user ? (
                  <button className="mobile-logout-btn" onClick={handleLogout}><FiLogOut /> Logout</button>
                ) : (
                  <button className="mobile-auth-btn" onClick={onAuthClick}><FiUser /> Sign In</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;