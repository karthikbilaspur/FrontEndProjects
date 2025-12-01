// script.js
const nameElement = document.getElementById('name');
const bioTextElement = document.getElementById('bio-text');
const socialLinksElement = document.getElementById('social-links');
const toggleThemeBtn = document.getElementById('toggle-theme-btn');

const socialMediaLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/your-linkedin-profile',
  },
  {
    name: 'GitHub',
    url: 'https://www.github.com/your-github-profile',
  },
  {
    name: 'Twitter',
    url: 'https://www.twitter.com/your-twitter-profile',
  },
];

const bioText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.';

nameElement.textContent = 'Your Name';
bioTextElement.textContent = bioText;

socialMediaLinks.forEach((link) => {
  const listItem = document.createElement('li');
  const anchor = document.createElement('a');
  anchor.textContent = link.name;
  anchor.href = link.url;
  listItem.appendChild(anchor);
  socialLinksElement.appendChild(listItem);
});

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});