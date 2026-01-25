// Get elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const resultsDiv = document.getElementById('results');
const articlePreviewDiv = document.getElementById('article-preview');
const searchHistoryDiv = document.getElementById('search-history');
const paginationDiv = document.getElementById('pagination');
const suggestionsDiv = document.getElementById('suggestions');

// Initialize variables
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
let darkMode = localStorage.getItem('darkMode') === 'true';
let currentPage = 1;
let totalPages = 1;
let currentSearchTerm = '';

// Add event listeners
searchBtn.addEventListener('click', handleSearch);
randomBtn.addEventListener('click', handleRandomArticle);
darkModeBtn.addEventListener('click', handleDarkMode);
searchInput.addEventListener('input', handleSearchInput);

// Initialize dark mode
if (darkMode) {
  document.body.classList.add('dark-mode');
}

// Handle search
async function handleSearch(e) {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== '') {
    try {
      const data = await fetchWikipediaData(searchTerm, 1);
      displayResults(data);
      addSearchHistory(searchTerm);
    } catch (error) {
      console.error(error);
    }
  }
}

// Handle random article
async function handleRandomArticle() {
  try {
    const data = await fetchRandomArticle();
    const title = data.query.random[0].title;
    const articleData = await fetchArticlePreview(title);
    displayArticlePreview(articleData);
  } catch (error) {
    console.error(error);
  }
}

// Handle dark mode
function handleDarkMode() {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', darkMode);
  if (darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Handle search input
async function handleSearchInput() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== '') {
    try {
      const data = await fetchSearchSuggestions(searchTerm);
      displaySearchSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  } else {
    suggestionsDiv.style.display = 'none';
  }
}

// Fetch Wikipedia data
async function fetchWikipediaData(searchTerm, page) {
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&limit=10&namespace=0&format=json&origin=*&sroffset=${(page - 1) * 10}`;
  const response = await axios.get(url);
  return response.data;
}

// Fetch random article
async function fetchRandomArticle() {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`;
  const response = await axios.get(url);
  return response.data;
}

// Fetch article preview
async function fetchArticlePreview(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${title}&format=json&prop=text&origin=*`;
  const response = await axios.get(url);
  return response.data;
}

// Fetch search suggestions
async function fetchSearchSuggestions(searchTerm) {
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&limit=5&namespace=0&format=json&origin=*`;
  const response = await axios.get(url);
  return response.data;
}

// Display results
function displayResults(data) {
  const [searchTerm, titles, descriptions, links] = data;
  let html = '';
  titles.forEach((title, index) => {
    html += `
      <h2><a href="${links[index]}" target="_blank">${title}</a></h2>
      <p>${descriptions[index]}</p>
    `;
  });
  resultsDiv.innerHTML = html;
  totalPages = Math.ceil(titles.length / 10);
  displayPagination();
}

// Display article preview
function displayArticlePreview(data) {
  const html = data.parse.text['*'];
  articlePreviewDiv.innerHTML = html;
}

// Display search suggestions
function displaySearchSuggestions(data) {
  const [searchTerm, titles] = data;
  let html = '';
  titles.forEach((title) => {
    html += `
      <li onclick="searchInput.value='${title}'; handleSearch(event)">${title}</li>
    `;
  });
  suggestionsDiv.innerHTML = html;
  suggestionsDiv.style.display = 'block';
}

// Display pagination
function displayPagination() {
  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="btn btn-outline-secondary ${i === currentPage ? 'active' : ''}" onclick="fetchWikipediaData('${currentSearchTerm}', ${i})">${i}</button>
    `;
  }
  paginationDiv.innerHTML = html;
}

// Add search history
function addSearchHistory(searchTerm) {
  if (searchHistory.includes(searchTerm)) {
    searchHistory.splice(searchHistory.indexOf(searchTerm), 1);
  }
  searchHistory.push(searchTerm);
  if (searchHistory.length > 10) {
    searchHistory.shift();
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  let html = '';
  searchHistory.forEach((term, index) => {
    html += `
      <span>${term}</span>
      ${index < searchHistory.length - 1 ? ' > ' : ''}
    `;
  });
  searchHistoryDiv.innerHTML = html;
}