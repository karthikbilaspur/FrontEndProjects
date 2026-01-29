document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const formType = form.dataset.type;
      handleSubmit(form, formType);
    });
  });

  const jobLinks = document.querySelectorAll('.job-link');
  jobLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const jobId = link.dataset.jobId;
      showJobDetails(jobId);
    });
  });
});

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
    // Show success message
    displaySuccess(form, 'Form submitted successfully!');
  } catch (error) {
    displayError(form, error.message);
  }
}

function showJobDetails(jobId) {
  try {
    // TO DO: Implement job details logic
    console.log('Show job details:', jobId);
  } catch (error) {
    displayError(null, error.message);
  }
}

function displayError(form, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-danger';
  errorDiv.textContent = message;

  if (form) {
    form.appendChild(errorDiv);
  } else {
    document.body.insertBefore(errorDiv, document.body.firstChild);
  }

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function displaySuccess(form, message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'alert alert-success';
  successDiv.textContent = message;

  if (form) {
    form.appendChild(successDiv);
  } else {
    document.body.insertBefore(successDiv, document.body.firstChild);
  }

  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}