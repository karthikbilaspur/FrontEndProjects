const thumbnails = document.querySelectorAll('.thumbnail');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeLightbox = document.getElementById('close-lightbox');
const prevImageButton = document.getElementById('prev-image');
const nextImageButton = document.getElementById('next-image');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');
const rotateLeftButton = document.getElementById('rotate-left');
const rotateRightButton = document.getElementById('rotate-right');
const filterButtons = document.querySelectorAll('.filter-button');
const shareButtons = document.querySelectorAll('.share-button');
const slideshowSpeedInput = document.getElementById('slideshow-speed');

let currentImageIndex = 0;
let slideshowInterval;
let zoomLevel = 1;
let rotation = 0;

thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener('click', () => {
    currentImageIndex = index;
    if (thumbnail.tagName === 'IMG') {
      lightboxImage.src = thumbnail.src;
      lightboxImage.style.display = 'block';
      lightboxVideo.style.display = 'none';
    } else if (thumbnail.tagName === 'VIDEO') {
      lightboxVideo.src = thumbnail.src;
      lightboxVideo.style.display = 'block';
      lightboxImage.style.display = 'none';
    }
    lightboxCaption.textContent = thumbnail.dataset.caption;
    lightbox.style.display = 'flex';
    startSlideshow();
  });
});

closeLightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  clearInterval(slideshowInterval);
});

prevImageButton.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
  updateLightbox();
});

nextImageButton.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
  updateLightbox();
});

zoomInButton.addEventListener('click', () => {
  zoomLevel += 0.1;
  lightboxImage.style.transform = `scale(${zoomLevel}) rotate(${rotation}deg)`;
});

zoomOutButton.addEventListener('click', () => {
  zoomLevel -= 0.1;
  lightboxImage.style.transform = `scale(${zoomLevel}) rotate(${rotation}deg)`;
});

rotateLeftButton.addEventListener('click', () => {
  rotation -= 90;
  lightboxImage.style.transform = `scale(${zoomLevel}) rotate(${rotation}deg)`;
});

rotateRightButton.addEventListener('click', () => {
  rotation += 90;
  lightboxImage.style.transform = `scale(${zoomLevel}) rotate(${rotation}deg)`;
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    thumbnails.forEach((thumbnail) => {
      if (filter === 'all' || thumbnail.dataset.filter === filter) {
        thumbnail.style.display = 'block';
      } else {
        thumbnail.style.display = 'none';
      }
    });
    filterButtons.forEach((btn) => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  });
});

shareButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const url = button.dataset.url + window.location.href;
    window.open(url, '_blank');
  });
});

function startSlideshow() {
  const speed = parseInt(slideshowSpeedInput.value);
  slideshowInterval = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
    updateLightbox();
  }, speed);
}

function updateLightbox() {
  if (thumbnails[currentImageIndex].tagName === 'IMG') {
    lightboxImage.src = thumbnails[currentImageIndex].src;
    lightboxImage.style.display = 'block';
    lightboxVideo.style.display = 'none';
  } else if (thumbnails[currentImageIndex].tagName === 'VIDEO') {
    lightboxVideo.src = thumbnails[currentImageIndex].src;
    lightboxVideo.style.display = 'block';
    lightboxImage.style.display = 'none';
  }
  lightboxCaption.textContent = thumbnails[currentImageIndex].dataset.caption;
  zoomLevel = 1;
  rotation = 0;
  lightboxImage.style.transform = `scale(${zoomLevel}) rotate(${rotation}deg)`;
}