const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const signupSubmitBtn = document.getElementById('signup-submit-btn');
const verifyEmailBtn = document.getElementById('verify-email-btn');
const loginSignupLink = document.getElementById('login-signup-link');
const signupLoginLink = document.getElementById('signup-login-link');

loginBtn.addEventListener('click', () => {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2-login').style.display = 'flex';
});

signupBtn.addEventListener('click', () => {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2-signup').style.display = 'flex';
});

loginSignupLink.addEventListener('click', () => {
    document.getElementById('step-2-login').style.display = 'none';
    document.getElementById('step-2-signup').style.display = 'flex';
});

signupLoginLink.addEventListener('click', () => {
    document.getElementById('step-2-signup').style.display = 'none';
    document.getElementById('step-2-login').style.display = 'flex';
});

loginSubmitBtn.addEventListener('click', () => {
    // Add login logic here
    document.getElementById('step-2-login').style.display = 'none';
    document.getElementById('step-3').style.display = 'flex';
});

signupSubmitBtn.addEventListener('click', () => {
    // Add signup logic here
    document.getElementById('step-2-signup').style.display = 'none';
    document.getElementById('step-3').style.display = 'flex';
});

verifyEmailBtn.addEventListener('click', () => {
    // Add email verification logic here
    alert('Email verified!');
});