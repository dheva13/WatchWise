# WatchWise

A lightweight movie search and personal watchlist web app built on the TMDB API. Search films, add them to your watchlist, and manage your list locally in the browser.

> This product uses the TMDB API but is not endorsed or certified by TMDB.

## Features
- Search movies by title (powered by TMDB)
- Add movies to a local Watchlist (stored in `localStorage`)
- Remove individual items or clear the entire Watchlist
- Responsive layout and graceful fallbacks for missing data

## Tech stack
- HTML, CSS, JavaScript (no framework)
- TMDB API for movie data
- Browser `localStorage` for persistence

## Quick start

### 1) Get a TMDB API key
- Create a free account at [TMDB](https://www.themoviedb.org/)
- Create an API key (v3 auth)

### 2) Configure the app
- Copy `config.example.js` to `config.js`
- Edit `config.js` and set your `TMDB_API_KEY`

```js
window.__CONFIG__ = {
  TMDB_API_KEY: "YOUR_TMDB_API_KEY_HERE"
};
```

> Note: `config.js` is git-ignored and must not be committed.

### 3) Run locally
Use any static server (examples below):

- Python
```bash
python3 -m http.server 5173
```
Open `http://localhost:5173` in your browser.

- Node (no install) using npx
```bash
npx serve -s .
```

- VS Code Extension
Use the "Live Server" extension and open `index.html`.

## Project structure
```
.
├── index.html          # Search page
├── watchlist.html      # Watchlist page
├── script.js           # Search logic + add to watchlist
├── watchlist.js        # Watchlist rendering + removal
├── styles.css          # Styles
├── backg.jpg           # Background image
├── config.example.js   # Example client-side config (copy to config.js)
├── .gitignore
├── .editorconfig
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

## Development notes
- API key: injected client-side via `config.js` and read from `window.__CONFIG.TMDB_API_KEY`.
- Fallbacks: A placeholder image is used when a poster is unavailable, and missing release years display as `N/A`.
- Storage: Watchlist is stored under the `watchlist` key in `localStorage`.

## Accessibility and responsiveness
- Includes a responsive viewport meta tag and keyboard-accessible controls.

## Deployment
- This is a static site. You can deploy to any static host (GitHub Pages, Netlify, Vercel, etc.).
- Ensure `config.js` is provided in the deployed environment (not in version control).

## Attribution
- Data and images courtesy of [TMDB](https://www.themoviedb.org/). Read their [terms of use](https://www.themoviedb.org/documentation/api/terms-of-use) and [attribution requirements](https://www.themoviedb.org/documentation/api/terms-of-use#attribution).

## License
MIT © 2025

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md). Please do not include secrets in PRs.
