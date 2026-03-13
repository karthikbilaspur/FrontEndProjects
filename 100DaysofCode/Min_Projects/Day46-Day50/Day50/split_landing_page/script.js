// Constants
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const SCROLL_THRESHOLD = 50;
const SCROLL_TOP_THRESHOLD = 300;

// DOM Elements
const heroForm = document.querySelector('#hero form');
const contactForm = document.querySelector('#contact form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const buttons = document.querySelectorAll('.btn');
const navLinks = document.querySelectorAll('nav a');
const mobileMenu = document.querySelector('.mobile-menu');
const navList = document.querySelector('.nav-list');
const scrollToTopButton = document.querySelector('.scroll-to-top');
const nav = document.querySelector('nav');
const container = document.querySelector('.container');

// Event Listeners
if (heroForm) {
  heroForm.addEventListener('submit', handleHeroFormSubmit);
}
if (contactForm) {
  contactForm.addEventListener('submit', handleContactFormSubmit);
}
buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    const buttonType = e.target.getAttribute('data-button-type');
    switch (buttonType) {
      case 'learn-more':
        // Logic for "Learn More" button
        window.location.href = '#about';
        break;
      case 'sign-up':
        // Logic for "Sign Up" button
        heroForm.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'send-message':
        // Logic for "Send Message" button
        contactForm.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        console.log('Unknown button type');
    }
  });
});
window.addEventListener('load', () => {
  if (container) {
    container.style.opacity = 1;
    container.style.transition = 'opacity 1s';
  }
});
navLinks.forEach(link => {
  link.addEventListener('click', smoothScroll);
});
if (mobileMenu) {
  mobileMenu.addEventListener('click', () => navList.classList.toggle('show'));
}
if (scrollToTopButton) {
  scrollToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

window.addEventListener('scroll', () => {
  // Sticky Navigation
  if (window.scrollY > SCROLL_THRESHOLD) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }

  // Scroll-to-Top Button Visibility
  if (scrollToTopButton) {
    if (window.scrollY > SCROLL_TOP_THRESHOLD) {
      scrollToTopButton.classList.add('show');
    } else {
      scrollToTopButton.classList.remove('show');
    }
  }
});

// Functions
async function handleHeroFormSubmit(e) {
  e.preventDefault();
  try {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      throw new Error('Please fill in all fields');
    }

    if (!EMAIL_REGEX.test(email)) {
      throw new Error('Invalid email');
    }
    if (!PASSWORD_REGEX.test(password)) {
      throw new Error('Password must be at least 8 characters, with uppercase, lowercase, number, and special character');
    }

    // Form submission logic
    alert('Form submitted successfully');
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function handleContactFormSubmit(e) {
  e.preventDefault();
  try {
    const contactEmail = document.querySelector('#contact-email').value.trim();
    const contactMessage = document.querySelector('#contact-message').value.trim();

    if (!contactEmail || !contactMessage) {
      throw new Error('Please fill in all fields');
    }

    if (!EMAIL_REGEX.test(contactEmail)) {
      throw new Error('Invalid email');
    }
    if (contactMessage.length < 10) {
      throw new Error('Message must be at least 10 characters');
    }

    // Form submission logic
    alert('Message sent successfully');
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function smoothScroll(e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
    });
  } else {
    console.error('Target element not found');
  }
}

// AOS Initialization
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 1000,
    once: true,
  });
}