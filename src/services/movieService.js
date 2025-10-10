// src/services/authService.js
const API_BASE_URL = 'https://backend.msdperera99.workers.dev/api';

async function fetchFromAPI(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

export const AuthService = {
  async login(credentials) {
    try {
      return await fetchFromAPI('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  async register(credentials) {
    try {
      return await fetchFromAPI('/register', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  async verifyToken(token) {
    try {
      return await fetchFromAPI('/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }
};