// server.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'sphynx_flicks_premium_secret_2024';

// MySQL Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sphynx_flicks',
  port: 3306
};

// Movie APIs configuration
const MOVIE_APIS = {
  TMDB: {
    apiKey: 'e723914bacd3f287ba6464803d8f41ce', // Free public key (replace with your own)
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500'
  },
  OMDB: {
    apiKey: 'ce396523', // Free public key (replace with your own)
    baseUrl: 'http://www.omdbapi.com'
  }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database initialization
let db;

async function initializeDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // Create tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        movie_id VARCHAR(50) NOT NULL,
        movie_data JSON NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_favorite (user_id, movie_id)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS watch_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        movie_id VARCHAR(50) NOT NULL,
        movie_data JSON NOT NULL,
        watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        movie_id VARCHAR(50) NOT NULL,
        movie_data JSON NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_watchlist (user_id, movie_id)
      )
    `);

    console.log('Database tables initialized');
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
    
    const [result] = await db.execute(
      'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
      [email, hashedPassword, username]
    );

    const token = jwt.sign(
      { id: result.insertId, email, username },
      JWT_SECRET
    );

    res.json({
      message: 'User created successfully',
      token,
      user: { id: result.insertId, email, username },
      favorites: [],
      watchlist: []
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
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
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET
    );

    // Fetch user's favorites and watchlist
    const [favorites] = await db.execute(
      'SELECT movie_data FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [user.id]
    );

    const [watchlist] = await db.execute(
      'SELECT movie_data FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [user.id]
    );

    const [watchHistory] = await db.execute(
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
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token endpoint
app.get('/api/verify', authenticateToken, async (req, res) => {
  try {
    const [favorites] = await db.execute(
      'SELECT movie_data FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );

    const [watchlist] = await db.execute(
      'SELECT movie_data FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );

    const [watchHistory] = await db.execute(
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
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Favorites Routes
app.post('/api/favorites', authenticateToken, async (req, res) => {
  const { movie_id, movie_data } = req.body;
  const user_id = req.user.id;

  try {
    await db.execute(
      'INSERT INTO favorites (user_id, movie_id, movie_data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE movie_data = ?',
      [user_id, movie_id, JSON.stringify(movie_data), JSON.stringify(movie_data)]
    );
    res.json({ message: 'Movie added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

app.delete('/api/favorites/:movie_id', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const movie_id = req.params.movie_id;

  try {
    await db.execute(
      'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );
    res.json({ message: 'Movie removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

app.get('/api/favorites', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await db.execute(
      'SELECT movie_data FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [user_id]
    );
    const favorites = rows.map(row => JSON.parse(row.movie_data));
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Watchlist Routes
app.post('/api/watchlist', authenticateToken, async (req, res) => {
  const { movie_id, movie_data } = req.body;
  const user_id = req.user.id;

  try {
    await db.execute(
      'INSERT INTO watchlist (user_id, movie_id, movie_data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE movie_data = ?',
      [user_id, movie_id, JSON.stringify(movie_data), JSON.stringify(movie_data)]
    );
    res.json({ message: 'Movie added to watchlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

app.delete('/api/watchlist/:movie_id', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const movie_id = req.params.movie_id;

  try {
    await db.execute(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );
    res.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

app.get('/api/watchlist', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await db.execute(
      'SELECT movie_data FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [user_id]
    );
    const watchlist = rows.map(row => JSON.parse(row.movie_data));
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Watch History Routes
app.post('/api/watch-history', authenticateToken, async (req, res) => {
  const { movie_id, movie_data } = req.body;
  const user_id = req.user.id;

  try {
    await db.execute(
      'INSERT INTO watch_history (user_id, movie_id, movie_data) VALUES (?, ?, ?)',
      [user_id, movie_id, JSON.stringify(movie_data)]
    );
    res.json({ message: 'Watch history recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record watch history' });
  }
});

app.get('/api/watch-history', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await db.execute(
      'SELECT movie_data, watched_at FROM watch_history WHERE user_id = ? ORDER BY watched_at DESC LIMIT 50',
      [user_id]
    );
    const history = rows.map(row => ({
      ...JSON.parse(row.movie_data),
      watched_at: row.watched_at
    }));
    res.json(history);
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

app.listen(PORT, () => {
  console.log(`SPHYNX-FLICKS backend running on port ${PORT}`);
});