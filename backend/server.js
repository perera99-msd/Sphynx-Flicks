// server.js - SQLite Version
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'sphynx_flicks_premium_secret_2024';

// Movie APIs configuration
const MOVIE_APIS = {
  TMDB: {
    apiKey: 'e723914bacd3f287ba6464803d8f41ce',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500'
  },
  OMDB: {
    apiKey: 'ce396523',
    baseUrl: 'http://www.omdbapi.com'
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// SQLite database
let db;

async function initializeDatabase() {
  try {
    db = await open({
      filename: join(__dirname, 'sphynx_flicks.db'),
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        username TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        movie_id TEXT NOT NULL,
        movie_data TEXT NOT NULL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS watch_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        movie_id TEXT NOT NULL,
        movie_data TEXT NOT NULL,
        watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        movie_id TEXT NOT NULL,
        movie_data TEXT NOT NULL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('SQLite database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Movie Service Functions
class MovieService {
  static async searchMovies(query, page = 1) {
    try {
      // Try TMDB first
      const tmdbResponse = await axios.get(
        `${MOVIE_APIS.TMDB.baseUrl}/search/movie`,
        {
          params: {
            api_key: MOVIE_APIS.TMDB.apiKey,
            query: query,
            page: page,
            include_adult: false
          }
        }
      );

      if (tmdbResponse.data.results.length > 0) {
        return tmdbResponse.data.results.map(movie => ({
          ...movie,
          poster_path: movie.poster_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.poster_path}` : null,
          backdrop_path: movie.backdrop_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.backdrop_path}` : null,
          source: 'TMDB'
        }));
      }

      // Fallback to OMDB
      const omdbResponse = await axios.get(
        `${MOVIE_APIS.OMDB.baseUrl}/`,
        {
          params: {
            apikey: MOVIE_APIS.OMDB.apiKey,
            s: query,
            page: page,
            type: 'movie'
          }
        }
      );

      if (omdbResponse.data.Search) {
        return omdbResponse.data.Search.map(movie => ({
          id: movie.imdbID,
          title: movie.Title,
          poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
          release_date: movie.Year,
          vote_average: null,
          source: 'OMDB'
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  static async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(
        `${MOVIE_APIS.TMDB.baseUrl}/movie/popular`,
        {
          params: {
            api_key: MOVIE_APIS.TMDB.apiKey,
            page: page
          }
        }
      );

      return response.data.results.map(movie => ({
        ...movie,
        poster_path: movie.poster_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.backdrop_path}` : null,
        source: 'TMDB'
      }));
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  }

  static async getMovieDetails(movieId, source = 'TMDB') {
    try {
      if (source === 'TMDB') {
        const response = await axios.get(
          `${MOVIE_APIS.TMDB.baseUrl}/movie/${movieId}`,
          {
            params: {
              api_key: MOVIE_APIS.TMDB.apiKey,
              append_to_response: 'videos,credits'
            }
          }
        );

        const movie = response.data;
        return {
          ...movie,
          poster_path: movie.poster_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.poster_path}` : null,
          backdrop_path: movie.backdrop_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.backdrop_path}` : null,
          trailer: movie.videos?.results?.find(video => video.type === 'Trailer') || null,
          cast: movie.credits?.cast?.slice(0, 10) || [],
          source: 'TMDB'
        };
      } else {
        // OMDB fallback
        const response = await axios.get(
          `${MOVIE_APIS.OMDB.baseUrl}/`,
          {
            params: {
              apikey: MOVIE_APIS.OMDB.apiKey,
              i: movieId,
              plot: 'full'
            }
          }
        );

        return {
          id: response.data.imdbID,
          title: response.data.Title,
          overview: response.data.Plot,
          poster_path: response.data.Poster !== 'N/A' ? response.data.Poster : null,
          release_date: response.data.Released,
          runtime: response.data.Runtime,
          genres: response.data.Genre ? response.data.Genre.split(', ') : [],
          vote_average: response.data.imdbRating ? parseFloat(response.data.imdbRating) : null,
          cast: response.data.Actors ? response.data.Actors.split(', ') : [],
          director: response.data.Director,
          source: 'OMDB'
        };
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  static async getMoviesByGenre(genreId, page = 1) {
    try {
      const response = await axios.get(
        `${MOVIE_APIS.TMDB.baseUrl}/discover/movie`,
        {
          params: {
            api_key: MOVIE_APIS.TMDB.apiKey,
            with_genres: genreId,
            page: page,
            sort_by: 'popularity.desc'
          }
        }
      );

      return response.data.results.map(movie => ({
        ...movie,
        poster_path: movie.poster_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.backdrop_path}` : null,
        source: 'TMDB'
      }));
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  }

  static async getTrendingMovies() {
    try {
      const response = await axios.get(
        `${MOVIE_APIS.TMDB.baseUrl}/trending/movie/week`,
        {
          params: {
            api_key: MOVIE_APIS.TMDB.apiKey
          }
        }
      );

      return response.data.results.map(movie => ({
        ...movie,
        poster_path: movie.poster_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `${MOVIE_APIS.TMDB.imageBaseUrl}${movie.backdrop_path}` : null,
        source: 'TMDB'
      }));
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Initialize database
initializeDatabase();

// Movie Routes
app.get('/api/movies/popular', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await MovieService.getPopularMovies(page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

app.get('/api/movies/search', async (req, res) => {
  try {
    const { query, page } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const movies = await MovieService.searchMovies(query, parseInt(page) || 1);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

app.get('/api/movies/trending', async (req, res) => {
  try {
    const movies = await MovieService.getTrendingMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

app.get('/api/movies/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const movies = await MovieService.getMoviesByGenre(genreId, page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies by genre' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { source } = req.query;
    const movie = await MovieService.getMovieDetails(id, source || 'TMDB');
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.run(
      'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
      [email, hashedPassword, username]
    );

    const token = jwt.sign(
      { id: result.lastID, email, username },
      JWT_SECRET
    );

    res.json({
      message: 'User created successfully',
      token,
      user: { id: result.lastID, email, username },
      favorites: [],
      watchlist: []
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET
    );

    // Fetch user's favorites and watchlist
    const favorites = await db.all(
      'SELECT movie_data FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [user.id]
    );

    const watchlist = await db.all(
      'SELECT movie_data FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [user.id]
    );

    const watchHistory = await db.all(
      'SELECT movie_data, watched_at FROM watch_history WHERE user_id = ? ORDER BY watched_at DESC LIMIT 50',
      [user.id]
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, username: user.username },
      favorites: favorites.map(row => JSON.parse(row.movie_data)),
      watchlist: watchlist.map(row => JSON.parse(row.movie_data)),
      watchHistory: watchHistory.map(row => ({
        ...JSON.parse(row.movie_data),
        watched_at: row.watched_at
      }))
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token endpoint
app.get('/api/verify', authenticateToken, async (req, res) => {
  try {
    const favorites = await db.all(
      'SELECT movie_data FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );

    const watchlist = await db.all(
      'SELECT movie_data FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );

    const watchHistory = await db.all(
      'SELECT movie_data, watched_at FROM watch_history WHERE user_id = ? ORDER BY watched_at DESC LIMIT 50',
      [req.user.id]
    );

    res.json({
      user: req.user,
      favorites: favorites.map(row => JSON.parse(row.movie_data)),
      watchlist: watchlist.map(row => JSON.parse(row.movie_data)),
      watchHistory: watchHistory.map(row => ({
        ...JSON.parse(row.movie_data),
        watched_at: row.watched_at
      }))
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Favorites Routes
app.post('/api/favorites', authenticateToken, async (req, res) => {
  const { movie_id, movie_data } = req.body;
  const user_id = req.user.id;

  try {
    await db.run(
      'INSERT OR REPLACE INTO favorites (user_id, movie_id, movie_data) VALUES (?, ?, ?)',
      [user_id, movie_id, JSON.stringify(movie_data)]
    );
    res.json({ message: 'Movie added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

app.delete('/api/favorites/:movie_id', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const movie_id = req.params.movie_id;

  try {
    await db.run(
      'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );
    res.json({ message: 'Movie removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

app.get('/api/favorites', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const rows = await db.all(
      'SELECT movie_data FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [user_id]
    );
    const favorites = rows.map(row => JSON.parse(row.movie_data));
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Watchlist Routes
app.post('/api/watchlist', authenticateToken, async (req, res) => {
  const { movie_id, movie_data } = req.body;
  const user_id = req.user.id;

  try {
    await db.run(
      'INSERT OR REPLACE INTO watchlist (user_id, movie_id, movie_data) VALUES (?, ?, ?)',
      [user_id, movie_id, JSON.stringify(movie_data)]
    );
    res.json({ message: 'Movie added to watchlist' });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

app.delete('/api/watchlist/:movie_id', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const movie_id = req.params.movie_id;

  try {
    await db.run(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );
    res.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

app.get('/api/watchlist', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const rows = await db.all(
      'SELECT movie_data FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [user_id]
    );
    const watchlist = rows.map(row => JSON.parse(row.movie_data));
    res.json(watchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Watch History Routes
app.post('/api/watch-history', authenticateToken, async (req, res) => {
  const { movie_id, movie_data } = req.body;
  const user_id = req.user.id;

  try {
    await db.run(
      'INSERT INTO watch_history (user_id, movie_id, movie_data) VALUES (?, ?, ?)',
      [user_id, movie_id, JSON.stringify(movie_data)]
    );
    res.json({ message: 'Watch history recorded' });
  } catch (error) {
    console.error('Record watch history error:', error);
    res.status(500).json({ error: 'Failed to record watch history' });
  }
});

app.get('/api/watch-history', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const rows = await db.all(
      'SELECT movie_data, watched_at FROM watch_history WHERE user_id = ? ORDER BY watched_at DESC LIMIT 50',
      [user_id]
    );
    const history = rows.map(row => ({
      ...JSON.parse(row.movie_data),
      watched_at: row.watched_at
    }));
    res.json(history);
  } catch (error) {
    console.error('Get watch history error:', error);
    res.status(500).json({ error: 'Failed to fetch watch history' });
  }
});

// Genres endpoint
app.get('/api/genres', async (req, res) => {
  try {
    const response = await axios.get(
      `${MOVIE_APIS.TMDB.baseUrl}/genre/movie/list`,
      {
        params: {
          api_key: MOVIE_APIS.TMDB.apiKey
        }
      }
    );
    res.json(response.data.genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`SPHYNX-FLICKS backend running on port ${PORT}`);
  console.log(`SQLite database: sphynx_flicks.db`);
});