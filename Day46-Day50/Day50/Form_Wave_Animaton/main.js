// main.js

// Auto-fill form with previously entered data
document.addEventListener('DOMContentLoaded', () => {
    const formData = localStorage.getItem('formData');
    if (formData) {
        const data = JSON.parse(formData);
        Object.keys(data).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = data[key];
            }
        });
    }

    // Initialize CAPTCHA
    const captcha = document.getElementById('captcha');
    const randomNumber = Math.floor(Math.random() * 10000);
    captcha.textContent = randomNumber;
});

// Store form data in local storage
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('input', () => {
        const formData = {};
        document.querySelectorAll('.input-group input').forEach(input => {
            formData[input.id] = input.value;
        });
        localStorage.setItem('formData', JSON.stringify(formData));
    });
});

// Improve password strength checking
document.getElementById('password').addEventListener('input', (e) => {
    const password = e.target.value;
    const strength = zxcvbn(password).score;
    updatePasswordStrength(strength);
});

// Update password strength indicator
function updatePasswordStrength(strength) {
    const strengthBar = document.querySelector('.password-strength');
    const strengthText = document.querySelector('.password-strength-text');

    const colors = ['#dc3545', '#ffc107', '#17a2b8', '#28a745', '#007bff'];
    const texts = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];

    strengthBar.style.backgroundColor = colors[strength];
    strengthBar.style.width = `${(strength + 1) * 20}%`;
    strengthText.textContent = texts[strength];
}

// Validate CAPTCHA on input
const captchaInput = document.getElementById('captcha-input');
captchaInput.addEventListener('input', validateCaptcha);

function validateCaptcha() {
    const captcha = document.getElementById('captcha');
    if (captchaInput.value === captcha.textContent) {
        captchaInput.parentNode.querySelector('.error-message').textContent = '';
        captchaInput.parentNode.querySelector('.error-message').style.display = 'none';
    } else {
        captchaInput.parentNode.querySelector('.error-message').textContent = 'Invalid CAPTCHA';
        captchaInput.parentNode.querySelector('.error-message').style.display = 'block';
    }
}

// Add GSAP animation to input fields
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', () => {
        gsap.to(input, {
            scale: 1.05,
            duration: 0.2
        });
    });

    input.addEventListener('blur', () => {
        gsap.to(input, {
            scale: 1,
            duration: 0.2
        });
    });
});

// Input masking for phone number
Inputmask({
    mask: '(999) 999-9999',
    placeholder: '(XXX) XXX-XXXX'
}).mask('#phone');

// Real-time validation
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('input', () => {
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (input.value.trim() === '') {
            errorMessage.textContent = `${input.placeholder} is required`;
            errorMessage.style.display = 'block';
        } else {
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
        }

        // Update submit button state
        const isValid = validateForm();
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.disabled = !isValid;
    });
});

// Password requirements
const passwordRequirements = [
    { regex: /.{8,}/, message: 'Minimum 8 characters' },
    { regex: /[A-Z]/, message: 'At least one uppercase letter' },
    { regex: /[a-z]/, message: 'At least one lowercase letter' },
    { regex: /[0-9]/, message: 'At least one number' },
    { regex: /[^A-Za-z0-9]/, message: 'At least one special character' }
];

document.getElementById('password').addEventListener('input', (e) => {
    const password = e.target.value;
    const passwordRequirementsList = document.querySelector('.password-requirements');
    passwordRequirementsList.innerHTML = '';
    passwordRequirements.forEach(requirement => {
        const li = document.createElement('li');
        li.textContent = requirement.message;
        if (requirement.regex.test(password)) {
            li.style.color = 'green';
        } else {
            li.style.color = 'red';
        }
        passwordRequirementsList.appendChild(li);
    });
});

// Progress bar
const inputs = document.querySelectorAll('.input-group input');
const progressBar = document.querySelector('.progress-bar');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        const filledInputs = Array.from(inputs).filter(input => input.value.trim() !== '').length;
        const progress = (filledInputs / inputs.length) * 100;
        progressBar.style.width = `${progress}%`;
    });
});

// Form validation
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const phone = document.getElementById('phone');

    let isValid = true;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });

    // Validate username
    if (username.value.trim() === '') {
        username.parentNode.querySelector('.error-message').textContent = 'Username is required';
        username.parentNode.querySelector('.error-message').style.display = 'block';
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.value.trim())) {
        email.parentNode.querySelector('.error-message').textContent = 'Invalid email address';
        email.parentNode.querySelector('.error-message').style.display = 'block';
        isValid = false;
    }

    // Validate password
    if (password.value.trim() === '') {
        password.parentNode.querySelector('.error-message').textContent = 'Password is required';
        password.parentNode.querySelector('.error-message').style.display = 'block';
        isValid = false;
    }

    // Validate confirm password
    if (confirmPassword.value.trim() !== password.value.trim()) {
        confirmPassword.parentNode.querySelector('.error-message').textContent = 'Passwords do not match';
        confirmPassword.parentNode.querySelector('.error-message').style.display = 'block';
        isValid = false;
    }

    // Validate phone number
    if (phone.value.trim() === '') {
        phone.parentNode.querySelector('.error-message').textContent = 'Phone number is required';
        phone.parentNode.querySelector('.error-message').style.display = 'block';
        isValid = false;
    }

    // Validate CAPTCHA
    if (captchaInput.value !== document.getElementById('captcha').textContent) {
        captchaInput.parentNode.querySelector('.error-message').textContent = 'Invalid CAPTCHA';
        captchaInput.parentNode.querySelector('.error-message').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Show loading spinner
        document.querySelector('.loading-spinner').style.display = 'block';
        document.querySelector('.button-text').style.display = 'none';

        // Simulate form submission
        setTimeout(() => {
            document.querySelector('.loading-spinner').style.display = 'none';
            document.querySelector('.button-text').style.display = 'block';
            document.querySelector('.success-message').textContent = 'Form submitted successfully!';
            document.querySelector('.success-message').style.display = 'block';
        }, 2000);
    }
});

// Toggle dark mode
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Validate form function
function validateForm() {
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const phone = document.getElementById('phone');
    const captchaInput = document.getElementById('captcha-input');

    let isValid = true;

    if (username.value.trim() === '') isValid = false;
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value.trim())) isValid = false;
    if (password.value.trim() === '') isValid = false;
    if (confirmPassword.value.trim() !== password.value.trim()) isValid = false;
    if (phone.value.trim() === '') isValid = false;
    if (captchaInput.value !== document.getElementById('captcha').textContent) isValid = false;

    return isValid;
}