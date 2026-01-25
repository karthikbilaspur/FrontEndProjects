// Get elements
const inputWord = document.getElementById('inputWord');
const passwordLength = document.getElementById('passwordLength');
const includeNumbers = document.getElementById('includeNumbers');
const includeSpecialChars = document.getElementById('includeSpecialChars');
const includeUppercase = document.getElementById('includeUppercase');
const generateBtn = document.getElementById('generateBtn');
const password = document.getElementById('password');
const copyBtn = document.getElementById('copyBtn');
const powerPoint = document.getElementById('power-point');
const explain = document.getElementById('explain');
const passwordHistory = document.getElementById('passwordHistory');

// Add event listener to generate button
generateBtn.addEventListener('click', generatePassword);

// Function to generate password
function generatePassword() {
    const word = inputWord.value.trim();
    if (!word) {
        alert('Please enter a word!');
        return;
    }

    const length = parseInt(passwordLength.value);
    const options = {
        includeNumbers: includeNumbers.checked,
        includeSpecialChars: includeSpecialChars.checked,
        includeUppercase: includeUppercase.checked,
    };

    const generatedPassword = generateSecurePassword(word, length, options);
    password.value = generatedPassword;
    checkPasswordStrength(generatedPassword);
    addPasswordToHistory(generatedPassword);
    showSuccessMessage('Password generated successfully!');
}

// Function to generate secure password
function generateSecurePassword(word, length, options) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let password = '';

    if (options.includeNumbers) {
        password += '0123456789';
    }
    if (options.includeSpecialChars) {
        password += '!@#$%^&*()_+-={}:<>?';
    }
    if (options.includeUppercase) {
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    password += word;

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let securePassword = '';
    for (let i = 0; i < length; i++) {
        securePassword += password[array[i] % password.length];
    }

    return securePassword;
}

// Function to check password strength
function checkPasswordStrength(password) {
    let point = 0;
    const value = password;
    const widthPower = ['1%', '25%', '50%', '75%', '100%'];
    const colorPower = ['#D73F40', '#DC6551', '#F2B84F', '#BDE952', '#3ba62f'];

    if (value.length >= 8) {
        point++;
    }
    if (/[0-9]/.test(value)) {
        point++;
    }
    if (/[a-z]/.test(value)) {
        point++;
    }
    if (/[A-Z]/.test(value)) {
        point++;
    }
    if (/[^0-9a-zA-Z]/.test(value)) {
        point++;
    }

    powerPoint.style.width = widthPower[Math.min(point, 4)];
    powerPoint.style.backgroundColor = colorPower[Math.min(point, 4)];
    explain.textContent = `Password strength: ${point}/5`;
}

// Function to add password to history
function addPasswordToHistory(password) {
    const li = document.createElement('li');
    li.textContent = password;
    passwordHistory.appendChild(li);
}

// Function to show success message
function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.textContent = message;
    successMessage.className = 'success-message';
    document.body.appendChild(successMessage);
    setTimeout(() => {
        successMessage.remove();
    }, 2000);
}

// Add event listener to copy button
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(password.value);
    showSuccessMessage('Password copied to clipboard!');
});