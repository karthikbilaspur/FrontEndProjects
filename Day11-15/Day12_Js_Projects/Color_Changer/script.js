const changeColorButton = document.getElementById('change-color');
const body = document.getElementById('body');
const colorDisplay = document.getElementById('color-display');

changeColorButton.addEventListener('click', () => {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  body.style.backgroundColor = randomColor;
  colorDisplay.textContent = `Current Color: ${randomColor}`;
});