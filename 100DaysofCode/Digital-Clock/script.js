// script.js

// --- DOM Element References ---
const languageSelect = document.getElementById("languageSelect");
const themeToggle = document.getElementById("themeToggle");
const greetingEl = document.getElementById("greeting");
const dateEl = document.getElementById("date");
const card = document.getElementById("card");
const stopwatchEl = document.getElementById("stopwatch");
const startSWBtn = document.getElementById("startSW");
const resetSWBtn = document.getElementById("resetSW");
const alarmTimeInput = document.getElementById("alarmTime");
const setAlarmBtn = document.getElementById("setAlarm");
const alarmStatusEl = document.getElementById("alarmStatus");
const clockHoursEl = document.getElementById("hours");
const clockMinutesEl = document.getElementById("minutes");
const clockSecondsEl = document.getElementById("seconds");

// --- Global Variables ---
let currentLang = localStorage.getItem("lang") || navigator.language.slice(0, 2);
if (!["en", "hi", "kn", "mr", "es", "ru", "zh"].includes(currentLang)) {
    currentLang = "en";
}
languageSelect.value = currentLang;

// Stopwatch variables
let stopwatchInterval = null;
let stopwatchMilliseconds = 0; // Stored in ms for more precise tracking
let stopwatchRunning = false;
let lastStopwatchUpdate = Date.now(); // For persistence calculation

// Alarm variables
let alarmTime = localStorage.getItem("alarmTime") || null; // Persist alarm
let alarmTimeout = null; // Stores the setTimeout ID for the alarm check
let alarmSet = false; // Flag to indicate if an alarm is actively set

// --- Translations ---
const translations = {
    en: {
        stopwatch: "Stopwatch",
        start: "Start",
        pause: "Pause", // New
        resume: "Resume", // New
        reset: "Reset",
        alarm: "Alarm",
        setAlarm: "Set Alarm",
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening",
        alarmSetFor: "Alarm set for", // New
        alarmActive: "Alarm Active", // New
        alarmDismiss: "Dismiss", // New
        alarmSnooze: "Snooze (5min)", // New
        noAlarm: "No alarm set" // New
    },
    hi: {
        stopwatch: "स्टॉपवॉच",
        start: "शुरू",
        pause: "रोकें", // New
        resume: "फिर शुरू करें", // New
        reset: "रीसेट",
        alarm: "अलार्म",
        setAlarm: "अलार्म सेट करें",
        morning: "सुप्रभात",
        afternoon: "नमस्कार",
        evening: "शुभ संध्या",
        alarmSetFor: "अलार्म का समय", // New
        alarmActive: "अलार्म सक्रिय", // New
        alarmDismiss: "ख़ारिज करें", // New
        alarmSnooze: "स्नूज़ करें (5मिनट)", // New
        noAlarm: "कोई अलार्म सेट नहीं" // New
    },
    kn: {
        stopwatch: "ಸ್ಟಾಪ್‌ವಾಚ್",
        start: "ಪ್ರಾರಂಭಿಸಿ",
        pause: "ವಿರಾಮ", // New
        resume: "ಪುನರಾರಂಭಿಸಿ", // New
        reset: "ಮರುಹೊಂದಿಸಿ",
        alarm: "ಅಲಾರಂ",
        setAlarm: "ಅಲಾರಂ ಸೆಟ್ ಮಾಡಿ",
        morning: "ಶುಭೋದಯ",
        afternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ",
        evening: "ಶುಭ ಸಂಜೆ",
        alarmSetFor: "ಅಲಾರಂ ಸಮಯ", // New
        alarmActive: "ಅಲಾರಂ ಸಕ್ರಿಯವಾಗಿದೆ", // New
        alarmDismiss: "ವಜಾಗೊಳಿಸಿ", // New
        alarmSnooze: "ಸ್ನೂಜ್ (5ನಿಮಿಷ)", // New
        noAlarm: "ಅಲಾರಂ ಹೊಂದಿಸಲಾಗಿಲ್ಲ" // New
    },
    mr: {
        stopwatch: "स्टॉपवॉच",
        start: "सुरू",
        pause: "थांबवा", // New
        resume: "पुन्हा सुरू करा", // New
        reset: "रीसेट",
        alarm: "अलार्म",
        setAlarm: "अलार्म सेट करा",
        morning: "शुभ सकाळ",
        afternoon: "शुभ दुपार",
        evening: "शुभ संध्या",
        alarmSetFor: "अलार्म वेळ", // New
        alarmActive: "अलार्म सक्रिय", // New
        alarmDismiss: "काढून टाका", // New
        alarmSnooze: "स्नूझ (5मि)", // New
        noAlarm: "अलार्म सेट नाही" // New
    },
    es: {
        stopwatch: "Cronómetro",
        start: "Iniciar",
        pause: "Pausar", // New
        resume: "Reanudar", // New
        reset: "Reiniciar",
        alarm: "Alarma",
        setAlarm: "Configurar alarma",
        morning: "Buenos días",
        afternoon: "Buenas tardes",
        evening: "Buenas noches",
        alarmSetFor: "Alarma configurada para", // New
        alarmActive: "Alarma activa", // New
        alarmDismiss: "Descartar", // New
        alarmSnooze: "Posponer (5min)", // New
        noAlarm: "No hay alarma configurada" // New
    },
    ru: {
        stopwatch: "Секундомер",
        start: "Старт",
        pause: "Пауза", // New
        resume: "Продолжить", // New
        reset: "Сброс",
        alarm: "Будильник",
        setAlarm: "Установить",
        morning: "Доброе утро",
        afternoon: "Добрый день",
        evening: "Добрый вечер",
        alarmSetFor: "Будильник установлен на", // New
        alarmActive: "Будильник активен", // New
        alarmDismiss: "Отклонить", // New
        alarmSnooze: "Отложить (5мин)", // New
        noAlarm: "Будильник не установлен" // New
    },
    zh: {
        stopwatch: "秒表",
        start: "开始",
        pause: "暂停", // New
        resume: "恢复", // New
        reset: "重置",
        alarm: "闹钟",
        setAlarm: "设置闹钟",
        morning: "早上好",
        afternoon: "下午好",
        evening: "晚上好",
        alarmSetFor: "闹钟设置为", // New
        alarmActive: "闹钟已激活", // New
        alarmDismiss: "解除", // New
        alarmSnooze: "小睡 (5分钟)", // New
        noAlarm: "未设置闹钟" // New
    }
};

