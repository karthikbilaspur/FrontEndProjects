// Image Slider
let slideIndex = 0;
const slides = document.querySelectorAll('.image-slider .slide');
const dots = document.querySelectorAll('.image-slider .dot');

function showSlides() {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${index * -100}%)`;
  });
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === slideIndex);
  });
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlides();
}

function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlides();
}

document.querySelector('.image-slider .next-button').addEventListener('click', nextSlide);
document.querySelector('.image-slider .prev-button').addEventListener('click', prevSlide);

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    slideIndex = index;
    showSlides();
  });
});

// Accordion
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
  });
});

// Auto-slide
setInterval(nextSlide, 5000);

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});