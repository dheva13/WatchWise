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

// Function to clear the watchlist
function clearWatchlist() {
  const confirmed = confirm("Are you sure you want to clear the watchlist?");
  if (confirmed) {
    localStorage.removeItem("watchlist");
    watchlistResults.innerHTML = "<p>Your watchlist is empty.</p>";
  }
}

// Function to load watchlist from local storage
function loadWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (watchlist.length === 0) {
    watchlistResults.innerHTML = "<p>Your watchlist is empty.</p>";
  } else {
    displayMovies(watchlist);
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
  
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => {
      removeMovieFromWatchlist(movie);
      movieCard.remove();
    });
    movieCard.appendChild(removeButton);
  
    return movieCard;
  }
  
// Load watchlist when the page loads
window.addEventListener("load", loadWatchlist);









//=======================================================
// Function to create a movie card

// Function to remove a movie from the watchlist
function removeMovieFromWatchlist(movie) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const movieIndex = watchlist.findIndex((item) => item.id === movie.id);
  if (movieIndex !== -1) {
    watchlist.splice(movieIndex, 1);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
}




