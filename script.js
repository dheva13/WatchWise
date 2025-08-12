// API configuration
const baseUrl = "https://api.themoviedb.org/3";
const apiKey = (window.__CONFIG && window.__CONFIG.TMDB_API_KEY) || "";

// Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const watchlistButton = document.getElementById("watchlist-button");

// Event listeners
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = (searchInput && searchInput.value) || "";
    searchMovies(searchTerm.trim());
  });
}

if (watchlistButton) {
  watchlistButton.addEventListener("click", goToWatchlist);
}

// Function to search movies
async function searchMovies(query) {
  if (!query) {
    searchResults.innerHTML = "<p>Please enter a movie title.</p>";
    return;
  }
  if (!apiKey) {
    searchResults.innerHTML = '<p class="error">TMDB API key is not configured. Create <code>config.js</code> from <code>config.example.js</code> and set your key.</p>';
    return;
  }
  const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
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
  updateWatchlistButtonState(movie, addButton);
  addButton.addEventListener("click", (e) => {
    toggleWatchlist(movie);
    updateWatchlistButtonState(movie, e.target);
  });
  movieCard.appendChild(addButton);

  return movieCard;
}

// Function to update the watchlist button state
function updateWatchlistButtonState(movie, button) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const movieIndex = watchlist.findIndex((item) => item.id === movie.id);
  if (movieIndex !== -1) {
    button.textContent = "Added to Watchlist";
    button.disabled = true;
  } else {
    button.textContent = "Add to Watchlist";
    button.disabled = false;
  }
}

// Function to add or remove a movie from the watchlist
function toggleWatchlist(movie) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const movieIndex = watchlist.findIndex((item) => item.id === movie.id);
  if (movieIndex !== -1) {
    watchlist.splice(movieIndex, 1);
  } else {
    watchlist.push(movie);
  }
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

// Function to redirect to the watchlist page
function goToWatchlist() {
  window.location.href = "watchlist.html";
}
