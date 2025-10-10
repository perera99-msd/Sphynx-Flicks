// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = await AuthService.verifyToken(token);
        setUser(userData.user);
        setFavorites(userData.favorites || []);
        setWatchlist(userData.watchlist || []);
        setWatchHistory(userData.watchHistory || []);
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const data = await AuthService.login(credentials);
      setUser(data.user);
      setFavorites(data.favorites || []);
      setWatchlist(data.watchlist || []);
      setWatchHistory(data.watchHistory || []);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials) => {
    try {
      const data = await AuthService.register(credentials);
      setUser(data.user);
      setFavorites(data.favorites || []);
      setWatchlist(data.watchlist || []);
      setWatchHistory(data.watchHistory || []);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setFavorites([]);
    setWatchlist([]);
    setWatchHistory([]);
  };

  const updateFavorites = (newFavorites) => {
    setFavorites(newFavorites);
  };

  const updateWatchlist = (newWatchlist) => {
    setWatchlist(newWatchlist);
  };

  const addToWatchHistory = (movie) => {
    setWatchHistory(prev => [movie, ...prev.slice(0, 49)]);
  };

  const value = {
    user,
    favorites,
    watchlist,
    watchHistory,
    login,
    register,
    logout,
    updateFavorites,
    updateWatchlist,
    addToWatchHistory,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};