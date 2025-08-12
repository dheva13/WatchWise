const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const dotenv = require('dotenv');
dotenv.config();

// Ensure data directory exists
const dataDir = path.resolve(process.env.DATA_DIR || path.join(__dirname, '..', 'data'));
fs.mkdirSync(dataDir, { recursive: true });

const {
  router: authRouter,
  requireAuth,
} = require('./routes/auth');
const watchlistRouter = require('./routes/watchlist');
const searchRouter = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new SQLiteStore({
      db: path.basename(process.env.SESSIONS_FILE || path.join(dataDir, 'sessions.sqlite')),
      dir: dataDir,
    }),
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// API routes
app.use('/api/auth', authRouter);
app.use('/api/watchlist', requireAuth, watchlistRouter);
app.use('/api/search', searchRouter);

// Serve static files (frontend) from repo root
const staticRoot = path.resolve(path.join(__dirname, '..'));
app.use(express.static(staticRoot));

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(staticRoot, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});