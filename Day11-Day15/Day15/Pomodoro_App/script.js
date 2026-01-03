// Get the elements
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const workIntervalInput = document.getElementById('work-interval');
const breakIntervalInput = document.getElementById('break-interval');

// Set the initial state
let workInterval = parseInt(workIntervalInput.value);
let breakInterval = parseInt(breakIntervalInput.value);
let currentInterval = workInterval;
let isRunning = false;
let isWorkTime = true;
let timerId;

// Update the timer display
function updateTimer() {
    minutesElement.textContent = String(currentInterval).padStart(2, '0');
    secondsElement.textContent = '00';
}

// Start the timer
function startTimer() {
    isRunning = true;
    startButton.disabled = true;
    pauseButton.disabled = false;
    timerId = setInterval(() => {
        let minutes = parseInt(minutesElement.textContent);
        let seconds = parseInt(secondsElement.textContent);
        if (seconds === 0) {
            if (minutes === 0) {
                if (isWorkTime) {
                    currentInterval = breakInterval;
                    isWorkTime = false;
                } else {
                    currentInterval = workInterval;
                    isWorkTime = true;
                }
                updateTimer();
            } else {
                minutes--;
                seconds = 59;
                minutesElement.textContent = String(minutes).padStart(2, '0');
                secondsElement.textContent = String(seconds).padStart(2, '0');
            }
        } else {
            seconds--;
            secondsElement.textContent = String(seconds).padStart(2, '0');
        }
    }, 1000);
}

// Pause the timer
function pauseTimer() {
    isRunning = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
    clearInterval(timerId);
}

// Reset the timer
function resetTimer() {
    isRunning = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
    clearInterval(timerId);
    currentInterval = workInterval;
    isWorkTime = true;
    updateTimer();
}

// Add event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workIntervalInput.addEventListener('input', () => {
    workInterval = parseInt(workIntervalInput.value);
    if (isWorkTime) {
        currentInterval = workInterval;
        updateTimer();
    }
});
breakIntervalInput.addEventListener('input', () => {
    breakInterval = parseInt(breakIntervalInput.value);
    if (!isWorkTime) {
        currentInterval = breakInterval;
        updateTimer();
    }
});

// Initialize the timer display
updateTimer();