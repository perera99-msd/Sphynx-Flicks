// src/components/Header/Header.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiUser, FiHeart, FiLogOut } from 'react-icons/fi';
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
    { key: 'discover', label: 'Discover' },
    ...(user ? [
      { key: 'favorites', label: 'My Favorites' },
      { key: 'profile', label: 'Profile' }
    ] : [])
  ];

  return (
    <>
      <motion.header
        className={`header ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div 
          className="logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="SPHYNX-FLICKS Home"
        >
          SPHYNX-FLICKS
        </motion.div>

        {/* Desktop Navigation */}
        <div className="nav-container">
          <nav className="nav-main">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`nav-item ${activeView === item.key ? 'active' : ''}`}
                onClick={() => handleViewChange(item.key)}
              >
                {item.label}
                {activeView === item.key && (
                  <motion.div className="active-indicator" layoutId="activeIndicator" />
                )}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search movies, genres..." 
              value={searchQuery} 
              onChange={(e) => onSearch(e.target.value)} 
              className="search-input"
              aria-label="Search movies"
            />
          </div>

          {/* User Actions */}
          <div className="user-actions">
            {user ? (
              <>
                <motion.button 
                  className="action-btn favorites-badge"
                  onClick={() => handleViewChange('favorites')}
                  data-count={favoritesCount > 9 ? '9+' : favoritesCount}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ y: 0, scale: 1 }}
                  title="My Favorites"
                  aria-label={`My Favorites, ${favoritesCount} items`}
                >
                  <FiHeart />
                </motion.button>

                <motion.div 
                  className="user-profile"
                  onClick={() => handleViewChange('profile')}
                  whileHover={{ y: -1 }}
                  title="View Profile"
                >
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.username}</span>
                    <span className="user-role">Member</span>
                  </div>
                </motion.div>

                <motion.button 
                  className="action-btn logout-btn"
                  onClick={handleLogout}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ y: 0, scale: 1 }}
                  title="Logout"
                  aria-label="Logout"
                >
                  <FiLogOut />
                </motion.button>
              </>
            ) : (
              <motion.button 
                className="auth-btn"
                onClick={onAuthClick}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Sign In
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button 
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={isMenuOpen ? "x" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mobile-menu"
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-search">
                <FiSearch className="mobile-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search movies..." 
                  value={searchQuery} 
                  onChange={(e) => onSearch(e.target.value)} 
                  className="mobile-search-input" 
                />
              </div>

              <div className="mobile-nav">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    className={`mobile-nav-item ${activeView === item.key ? 'active' : ''}`}
                    onClick={() => handleViewChange(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mobile-actions">
                {user ? (
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button className="mobile-auth-btn" onClick={onAuthClick}>
                    <FiUser />
                    <span>Sign In</span>
                  </button>
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