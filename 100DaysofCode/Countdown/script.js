// Digital Clock
let is12HourFormat = false;
let isDarkMode = false;
let alarmTime = null;
let countdownInterval = null;
let timerInterval;
let secondsElapsed = 0;
let lapCount = 1;
let laps = [];
let selectedLanguage = 'en';
let selectedDay = new Date().toLocaleString('default', { weekday: 'long' });

// Get elements
const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');
const exportBtn = document.getElementById('export-btn');
const alarmInput = document.getElementById('alarm-input');
const setAlarmBtn = document.getElementById('set-alarm-btn');
const countdownInput = document.getElementById('countdown-input');
const startCountdownBtn = document.getElementById('start-countdown-btn');
const countdownDisplay = document.getElementById('countdown-display');
const toggleFormatBtn = document.getElementById('toggle-format-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const languageSelector = document.getElementById('language-selector');
const daySelector = document.getElementById('day-selector');
const alarmSound = new Audio('alarm.mp3'); // Add an alarm sound file

// Event listeners
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
exportBtn.addEventListener('click', exportLaps);
setAlarmBtn.addEventListener('click', setAlarm);
startCountdownBtn.addEventListener('click', startCountdown);
toggleFormatBtn.addEventListener('click', toggleTimeFormat);
darkModeBtn.addEventListener('click', toggleDarkMode);
languageSelector.addEventListener('change', updateLanguage);
daySelector.addEventListener('change', updateDay);

// Update clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const day = selectedDay;
    const month = now.toLocaleString(selectedLanguage, { month: 'long' });
    const dayOfMonth = now.getDate();

    if (is12HourFormat) {
        const ampm = hours < 12 ? 'AM' : 'PM';
        const displayHours = hours % 12 || 12;
        clockElement.textContent = `${displayHours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    } else {
        clockElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    }

    dateElement.textContent = `${day}, ${month} ${dayOfMonth}`;

    // Check alarm
    if (alarmTime && hours === alarmTime.getHours() && minutes === alarmTime.getMinutes() && seconds === alarmTime.getSeconds()) {
        alarmSound.play();
        alert('Alarm going off!');
    }
}
setInterval(updateClock, 1000);

// Timer functions
function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const hours = Math.floor(secondsElapsed / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((secondsElapsed % 3600) / 60).toString().padStart(2, '0');
        const seconds = (secondsElapsed % 60).toString().padStart(2, '0');
        timerElement.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;
    lapBtn.disabled = false;
    exportBtn.disabled = false;
}

function stopTimer() {
    clearInterval(timerInterval);
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    timerElement.textContent = '00:00:00';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
    lapBtn.disabled = true;
    exportBtn.disabled = true;
    document.getElementById('laps').innerHTML = '';
    lapCount = 1;
    laps = [];
}

function recordLap() {
    const lapTime = timerElement.textContent;
    const lapElement = document.createElement('div');
    lapElement.className = 'lap';
    lapElement.textContent = `Lap ${lapCount}: ${lapTime}`;
    document.getElementById('laps').appendChild(lapElement);
    laps.push({ lap: lapCount, time: lapTime });
    lapCount++;
}

function exportLaps() {
    const csvContent = laps.map(lap => `${lap.lap},${lap.time}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'laps.csv';
    link.click();
}

// Alarm functions
function setAlarm() {
    const alarmTimeString = alarmInput.value;
    const [hours, minutes] = alarmTimeString.split(':');
    alarmTime = new Date();
    alarmTime.setHours(hours);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(0);
    alert(`Alarm set for ${alarmTimeString}`);
}

// Countdown functions
function startCountdown() {
    const countdownTime = parseInt(countdownInput.value);
    let timeLeft = countdownTime;
    countdownInterval = setInterval(() => {
        if (timeLeft > 0) {
            countdownDisplay.textContent = timeLeft;
            timeLeft--;
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = 'Time\'s up!';
            alert('Countdown finished!');
        }
    }, 1000);
}

// Toggle time format
function toggleTimeFormat() {
    is12HourFormat = !is12HourFormat;
    toggleFormatBtn.textContent = is12HourFormat ? 'Toggle 24 Hour' : 'Toggle 12 Hour';
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    darkModeBtn.textContent = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
}

// Update language
function updateLanguage() {
    selectedLanguage = languageSelector.value;
}

// Update day
function updateDay() {
    selectedDay = daySelector.value;
}