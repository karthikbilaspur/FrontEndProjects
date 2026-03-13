let timerInterval;
let hours = 0;
let minutes = 0;
let seconds = 0;

const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

function startTimer() {
  hours = parseInt(hoursInput.value) || 0;
  minutes = parseInt(minutesInput.value) || 0;
  seconds = parseInt(secondsInput.value) || 0;

  timerInterval = setInterval(() => {
    if (seconds > 0) {
      seconds--;
    } else if (minutes > 0) {
      minutes--;
      seconds = 59;
    } else if (hours > 0) {
      hours--;
      minutes = 59;
      seconds = 59;
    } else {
      clearInterval(timerInterval);
      alert('Time\'s up!');
    }

    updateTimerDisplay();
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  hours = 0;
  minutes = 0;
  seconds = 0;
  hoursInput.value = '';
  minutesInput.value = '';
  secondsInput.value = '';
  timerDisplay.textContent = '00:00:00';
}

function updateTimerDisplay() {
  const hoursString = String(hours).padStart(2, '0');
  const minutesString = String(minutes).padStart(2, '0');
  const secondsString = String(seconds).padStart(2, '0');
  timerDisplay.textContent = `${hoursString}:${minutesString}:${secondsString}`;
}