// --- Initial Setup & Event Listeners ---

// Theme auto-detection and toggling
if (!localStorage.getItem("theme")) {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        document.body.classList.add("light");
    }
} else {
    document.body.classList.toggle("light", localStorage.getItem("theme") === "light");
}

themeToggle.onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme",
        document.body.classList.contains("light")? "light" : "dark");
};

// Language selection
function translatePage(lang) {
    card.classList.add("fade");
    // Using setTimeout to allow CSS transition to play before content updates
    setTimeout(() => {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        // Update greeting and alarm status immediately after translation
        updateGreeting();
        updateAlarmStatusDisplay();
        // Update stopwatch button text based on its state
        updateStopwatchButtonText();

        localStorage.setItem("lang", lang);
        card.classList.remove("fade");
    }, 150); // Matches CSS transition duration
}

languageSelect.onchange = (e) => {
    currentLang = e.target.value;
    translatePage(currentLang);
};

// --- Clock Functionality ---
function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    clockHoursEl.textContent = String(h).padStart(2, "0");
    clockMinutesEl.textContent = String(m).padStart(2, "0");
    clockSecondsEl.textContent = String(s).padStart(2, "0");

    dateEl.textContent = now.toLocaleDateString(currentLang, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    updateGreeting(h); // Pass current hour to greeting update
    checkAlarm(now); // Check alarm every second

    // Schedule next update precisely (improves accuracy)
    setTimeout(updateClock, 1000 - now.getMilliseconds());
}

function updateGreeting(h = new Date().getHours()) {
    const greetKey = h < 12? "morning" : h < 18? "afternoon" : "evening";
    greetingEl.textContent = translations[currentLang][greetKey];
}

// Initial call for clock and greeting
updateClock();
translatePage(currentLang); // Ensure initial page translation

// --- Stopwatch Functionality ---

// Load persisted stopwatch state on page load
function loadStopwatchState() {
    const savedSW = localStorage.getItem("stopwatchMilliseconds");
    const savedRunning = localStorage.getItem("stopwatchRunning");
    const savedLastUpdate = localStorage.getItem("lastStopwatchUpdate");

    if (savedSW!== null) {
        stopwatchMilliseconds = parseInt(savedSW, 10);
    }
    if (savedRunning === "true" && savedLastUpdate!== null) {
        const timeSinceLastUpdate = Date.now() - parseInt(savedLastUpdate, 10);
        stopwatchMilliseconds += timeSinceLastUpdate; // Add elapsed time since last save
        startStopwatch(); // Restart if it was running
    }
    updateStopwatchDisplay();
    updateStopwatchButtonText();
}

