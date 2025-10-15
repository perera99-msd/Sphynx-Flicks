// src/components/Header/Header.jsx - PREMIUM PROFESSIONAL (ENHANCED)
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
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const mobileNavItemVariant = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <motion.header
        className={`header ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="header-content">
          <div className="header-left">
            <motion.h1 
              className="logo-gradient" 
              onClick={() => handleViewChange('discover')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              SPHYNX FLICKS
            </motion.h1>
            
            <nav className="nav-main">
              {navItems.map((item) => (
                <motion.button 
                  key={item.key} 
                  className={`nav-item ${activeView === item.key ? 'active' : ''}`} 
                  onClick={() => handleViewChange(item.key)}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <span>{item.label}</span>
                  {activeView === item.key && (
                    <motion.div 
                      className="active-indicator" 
                      layoutId="activeNavIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="header-right">
            <motion.button 
              className="action-icon" 
              onClick={() => setIsSearchOpen(true)} 
              aria-label="Search"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSearch />
            </motion.button>
            
            <motion.button 
              className="action-icon" 
              aria-label="Notifications"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiBell />
            </motion.button>

            {user ? (
              <div className="profile-menu" ref={profileRef}>
                <motion.button 
                  className="profile-trigger" 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      className="profile-dropdown"
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="dropdown-user-info">
                        <div className="user-avatar large">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{user.username}</span>
                      </div>
                      
                      <motion.button 
                        onClick={() => handleViewChange('profile')}
                        whileHover={{ x: 4 }}
                      >
                        <FiUser/> Profile
                      </motion.button>
                      
                      <motion.button 
                        onClick={() => handleViewChange('favorites')}
                        whileHover={{ x: 4 }}
                      >
                        <FiHeart/> My List ({favoritesCount})
                      </motion.button>
                      
                      <motion.button 
                        className="logout-btn" 
                        onClick={handleLogout}
                        whileHover={{ x: 4 }}
                      >
                        <FiLogOut/> Sign Out
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button 
                className="auth-btn" 
                onClick={onAuthClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            )}
            
            <motion.button 
              className="mobile-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              aria-label="Toggle Menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiMenu />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Premium Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div 
              className="search-modal"
              initial={{ scale: 0.8, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
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
              <motion.button 
                className="search-close-btn" 
                onClick={() => setIsSearchOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Menu - Add your existing mobile menu styles here */}
    </>
  );
};

export default Header;