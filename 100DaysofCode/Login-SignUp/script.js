const selector = document.getElementById("formSelector");
const descBox = document.getElementById("descriptionBox");
const descTitle = document.getElementById("descTitle");
const descText = document.getElementById("descText");
const codeModal = document.getElementById('codeModal');
const closeCodeModal = document.getElementById('closeCodeModal');
const codeContent = document.getElementById('codeContent');
const copyCodeBtn = document.getElementById('copyCodeBtn');

let selectedForm = "";

const descriptions = {
    form1: "A simple login form with user-friendly icons inside input fields.",
    form2: "A modern login form with floating label animation effect.",
    form3: "A combined login and registration form with toggle switch.",
    form4: "A fully responsive registration form using CSS Grid layout.",
    form5: "Login form with integrated social media login options.",
    form6: "A multi-step registration process, breaking down a long form into smaller, manageable steps, with a progress indicator.",
    form7: "A contact form featuring interactive tooltips for guidance on input fields.",
    form8: "A login form with an eye icon to toggle password visibility.",
    form9: "A search bar that expands to show recent searches or suggestions in a dropdown.",
    form10: "A profile setup form including an option to upload an avatar."
};

const formCodeSnippets = {
    // In a real application, you'd fetch these dynamically or embed them
    // For this demonstration, these are placeholders or manually extracted
    form1: {
        html: `<!-- 1️⃣ Simple Login with Icons -->
<section id="form1" class="form-section">
    <h2>Simple Login with Icons</h2>
    <div class="input-group">
        <i class="fa fa-user"></i>
        <input type="text" placeholder="Username">
    </div>
    <div class="input-group">
        <i class="fa fa-lock"></i>
        <input type="password" placeholder="Password">
    </div>
    <button onclick="simulateSubmit('form1')">Login</button>
    <button class="show-code-btn" onclick="showCode('form1')">Show Code</button>
    <p id="form1-message" class="form-message"></p>
</section>`,
        css: `/* Icon Inputs */
.input-group {
    position: relative;
    margin-bottom: 10px;
}
.input-group i {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #999;
}
.input-group input {
    padding-left: 35px;
    width: calc(100% - 45px);
}`,
        js: `// No specific JS functions for form1 interactivity`
    },
    form2: {
        html: `<!-- 2️⃣ Floating Label Login -->
<section id="form2" class="form-section">
    <h2>Floating Label Login</h2>
    <div class="floating-group">
        <input type="text" required>
        <label>Username</label>
    </div>
    <div class="floating-group">
        <input type="password" required>
        <label>Password</label>
    </div>
    <button onclick="simulateSubmit('form2')">Login</button>
    <button class="show-code-btn" onclick="showCode('form2')">Show Code</button>
    <p id="form2-message" class="form-message"></p>
</section>`,
        css: `/* Floating Label */
.floating-group {
    position: relative;
    margin: 20px 0;
}
.floating-group input {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.floating-group label {
    position: absolute;
    left: 10px;
    top: 12px;
    color: gray;
    transition: 0.3s ease-out;
    background: white;
    padding: 0 5px;
    pointer-events: none;
}
.floating-group input:focus + label,
.floating-group input:valid + label {
    top: -10px;
    left: 8px;
    font-size: 12px;
    color: #4a6cf7;
}`,
        js: `// No specific JS functions for form2 interactivity`
    },
    form3: {
        html: `<!-- 3️⃣ Login & Registration Toggle -->
<section id="form3" class="form-section">
    <h2>Login & Registration</h2>
    <div class="toggle-buttons">
        <button onclick="showLogin()" aria-label="Show login form">Login</button>
        <button onclick="showRegister()" aria-label="Show registration form">Register</button>
    </div>

    <div id="loginBox">
        <input type="email" placeholder="Email">
        <input type="password" placeholder="Password">
        <button onclick="simulateSubmit('form3')">Login</button>
    </div>

    <div id="registerBox" style="display:none;">
        <input type="text" placeholder="Full Name">
        <input type="email" placeholder="Email">
        <input type="password" placeholder="Password">
        <button onclick="simulateSubmit('form3')">Register</button>
    </div>
    <button class="show-code-btn" onclick="showCode('form3')">Show Code</button>
    <p id="form3-message" class="form-message"></p>
</section>`,
        css: `/* Toggle Buttons (example) */
.toggle-buttons button {
    width: 49%;
    display: inline-block;
    margin: 0;
    padding: 10px 0;
}
#loginBox, #registerBox {
    margin-top: 20px;
    border: 1px solid #eee;
    padding: 20px;
    border-radius: 8px;
    background: #fdfdfd;
}`,
        js: `function showLogin() {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("registerBox").style.display = "none";
}
function showRegister() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "block";
}`
    },
    form4: {
        html: `<!-- 4️⃣ Responsive Registration -->
<section id="form4" class="form-section">
    <h2>Responsive Registration Form</h2>
    <div class="responsive-grid">
        <input type="text" placeholder="First Name">
        <input type="text" placeholder="Last Name">
        <input type="email" placeholder="Email">
        <input type="tel" placeholder="Phone">
        <input type="password" placeholder="Password">
        <input type="password" placeholder="Confirm Password">
    </div>
    <button onclick="simulateSubmit('form4')">Register</button>
    <button class="show-code-btn" onclick="showCode('form4')">Show Code</button>
    <p id="form4-message" class="form-message"></p>
</section>`,
        css: `/* Responsive Grid */
.responsive-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 10px;
}
.responsive-grid input {
    width: calc(100% - 20px);
    margin: 0;
}
@media (max-width: 600px) {
   .responsive-grid {
        grid-template-columns: 1fr;
    }
}`,
        js: `// No specific JS functions for form4 interactivity`
    },
    form5: {
        html: `<!-- 5️⃣ Social Media Login -->
<section id="form5" class="form-section">
    <h2>Login with Social Media</h2>
    <input type="email" placeholder="Email">
    <input type="password" placeholder="Password">
    <button onclick="simulateSubmit('form5')">Login</button>

    <div class="social-login">
        <p>Or Login With</p>
        <i class="fab fa-google"></i>
        <i class="fab fa-facebook"></i>
        <i class="fab fa-github"></i>
    </div>
    <button class="show-code-btn" onclick="showCode('form5')">Show Code</button>
    <p id="form5-message" class="form-message"></p>
</section>`,
        css: `/* Social Icons */
.social-login {
    text-align: center;
    margin-top: 20px;
}
.social-login p {
    margin-bottom: 15px;
    color: #777;
}
.social-login i {
    font-size: 28px;
    margin: 0 10px;
    cursor: pointer;
    color: #666;
    transition: color 0.2s ease-in-out;
}
.social-login i:hover {
    color: #4a6cf7;
}`,
        js: `// No specific JS functions for form5 interactivity`
    },
    form6: {
        html: `<!-- 6️⃣ Multi-Step Registration -->
<section id="form6" class="form-section multi-step-form">
    <h2>Multi-Step Registration</h2>
    <div class="progress-indicator" id="progressIndicator6">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    </div>
    <div class="form-step" id="step1">
        <h3>Step 1: Personal Info</h3>
        <input type="text" placeholder="First Name">
        <input type="text" placeholder="Last Name">
        <button onclick="showStep(2)">Next</button>
    </div>
    <div class="form-step" id="step2" style="display:none;">
        <h3>Step 2: Contact Info</h3>
        <input type="email" placeholder="Email">
        <input type="tel" placeholder="Phone Number">
        <button onclick="showStep(1)">Previous</button>
        <button onclick="showStep(3)">Next</button>
    </div>
    <div class="form-step" id="step3" style="display:none;">
        <h3>Step 3: Account Info</h3>
        <input type="password" placeholder="Password">
        <input type="password" placeholder="Confirm Password">
        <button onclick="showStep(2)">Previous</button>
        <button onclick="simulateSubmit('form6')" id="submitMultiStep">Submit</button>
    </div>
    <button class="show-code-btn" onclick="showCode('form6')">Show Code</button>
    <p id="form6-message" class="form-message"></p>
</section>`,
        css: `/* Form 6: Multi-Step Registration */
.multi-step-form button {
    width: auto;
    padding: 10px 20px;
    display: inline-block;
    margin: 10px 5px 0 0;
}
.form-step {
    border: 1px solid #eee;
    padding: 20px;
    border-radius: 8px;
    background: #fdfdfd;
    margin-bottom: 15px; /* Added spacing */
}
.progress-indicator {
    text-align: center;
    margin-bottom: 20px;
}
.progress-indicator.dot {
    height: 10px;
    width: 10px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    margin: 0 5px;
    transition: background-color 0.3s ease;
}
.progress-indicator.dot.active {
    background-color: #4a6cf7;
}`,
        js: `let currentStep = 1;
function showStep(step) {
    document.querySelectorAll('#form6.form-step').forEach(s => s.style.display = 'none');
    document.getElementById('step' + step).style.display = 'block';
    currentStep = step;

    // Update progress dots
    document.querySelectorAll('#progressIndicator6.dot').forEach((dot, index) => {
        if (index + 1 === currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update buttons visibility
    const prevBtn = document.getElementById('prevBtn'); // Not directly used in HTML for form6, but logic is here
    const nextBtn = document.getElementById('nextBtn'); // Not directly used in HTML for form6, but logic is here
    const submitMultiStep = document.getElementById('submitMultiStep');

    // These buttons are now part of the step divs, not global
    // Example: <button onclick="showStep(1)">Previous</button> within step2/step3
    // The submit button is only visible on step 3
    if (submitMultiStep) { // Check if it exists for this form
        submitMultiStep.style.display = (currentStep === 3)? 'inline-block' : 'none';
    }
}
// Initial call for form6
// showStep(1);`
    },
    form7: {
        html: `<!-- 7️⃣ Form with Tooltips -->
<section id="form7" class="form-section">
    <h2>Form with Tooltips</h2>
    <div class="tooltip-group">
        <input type="text" placeholder="Username">
        <span class="tooltip-text">Choose a unique username.</span>
    </div>
    <div class="tooltip-group">
        <input type="email" placeholder="Email Address">
        <span class="tooltip-text">Enter a valid email for verification.</span>
    </div>
    <button onclick="simulateSubmit('form7')">Submit</button>
    <button class="show-code-btn" onclick="showCode('form7')">Show Code</button>
    <p id="form7-message" class="form-message"></p>
</section>`,
        css: `/* Form 7: Tooltips */
.tooltip-group {
    position: relative;
    margin-bottom: 25px;
}
.tooltip-group input {
    width: calc(100% - 20px);
}
.tooltip-text {
    visibility: hidden;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
    white-space: nowrap;
}
.tooltip-group input:focus +.tooltip-text,
.tooltip-group:hover.tooltip-text { /* Show tooltip on focus or hover */
    visibility: visible;
    opacity: 1;
}`,
        js: `// No specific JS functions for form7 interactivity`
    },
    form8: {
        html: `<!-- 8️⃣ Password Visibility Toggle -->
<section id="form8" class="form-section">
    <h2>Password Visibility Toggle</h2>
    <input type="email" placeholder="Email">
    <div class="input-group password-toggle-group">
        <input type="password" id="passwordField8" placeholder="Password">
        <i class="fa fa-eye toggle-password" onclick="togglePasswordVisibility('passwordField8')" aria-label="Toggle password visibility"></i>
    </div>
    <button onclick="simulateSubmit('form8')">Login</button>
    <button class="show-code-btn" onclick="showCode('form8')">Show Code</button>
    <p id="form8-message" class="form-message"></p>
</section>`,
        css: `/* Form 8: Password Visibility Toggle */
.password-toggle-group {
    position: relative;
}
.password-toggle-group input {
    width: calc(100% - 45px); /* Account for eye icon */
}
.password-toggle-group.toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #999;
}`,
        js: `function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    const toggleIcon = passwordField.nextElementSibling;
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}`
    },
    form9: {
        html: `<!-- 9️⃣ Search Bar with Suggestions -->
<section id="form9" class="form-section search-form">
    <h2>Search Bar with Suggestions</h2>
    <div class="search-input-container">
        <input type="text" id="searchBarInput" placeholder="Search..." onfocus="showSuggestions()" onblur="hideSuggestions()">
        <i class="fa fa-search search-icon"></i>
        <div class="search-suggestions" id="searchSuggestions" style="display:none;">
            <div class="suggestion-item" onclick="selectSuggestion('Latest News')">Latest News</div>
            <div class="suggestion-item" onclick="selectSuggestion('Product Reviews')">Product Reviews</div>
            <div class="suggestion-item" onclick="selectSuggestion('How-to Guides')">How-to Guides</div>
        </div>
    </div>
    <button onclick="simulateSubmit('form9')">Search</button>
    <button class="show-code-btn" onclick="showCode('form9')">Show Code</button>
    <p id="form9-message" class="form-message"></p>
</section>`,
        css: `/* Form 9: Search Bar with Suggestions */
.search-form { /* Added class to the section for easier targeting */
    position: relative; /* For positioning suggestions */
}
.search-input-container {
    position: relative;
    margin-bottom: 15px;
}
.search-input-container input {
    padding-right: 40px;
    width: calc(100% - 60px);
}
.search-input-container.search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
}
.search-suggestions {
    position: absolute;
    top: calc(100% + 5px); /* Below the input, with some gap */
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 10;
    text-align: left;
    max-height: 200px; /* Make it scrollable if too many suggestions */
    overflow-y: auto;
}
.suggestion-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
}
.suggestion-item:last-child {
    border-bottom: none;
}
.suggestion-item:hover {
    background-color: #f0f0f0;
}`,
        js: `function showSuggestions() {
    document.getElementById('searchSuggestions').style.display = 'block';
}
function hideSuggestions() {
    // A small delay to allow click on suggestions
    setTimeout(() => {
        document.getElementById('searchSuggestions').style.display = 'none';
    }, 100);
}
function selectSuggestion(suggestion) {
    document.getElementById('searchBarInput').value = suggestion;
    hideSuggestions();
}`
    },
    form10: {
        html: `<!-- 🔟 Profile with Avatar Upload -->
<section id="form10" class="form-section avatar-upload-form">
    <h2>Profile with Avatar Upload</h2>
    <div class="avatar-upload-container">
        <label for="avatarInput" class="avatar-label">
            <img id="avatarPreview" src="https://via.placeholder.com/100" alt="Avatar Preview" style="display:block;">
            <input type="file" id="avatarInput" accept="image/*" onchange="previewAvatar(event)">
            <span class="upload-text">Upload Avatar</span>
        </label>
    </div>
    <input type="text" placeholder="Display Name">
    <input type="email" placeholder="Email">
    <button onclick="simulateSubmit('form10')">Save Profile</button>
    <button class="show-code-btn" onclick="showCode('form10')">Show Code</button>
    <p id="form10-message" class="form-message"></p>
</section>`,
        css: `/* Form 10: Avatar Upload */
.avatar-upload-form.avatar-upload-container {
    text-align: center;
    margin-bottom: 20px;
}
.avatar-label {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 3px solid #4a6cf7;
    background-color: #f0f0f0;
}
.avatar-label img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.avatar-label input[type="file"] {
    display: none;
}
.avatar-label.upload-text {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.6);
    color: white;
    font-size: 12px;
    padding: 5px 0;
    opacity: 0;
    transition: opacity 0.3s;
}
.avatar-label:hover.upload-text {
    opacity: 1;
}`,
        js: `function previewAvatar(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('avatarPreview');
        output.src = reader.result;
        output.style.display = 'block';
    }
    reader.readAsDataURL(event.target.files[0]);
}`
    }
};