function updateStopwatchDisplay() {
    const totalSeconds = Math.floor(stopwatchMilliseconds / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const ms = Math.floor((stopwatchMilliseconds % 1000) / 10); // Show centiseconds

    stopwatchEl.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    // Optional: add centiseconds for more precision visual: `.${String(ms).padStart(2, "0")}`
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        lastStopwatchUpdate = Date.now(); // Record start time for persistence
        stopwatchInterval = setInterval(() => {
            const now = Date.now();
            stopwatchMilliseconds += (now - lastStopwatchUpdate); // Add elapsed time
            lastStopwatchUpdate = now; // Update last update time
            updateStopwatchDisplay();
            localStorage.setItem("stopwatchMilliseconds", stopwatchMilliseconds);
            localStorage.setItem("lastStopwatchUpdate", lastStopwatchUpdate);
            localStorage.setItem("stopwatchRunning", stopwatchRunning);
        }, 100); // Update every 100ms for smoother display
        updateStopwatchButtonText();
    }
}

function pauseStopwatch() {
    if (stopwatchRunning) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        stopwatchRunning = false;
        localStorage.setItem("stopwatchRunning", stopwatchRunning);
        updateStopwatchButtonText();
    }
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchRunning = false;
    stopwatchMilliseconds = 0;
    updateStopwatchDisplay();
    localStorage.removeItem("stopwatchMilliseconds");
    localStorage.removeItem("stopwatchRunning");
    localStorage.removeItem("lastStopwatchUpdate");
    updateStopwatchButtonText();
}

function updateStopwatchButtonText() {
    if (stopwatchRunning) {
        startSWBtn.textContent = translations[currentLang].pause;
    } else {
        // If stopwatchMilliseconds is > 0, it means it's paused, so offer Resume
        startSWBtn.textContent = stopwatchMilliseconds > 0? translations[currentLang].resume : translations[currentLang].start;
    }
}

startSWBtn.onclick = () => {
    if (stopwatchRunning) {
        pauseStopwatch();
    } else {
        startStopwatch();
    }
};

resetSWBtn.onclick = resetStopwatch;

loadStopwatchState(); // Load state when script loads

// --- Alarm Functionality ---

// Load persisted alarm state on page load
function loadAlarmState() {
    if (alarmTime) {
        alarmTimeInput.value = alarmTime;
        alarmSet = true;
    }
    updateAlarmStatusDisplay();
}

function setOrClearAlarm() {
    const newAlarmTime = alarmTimeInput.value;

    // If input is empty, clear alarm
    if (!newAlarmTime) {
        clearAlarm();
        return;
    }

    alarmTime = newAlarmTime;
    localStorage.setItem("alarmTime", alarmTime);
    alarmSet = true;
    updateAlarmStatusDisplay();
    // Pre-fill next alarm time for convenience (e.g., 5 min from now)
    suggestNextAlarmTime();
}

function clearAlarm() {
    alarmTime = null;
    localStorage.removeItem("alarmTime");
    alarmSet = false;
    alarmTimeInput.value = ""; // Clear input field
    if (alarmTimeout) clearTimeout(alarmTimeout);
    updateAlarmStatusDisplay();
}

function updateAlarmStatusDisplay() {
    if (alarmSet && alarmTime) {
        alarmStatusEl.textContent = `${translations[currentLang].alarmSetFor} ${alarmTime}`;
    } else {
        alarmStatusEl.textContent = translations[currentLang].noAlarm;
    }
}

function suggestNextAlarmTime() {
    const now = new Date();
    const future = new Date(now.getTime() + 5 * 60000); // 5 minutes from now
    const h = String(future.getHours()).padStart(2, '0');
    const m = String(future.getMinutes()).padStart(2, '0');
    alarmTimeInput.value = `${h}:${m}`;
}

function checkAlarm(now) {
    if (!alarmSet ||!alarmTime) return;

    const [alarmH, alarmM] = alarmTime.split(":").map(Number);
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const currentS = now.getSeconds();

    if (currentH === alarmH && currentM === alarmM && currentS === 0) {
        triggerAlarm();
    }
}

