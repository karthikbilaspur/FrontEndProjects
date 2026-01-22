// Auto-text-effect
const autoTextElement = document.querySelector('#auto-text');
const text = "Welcome to DEMO Website!";
const speed = 100; // speed in ms
let currentIndex = 0;

const typeWriter = () => {
  try {
    if (autoTextElement && currentIndex < text.length) {
      autoTextElement.textContent += text.charAt(currentIndex);
      currentIndex++;
      setTimeout(typeWriter, speed);
    }
  } catch (error) {
    console.error('Error in typeWriter:', error);
  }
};

typeWriter();

// Dropdown menu toggle
const dropdownToggles = document.querySelectorAll('header nav li > a');

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener('mouseover', () => {
    const menu = toggle.parentElement.querySelector('ul');
    if (menu) {
      menu.classList.add('show');
    }
  });

  toggle.addEventListener('mouseout', () => {
    const menu = toggle.parentElement.querySelector('ul');
    if (menu) {
      menu.classList.remove('show');
    }
  });
});

// Smooth scrolling for anchor links
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    try {
      e.preventDefault();
      const targetId = link.href.split('#')[1];
      const targetElement = document.querySelector(`#${targetId}`);
      if (targetElement) {
        window.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error in anchor link click:', error);
    }
  });
});

// Read more functionality
const readMoreButtons = document.querySelectorAll('.read-more');

readMoreButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const description = button.previousElementSibling;
    const isExpanded = button.textContent === 'Read Less';

    if (isExpanded) {
      description.style.webkitLineClamp = '2';
      button.textContent = 'Read More';
    } else {
      description.style.webkitLineClamp = 'unset';
      button.textContent = 'Read Less';
    }
  });
});