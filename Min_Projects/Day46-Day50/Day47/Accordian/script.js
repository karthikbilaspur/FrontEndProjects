// Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      // Toggle active class on header
      header.classList.toggle('active');

      // Get the content element
      const content = header.nextElementSibling;

      // Toggle content visibility
      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }

      // Close other accordions on the same level
      const siblings = Array.prototype.filter.call(header.parentNode.children, (child) => child !== header.parentNode);
      siblings.forEach((sibling) => {
        const siblingHeader = sibling.querySelector('.accordion-header');
        const siblingContent = sibling.querySelector('.accordion-content');
        if (siblingHeader && siblingContent) {
          siblingHeader.classList.remove('active');
          siblingContent.style.display = 'none';
        }
      });
    });
  });
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
  if (e.target.hash) {
    e.preventDefault();
    const target = document.querySelector(e.target.hash);
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth',
      });
    }
  }
});