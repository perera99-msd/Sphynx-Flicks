// src/components/Header/Header.jsx - NEW PREMIUM DESIGN
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiHeart, FiLogOut, FiGrid, FiBookmark, FiMenu, FiX } from 'react-icons/fi';
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
    { key: 'discover', label: 'Discover', icon: <FiGrid/> },
    ...(user ? [{ key: 'favorites', label: 'My List', icon: <FiBookmark/> }] : [])
  ];

  const renderNavLinks = (isMobile = false) => (
    <nav className={isMobile ? "nav-mobile" : "nav-desktop"}>
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`nav-link ${activeView === item.key ? 'active' : ''}`}
          onClick={() => handleViewChange(item.key)}
        >
          {isMobile && item.icon} <span>{item.label}</span>
          {activeView === item.key && (
            <motion.div
              className="active-indicator"
              layoutId={isMobile ? "activeMobileIndicator" : "activeDesktopIndicator"}
            />
          )}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      <motion.header
        className={`header ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="header-content">
          <div className="header-left">
            <div className="logo" onClick={() => handleViewChange('discover')}>
              SPHYNX FLICKS
            </div>
            {renderNavLinks()}
          </div>

          <div className="header-right">
            <div className="header-search">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>

            {user ? (
              <div className="profile-menu" ref={profileRef}>
                <button className="profile-trigger" onClick={() => setIsProfileOpen(p => !p)}>
                  <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                </button>

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
                        <span className="user-name">{user.username}</span>
                      </div>
                      <button onClick={() => handleViewChange('profile')}><FiUser/> Profile</button>
                      <button onClick={() => handleViewChange('favorites')}><FiHeart/> My List ({favoritesCount})</button>
                      <div className="dropdown-divider"></div>
                      <button className="logout-btn" onClick={handleLogout}><FiLogOut/> Sign Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                className="auth-button"
                onClick={onAuthClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            )}
             <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
                <FiMenu />
             </button>
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
          >
            <motion.div 
                className="mobile-menu-panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiX />
                </button>
                {renderNavLinks(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;