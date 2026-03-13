// script.js
let jobListings = [];
let currentPage = 1;
let jobsPerPage = 5;

document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const formType = form.id === 'login-form' ? 'login' :
        form.id === 'register-form' ? 'register' :
        form.id === 'post-job-form' ? 'post-job' : '';
      handleSubmit(form, formType);
    });
  });

  // Add event listener to search button
  document.getElementById('search-btn').addEventListener('click', searchJobs);

  // Fetch job listings from JSON file
  fetch('jobs.json')
    .then(response => response.json())
    .then(data => {
      jobListings = data;
      updateJobListings(jobListings);
      updatePagination(jobListings);
    })
    .catch(error => console.error('Error fetching job listings:', error));

  const registerForm = document.getElementById('register-form');
  const registerInputs = registerForm.querySelectorAll('input');
  registerInputs.forEach(input => {
    input.addEventListener('input', updateRegisterProgressBar);
  });
});

// Handle form submission
function handleSubmit(form, formType) {
  try {
    switch (formType) {
      case 'login':
        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value.trim();
        if (!email || !password) {
          throw new Error('Please fill in all fields');
        }
        // TO DO: Implement login logic
        console.log('Login form submitted:', email, password);
        break;
      case 'register':
        const name = form.querySelector('#name').value.trim();
        const registerEmail = form.querySelector('#register-email').value.trim();
        const registerPassword = form.querySelector('#register-password').value.trim();
        const confirmPassword = form.querySelector('#confirm-password').value.trim();
        if (!name || !registerEmail || !registerPassword || !confirmPassword) {
          throw new Error('Please fill in all fields');
        }
        if (registerPassword !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        // TO DO: Implement registration logic
        console.log('Register form submitted:', name, registerEmail, registerPassword, confirmPassword);
        break;
      case 'post-job':
        const jobTitle = form.querySelector('#jobTitle').value.trim();
        const companyName = form.querySelector('#companyName').value.trim();
        const location = form.querySelector('#location').value.trim();
        const jobDescription = form.querySelector('#jobDescription').value.trim();
        if (!jobTitle || !companyName || !location || !jobDescription) {
          throw new Error('Please fill in all fields');
        }
        // TO DO: Implement job posting logic
        console.log('Post job form submitted:', jobTitle, companyName, location, jobDescription);
        break;
      default:
        throw new Error('Unknown form type');
    }
  } catch (error) {
    displayError(form, error.message);
  }
}

// Search jobs
function searchJobs() {
  const searchInput = document.getElementById('search-input').value.trim();
  const locationFilter = document.getElementById('location-filter').value;
  const industryFilter = document.getElementById('industry-filter').value;

  const filteredJobs = jobListings.filter(job => {
    return job.title.includes(searchInput) && job.location.includes(locationFilter) && job.industry.includes(industryFilter);
  });

  updateJobListings(filteredJobs);
  updatePagination(filteredJobs);
}

// Update job accordion
function updateJobListings(jobs) {
  const jobAccordion = document.getElementById('jobAccordion');
  jobAccordion.innerHTML = '';

  const start = (currentPage - 1) * jobsPerPage;
  const end = start + jobsPerPage;
  const paginatedJobs = jobs.slice(start, end);

  paginatedJobs.forEach((job, index) => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';

    const accordionHeader = document.createElement('h2');
    accordionHeader.className = 'accordion-header';
    accordionHeader.id = `heading${index}`;

    const accordionButton = document.createElement('button');
    accordionButton.className = 'accordion-button';
    accordionButton.type = 'button';
    accordionButton.dataset.bsToggle = 'collapse';
    accordionButton.dataset.bsTarget = `#collapse${index}`;
    accordionButton.ariaExpanded = 'true';
    accordionButton.ariaControls = `collapse${index}`;
    accordionButton.textContent = job.title;

    accordionHeader.appendChild(accordionButton);

    const accordionCollapse = document.createElement('div');
    accordionCollapse.id = `collapse${index}`;
    accordionCollapse.className = 'accordion-collapse collapse show';
    accordionCollapse.ariaLabelledby = `heading${index}`;
    accordionCollapse.dataset.bsParent = '#jobAccordion';

    const accordionBody = document.createElement('div');
    accordionBody.className = 'accordion-body';

    const jobDetails = document.createElement('p');
    jobDetails.textContent = `Company: ${job.company}, Location: ${job.location}`;

    const jobDescription = document.createElement('p');
    jobDescription.textContent = job.description;

    accordionBody.appendChild(jobDetails);
    accordionBody.appendChild(jobDescription);

    accordionCollapse.appendChild(accordionBody);

    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionCollapse);

    jobAccordion.appendChild(accordionItem);
  });
}

// Update pagination
function updatePagination(jobs) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.className = `btn btn-primary ${i === currentPage ? 'active' : ''}`;
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => {
      currentPage = i;
      updateJobListings(jobs);
      updatePagination(jobs);
    });
    pagination.appendChild(pageButton);
  }
}

// Display error message to user
function displayError(form, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-danger';
  errorDiv.textContent = message;

  if (form) {
    const formGroup = form.querySelector('.form-group');
    if (formGroup) {
      formGroup.appendChild(errorDiv);
    } else {
      form.appendChild(errorDiv);
    }
  } else {
    const body = document.body;
    body.insertBefore(errorDiv, body.firstChild);
  }

  // Remove error message after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Update register progress bar
function updateRegisterProgressBar() {
  const registerForm = document.getElementById('register-form');
  const registerInputs = registerForm.querySelectorAll('input');
  const filledInputs = Array.from(registerInputs).filter(input => input.value.trim() !== '');
  const progressPercentage = (filledInputs.length / registerInputs.length) * 100;
  const progressBar = document.getElementById('register-progress-bar');
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.textContent = `${Math.round(progressPercentage)}%`;
  progressBar.ariaValueNow = progressPercentage;
}