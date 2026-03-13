class KboardDashboard {
  constructor() {
    this.usersCounter = document.getElementById('users-counter');
    this.postsCounter = document.getElementById('posts-counter');
    this.engagementCounter = document.getElementById('engagement-counter');
    this.trafficChart = document.getElementById('traffic-chart').getContext('2d');
    this.engagementChart = document.getElementById('engagement-chart').getContext('2d');
    this.themeToggle = document.getElementById('theme-toggle');
    this.notificationButton = document.getElementById('notification-button');

    this.years = [2023, 2024, 2025, 2026];
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.init();
    this.addEventListeners();
  }

  async init() {
    try {
      await this.animateCounters();
      this.renderCharts();
      this.applyTheme();
      this.checkNotifications();
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

  checkNotifications() {
    // Add notification logic here
    console.log('Checking notifications...');
  }

  addEventListeners() {
    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    this.notificationButton.addEventListener('click', () => {
      this.checkNotifications();
    });
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  }

  applyTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }
}

const dashboard = new KboardDashboard();