// src/components/Footer/Footer.jsx - PREMIUM DESIGN
import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiGithub, FiLinkedin, FiMail, FiPlay } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: <FiGithub />, name: 'GitHub', href: 'https://github.com' },
    { icon: <FiLinkedin />, name: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: <FiMail />, name: 'Email', href: 'mailto:contact@sphynxflicks.com' }
  ];

  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="footer-content">
        {/* Main Footer Section */}
        <div className="footer-main">
          <div className="footer-brand">
            <motion.div 
              className="footer-logo"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="logo-icon">🎬</span>
              <span className="logo-text">SPHYNX FLICKS</span>
            </motion.div>
            <p className="footer-description">
              Your premier destination for discovering and enjoying the world's finest cinema. 
              Experience movies like never before.
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="social-link"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  custom={index}
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4 className="link-group-title">Navigation</h4>
              <ul className="link-list">
                {footerLinks.slice(0, 3).map((link, index) => (
                  <motion.li key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a href={link.href} className="footer-link">{link.name}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="link-group">
              <h4 className="link-group-title">Support</h4>
              <ul className="link-list">
                {footerLinks.slice(3).map((link, index) => (
                  <motion.li key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 3) * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a href={link.href} className="footer-link">{link.name}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <motion.div 
            className="footer-copyright"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p>
              © {currentYear} SPHYNX FLICKS. Made with{' '}
              <motion.span 
                className="heart-icon"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <FiHeart />
              </motion.span>{' '}
              by <span className="developer-name">M S D PERERA</span>
            </p>
          </motion.div>
          
          <motion.div 
            className="footer-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button 
              className="cta-button"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <FiPlay className="cta-icon" />
              Back to Top
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="footer-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;