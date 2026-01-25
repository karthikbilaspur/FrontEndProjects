// Fetch JSON data
const jsonFiles = [
  'java.json',
  'python.json',
  'ruby.json',
  'web.json',
  'blog-posts.json',
  'testimonials.json'
];

let projects = [];
let blogPosts = [];
let testimonials = [];

Promise.all(jsonFiles.map(file => fetch(file).then(response => response.json())))
  .then(data => {
    projects = data[0].concat(data[1], data[2], data[3]);
    blogPosts = data[4];
    testimonials = data[5];
    generateProjectCards(projects);
    generateTestimonialSlides(testimonials);
    generateBlogPosts(blogPosts);
  })
  .catch(error => console.error('Error loading JSON data:', error));



// Generate project cards
function generateProjectCards(projects) {
  const projectCards = document.getElementById('project-cards');
  projectCards.innerHTML = ''; // Clear existing cards

  projects.forEach((project) => {
    const card = document.createElement('div');
    card.className = `col-md-4 project-card ${project.difficultyLevel}`;
    card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${project.description}</h5>
          <p class="card-text">ID: ${project.id}</p>
          <p class="card-text">Difficulty: ${project.difficultyLevel}</p>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#project-modal" data-project='${JSON.stringify(project)}'>View More</button>
        </div>
      </div>
    `;
    projectCards.appendChild(card);
  });
}

// Project details modal
const projectModal = document.getElementById('project-modal');
projectModal.addEventListener('show.bs.modal', (e) => {
  const button = e.relatedTarget;
  const project = JSON.parse(button.dataset.project);
  const modalBody = document.getElementById('project-modal-body');
  modalBody.innerHTML = `
    <p>ID: ${project.id}</p>
    <p>Description: ${project.description}</p>
    <p>Difficulty: ${project.difficultyLevel}</p>
    <p>Time: ${project.timeTake}</p>
    <p>Rating: ${project.starRating}/5</p>
    <p>Tags: ${project.tags.join(', ')}</p>
    <p>Technologies Used: ${project.technologiesUsed.join(', ')}</p>
    <p>Project Type: ${project.projectType}</p>
    <p>GitHub Link: ${project.githubLink}</p>
    <p>Created At: ${project.createdAt}</p>
    <p>Updated At: ${project.updatedAt}</p>
  `;
});

// Filter projects
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
      if (filter === 'all' || card.classList.contains(filter)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Resume rating
const starRating = document.querySelector('.star-rating');
const ratingValue = document.getElementById('rating-value');
let currentRating = 0;

starRating.addEventListener('click', (e) => {
  if (e.target.classList.contains('fa-star')) {
    const rating = parseInt(e.target.dataset.rating);
    if (rating >= 1 && rating <= 5) {
      currentRating = rating;
      updateRating(rating);
    }
  }
});

function updateRating(rating) {
  const stars = starRating.children;
  for (let i = 0; i < stars.length; i++) {
    if (i < rating) {
      stars[i].classList.add('fas');
      stars[i].classList.remove('far');
    } else {
      stars[i].classList.add('far');
      stars[i].classList.remove('fas');
    }
  }
  ratingValue.textContent = `${rating}/5`;
}

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Download resume
const downloadResumeBtn = document.getElementById('download-resume');
downloadResumeBtn.addEventListener('click', () => {
  const resumeUrl = 'path/to/resume.pdf'; // replace with your resume URL
  const link = document.createElement('a');
  link.href = resumeUrl;
  link.download = 'resume.pdf';
  link.click();
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  fetch('/contact', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      alert('Message sent!');
      contactForm.reset();
    } else {
      alert('Error sending message. Please try again.');
    }
  })
  .catch((error) => {
    console.error(error);
    alert('Error sending message. Please try again.');
  });
});

// Newsletter form submission
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  const email = emailInput.value.trim();
  if (email === '') {
    alert('Please enter your email address.');
    return;
  }
  const formData = new FormData();
  formData.append('email', email);
  fetch('/newsletter', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      alert('Subscribed!');
      emailInput.value = '';
    } else {
      alert('Error subscribing. Please try again.');
    }
  })
  .catch((error) => {
    console.error(error);
    alert('Error subscribing. Please try again.');
  });
});

function generateTestimonialSlides(testimonials) {
  const testimonialSlider = document.querySelector('.carousel-inner');
  testimonialSlider.innerHTML = ''; // Clear existing slides

  testimonials.forEach((testimonial, index) => {
    const slide = document.createElement('div');
    slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    slide.innerHTML = `
      <div class="container text-center">
        <p>${testimonial.text}</p>
        <p>- ${testimonial.author}</p>
      </div>
    `;
    testimonialSlider.appendChild(slide);
  });
}

function generateBlogPosts(blogPosts) {
  const blogPostsContainer = document.querySelector('.blog-posts');
  blogPostsContainer.innerHTML = ''; // Clear existing posts

  blogPosts.forEach((post) => {
    const postElement = document.createElement('div');
    postElement.className = 'col-md-4 blog-post';
    postElement.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="-captitle">${post.title}</h5>
          <p class="card-text">${post.description}</p>
          <a href="${post.link}" class="btn btn-primary">Read More</a>
        </div>
      </div>
    `;
    blogPostsContainer.appendChild(postElement);
  });
}