let alarmAudio = null; // Variable to hold alarm sound
function triggerAlarm() {
    pauseStopwatch(); // Pause stopwatch if running
    // Prevent re-triggering if already active for this minute
    if (document.getElementById("alarmModal")) return;

    // Create an audio element for the alarm sound
    alarmAudio = new Audio('path/to/your/alarm-sound.mp3'); // REPLACE WITH YOUR ALARM SOUND PATH
    alarmAudio.loop = true;
    alarmAudio.volume = 0.8;
    alarmAudio.play().catch(e => console.error("Audio play failed:", e));

    // Display a custom modal instead of alert
    const alarmModal = document.createElement("div");
    alarmModal.id = "alarmModal";
    alarmModal.innerHTML = `
        <div class="alarm-modal-content">
            <h2>${translations[currentLang].alarmActive}</h2>
            <p>${translations[currentLang].alarmSetFor} ${alarmTime}</p>
            <button id="dismissAlarm">${translations[currentLang].alarmDismiss}</button>
            <button id="snoozeAlarm">${translations[currentLang].snooze} (5min)</button>
        </div>
    `;
    document.body.appendChild(alarmModal);

    // Style the modal (you'll want to add this to your style.css)
    const modalStyle = document.createElement("style");
    modalStyle.id = "alarmModalStyle";
    modalStyle.innerHTML = `
        #alarmModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
            opacity: 0;
            animation: fadeInModal 0.3s forwards;
        }
       .alarm-modal-content {
            background: var(--card);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            color: var(--text);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            max-width: 90%;
            transform: scale(0.9);
            animation: popInModal 0.3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
       .alarm-modal-content h2 {
            font-size: 2rem;
            margin-bottom: 15px;
            color: var(--button-bg);
            text-shadow: 0 0 8px var(--button-bg);
        }
       .alarm-modal-content p {
            font-size: 1.2rem;
            margin-bottom: 25px;
        }
       .alarm-modal-content button {
            background: var(--button-bg);
            color: var(--button-text);
            border: none;
            padding: 10px 20px;
            margin: 0 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease, transform 0.2s ease;
        }
       .alarm-modal-content button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }

        @keyframes fadeInModal {
            to { opacity: 1; }
        }
        @keyframes popInModal {
            to { transform: scale(1); }
        }
    `;
    document.head.appendChild(modalStyle);

    document.getElementById("dismissAlarm").onclick = () => {
        dismissAlarm();
    };

    document.getElementById("snoozeAlarm").onclick = () => {
        snoozeAlarm();
    };

    // Vibrate device if supported
    if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500]); // Vibrate pattern
    }
}

function dismissAlarm() {
    if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    }
    const modal = document.getElementById("alarmModal");
    if (modal) modal.remove();
    const modalStyle = document.getElementById("alarmModalStyle");
    if (modalStyle) modalStyle.remove();
    clearAlarm(); // Clear the alarm after dismissal
    suggestNextAlarmTime(); // Suggest a new alarm time
}

function snoozeAlarm() {
    if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    }
    const modal = document.getElementById("alarmModal");
    if (modal) modal.remove();
    const modalStyle = document.getElementById("alarmModalStyle");
    if (modalStyle) modalStyle.remove();

    // Set alarm for 5 minutes from now
    const now = new Date();
    const snoozeTime = new Date(now.getTime() + 5 * 60000); // Add 5 minutes
    const h = String(snoozeTime.getHours()).padStart(2, '0');
    const m = String(snoozeTime.getMinutes()).padStart(2, '0');
    alarmTime = `${h}:${m}`;
    localStorage.setItem("alarmTime", alarmTime);
    alarmSet = true;
    alarmTimeInput.value = alarmTime; // Update input field
    updateAlarmStatusDisplay();
}

setAlarmBtn.onclick = setOrClearAlarm;
alarmTimeInput.onfocus = suggestNextAlarmTime; // Suggest a time when input is focused

loadAlarmState(); // Load alarm state on page load

// --- Keyboard Shortcuts ---
document.addEventListener("keydown", (e) => {
    if (e.key === "t") themeToggle.click();
    if (e.key === "s") startSWBtn.click(); // S for start/pause/resume stopwatch
    if (e.key === "r") resetSWBtn.click(); // R for reset stopwatch
    if (e.key === "a") setAlarmBtn.click(); // A for set alarm
    // If modal is active, allow keyboard dismiss/snooze
    if (document.getElementById("alarmModal")) {
        if (e.key === "Escape") document.getElementById("dismissAlarm").click();
        if (e.key === "Enter") document.getElementById("snoozeAlarm").click();
    }
});
