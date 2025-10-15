// src/index.js - Simplified version without bcryptjs

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Simple JWT implementation (basic)
const base64UrlEncode = (str) => {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};

const base64UrlDecode = (str) => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return atob(str);
};

const generateToken = (user, secret) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };

    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
    
    // Simple signature (in production, use proper HMAC)
    const signature = base64UrlEncode(secret + payloadEncoded);
    
    return `${headerEncoded}.${payloadEncoded}.${signature}`;
};

const verifyToken = (token, secret) => {
    try {
        const [headerEncoded, payloadEncoded, signature] = token.split('.');
        
        // Verify signature
        const expectedSignature = base64UrlEncode(secret + payloadEncoded);
        if (signature !== expectedSignature) {
            return null;
        }

        const payload = JSON.parse(base64UrlDecode(payloadEncoded));
        
        // Check expiration
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return payload;
    } catch (error) {
        return null;
    }
};

// Simple password hashing (basic implementation)
const simpleHash = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'movie-app-salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const comparePassword = async (password, hash) => {
    const newHash = await simpleHash(password);
    return newHash === hash;
};

// Response helpers
const json = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        },
    });
};

const error = (status, message) => {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        },
    });
};

// TMDB API helper
const tmdbFetch = async (endpoint, env) => {
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${env.TMDB_API_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (err) {
        console.error('TMDB Fetch Error:', err);
        throw err;
    }
};

// Authentication middleware
const authenticateToken = async (request, env) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    return verifyToken(token, env.JWT_SECRET);
};

