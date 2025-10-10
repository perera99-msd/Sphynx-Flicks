// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await AuthService.verifyToken(token);
          setUser(userData.user);
          setFavorites(userData.favorites || []);
          setWatchHistory(userData.watchHistory || []);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const result = await AuthService.login(credentials);
    setUser(result.user);
    setFavorites(result.favorites || []);
    setWatchHistory(result.watchHistory || []);
    localStorage.setItem('token', result.token);
    return result;
  };

  const register = async (credentials) => {
    const result = await AuthService.register(credentials);
    setUser(result.user);
    setFavorites(result.favorites || []);
    setWatchHistory(result.watchHistory || []);
    localStorage.setItem('token', result.token);
    return result;
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setWatchHistory([]);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    favorites,
    watchHistory,
    login,
    register,
    logout,
    setFavorites,
    setWatchHistory,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};