// --- General Functions ---

selector.addEventListener("change", function() {
    selectedForm = this.value;

    if (!selectedForm) {
        descBox.style.display = "none";
        // Hide all forms if nothing selected
        document.querySelectorAll('.form-section').forEach(form => {
            form.style.display = 'none';
        });
        return;
    }

    descBox.style.display = "block";
    descTitle.innerText = this.options[this.selectedIndex].text;
    descText.innerText = descriptions[selectedForm];

    // Show only the selected form, hide others
    document.querySelectorAll('.form-section').forEach(form => {
        form.style.display = 'none';
    });
    const targetForm = document.getElementById(selectedForm);
    if (targetForm) {
        targetForm.style.display = 'block';
        // Re-initialize form-specific JS for the newly visible form
        initializeFormSpecificJS(selectedForm);
    }
});

function scrollToForm() {
    document.getElementById(selectedForm).scrollIntoView({
        behavior: "smooth"
    });
}

function simulateSubmit(formId) {
    const messageElement = document.getElementById(`${formId}-message`);
    if (messageElement) {
        messageElement.innerText = "Form submitted successfully!";
        messageElement.style.color = "green";
        messageElement.style.display = "block";
        setTimeout(() => {
            messageElement.style.display = "none";
            messageElement.innerText = "";
        }, 3000);
    }
}

