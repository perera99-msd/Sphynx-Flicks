<div align="center">

# 🎬 Sphynx Flicks

**A sleek, full-stack movie discovery platform — find trending films, search by genre, and manage your personal watchlist.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sphynx--flicks.pages.dev-blue?style=for-the-badge&logo=cloudflare)](https://sphynx-flicks.pages.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Issues](https://img.shields.io/github/issues/perera99-msd/Sphynx-Flicks?style=for-the-badge)](https://github.com/perera99-msd/Sphynx-Flicks/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/perera99-msd/Sphynx-Flicks?style=for-the-badge)](https://github.com/perera99-msd/Sphynx-Flicks/pulls)
[![Stars](https://img.shields.io/github/stars/perera99-msd/Sphynx-Flicks?style=for-the-badge)](https://github.com/perera99-msd/Sphynx-Flicks/stargazers)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Credits](#-credits)

---

## 🌟 Overview

**Sphynx Flicks** is a modern, full-stack movie discovery web application that lets users explore trending and popular films, search across a vast catalogue, filter by genre and ratings, and maintain personal watchlists — all from a fast, responsive UI.

The frontend is a React + Vite SPA deployed to **Cloudflare Pages**, while the backend runs as a **Cloudflare Worker** backed by **Cloudflare D1** (SQLite-compatible) for user data persistence and **TMDb API** for movie metadata.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔥 **Trending Movies** | Real-time trending movies updated daily via TMDb |
| 🔍 **Instant Search** | Live search with debouncing for a smooth experience |
| 🎭 **Genre Browsing** | Filter movies by any of 19 supported genres |
| ⭐ **Ratings & Details** | Full movie info — cast, synopsis, runtime, ratings |
| 🔐 **Authentication** | Secure user sign-up / login with hashed passwords |
| ❤️ **Favourites** | Save and manage a personal list of favourite movies |
| 📺 **Watch History** | Automatic tracking of recently viewed films |
| 📱 **Responsive UI** | Fully responsive design for desktop, tablet, and mobile |
| ⚡ **Edge Performance** | Both frontend and backend deployed on Cloudflare's global edge |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI library |
| [Vite 5](https://vitejs.dev/) | Build tool & dev server |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Swiper](https://swiperjs.com/) | Carousel components |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon library |
| [Axios](https://axios-http.com/) | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| [Cloudflare Workers](https://workers.cloudflare.com/) | Serverless edge runtime |
| [Cloudflare D1](https://developers.cloudflare.com/d1/) | Serverless SQLite database |
| [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) | Local dev & deployment |

### External APIs
| Service | Purpose |
|---|---|
| [TMDb API](https://www.themoviedb.org/documentation/api) | Movie metadata, trending, search, genres |

---

## 📸 Screenshots

> **Live preview:** [https://sphynx-flicks.pages.dev/](https://sphynx-flicks.pages.dev/)

| Home / Trending | Movie Details | Search Results |
|:---:|:---:|:---:|
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| [Node.js](https://nodejs.org/) | v18 or newer |
| npm | v9 or newer (bundled with Node.js) |
| [Cloudflare account](https://dash.cloudflare.com/sign-up) | Free tier is sufficient |
| TMDb API key | [Register here](https://developer.themoviedb.org/docs/getting-started) |

### Installation

1. **Fork & clone the repository**

   ```bash
   git clone https://github.com/perera99-msd/Sphynx-Flicks.git
   cd Sphynx-Flicks
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure environment variables** _(see section below)_

5. **Initialise the D1 database** (first-time setup)

   ```bash
   cd backend
   npm run db:init
   ```

6. **Start the development servers**

   ```bash
   # Terminal 1 — Frontend (http://localhost:3000)
   npm run dev

   # Terminal 2 — Backend (Cloudflare Worker local emulation)
   cd backend
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the **project root** (frontend):

```dotenv
# .env  —  frontend
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

Backend environment variables are managed through **Cloudflare Dashboard → Workers → Settings → Variables** or via `wrangler.toml` for local development. Key secrets:

| Variable | Description |
|---|---|
| `TMDB_API_KEY` | Your TMDb API key |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

> ⚠️ **Never commit `.env` files or real secrets to source control.**

---

## 📜 Available Scripts

### Frontend (project root)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server at `http://localhost:3000` |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |

### Backend (`backend/`)

| Command | Description |
|---|---|
| `npm run dev` | Run the Cloudflare Worker locally with Wrangler |
| `npm run deploy` | Deploy the Worker to Cloudflare's edge network |
| `npm run db:init` | Initialise / migrate the D1 database schema |

---

## 📁 Project Structure

```
Sphynx-Flicks/
├── backend/                  # Cloudflare Worker backend
│   ├── src/                  # Worker source files
│   ├── schema.sql            # D1 database schema (users, favourites, history)
│   ├── server.js             # Worker entry point
│   ├── wrangler.toml         # Cloudflare Wrangler configuration
│   └── package.json
│
├── public/                   # Static assets served as-is
│
├── src/                      # React frontend source
│   ├── assets/               # Images, fonts, static files
│   ├── components/           # Reusable UI components
│   │   ├── AuthModal/        # Login / register modal
│   │   ├── Header/           # Navigation bar
│   │   ├── Hero/             # Hero banner with featured movie
│   │   ├── MovieCard/        # Individual movie card
│   │   ├── MovieGrid/        # Paginated grid of movies
│   │   ├── MovieModal/       # Movie detail pop-up
│   │   └── UserProfile/      # User profile & watchlist
│   ├── contexts/             # React context providers (auth, etc.)
│   ├── services/             # API service layer (movieService.js)
│   ├── styles/               # Global CSS modules
│   ├── App.jsx               # Root application component
│   └── main.jsx              # React entry point
│
├── .env                      # Local environment variables (git-ignored)
├── .gitignore
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point for Vite
├── package.json              # Frontend dependencies & scripts
├── vite.config.js            # Vite build configuration
└── README.md
```

---

## 🔌 API Reference

The backend exposes a REST API at `https://backend.msdperera99.workers.dev/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies/popular?page={n}` | Paginated list of popular movies |
| `GET` | `/api/movies/trending` | Current trending movies |
| `GET` | `/api/movies/search?query={q}&page={n}` | Search movies by title |
| `GET` | `/api/movies/{id}` | Full details for a single movie |
| `GET` | `/api/movies/genre/{genreId}?page={n}` | Movies filtered by genre |
| `GET` | `/api/genres` | Full list of available genres |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/user/favourites` | Get authenticated user's favourites |
| `POST` | `/api/user/favourites` | Add a movie to favourites |
| `DELETE` | `/api/user/favourites/{movieId}` | Remove a movie from favourites |

---

## ☁️ Deployment

This project is deployed entirely on **Cloudflare's edge network** — no traditional server required.

| Layer | Platform | URL |
|---|---|---|
| Frontend | Cloudflare Pages | [sphynx-flicks.pages.dev](https://sphynx-flicks.pages.dev/) |
| Backend API | Cloudflare Workers | [backend.msdperera99.workers.dev](https://backend.msdperera99.workers.dev/) |
| Database | Cloudflare D1 | Managed via Wrangler |

### Deploying the Frontend

```bash
# Build the production bundle
npm run build

# Deploy to Cloudflare Pages (via Git integration or Wrangler)
# Typically connected automatically via GitHub → Cloudflare Pages dashboard
```

### Deploying the Backend

```bash
cd backend

# Authenticate with Cloudflare
npx wrangler login

# Deploy the Worker
npm run deploy
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| **`VITE_TMDB_API_KEY` is undefined** | Ensure `.env` is in the project root and variable starts with `VITE_` |
| **Backend returns 401** | Check that `JWT_SECRET` is set in your Cloudflare Worker environment |
| **D1 queries failing locally** | Run `npm run db:init` in the `backend/` directory to apply the schema |
| **Build fails with ESLint errors** | Run `npm run lint` to see all violations, then fix before building |
| **Port 3000 already in use** | Change `server.port` in `vite.config.js` or kill the conflicting process |
| **CORS errors in development** | Ensure your Wrangler dev URL matches the `API_BASE_URL` in `movieService.js` |

---

## 🗺 Roadmap

- [ ] Advanced filtering (release year, language, runtime)
- [ ] Movie trailer playback (YouTube embed)
- [ ] Social sharing of watchlists
- [ ] Notifications for new releases in followed genres
- [ ] Dark / Light theme toggle
- [ ] PWA support (offline favourites)
- [ ] Internationalisation (i18n)

---

## 🤝 Contributing

Contributions are very welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request and fill in the template

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- Movie data provided by [The Movie Database (TMDb)](https://www.themoviedb.org/) — *This product uses the TMDb API but is not endorsed or certified by TMDb.*
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Hosted on [Cloudflare](https://www.cloudflare.com/)

---

<div align="center">

Built with ❤️ by [perera99-msd](https://github.com/perera99-msd)

</div>
