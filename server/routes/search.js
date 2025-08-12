const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = (req.query.query || '').toString().trim();
    if (!query) return res.json({ results: [] });
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'TMDB API key not configured' });

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    const r = await fetch(url);
    if (!r.ok) return res.status(502).json({ error: 'TMDB request failed' });
    const data = await r.json();
    res.json({ results: Array.isArray(data.results) ? data.results : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;