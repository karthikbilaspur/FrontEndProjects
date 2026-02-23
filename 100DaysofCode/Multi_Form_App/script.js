document.addEventListener('DOMContentLoaded', function() {
    const formSelector = document.getElementById('formSelector');
    const formSections = document.querySelectorAll('.form-section');
    const formsOverviewCards = document.querySelectorAll('.forms-overview .card'); // New: for clicking cards
    const toggleReadMoreButtons = document.querySelectorAll('.toggle-read-more');

    // --- Configuration (Enhanced: Centralized magic numbers and messages) ---
    const CONFIG = {
        TIMEOUTS: {
            ALERT_DISPLAY: 5000,
            FORM_SUBMIT: 1500, // General form submit simulation time
            REGISTRATION_SUBMIT: 2000 // Slightly longer for registration
        },
        MESSAGES: {
            CONTACT_SUCCESS: 'Thank you for your message! We will get back to you soon.',
            CONTACT_ERROR: 'Please correct the errors in the form.',
            LOGIN_SUCCESS: 'Login successful! Welcome back.',
            LOGIN_INVALID: 'Invalid username/email or password. Please try again.',
            LOGIN_CREDENTIALS_REQUIRED: 'Please enter your credentials.',
            REGISTRATION_SUCCESS: 'Registration successful! Please check your email for verification.',
            REGISTRATION_ERROR: 'Please correct the errors to create an account.',
            FEEDBACK_SUCCESS: 'Thank you for your valuable feedback!',
            FEEDBACK_ERROR: 'Please complete the form correctly.',
            FEEDBACK_RATING_REQUIRED: 'Please select an overall rating.',
            NEWSLETTER_SUCCESS: (email) => `Successfully subscribed ${email} to our newsletter!`,
            NEWSLETTER_ERROR: 'Please fix the errors to subscribe.',
            EMAIL_INVALID: 'Please enter a valid email address.',
            NAME_REQUIRED: 'Name is required.',
            MESSAGE_REQUIRED: 'Message is required and must be at least 10 characters.',
            USERNAME_REQUIRED: 'Username or email is required.',
            PASSWORD_REQUIRED: 'Password is required.',
            PASSWORD_STRENGTH: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.',
            PASSWORDS_MISMATCH: 'Passwords do not match.',
            CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password.',
            BUG_DETAILS_REQUIRED: 'Bug details are required and must be at least 15 characters for a bug report.',
            TERMS_REQUIRED: 'You must agree to the terms and conditions.'
        }
    };

    // --- Helper Functions ---

    /**
     * Shows a specific form section and hides others.
     * @param {string} formId The ID of the form section to show.
     */
    function showForm(formId) {
        formSections.forEach(section => {
            section.classList.remove('active');
            // Hide all read more sections when switching forms
            const readMoreContent = section.querySelector('.read-more-content');
            const toggleBtn = section.querySelector('.toggle-read-more');
            if (readMoreContent && toggleBtn) {
                readMoreContent.classList.remove('active');
                toggleBtn.textContent = 'Read More';
            }
        });

        const targetSection = document.getElementById(formId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Ensure the form selector dropdown also reflects the current form
            formSelector.value = formId;
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Displays a dynamic alert message (using Bootstrap's alert structure).
     * @param {HTMLElement} containerElement The element to prepend the alert to.
     * @param {string} message The message to display.
     * @param {string} type The Bootstrap alert type (e.g., 'success', 'danger', 'warning').
     * @param {number} timeoutMillis The time in milliseconds before the alert is removed.
     */
    function displayMessage(containerElement, message, type = 'success', timeoutMillis = CONFIG.TIMEOUTS.ALERT_DISPLAY) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        // Find existing alerts in the container and remove them before adding new one
        containerElement.querySelectorAll('.alert').forEach(alert => alert.remove());
        containerElement.prepend(alertDiv);
        setTimeout(() => alertDiv.remove(), timeoutMillis);
    }

    /**
     * Clears all validation feedback from a form.
     * @param {HTMLFormElement} form The form element.
     */
    function clearValidationFeedback(form) {
        form.querySelectorAll('.form-control.is-invalid, .form-control.is-valid, .form-check-input.is-invalid').forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
        form.querySelectorAll('.invalid-feedback, .valid-feedback').forEach(feedback => {
            feedback.remove();
        });
    }

    /**
     * Shows validation error for a specific input.
     * @param {HTMLElement} inputElement The input element to show error for.
     * @param {string} message The error message.
     */
    function showValidationError(inputElement, message) {
        inputElement.classList.add('is-invalid');
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'invalid-feedback';
        feedbackDiv.textContent = message;
        // Append feedback to the parent of the input (or specific container like form-check for checkboxes)
        if (inputElement.classList.contains('form-check-input')) {
            inputElement.closest('.form-check').appendChild(feedbackDiv);
        } else {
            inputElement.parentNode.appendChild(feedbackDiv);
        }
    }

    /**
     * Shows validation success for a specific input.
     * @param {HTMLElement} inputElement The input element to show success for.
     */
    function showValidationSuccess(inputElement) {
        inputElement.classList.add('is-valid');
    }

    /**
     * Validate email format.
     * @param {string} email The email string to validate.
     * @returns {boolean} True if valid email, false otherwise.
     */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Validate password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char).
     * @param {string} password The password string to validate.
     * @returns {boolean} True if strong password, false otherwise.
     */
    function isStrongPassword(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    }

    // --- Event Listeners ---

    // Dropdown for switching forms
    formSelector.addEventListener('change', function() {
        showForm(this.value);
    });

    // New: Click on overview cards to switch forms
    formsOverviewCards.forEach(card => {
        card.addEventListener('click', function() {
            const formId = this.dataset.formId;
            if (formId) {
                showForm(formId);
            }
        });
    });

    // Read More/Read Less toggles
    toggleReadMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const readMoreContent = document.getElementById(targetId);
            if (readMoreContent) {
                const isActive = readMoreContent.classList.toggle('active'); // Use 'active' class for state
                this.textContent = isActive ? 'Read Less' : 'Read More';
                // Scroll to the content if it's being expanded
                if (isActive) {
                    readMoreContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    });

    // --- Form Specific Logic ---

    // Contact Form
    const contactForm = document.querySelector('#contactForm .contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default HTML form submission
            clearValidationFeedback(this); // Clear previous feedback

            let isValid = true;
            const nameInput = this.querySelector('#name');
            const emailInput = this.querySelector('#email');
            const messageInput = this.querySelector('#message');
            const formContainer = this.closest('.form-container');
            const submitButton = this.querySelector('button[type="submit"]');

            if (!nameInput.value.trim()) {
                showValidationError(nameInput, CONFIG.MESSAGES.NAME_REQUIRED);
                isValid = false;
            } else {
                showValidationSuccess(nameInput);
            }

            if (!isValidEmail(emailInput.value.trim())) {
                showValidationError(emailInput, CONFIG.MESSAGES.EMAIL_INVALID);
                isValid = false;
            } else {
                showValidationSuccess(emailInput);
            }

            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                showValidationError(messageInput, CONFIG.MESSAGES.MESSAGE_REQUIRED);
                isValid = false;
            } else {
                showValidationSuccess(messageInput);
            }

            if (isValid) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                setTimeout(() => {
                    displayMessage(formContainer, CONFIG.MESSAGES.CONTACT_SUCCESS);
                    this.reset();
                    clearValidationFeedback(this); // Clear feedback after successful reset
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }, CONFIG.TIMEOUTS.FORM_SUBMIT);
            } else {
                displayMessage(formContainer, CONFIG.MESSAGES.CONTACT_ERROR, 'danger');
            }
        });
    }

    // Login Form
    const loginForm = document.querySelector('#loginForm .login-form');
    if (loginForm) {
        const passwordInput = loginForm.querySelector('#password');
        const togglePassword = loginForm.querySelector('.password-toggle-icon');

        // Toggle password visibility (moved to CSS for cleaner inline styles)
        if (passwordInput && togglePassword) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ?
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5"/></svg>' : // Eye icon
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.206c.744-.813 1.2-1.782 1.2-3.206 0-3-3-5.5-8-5.5-1.134 0-2.229.282-3.2.783L8 5.384zm3.673 3.992-13-13 1.414-1.414 13 13zM6.107 8.163A3.502 3.502 0 0 1 8 4.5c.797 0 1.517.264 2.09.696l.169.13-.715.715L9.612 6.54c-.161-.088-.331-.161-.509-.217a2.593 2.593 0 0 0-1.07.039C7.753 6.42 7.07 7.079 6.811 7.788c-.015.044-.029.088-.042.133l-.752.752zM3.38 7.391a3.53 3.53 0 0 0 1.185 2.76l-.752.752a4.522 4.522 0 0 1-1.39-3.242z"/><path d="M.5 8.163A13 13 0 0 1 1.172 8l.206-.264c.335-.48.83-.112 1.465-1.755C4.12 4.668 5.88 3.5 8 3.5c1.134 0 2.229.282 3.2.783l-.715.715a11.962 11.962 0 0 0-2.404-.925c-.292-.097-.597-.152-.912-.152-2.121 0-3.879 1.168-5.168 2.457A13.063 13.063 0 0 0 .5 8.163z"/></svg>'; // Eye-slash icon
                this.setAttribute('aria-label', type === 'password' ? 'Toggle password visibility' : 'Toggle password hiding');
            });
        }

        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearValidationFeedback(this);

            let isValid = true;
            const usernameInput = this.querySelector('#username');
            const passwordInput = this.querySelector('#password');
            const formContainer = this.closest('.form-container');
            const submitButton = this.querySelector('button[type="submit"]');

            if (!usernameInput.value.trim()) {
                showValidationError(usernameInput, CONFIG.MESSAGES.USERNAME_REQUIRED);
                isValid = false;
            } else {
                showValidationSuccess(usernameInput);
            }

            if (!passwordInput.value.trim()) {
                showValidationError(passwordInput, CONFIG.MESSAGES.PASSWORD_REQUIRED);
                isValid = false;
            } else {
                showValidationSuccess(passwordInput);
            }

            if (isValid) {
                submitButton.disabled = true;
                submitButton.textContent = 'Logging In...';

                setTimeout(() => {
                    // For demonstration, let's simulate a failed login
                    const simulatedLoginSuccess = false; // Change to true for a successful login demo

                    if (simulatedLoginSuccess) {
                        displayMessage(formContainer, CONFIG.MESSAGES.LOGIN_SUCCESS);
                        this.reset();
                        clearValidationFeedback(this);
                    } else {
                        // Revert button text on failure immediately
                        displayMessage(formContainer, CONFIG.MESSAGES.LOGIN_INVALID, 'danger');
                        // Show errors on fields without specific messages
                        showValidationError(usernameInput, ''); // Empty string for generic invalid state
                        showValidationError(passwordInput, ''); // Empty string for generic invalid state
                    }
                    submitButton.disabled = false;
                    submitButton.textContent = 'Log In';
                }, CONFIG.TIMEOUTS.FORM_SUBMIT);
            } else {
                displayMessage(formContainer, CONFIG.MESSAGES.LOGIN_CREDENTIALS_REQUIRED, 'danger');
            }
        });
    }

    // Registration Form
    const registrationForm = document.querySelector('#registrationForm .register-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearValidationFeedback(this);

            let isValid = true;
            const nameInput = this.querySelector('#reg-name');
            const emailInput = this.querySelector('#reg-email');
            const passwordInput = this.querySelector('#reg-password');
            const confirmPasswordInput = this.querySelector('#confirm-password');
            const formContainer = this.closest('.form-container');
            const submitButton = this.querySelector('button[type="submit"]');

            if (!nameInput.value.trim()) {
                showValidationError(nameInput, CONFIG.MESSAGES.NAME_REQUIRED);
                isValid = false;
            } else {
                showValidationSuccess(nameInput);
            }

            if (!isValidEmail(emailInput.value.trim())) {
                showValidationError(emailInput, CONFIG.MESSAGES.EMAIL_INVALID);
                isValid = false;
            } else {
                showValidationSuccess(emailInput);
            }

            if (!isStrongPassword(passwordInput.value)) {
                showValidationError(passwordInput, CONFIG.MESSAGES.PASSWORD_STRENGTH);
                isValid = false;
            } else {
                showValidationSuccess(passwordInput);
            }

            if (passwordInput.value !== confirmPasswordInput.value) {
                showValidationError(confirmPasswordInput, CONFIG.MESSAGES.PASSWORDS_MISMATCH);
                isValid = false;
            } else if (!confirmPasswordInput.value.trim()) {
                 showValidationError(confirmPasswordInput, CONFIG.MESSAGES.CONFIRM_PASSWORD_REQUIRED);
                 isValid = false;
            } else {
                showValidationSuccess(confirmPasswordInput);
            }

            if (isValid) {
                submitButton.disabled = true;
                submitButton.textContent = 'Registering...';

                setTimeout(() => {
                    displayMessage(formContainer, CONFIG.MESSAGES.REGISTRATION_SUCCESS);
                    this.reset();
                    clearValidationFeedback(this);
                    submitButton.disabled = false;
                    submitButton.textContent = 'Create Account';
                }, CONFIG.TIMEOUTS.REGISTRATION_SUBMIT);
            } else {
                displayMessage(formContainer, CONFIG.MESSAGES.REGISTRATION_ERROR, 'danger');
            }
        });
    }

    // Feedback Form
    const feedbackForm = document.querySelector('#feedbackForm .feedback-form');
    if (feedbackForm) {
        const feedbackTypeSelect = feedbackForm.querySelector('#feedback-type');
        const commentsTextarea = feedbackForm.querySelector('#comments');
        const bugDetailsGroup = feedbackForm.querySelector('#bug-details-group'); // Get the whole div
        const bugDetailsInput = bugDetailsGroup.querySelector('#bug-details');

        // Dynamic bug details field visibility
        feedbackTypeSelect.addEventListener('change', function() {
            if (this.value === 'bug') {
                bugDetailsGroup.style.display = 'block';
                bugDetailsInput.setAttribute('required', 'true');
            } else {
                bugDetailsGroup.style.display = 'none';
                bugDetailsInput.removeAttribute('required');
                // Clear validation state if hidden
                bugDetailsInput.classList.remove('is-invalid', 'is-valid');
                const feedback = bugDetailsGroup.querySelector('.invalid-feedback');
                if (feedback) feedback.remove();
            }
        });

        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearValidationFeedback(this);

            let isValid = true;
            const ratingInput = this.querySelector('input[name="rating"]:checked');
            const commentsInput = this.querySelector('#comments');
            const formContainer = this.closest('.form-container');
            const submitButton = this.querySelector('button[type="submit"]');

            if (!ratingInput) {
                displayMessage(formContainer, CONFIG.MESSAGES.FEEDBACK_RATING_REQUIRED, 'danger');
                isValid = false;
            }

            if (!commentsInput.value.trim() || commentsInput.value.trim().length < 20) {
                showValidationError(commentsInput, CONFIG.MESSAGES.MESSAGE_REQUIRED.replace('Message', 'Comments')); // Re-use message and adapt
                isValid = false;
            } else {
                showValidationSuccess(commentsInput);
            }

            if (feedbackTypeSelect.value === 'bug') {
                if (!bugDetailsInput.value.trim() || bugDetailsInput.value.trim().length < 15) {
                    showValidationError(bugDetailsInput, CONFIG.MESSAGES.BUG_DETAILS_REQUIRED);
                    isValid = false;
                } else {
                    showValidationSuccess(bugDetailsInput);
                }
            }

            if (isValid) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';

                setTimeout(() => {
                    displayMessage(formContainer, CONFIG.MESSAGES.FEEDBACK_SUCCESS);
                    this.reset();
                    clearValidationFeedback(this);
                    // Hide dynamic field after reset if it was visible
                    bugDetailsGroup.style.display = 'none';
                    bugDetailsInput.removeAttribute('required');

                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit Feedback';
                }, CONFIG.TIMEOUTS.FORM_SUBMIT);
            } else {
                displayMessage(formContainer, CONFIG.MESSAGES.FEEDBACK_ERROR, 'danger');
            }
        });
    }

    // Newsletter Form
    const newsletterForm = document.querySelector('#newsletterForm .newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearValidationFeedback(this);

            let isValid = true;
            const emailInput = this.querySelector('#sub-email');
            const termsCheckbox = this.querySelector('#terms');
            const formContainer = this.closest('.form-container');
            const submitButton = this.querySelector('button[type="submit"]');

            if (!isValidEmail(emailInput.value.trim())) {
                showValidationError(emailInput, CONFIG.MESSAGES.EMAIL_INVALID);
                isValid = false;
            } else {
                showValidationSuccess(emailInput);
            }

            if (!termsCheckbox.checked) {
                showValidationError(termsCheckbox, CONFIG.MESSAGES.TERMS_REQUIRED);
                isValid = false;
            } else {
                 termsCheckbox.classList.remove('is-invalid'); // Ensure invalid state is removed
                 showValidationSuccess(termsCheckbox); // Add valid state
            }

            if (isValid) {
                submitButton.disabled = true;
                submitButton.textContent = 'Subscribing...';

                setTimeout(() => {
                    displayMessage(formContainer, CONFIG.MESSAGES.NEWSLETTER_SUCCESS(emailInput.value));
                    this.reset();
                    clearValidationFeedback(this);
                    // Clear the valid state for the checkbox too after reset
                    termsCheckbox.classList.remove('is-valid');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Subscribe';
                }, CONFIG.TIMEOUTS.FORM_SUBMIT);
            } else {
                displayMessage(formContainer, CONFIG.MESSAGES.NEWSLETTER_ERROR, 'danger');
            }
        });
    }

    // Initial setup: show the first form selected in the dropdown
    showForm(formSelector.value);
});