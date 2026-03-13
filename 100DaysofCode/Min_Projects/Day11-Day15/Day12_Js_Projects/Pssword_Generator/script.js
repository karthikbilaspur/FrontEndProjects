const generateButton = document.getElementById('generate');
const passwordElement = document.getElementById('password');
const lengthInput = document.getElementById('length');

generateButton.addEventListener('click', () => {
  const length = parseInt(lengthInput.value);
  if (isNaN(length) || length < 8) {
    alert('Please enter a valid password length (min 8 characters)');
    return;
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  passwordElement.textContent = password;
});