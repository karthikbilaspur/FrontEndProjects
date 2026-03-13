// Get the form and steps
const form = document.getElementById('multi-step-form');
const steps = document.querySelectorAll('.step');
const progressBar = document.querySelector('.progress');
const langButtons = document.querySelectorAll('.lang-btn');
let currentStep = 0;
let currentLang = 'en';

// Language data
const langData = {
  en: {
    personalInfo: 'Personal Info',
    address: 'Address',
    review: 'Review',
    name: 'Name',
    email: 'Email',
    next: 'Next',
    prev: 'Prev',
    submit: 'Submit',
    reviewInfo: 'Review your info:',
  },
  es: {
    personalInfo: 'Información Personal',
    address: 'Dirección',
    review: 'Revisar',
    name: 'Nombre',
    email: 'Correo electrónico',
    next: 'Siguiente',
    address: 'Dirección',
    city: 'Ciudad',
    review: 'Revisar',
    prev: 'Anterior',
    submit: 'Enviar',
    reviewInfo: 'Revisa tus datos:',
  },
  fr: {
    personalInfo: 'Informations Personnelles',
    address: 'Adresse',
    review: 'Réviser',
    name: 'Nom',
    email: 'Email',
    next: 'Suivant',
    address: 'Adresse',
    city: 'Ville',
    review: 'Réviser',
    prev: 'Précédent',
    submit: 'Soumettre',
    reviewInfo: 'Vérifiez vos informations:',
  },
};

// Function to update the progress bar
function updateProgressBar() {
  const progress = (currentStep / (steps.length - 1)) * 100;
  progressBar.style.width = `${progress}%`;
}

// Function to show the current step
function showStep() {
  steps.forEach((step, index) => {
    if (index === currentStep) {
      step.classList.add('active');
      step.setAttribute('aria-hidden', 'false');
    } else {
      step.classList.remove('active');
      step.setAttribute('aria-hidden', 'true');
    }
  });
}

// Function to translate the page
function translatePage(lang) {
  document.querySelectorAll('[data-translate]').forEach((element) => {
    const key = element.getAttribute('data-translate');
    element.textContent = langData[lang][key];
  });
}

// Event listeners for next and prev buttons
document.querySelectorAll('.next-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep();
        updateProgressBar();
      }
    }
  });
});

document.querySelectorAll('.prev-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      showStep();
      updateProgressBar();
    }
  });
});

// Event listener for language switcher
langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-lang');
    currentLang = lang;
    translatePage(lang);
  });
});

// Event listener for form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) {
    // Handle form submission here
    alert('Form submitted!');
  }
});

// Validation function for each step
function validateStep(step) {
  const inputs = steps[step].querySelectorAll('input');
  let isValid = true;
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
  });
  return isValid;
}

// Validation function for the entire form
function validateForm() {
  let isValid = true;
  steps.forEach((step, index) => {
    if (!validateStep(index)) {
      isValid = false;
    }
  });
  return isValid;
}

// Initialize the progress bar and show the first step
updateProgressBar();
showStep();
translatePage(currentLang);