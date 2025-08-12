const watchlistResults = document.getElementById("watchlist-results");
const homeButton = document.getElementById("home-button");
const clearButton = document.getElementById("clear-button");

// Event listeners
homeButton.addEventListener("click", goHome);
clearButton.addEventListener("click", clearWatchlist);

// Function to redirect to the home page
function goHome() {
  window.location.href = "index.html";
}

async function fetchWatchlist() {
  const res = await fetch('/api/watchlist');
  if (res.status === 401) {
    window.location.href = 'login.html';
    return [];
  }
  if (!res.ok) throw new Error('Failed to load watchlist');
  const data = await res.json();
  return data.items || [];
}

// Function to clear the watchlist
async function clearWatchlist() {
  const confirmed = confirm("Are you sure you want to clear the watchlist?");
  if (!confirmed) return;
  const items = await fetchWatchlist();
  await Promise.allSettled(items.map((item) => deleteItem(item.tmdbId)));
  await loadWatchlist();
}

async function deleteItem(tmdbId) {
  const res = await fetch(`/api/watchlist/${tmdbId}`, { method: 'DELETE' });
  if (res.status === 401) {
    window.location.href = 'login.html';
    return;
  }
  if (!res.ok) throw new Error('Failed to remove item');
}

// Function to load watchlist from server
async function loadWatchlist() {
  try {
    const items = await fetchWatchlist();
    if (items.length === 0) {
      watchlistResults.innerHTML = "<p>Your watchlist is empty.</p>";
    } else {
      displayMovies(items);
    }
  } catch (e) {
    watchlistResults.innerHTML = `<p class="error">${e.message}</p>`;
  }
}

// Function to display movies
function displayMovies(movies) {
  watchlistResults.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    watchlistResults.appendChild(movieCard);
  });
}

// Function to create a movie card
function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const posterPath = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "https://placehold.co/200x300?text=No+Image";
  const moviePoster = document.createElement("img");
  moviePoster.src = posterPath;
  moviePoster.alt = movie.title || "Movie Poster";
  moviePoster.classList.add("movie-poster");
  movieCard.appendChild(moviePoster);

  const year = movie.releaseYear || "N/A";
  const movieTitle = document.createElement("h3");
  movieTitle.textContent = `${movie.title || "Untitled"} (${year})`;
  movieTitle.classList.add("movie-title");
  movieCard.appendChild(movieTitle);

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("remove-button");
  removeButton.addEventListener("click", async () => {
    try {
      await deleteItem(movie.tmdbId);
      movieCard.remove();
      if (!watchlistResults.hasChildNodes()) {
        watchlistResults.innerHTML = "<p>Your watchlist is empty.</p>";
      }
    } catch (e) {
      alert(e.message);
    }
  });
  movieCard.appendChild(removeButton);

  return movieCard;
}

// Load watchlist when the page loads
window.addEventListener("load", loadWatchlist);

// Function to remove a movie from the watchlist
function removeMovieFromWatchlist(movie) { /* no-op, server-backed now */ }




