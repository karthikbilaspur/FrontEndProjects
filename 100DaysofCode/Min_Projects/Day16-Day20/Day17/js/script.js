// Get elements
const menuItems = document.getElementById('menu-items');
const contactForm = document.getElementById('contact-form');
const scrollToTopButton = document.getElementById('scroll-to-top');
// Sample menu data
const menuData = [
  { name: 'Dish 1', price: '₹200' },
  { name: 'Dish 2', price: '₹300' },
  { name: 'Dish 3', price: '₹400' },
];

// Populate menu items
menuData.forEach((item) => {
  const li = document.createElement('li');
  li.innerHTML = `${item.name} - ${item.price}`;
  menuItems.appendChild(li);
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Validate form data
  if (name && email && message) {
    // Send form data to server or email service
    console.log('Form submitted:', { name, email, message });
    alert('Message sent successfully!');
    contactForm.reset();
  } else {
    alert('Please fill in all fields.');
  }
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }

  // Send form data to server or email service
  console.log('Form submitted:', { name, email, message });
  alert('Message sent successfully!');
  contactForm.reset();
});


// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  });
});

// Scroll to top button
scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});