// src/index.js - Debugging version with detailed database errors

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://sphynx-flicks.pages.dev',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
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

// Simple password hashing
const simpleHash = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'movie-app-salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Simple token generation
const generateToken = (user) => {
    const tokenData = {
        userId: user.id,
        email: user.email,
        timestamp: Date.now()
    };
    return btoa(JSON.stringify(tokenData));
};

// Main handler
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        console.log(`[${method}] ${path}`);

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
                // Test database connection first
                if (path === '/api/test-db' && method === 'GET') {
                    try {
                        const test = await env.DB.prepare('SELECT 1 as test').first();
                        return json({ database: 'connected', test });
                    } catch (dbError) {
                        console.error('Database connection test failed:', dbError);
                        return error(500, 'Database connection failed: ' + dbError.message);
                    }
                }

                // Authentication routes
                if (path === '/api/register' && method === 'POST') {
                    console.log('Registration attempt');
                    
                    let body;
                    try {
                        body = await request.json();
                    } catch (e) {
                        return error(400, 'Invalid JSON in request body');
                    }
                    
                    const { username, email, password } = body;

                    if (!username || !email || !password) {
                        return error(400, 'All fields are required');
                    }

                    if (password.length < 6) {
                        return error(400, 'Password must be at least 6 characters');
                    }

                    try {
                        console.log('Checking for existing user...');
                        // Check if user exists
                        const existingUser = await env.DB.prepare(
                            'SELECT * FROM users WHERE email = ? OR username = ?'
                        ).bind(email, username).first();

                        if (existingUser) {
                            console.log('User already exists');
                            return error(409, 'User already exists');
                        }

                        console.log('Hashing password...');
                        // Hash password
                        const passwordHash = await simpleHash(password);
                        
                        console.log('Creating user in database...');
                        // Create user
                        let result;
                        try {
                            result = await env.DB.prepare(
                                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
                            ).bind(username, email, passwordHash).run();
                            
                            console.log('Database result:', result);
                            
                            if (!result.success) {
                                throw new Error('Insert failed: ' + JSON.stringify(result));
                            }
                            
                        } catch (dbError) {
                            console.error('SQL Insert Error:', dbError);
                            console.error('Error details:', {
                                message: dbError.message,
                                cause: dbError.cause,
                                stack: dbError.stack
                            });
                            
                            if (dbError.message && dbError.message.includes('UNIQUE')) {
                                return error(409, 'User already exists');
                            }
                            if (dbError.message && dbError.message.includes('no such table')) {
                                return error(500, 'Database not properly initialized. Tables missing.');
                            }
                            
                            return error(500, 'Database insert failed: ' + dbError.message);
                        }

                        console.log('User created with ID:', result.meta.last_row_id);

                        const user = {
                            id: result.meta.last_row_id,
                            username,
                            email
                        };

                        const token = generateToken(user);

                        return json({
                            message: 'User registered successfully',
                            user,
                            token
                        });
                    } catch (dbError) {
                        console.error('Registration process error:', dbError);
                        console.error('Full error details:', JSON.stringify(dbError, null, 2));
                        return error(500, 'Registration process failed: ' + dbError.message);
                    }
                }

                // Login route
                if (path === '/api/login' && method === 'POST') {
                    let body;
                    try {
                        body = await request.json();
                    } catch (e) {
                        return error(400, 'Invalid JSON in request body');
                    }

                    const { email, password } = body;

                    if (!email || !password) {
                        return error(400, 'Email and password are required');
                    }

                    try {
                        const user = await env.DB.prepare(
                            'SELECT * FROM users WHERE email = ?'
                        ).bind(email).first();

                        if (!user) {
                            return error(401, 'Invalid credentials');
                        }

                        const passwordMatch = await simpleHash(password) === user.password_hash;
                        if (!passwordMatch) {
                            return error(401, 'Invalid credentials');
                        }

                        const token = generateToken(user);

                        return json({
                            message: 'Login successful',
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email
                            },
                            token
                        });
                    } catch (dbError) {
                        console.error('Login database error:', dbError);
                        return error(500, 'Login failed. Please try again.');
                    }
                }

                // Movie routes
                if (path === '/api/genres' && method === 'GET') {
                    try {
                        // Check if TMDB_API_KEY is set
                        if (!env.TMDB_API_KEY || env.TMDB_API_KEY === 'your-tmdb-api-key-here') {
                            return error(500, 'TMDB API key not configured');
                        }
                        const data = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${env.TMDB_API_KEY}`).then(r => r.json());
                        return json(data.genres);
                    } catch (err) {
                        console.error('Error fetching genres:', err);
                        return error(500, 'Failed to fetch genres');
                    }
                }

                if (path === '/api/movies/popular' && method === 'GET') {
                    try {
                        const page = url.searchParams.get('page') || 1;
                        const movies = await fetch(`https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=${env.TMDB_API_KEY}`).then(r => r.json());
                        return json(movies.results);
                    } catch (err) {
                        console.error('Error fetching popular movies:', err);
                        return error(500, 'Failed to fetch popular movies');
                    }
                }
            }

            return error(404, 'Route not found');

        } catch (err) {
            console.error('Unhandled Server Error:', err);
            return error(500, 'Internal Server Error: ' + err.message);
        }
    }
};