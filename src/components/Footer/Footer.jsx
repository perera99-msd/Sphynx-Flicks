// src/components/Footer/Footer.jsx - PROFESSIONAL COMPACT DESIGN
import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import './Footer.css';
import logo from './logo.jpg'; // <-- Image is imported here

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
  ];

  const socialLinks = [
    { icon: <FiGithub />, name: 'GitHub', href: 'https://github.com' },
    { icon: <FiLinkedin />, name: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: <FiMail />, name: 'Email', href: 'mailto:contact@sphynxflicks.com' }
  ];

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="footer-content">
        {/* Left Side: Logo and Copyright */}
        <div className="footer-left">
          <motion.div
            className="footer-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img
              src={logo}
              alt="Sphynx Flicks Logo"
              className="footer-logo-image"
            />
            <span>SPHYNX FLICKS</span>
          </motion.div>
          <div className="footer-copyright">
            <p>
              © {currentYear} SPHYNX FLICKS. Made with
              <motion.span
                className="heart-icon"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <FiHeart />
              </motion.span>
              by <a href="https://github.com/msdperera" target="_blank" rel="noopener noreferrer" className="developer-name">M S D PERERA</a>
            </p>
          </div>
        </div>

        {/* Right Side: Navigation and Social Links */}
        <div className="footer-right">
          <nav className="footer-nav">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="footer-link"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="footer-social">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;