// --- Form 3 Specific ---
function showLogin() {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("registerBox").style.display = "none";
}

function showRegister() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "block";
}

// --- Form 6 Specific ---
let currentStep = 1; // Tracks current step for form6
function showStep(step) {
    document.querySelectorAll('#form6.form-step').forEach(s => s.style.display = 'none');
    document.getElementById('step' + step).style.display = 'block';
    currentStep = step;

    // Update progress dots
    document.querySelectorAll('#progressIndicator6.dot').forEach((dot, index) => {
        if (index + 1 === currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    const submitMultiStep = document.getElementById('submitMultiStep');
    if (submitMultiStep) {
        submitMultiStep.style.display = (currentStep === 3)? 'block' : 'none';
    }
}

// --- Form 8 Specific ---
function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    const toggleIcon = passwordField.nextElementSibling;
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

// --- Form 9 Specific ---
function showSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) suggestions.style.display = 'block';
}

function hideSuggestions() {
    setTimeout(() => {
        const suggestions = document.getElementById('searchSuggestions');
        if (suggestions) suggestions.style.display = 'none';
    }, 100);
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('searchBarInput');
    if (searchInput) searchInput.value = suggestion;
    hideSuggestions();
}

// --- Form 10 Specific ---
function previewAvatar(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('avatarPreview');
        if (output) {
            output.src = reader.result;
            output.style.display = 'block';
        }
    }
    if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

// --- Dynamic Code Display Modal ---
function showCode(formId) {
    const snippets = formCodeSnippets[formId];
    if (snippets) {
        let codeHtml = `<h3>HTML</h3><pre><code class="language-html">${escapeHtml(snippets.html)}</code></pre>`;
        let codeCss = `<h3>CSS</h3><pre><code class="language-css">${escapeHtml(snippets.css)}</code></pre>`;
        let codeJs = `<h3>JavaScript</h3><pre><code class="language-javascript">${escapeHtml(snippets.js)}</code></pre>`;

        codeContent.innerHTML = codeHtml + codeCss + codeJs;
        codeModal.style.display = 'block';
        // Highlight code after content is set
        Prism.highlightAllUnder(codeContent);
    }
}

closeCodeModal.addEventListener('click', () => {
    codeModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === codeModal) {
        codeModal.style.display = 'none';
    }
});

