// Get DOM elements
const apiKey = 'YOUR_API_KEY';
const searchQuery = 'nature';
const endpoint = `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${apiKey}`;
const bgImageEl = document.getElementById("bg-image");
const imageInfoEl = document.getElementById("image-info");
const downloadBtn = document.getElementById("download-btn");
const shareBtn = document.getElementById("share-btn");
const toggleInfoBtn = document.getElementById("toggle-info-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const searchInput = document.getElementById("search-input");
const loadingIndicator = document.getElementById("loading-indicator");
const imageCounter = document.getElementById("image-counter");

let currentImageIndex = 0;
let images = [];
let autoChangeIntervalId;
const autoChangeInterval = 5000; // 5 seconds

// Function to fetch images from API
async function fetchImages(query) {
  try {
    loadingIndicator.style.display = 'block';
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}`);
    const data = await response.json();
    images = data.results;
    currentImageIndex = 0;
    changeBackgroundImage();
    updateImageCounter();
    clearInterval(autoChangeIntervalId);
    autoChangeIntervalId = setInterval(autoChangeImage, autoChangeInterval);
  } catch (error) {
    console.error('Error fetching images', error);
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

// Function to update image
function updateImage() {
  bgImageEl.style.opacity = 1 - window.pageYOffset / 900;
  bgImageEl.style.backgroundSize = 160 - window.pageYOffset / 12 + "%";
}

// Function to change background image
function changeBackgroundImage() {
  if (images.length === 0) return;
  const image = images[currentImageIndex];
  bgImageEl.style.backgroundImage = `url(${image.urls.regular})`;
  imageInfoEl.innerHTML = `
    <p>Image Description: ${image.description || 'No description available'}</p>
    <p>Image Format: ${image.width}x${image.height}</p>
    <p>Photographer: ${image.user.name}</p>
  `;
}

// Function to update image counter
function updateImageCounter() {
  imageCounter.textContent = `${currentImageIndex + 1} of ${images.length}`;
}

// Function to auto-change image
function autoChangeImage() {
  if (images.length > 0) {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    changeBackgroundImage();
    updateImageCounter();
  }
}

// Event listeners
downloadBtn.addEventListener('click', () => {
  const image = images[currentImageIndex];
  const link = document.createElement('a');
  link.href = image.urls.full;
  link.download = 'image.jpg';
  link.click();
});

shareBtn.addEventListener('click', () => {
  const image = images[currentImageIndex];
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${image.urls.full}`;
  window.open(shareUrl, '_blank');
});

toggleInfoBtn.addEventListener('click', () => {
  imageInfoEl.style.display = imageInfoEl.style.display === 'none' ? 'block' : 'none';
});

fullscreenBtn.addEventListener('click', () => {
  document.documentElement.requestFullscreen();
});

prevBtn.addEventListener('click', () => {
  changeImage(-1);
});

nextBtn.addEventListener('click', () => {
  changeImage(1);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    fetchImages(searchInput.value);
  }
});

window.addEventListener("scroll", () => {
  updateImage();
});

// Function to change image
function changeImage(direction) {
  currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
  changeBackgroundImage();
  updateImageCounter();
  clearInterval(autoChangeIntervalId);
  autoChangeIntervalId = setInterval(autoChangeImage, autoChangeInterval);
}

// Initialize
fetchImages(searchQuery);