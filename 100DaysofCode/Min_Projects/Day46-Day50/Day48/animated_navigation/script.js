// Get the navigation links
const navLinks = document.querySelectorAll('.nav-link');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');
const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');

// Add event listener to navigation links
navLinks.forEach((link) => {
  link.addEventListener('click', handleNavLinkClick);
});

// Add event listener to dropdown toggle button
dropdownToggle.addEventListener('click', handleDropdownToggleClick);

// Add event listener to form submission
form.addEventListener('submit', handleFormSubmit);

// Function to handle nav link click
function handleNavLinkClick(e) {
  e.preventDefault();
  const link = e.target;
  removeActiveClassFromNavLinks();
  link.classList.add('active');
  closeDropdownMenu();
  scrollToSection(link.href);
}

// Function to handle dropdown toggle click
function handleDropdownToggleClick() {
  dropdownMenu.classList.toggle('show');
}

// Function to handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;
  // Send form data to server (TO DO)
  console.log('Form submitted');
  form.reset();
  showSuccessMessage('Form submitted successfully!');
}

// Function to validate form inputs
function validateForm() {
  let isValid = true;
  if (!nameInput.value.trim()) {
    showError(nameInput, 'Please enter your name');
    isValid = false;
  } else {
    removeError(nameInput);
  }
  if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
    showError(emailInput, 'Please enter a valid email');
    isValid = false;
  } else {
    removeError(emailInput);
  }
  if (!messageInput.value.trim()) {
    showError(messageInput, 'Please enter your message');
    isValid = false;
  } else {
    removeError(messageInput);
  }
  return isValid;
}

// Function to show error message
function showError(input, message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  input.parentNode.appendChild(errorElement);
  input.classList.add('error');
}

// Function to remove error message
function removeError(input) {
  const errorElement = input.parentNode.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
  input.classList.remove('error');
}

// Function to check if email is valid
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Function to show success message
function showSuccessMessage(message) {
  const successElement = document.createElement('div');
  successElement.className = 'success-message';
  successElement.textContent = message;
  form.parentNode.appendChild(successElement);
  setTimeout(() => {
    successElement.remove();
  }, 3000);
}

// Function to remove active class from nav links
function removeActiveClassFromNavLinks() {
  navLinks.forEach((link) => link.classList.remove('active'));
}

// Function to close dropdown menu
function closeDropdownMenu() {
  dropdownMenu.classList.remove('show');
}

// Function to scroll to section
function scrollToSection(href) {
  const section = document.querySelector(href);
  section.scrollIntoView({
    behavior: 'smooth',
  });
}

// Add animation to sections
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
});
sections.forEach((section) => {
  observer.observe(section);
});

// Add event listener to window resize
window.addEventListener('resize', () => {
  // Update dropdown menu position
  dropdownMenu.style.top = `${dropdownToggle.offsetTop + dropdownToggle.offsetHeight}px`;
  dropdownMenu.style.left = `${dropdownToggle.offsetLeft}px`;
});