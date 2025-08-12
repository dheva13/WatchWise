# WatchWise

A lightweight movie search and personal watchlist web app with user accounts. Search films, save them to your own watchlist, and manage your list across sessions.

> This product uses the TMDB API but is not endorsed or certified by TMDB.

## Features
- Search movies by title (TMDB-powered, proxied through the backend)
- Login/register with secure password hashing and sessions
- Personal server-backed Watchlist per user (SQLite)
- Responsive UI and graceful fallbacks for missing data

## Tech stack
- Frontend: HTML, CSS, JavaScript (no framework)
- Backend: Node.js, Express, SQLite, express-session
- TMDB API for movie data

## Quick start

### 1) Install dependencies
```bash
npm install
```

### 2) Set environment variables
Copy `.env.example` to `.env` and fill values:
- `SESSION_SECRET`: a long random string
- `TMDB_API_KEY`: your TMDB v3 API key
- Optionally adjust `PORT`, `DATABASE_FILE`, `SESSIONS_FILE`

### 3) Run the server
- Development with auto-reload:
```bash
npm run dev
```
- Production:
```bash
npm start
```
Open `http://localhost:3000` (or your `PORT`).

## Project structure
```
.
├── server/
│   ├── index.js           # Express app, sessions, static hosting
│   ├── db.js              # SQLite schema and helpers
│   └── routes/
│       ├── auth.js        # Register, login, logout, me
│       ├── search.js      # TMDB search proxy
│       └── watchlist.js   # CRUD endpoints for watchlist (auth required)
├── index.html             # Search page
├── watchlist.html         # Watchlist page
├── login.html             # Login page
├── register.html          # Register page
├── script.js              # Search UI -> backend APIs
├── watchlist.js           # Watchlist UI -> backend APIs
├── login.js               # Login UI handler
├── register.js            # Register UI handler
├── auth.js                # Header auth state rendering
├── styles.css             # Styles
├── backg.jpg              # Background image
├── .env.example           # Server env example
├── .gitignore
├── .editorconfig
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md
```

## Data and security
- Passwords are stored as bcrypt hashes.
- Sessions are stored server-side using `connect-sqlite3`.
- Each user has a separate watchlist; endpoints require auth.

## API overview (client-facing)
- `GET /api/auth/me`: current user or null
- `POST /api/auth/register { email, password }`
- `POST /api/auth/login { email, password }`
- `POST /api/auth/logout`
- `GET /api/search?query=...`: search TMDB
- `GET /api/watchlist`: list current user watchlist
- `POST /api/watchlist { tmdbId, title, releaseYear, posterPath }`: add item
- `DELETE /api/watchlist/:tmdbId`: remove item

## Deployment
- This app is an Express server that also serves the static frontend. Deploy to any Node-compatible platform. Provide a `.env` with `TMDB_API_KEY` and `SESSION_SECRET`.

## Attribution
- Data and images courtesy of [TMDB](https://www.themoviedb.org/). See their terms and attribution requirements.

## License
MIT © 2025

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
