// API configuration
const baseUrl = "https://api.themoviedb.org/3";
const apiKey = (window.__CONFIG && window.__CONFIG.TMDB_API_KEY) || "";

// Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const watchlistButton = document.getElementById("watchlist-button");

let watchlistIdSet = null; // Set of tmdbIds for current user

async function preloadWatchlistIds() {
  try {
    const res = await fetch('/api/watchlist');
    if (!res.ok) return null;
    const data = await res.json();
    const set = new Set((data.items || []).map((i) => i.tmdbId));
    watchlistIdSet = set;
    return set;
  } catch (_) {
    return null;
  }
}

// Event listeners
if (searchForm) {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = (searchInput && searchInput.value) || "";
    // Preload watchlist ids for better UX (ignores 401s)
    if (watchlistIdSet === null) await preloadWatchlistIds();
    searchMovies(searchTerm.trim());
  });
}

if (watchlistButton) {
  watchlistButton.addEventListener("click", goToWatchlist);
}

// Function to search movies via backend proxy
async function searchMovies(query) {
  if (!query) {
    searchResults.innerHTML = "<p>Please enter a movie title.</p>";
    return;
  }
  try {
    const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    displayMovies(Array.isArray(data.results) ? data.results : []);
  } catch (error) {
    console.log("Error:", error.message);
    searchResults.innerHTML = "<p>Something went wrong while fetching movies.</p>";
  }
}

// Function to display movies
function displayMovies(movies) {
  searchResults.innerHTML = "";
  if (!movies || movies.length === 0) {
    searchResults.innerHTML = "<p>No results found.</p>";
    return;
  }
  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    searchResults.appendChild(movieCard);
  });
}

// Function to create a movie card
function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/200x300?text=No+Image";
  const moviePoster = document.createElement("img");
  moviePoster.src = posterPath;
  moviePoster.alt = movie.title || "Movie Poster";
  moviePoster.classList.add("movie-poster");
  movieCard.appendChild(moviePoster);

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const movieTitle = document.createElement("h3");
  movieTitle.textContent = `${movie.title || "Untitled"} (${year})`;
  movieTitle.classList.add("movie-title");
  movieCard.appendChild(movieTitle);

  const addButton = document.createElement("button");
  addButton.classList.add("watchlist-button");
  const alreadyAdded = !!(watchlistIdSet && watchlistIdSet.has(movie.id));
  addButton.textContent = alreadyAdded ? "Added to Watchlist" : "Add to Watchlist";
  addButton.disabled = alreadyAdded;
  addButton.addEventListener("click", async () => {
    try {
      const payload = {
        tmdbId: movie.id,
        title: movie.title || '',
        releaseYear: year,
        posterPath: movie.poster_path || '',
      };
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        window.location.href = 'login.html';
        return;
      }
      if (!res.ok) throw new Error('Failed to add to watchlist');
      addButton.textContent = "Added to Watchlist";
      addButton.disabled = true;
      if (watchlistIdSet) watchlistIdSet.add(movie.id);
    } catch (e) {
      alert(e.message);
    }
  });
  movieCard.appendChild(addButton);

  return movieCard;
}

// Function to redirect to the watchlist page
function goToWatchlist() {
  window.location.href = "watchlist.html";
}
