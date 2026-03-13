// API endpoint and API key for TMDB
const apiUrl = 'https://api.themoviedb.org/3';
const apiKey = 'YOUR_API_KEY_HERE'; // replace with your TMDB API key

// Get elements
const trendingMoviesContainer = document.getElementById('trending-movies');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const loader = document.createElement('div');

// Function to create a movie element
function createMovieElement(movie) {
  const movieElement = document.createElement('div');
  movieElement.classList.add('movie');
  movieElement.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <h3>${movie.title}</h3>
    <p>Rating: ${movie.vote_average}/10</p>
  `;
  return movieElement;
}

// Function to show loader
function showLoader() {
  loader.innerHTML = 'Loading...';
  loader.style.textAlign = 'center';
  loader.style.fontSize = '24px';
  trendingMoviesContainer.appendChild(loader);
}

// Function to hide loader
function hideLoader() {
  trendingMoviesContainer.removeChild(loader);
}

// Fetch trending movies
async function fetchTrendingMovies() {
  showLoader();
  try {
    const response = await fetch(`${apiUrl}/trending/movie/week?api_key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    hideLoader();
    displayTrendingMovies(data.results);
  } catch (error) {
    hideLoader();
    console.error('Error fetching trending movies:', error);
    displayError('Error fetching trending movies. Please try again later.');
  }
}

// Display trending movies
function displayTrendingMovies(movies) {
  trendingMoviesContainer.innerHTML = '';
  if (movies.length === 0) {
    displayError('No movies found.');
    return;
  }
  movies.forEach((movie) => {
    const movieElement = createMovieElement(movie);
    trendingMoviesContainer.appendChild(movieElement);
  });
}

// Search movies
async function searchMovies(query) {
  showLoader();
  try {
    const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    hideLoader();
    displaySearchResults(data.results);
  } catch (error) {
    hideLoader();
    console.error('Error searching movies:', error);
    displayError('Error searching movies. Please try again later.');
  }
}

// Display search results
function displaySearchResults(movies) {
  trendingMoviesContainer.innerHTML = '';
  if (movies.length === 0) {
    displayError('No movies found.');
    return;
  }
  movies.forEach((movie) => {
    const movieElement = createMovieElement(movie);
    trendingMoviesContainer.appendChild(movieElement);
  });
}

// Display error message
function displayError(message) {
  trendingMoviesContainer.innerHTML = `
    <p style="color: red;">${message}</p>
  `;
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      searchMovies(query);
    }
  }
});

// Initialize
fetchTrendingMovies();