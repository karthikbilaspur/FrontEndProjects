// script.js

// Add event listeners to forms
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');

  forms.forEach(function(form) {
    form.addEveantListener('submit', function(event) {
      event.preventDefault();
      const formType = form.classList.contains('login-form') ? 'login' :
        form.classList.contains('register-form') ? 'register' :
        form.classList.contains('post-job-form') ? 'post-job' : '';
      handleSubmit(form, formType);
    });
  });

  // Add event listener to job listing links
  const jobLinks = document.querySelectorAll('.job-link');
  jobLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const jobId = link.dataset.jobId;
      showJobDetails(jobId);
    });
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
        const registerEmail = form.querySelector('#email').value.trim();
        const registerPassword = form.querySelector('#password').value.trim();
        const confirmPassword = form.querySelector('#confirmPassword').value.trim();
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

// Show job details
function showJobDetails(jobId) {
  try {
    // TO DO: Implement job details logic
    console.log('Show job details:', jobId);
  } catch (error) {
    displayError(null, error.message);
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