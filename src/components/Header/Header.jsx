// src/components/Header/Header.jsx - PREMIUM PROFESSIONAL (ANIMATED REVISION 2)
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiUser, FiHeart, FiLogOut, FiGrid, FiBookmark, FiBell, FiChevronDown } from 'react-icons/fi';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const navItems = [
    { key: 'discover', label: 'Discover', icon: <FiGrid/> },
    ...(user ? [{ key: 'favorites', label: 'My List', icon: <FiBookmark/> }] : [])
  ];
  
  const mobileMenuVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const mobileNavItemVariant = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.header
        className={`header ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -80 }} animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo-gradient" onClick={() => handleViewChange('discover')}>SPHYNX FLICKS</h1>
            <nav className="nav-main">
              {navItems.map((item) => (
                <button key={item.key} className={`nav-item ${activeView === item.key ? 'active' : ''}`} onClick={() => handleViewChange(item.key)}>
                  <span>{item.label}</span>
                  {activeView === item.key && <motion.div className="active-indicator" layoutId="activeNavIndicator" />}
                </button>
              ))}
            </nav>
          </div>

          <div className="header-right">
            <button className="action-icon" onClick={() => setIsSearchOpen(true)} aria-label="Search"><FiSearch /></button>
            <button className="action-icon" aria-label="Notifications"><FiBell /></button>

            {user ? (
              <div className="profile-menu" ref={profileRef}>
                <button className="profile-trigger" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      className="profile-dropdown"
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="dropdown-user-info">
                        <div className="user-avatar large">{user.username.charAt(0).toUpperCase()}</div>
                        <span className="user-name">{user.username}</span>
                      </div>
                      <button onClick={() => handleViewChange('profile')}><FiUser/> Profile</button>
                      <button onClick={() => handleViewChange('favorites')}><FiHeart/> My List ({favoritesCount})</button>
                      <button className="logout-btn" onClick={handleLogout}><FiLogOut/> Sign Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button className="auth-btn" onClick={onAuthClick}>Sign In</motion.button>
            )}
            <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu"><FiMenu /></button>
          </div>
        </div>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="search-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="search-modal"
              initial={{ y: -100, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: -100, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <FiSearch className="search-modal-icon" />
              <input 
                type="text"
                placeholder="Search for movies, genres, and more..."
                className="search-modal-input"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                autoFocus
              />
              <button className="search-close-btn" onClick={() => setIsSearchOpen(false)}><FiX /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div className="mobile-menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <motion.div
              className="mobile-menu"
              initial={{ x: "100%" }} animate={{ x: "0%" }} exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 40, stiffness: 400 }}
            >
              <motion.div variants={mobileMenuVariant} initial="hidden" animate="visible">
                {navItems.map((item) => (
                  <motion.button key={item.key} variants={mobileNavItemVariant} className="mobile-nav-item" onClick={() => handleViewChange(item.key)}>
                    {item.icon}<span>{item.label}</span>
                  </motion.button>
                ))}
                {user && (
                  <motion.button variants={mobileNavItemVariant} className="mobile-nav-item" onClick={() => handleViewChange('profile')}>
                    <FiUser/><span>Profile</span>
                  </motion.button>
                )}
              </motion.div>
              <div className="mobile-actions">
                {user ? (
                  <button className="mobile-logout-btn" onClick={handleLogout}><FiLogOut /> Sign Out</button>
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