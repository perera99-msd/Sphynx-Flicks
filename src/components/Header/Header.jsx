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
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // UX Improvement: Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleViewChange = (view) => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.header
      className={`header ${isScrolled ? 'scrolled' : 'floating'}`}
      layout
      transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      <div className="header-content">
        <motion.div layout="position" className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          SPHYNX-FLICKS
        </motion.div>

        <nav className="desktop-nav">
            <button className={`view-btn ${activeView === 'discover' ? 'active' : ''}`} onClick={() => handleViewChange('discover')}>Discover</button>
            {user && (
              <>
                <button className={`view-btn ${activeView === 'favorites' ? 'active' : ''}`} onClick={() => handleViewChange('favorites')}>Favorites</button>
                <button className={`view-btn ${activeView === 'profile' ? 'active' : ''}`} onClick={() => handleViewChange('profile')}>Profile</button>
              </>
            )}
        </nav>

        <motion.div layout className="header-actions">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => onSearch(e.target.value)} className="search-input" />
          </div>
          {user ? (
            <motion.div className="user-section" variants={itemVariants} initial="initial" animate="animate">
              <button className="icon-btn favorites-badge" onClick={() => handleViewChange('favorites')} title="View Favorites">
                <FiHeart />
                {favoritesCount > 0 && <span className="favorites-count">{favoritesCount}</span>}
              </button>
              <div className="user-info" onClick={() => handleViewChange('profile')} role="button" tabIndex={0}>
                <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
              </div>
              <button className="icon-btn logout-btn" onClick={handleLogout} title="Logout"><FiLogOut /></button>
            </motion.div>
          ) : (
            <motion.button className="auth-btn" onClick={onAuthClick} variants={itemVariants} initial="initial" animate="animate">
              <span>Sign In</span>
            </motion.button>
          )}
        </motion.div>

        <div className="mobile-menu-toggle">
          <button className="menu-toggle-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mobile-nav-content"
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <nav className="mobile-nav-links">
                <button className={`mobile-view-btn ${activeView === 'discover' ? 'active' : ''}`} onClick={() => handleViewChange('discover')}>Discover</button>
                {user && (
                  <>
                    <button className={`mobile-view-btn ${activeView === 'favorites' ? 'active' : ''}`} onClick={() => handleViewChange('favorites')}>Favorites ({favoritesCount})</button>
                    <button className={`mobile-view-btn ${activeView === 'profile' ? 'active' : ''}`} onClick={() => handleViewChange('profile')}>Profile</button>
                  </>
                )}
              </nav>
              <div className="mobile-user-actions">
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
    </motion.header>
  );
};

export default Header;