copyCodeBtn.addEventListener('click', () => {
    const codeToCopy = codeContent.innerText;
    navigator.clipboard.writeText(codeToCopy).then(() => {
        const originalText = copyCodeBtn.innerText;
        copyCodeBtn.innerText = 'Copied!';
        setTimeout(() => {
            copyCodeBtn.innerText = originalText;
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// --- Form-Specific JS Initialization on Display ---
function initializeFormSpecificJS(formId) {
    // Reset all form messages
    document.querySelectorAll('.form-message').forEach(msg => {
        msg.style.display = 'none';
        msg.innerText = '';
    });

    if (formId === 'form6') {
        showStep(1); // Initialize multi-step form to first step
    } else if (formId === 'form10') {
        // Reset avatar preview to placeholder if not already set
        const avatarPreview = document.getElementById('avatarPreview');
        if (avatarPreview && avatarPreview.src === window.location.href) { // Check if src is empty or not set
             avatarPreview.src = "https://via.placeholder.com/100";
        }
    }
    // Add other form-specific initializations here as needed
}

// --- Initial Setup on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Hide all forms initially
    document.querySelectorAll('.form-section').forEach(form => {
        form.style.display = 'none';
    });
    // Set initial state for form 3 login/register toggle
    if (document.getElementById('loginBox')) {
        showLogin();
    }
});