// Main handler
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // Handle CORS preflight
        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // Health check
            if (path === '/' && method === 'GET') {
                return json({ message: 'Movie App API is running!' });
            }

            // API routes
            if (path.startsWith('/api/')) {
                // Authentication routes
                if (path === '/api/register' && method === 'POST') {
                    const { username, email, password } = await request.json();

                    if (!username || !email || !password) {
                        return error(400, 'All fields are required');
                    }

                    if (password.length < 6) {
                        return error(400, 'Password must be at least 6 characters');
                    }

                    // Check if user exists
                    const existingUser = await env.DB.prepare(
                        'SELECT * FROM users WHERE email = ? OR username = ?'
                    ).bind(email, username).first();

                    if (existingUser) {
                        return error(409, 'User already exists');
                    }

                    // Hash password and create user
                    const passwordHash = await simpleHash(password);
                    const result = await env.DB.prepare(
                        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
                    ).bind(username, email, passwordHash).run();

                    const user = {
                        id: result.meta.last_row_id,
                        username,
                        email
                    };

                    const token = generateToken(user, env.JWT_SECRET);

                    return json({
                        message: 'User registered successfully',
                        user,
                        token
                    });
                }

                if (path === '/api/login' && method === 'POST') {
                    const { email, password } = await request.json();

                    if (!email || !password) {
                        return error(400, 'Email and password are required');
                    }

                    // Find user
                    const user = await env.DB.prepare(
                        'SELECT * FROM users WHERE email = ?'
                    ).bind(email).first();

                    if (!user || !(await comparePassword(password, user.password_hash))) {
                        return error(401, 'Invalid credentials');
                    }

                    const token = generateToken(user, env.JWT_SECRET);

                    return json({
                        message: 'Login successful',
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email
                        },
                        token
                    });
                }

                if (path === '/api/verify' && method === 'GET') {
                    const user = await authenticateToken(request, env);
                    if (!user) {
                        return error(401, 'Invalid token');
                    }

                    const userData = await env.DB.prepare(
                        'SELECT id, username, email FROM users WHERE id = ?'
                    ).bind(user.userId).first();

                    if (!userData) {
                        return error(404, 'User not found');
                    }

                    return json({ user: userData });
                }

                // Movie routes
                if (path === '/api/movies/popular' && method === 'GET') {
                    const page = url.searchParams.get('page') || 1;
                    const movies = await tmdbFetch(`/movie/popular?page=${page}`, env);
                    return json(movies.results);
                }

                if (path === '/api/movies/search' && method === 'GET') {
                    const query = url.searchParams.get('query');
                    const page = url.searchParams.get('page') || 1;

                    if (!query) {
                        return error(400, 'Query parameter is required');
                    }

                    const movies = await tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`, env);
                    return json(movies.results);
                }

                if (path.match(/^\/api\/movies\/\d+$/) && method === 'GET') {
                    const movieId = path.split('/').pop();
                    try {
                        const movie = await tmdbFetch(`/movie/${movieId}?append_to_response=videos,credits`, env);
                        
                        // Extract trailer
                        const trailer = movie.videos?.results?.find(
                            video => video.type === 'Trailer' && video.site === 'YouTube'
                        );

                        return json({
                            ...movie,
                            trailer: trailer || null
                        });
                    } catch (err) {
                        return error(404, 'Movie not found');
                    }
                }

                if (path === '/api/movies/trending' && method === 'GET') {
                    const movies = await tmdbFetch('/trending/movie/week', env);
                    return json(movies.results);
                }

                if (path === '/api/genres' && method === 'GET') {
                    const data = await tmdbFetch('/genre/movie/list', env);
                    return json(data.genres);
                }

                // Favorites routes (protected)
                if (path === '/api/favorites' && method === 'GET') {
                    const user = await authenticateToken(request, env);
                    if (!user) {
                        return error(401, 'Unauthorized');
                    }

                    const favorites = await env.DB.prepare(
                        'SELECT movie_data FROM favorites WHERE user_id = ? ORDER BY created_at DESC'
                    ).bind(user.userId).all();

                    const movies = favorites.results.map(row => JSON.parse(row.movie_data));
                    return json(movies);
                }

                if (path === '/api/favorites' && method === 'POST') {
                    const user = await authenticateToken(request, env);
                    if (!user) {
                        return error(401, 'Unauthorized');
                    }

                    const { movie_data } = await request.json();
                    
                    if (!movie_data || !movie_data.id) {
                        return error(400, 'Invalid movie data');
                    }

                    await env.DB.prepare(
                        'INSERT OR REPLACE INTO favorites (user_id, movie_id, movie_data) VALUES (?, ?, ?)'
                    ).bind(user.userId, movie_data.id, JSON.stringify(movie_data)).run();

                    return json({ message: 'Movie added to favorites' });
                }

                if (path.match(/^\/api\/favorites\/\d+$/) && method === 'DELETE') {
                    const user = await authenticateToken(request, env);
                    if (!user) {
                        return error(401, 'Unauthorized');
                    }

                    const movieId = path.split('/').pop();
                    await env.DB.prepare(
                        'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?'
                    ).bind(user.userId, movieId).run();

                    return json({ message: 'Movie removed from favorites' });
                }

                // Watch history routes (protected)
                if (path === '/api/watch-history' && method === 'GET') {
                    const user = await authenticateToken(request, env);
                    if (!user) {
                        return error(401, 'Unauthorized');
                    }

                    const history = await env.DB.prepare(
                        'SELECT movie_id, movie_data, watched_at FROM watch_history WHERE user_id = ? ORDER BY watched_at DESC LIMIT 50'
                    ).bind(user.userId).all();

                    const items = history.results.map(row => ({
                        movie_id: row.movie_id,
                        movie_data: JSON.parse(row.movie_data),
                        watched_at: row.watched_at
                    }));

                    return json(items);
                }

                if (path === '/api/watch-history' && method === 'POST') {
                    const user = await authenticateToken(request, env);
                    if (!user) {
                        return error(401, 'Unauthorized');
                    }

                    const { movie_data } = await request.json();
                    
                    if (!movie_data || !movie_data.id) {
                        return error(400, 'Invalid movie data');
                    }

                    // Remove existing entry if exists
                    await env.DB.prepare(
                        'DELETE FROM watch_history WHERE user_id = ? AND movie_id = ?'
                    ).bind(user.userId, movie_data.id).run();

                    // Insert new entry
                    await env.DB.prepare(
                        'INSERT INTO watch_history (user_id, movie_id, movie_data) VALUES (?, ?, ?)'
                    ).bind(user.userId, movie_data.id, JSON.stringify(movie_data)).run();

                    return json({ message: 'Watch recorded' });
                }
            }

            // Route not found
            return error(404, 'Route not found');

        } catch (err) {
            console.error('Server Error:', err);
            return error(500, 'Internal Server Error');
        }
    }
};