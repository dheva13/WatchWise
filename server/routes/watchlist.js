const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await db.listWatchlist(req.session.userId);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { tmdbId, title, releaseYear, posterPath } = req.body || {};
    if (!tmdbId) return res.status(400).json({ error: 'tmdbId is required' });
    await db.addWatchlistItem(req.session.userId, { tmdbId, title, releaseYear, posterPath });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:tmdbId', async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);
    if (!tmdbId) return res.status(400).json({ error: 'Invalid tmdbId' });
    await db.removeWatchlistItem(req.session.userId, tmdbId);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;