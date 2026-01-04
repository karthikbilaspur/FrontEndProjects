const carouselItems = document.querySelectorAll('.carousel-item');
const bouncingLetters = document.querySelectorAll('.bouncing-letters');
const prevBtn = document.querySelector('.nav.prev');
const nextBtn = document.querySelector('.nav.next');
const dots = document.querySelectorAll('.dot');
const progress = document.querySelector('.progress');
const pauseButton = document.querySelector('.pause-button');
let currentIndex = 0;
let intervalId;
let isPaused = false;
let touchStartX = 0;
let touchEndX = 0;

// Show the current slide
const showSlide = (index) => {
    carouselItems[currentIndex].classList.remove('active');
    bouncingLetters[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    currentIndex = (index + carouselItems.length) % carouselItems.length;
    carouselItems[currentIndex].classList.add('active');
    bouncingLetters[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
    progress.style.width = `${((currentIndex + 1) / carouselItems.length) * 100}%`;
    updateProgressIndicator();
};

// Next slide
const nextSlide = () => showSlide(currentIndex + 1);

// Previous slide
const prevSlide = () => showSlide(currentIndex - 1);

// Update progress indicator
const updateProgressIndicator = () => {
    const progressIndicator = document.querySelector('.progress-indicator');
    progressIndicator.textContent = `${currentIndex + 1} of ${carouselItems.length}`;
};

// Add event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

dots.forEach((dot) => {
    dot.addEventListener('click', () => {
        showSlide(parseInt(dot.dataset.index));
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// Autoplay
const startAutoplay = () => {
    intervalId = setInterval(nextSlide, 5000);
};
startAutoplay();

// Pause autoplay on hover
document.querySelector('.carousel').addEventListener('mouseover', () => {
    clearInterval(intervalId);
});
document.querySelector('.carousel').addEventListener('mouseout', () => {
    if (!isPaused) startAutoplay();
});

// Animate text on slide change
bouncingLetters.forEach((letters) => {
    letters.addEventListener('animationend', () => {
        letters.classList.remove('active');
    });
});

// Auto-rotation control
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(intervalId);
        pauseButton.textContent = 'Play';
    } else {
        startAutoplay();
        pauseButton.textContent = 'Pause';
    }
});

// Touch support
document.querySelector('.carousel').addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});
document.querySelector('.carousel').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    if (touchStartX > touchEndX + 50) nextSlide();
    if (touchStartX < touchEndX - 50) prevSlide();
});

// Set random video
iframe.src = `https://www.youtube.com/embed/${randomVideoId}`;

// Video progress
document.getElementById('video-iframe').addEventListener('timeupdate', () => {
    const progress = (iframe.currentTime / iframe.duration) * 100;
    videoProgress.style.width = `${progress}%`;
});

