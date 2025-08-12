const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.resolve(process.env.DATA_DIR || path.join(__dirname, '..', 'data'));
fs.mkdirSync(dataDir, { recursive: true });
const dbFile = path.resolve(process.env.DATABASE_FILE || path.join(dataDir, 'app.sqlite'));

const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tmdb_id INTEGER NOT NULL,
    title TEXT,
    release_year TEXT,
    poster_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tmdb_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
});

module.exports = {
  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  },
  getUserById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, email, created_at FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  },
  createUser(email, passwordHash) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        [email, passwordHash],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, email });
        }
      );
    });
  },
  listWatchlist(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT tmdb_id AS tmdbId, title, release_year AS releaseYear, poster_path AS posterPath FROM watchlist WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  },
  addWatchlistItem(userId, item) {
    const { tmdbId, title, releaseYear, posterPath } = item;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO watchlist (user_id, tmdb_id, title, release_year, poster_path) VALUES (?, ?, ?, ?, ?)',
        [userId, tmdbId, title, releaseYear, posterPath],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  },
  removeWatchlistItem(userId, tmdbId) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM watchlist WHERE user_id = ? AND tmdb_id = ?',
        [userId, tmdbId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  },
};