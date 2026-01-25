// DOM Elements
const passwordOutput = document.getElementById('password-output');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const generateBtn = document.getElementById('generate-btn');
const strengthMeter = document.getElementById('strength-meter');
const twofaSecretInput = document.getElementById('twofa-secret');
const generateTwofaBtn = document.getElementById('generate-twofa');
const twofaCodeSpan = document.getElementById('twofa-code');
const qrCanvas = document.getElementById('qr-canvas');
const lastpassLoginBtn = document.getElementById('lastpass-login');
const onepasswordLoginBtn = document.getElementById('onepassword-login');

// Options
const lowercaseCb = document.getElementById('lowercaseCb');
const uppercaseCb = document.getElementById('uppercaseCb');
const digitsCb = document.getElementById('digitsCb');
const specialsCb = document.getElementById('specialsCb');

// Constants
const lowercaseChars = 'abcdefghijkmnpqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const digitChars = '123456789';
const specialChars = '!@#$%^&*()_+-={}[];<>:';

// Web Worker
const worker = new Worker('worker.js');

// IndexedDB
const dbPromise = indexedDB.open('passwords', 1);

dbPromise.then((db) => {
  if (!db.objectStoreNames.contains('passwords')) {
    db.createObjectStore('passwords', { keyPath: 'id', autoIncrement: true });
  }
});

// Event Listeners
lengthSlider.addEventListener('input', updateLengthValue);
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);
generateTwofaBtn.addEventListener('click', generateTwofaCode);
lastpassLoginBtn.addEventListener('click', loginWithLastPass);
onepasswordLoginBtn.addEventListener('click', loginWith1Password);
worker.onmessage = (event) => {
  if (event.data.type === 'password-generated') {
    passwordOutput.value = event.data.password;
    updateStrengthIndicator(event.data.password);
    savePassword(event.data.password);
  }
};

// Event Handlers
function updateLengthValue() {
  lengthValue.textContent = lengthSlider.value;
  generatePassword();
}

function generatePassword() {
  const length = parseInt(lengthSlider.value);
  let dictionary = '';
  if (lowercaseCb.checked) dictionary += lowercaseChars;
  if (uppercaseCb.checked) dictionary += uppercaseChars;
  if (digitsCb.checked) dictionary += digitChars;
  if (specialsCb.checked) dictionary += specialChars;
  worker.postMessage({ type: 'generate-password', data: { length, dictionary } });
}

function copyPassword() {
  navigator.clipboard.writeText(passwordOutput.value).then(() => {
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
    }, 1000);
  });
}

function generateTwofaCode() {
  const secret = twofaSecretInput.value;
  if (!secret) return;
  const token = speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });
  twofaCodeSpan.textContent = token;
  const qrCode = new QRCode(qrCanvas, {
    text: `otpauth://totp/${secret}`,
    width: 200,
    height: 200
  });
}

function loginWithLastPass() {
  const lpUrl = 'https://lastpass.com';
  const lpClientId = 'YOUR_LASTPASS_CLIENT_ID';
  const lpRedirectUri = 'YOUR_LASTPASS_REDIRECT_URI';

  const authUrl = `${lpUrl}/oidc/auth?client_id=${lpClientId}&redirect_uri=${lpRedirectUri}&response_type=code&scope=identity`;
  window.location.href = authUrl;
}

function loginWith1Password() {
  const opUrl = 'https://1password.com';
  const opClientId = 'YOUR_1PASSWORD_CLIENT_ID';
  const opRedirectUri = 'YOUR_1PASSWORD_REDIRECT_URI';

  const authUrl = `${opUrl}/signin?client_id=${opClientId}&redirect_uri=${opRedirectUri}&response_type=code`;
  window.location.href = authUrl;
}

function updateStrengthIndicator(password) {
  const strength = calculateStrength(password);
  strengthMeter.className = '';
  if (strength <= 2) strengthMeter.classList.add('weak');
  else if (strength <= 4) strengthMeter.classList.add('medium');
  else strengthMeter.classList.add('strong');
}

function calculateStrength(password) {
  let strength = 0;
  if (password.length >= 12) strength += 3;
  else if (password.length >= 8) strength += 2;
  else strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  return strength;
}

function savePassword(password) {
  dbPromise.then((db) => {
    const tx = db.transaction('passwords', 'readwrite');
    const store = tx.objectStore('passwords');
    store.add({ password, timestamp: Date.now() });
  });
}