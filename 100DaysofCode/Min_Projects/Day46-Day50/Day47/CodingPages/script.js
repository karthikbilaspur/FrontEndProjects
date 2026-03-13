class FlipBox {
  constructor(element) {
    this.element = element;
    this.trigger = element.dataset.flipTrigger;
    this.direction = element.dataset.flipDirection;

    this.init();
  }

  init() {
    if (this.trigger === 'hover') {
      this.element.addEventListener('mouseover', () => {
        this.element.classList.add('hover');
      });

      this.element.addEventListener('mouseout', () => {
        this.element.classList.remove('hover');
      });
    } else if (this.trigger === 'click') {
      this.element.addEventListener('click', () => {
        this.element.classList.toggle('hover');
      });
    }

    // Add animation on load
    this.element.classList.add('animated');
    setTimeout(() => {
      this.element.classList.remove('animated');
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const flipBoxes = document.querySelectorAll('.flip-box');

  flipBoxes.forEach((box) => {
    new FlipBox(box);
  });

  // Add smooth scrolling to anchors
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = anchor.getAttribute('href');
      const element = document.querySelector(target);

      element.scrollIntoView({
        behavior: 'smooth',
      });
    });
  });
});

// Accordion functionality
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

class KboardDashboard {
  constructor() {
    this.usersCounter = document.getElementById('users-counter');
    this.postsCounter = document.getElementById('posts-counter');
    this.engagementCounter = document.getElementById('engagement-counter');
    this.trafficChart = document.getElementById('traffic-chart').getContext('2d');
    this.engagementChart = document.getElementById('engagement-chart').getContext('2d');

    this.years = [2023, 2024, 2025, 2026];
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.init();
  }

  async init() {
    try {
      await this.animateCounters();
      this.renderCharts();
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    }
  }

  async animateCounters() {
    const counters = [
      { element: this.usersCounter, target: 1000 },
      { element: this.postsCounter, target: 500 },
      { element: this.engagementCounter, target: 2000 },
    ];

    counters.forEach((counter) => {
      this.animateCounter(counter.element, counter.target);
    });
  }

  animateCounter(element, target) {
    let count = 0;
    const increment = target / 100;

    const updateCounter = () => {
      count += increment;
      element.textContent = Math.floor(count);
      if (count < target) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }

  renderCharts() {
    const trafficData = {
      labels: this.months,
      datasets: this.years.map((year) => ({
        label: year.toString(),
        data: Array(12).fill(0).map(() => Math.floor(Math.random() * 1000)),
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
      })),
    };

    const engagementData = {
      labels: ['Likes', 'Comments', 'Shares'],
      datasets: [{
        label: 'Engagement',
        data: [60, 20, 20],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
      }],
    };

    new Chart(this.trafficChart, {
      type: 'line',
      data: trafficData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(this.engagementChart, {
      type: 'pie',
      data: engagementData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

const dashboard = new KboardDashboard();