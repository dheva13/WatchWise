// API configuration
const apiKey = "1019e177f00ccecc3daf6562350ca81b";
const baseUrl = "https://api.themoviedb.org/3";

// Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const watchlistButton = document.getElementById("watchlist-button");
const homeButton = document.getElementById("home-button");

// Event listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value;
  searchMovies(searchTerm);
});

// Function to search movies
async function searchMovies(query) {
  const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${query}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// Function to display movies
function displayMovies(movies) {
  searchResults.innerHTML = "";
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
    : "no-poster.jpg";
  const moviePoster = document.createElement("img");
  moviePoster.src = posterPath;
  moviePoster.alt = movie.title;
  moviePoster.classList.add("movie-poster");
  movieCard.appendChild(moviePoster);

  const movieTitle = document.createElement("h3");
  movieTitle.textContent = `${movie.title} (${movie.release_date.slice(0, 4)})`;
  movieTitle.classList.add("movie-title");
  movieCard.appendChild(movieTitle);

  const watchlistButton = document.createElement("button");
  watchlistButton.classList.add("watchlist-button");
  updateWatchlistButtonState(movie, watchlistButton);
  watchlistButton.addEventListener("click", (e) => {
    toggleWatchlist(movie, e.target);
    updateWatchlistButtonState(movie, e.target);
  });
  movieCard.appendChild(watchlistButton);

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
function toggleWatchlist(movie, button) {
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

// Add event listeners to the buttons
watchlistButton.addEventListener("click", goToWatchlist);
homeButton.addEventListener("click", goHome);
