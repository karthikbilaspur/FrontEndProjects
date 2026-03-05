// NAVIGATION
const NAV_BUTTONS = {
    'navLorem': 'lorem',
    'navPassword': 'password',
    'navColor': 'color',
    'navEmoji': 'emoji',
    'navQr': 'qr',
    'navRandom': 'random',
    'navFile': 'file', // Changed from navAi
    'navHistory': 'history'
};

function showSection(id) {
    document.querySelectorAll(".tool").forEach(t => t.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    clearSectionOutputs(id);

    // Update active state of sidebar buttons
    document.querySelectorAll(".sidebar button").forEach(btn => {
        if (NAV_BUTTONS[btn.id] === id) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Optionally set focus to the first input of the active section for accessibility
    const firstInput = document.getElementById(id).querySelector('input, select, textarea');
    if (firstInput) {
        firstInput.focus();
    }
}

function clearSectionOutputs(id) {
    switch (id) {
        case 'lorem':
            document.getElementById("loremOutput").innerText = "";
            break;
        case 'password':
            document.getElementById("passwordOutput").value = "";
            checkStrength(""); // Reset strength indicator
            break;
        case 'color':
            document.getElementById("colorBox").style.background = "#1c1c1c";
            document.getElementById("colorCode").innerText = "";
            break;
        case 'qr':
            document.getElementById("qrInput").value = "";
            document.getElementById("qrCodeContainer").innerHTML = ""; // Clear QR container
            qrInstance = null; // Reset QR instance
            document.getElementById("downloadQrBtn").disabled = true; // Disable download
            break;
        case 'random':
            document.getElementById("randomOutput").innerText = "";
            break;
        case 'file': // New case for file generator
            document.getElementById("txtContent").value = loadSetting('file', 'txtContent', "");
            document.getElementById("txtFilename").value = loadSetting('file', 'txtFilename', "my-document");
            document.getElementById("csvHeader").value = loadSetting('file', 'csvHeader', "Name,Email,Age");
            document.getElementById("csvData").value = loadSetting('file', 'csvData', "John Doe,john@example.com,30\nJane Smith,jane@example.com,25");
            document.getElementById("csvFilename").value = loadSetting('file', 'csvFilename', "my-data");
            document.getElementById("jsonContent").value = loadSetting('file', 'jsonContent', JSON.stringify({
                "name": "Example Data",
                "version": "1.0",
                "items": [
                  {"id": 1, "description": "First item"},
                  {"id": 2, "description": "Second item"}
                ]
              }, null, 2)); // Prettify default JSON
            document.getElementById("jsonFilename").value = loadSetting('file', 'jsonFilename', "my-object");
            document.getElementById("htmlTitle").value = loadSetting('file', 'htmlTitle', "My Awesome Page");
            document.getElementById("htmlBody").value = loadSetting('file', 'htmlBody', `<h1>Welcome to my Page!</h1>
<p>This HTML file was generated using the Generator Hub.</p>
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>`);
            document.getElementById("htmlFilename").value = loadSetting('file', 'htmlFilename', "my-page");
            showFileSubGenerator(loadSetting('file', 'lastActiveTab', 'txt')); // Reset to last active tab
            break;
    }
}

// LOCAL STORAGE KEYS
const HISTORY_KEY = "generatorHubHistory";
const SAVED_COLORS_KEY = "generatorHubSavedColors";
const SETTINGS_KEY = "generatorHubSettings"; // New key for general settings

// FOOTER UTILITIES
function updateCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// HISTORY
function addHistory(text) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    history.unshift({ timestamp: new Date().toLocaleString(), entry: text });
    if (history.length > 20) {
        history = history.slice(0, 20);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById("historyList");
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    list.innerHTML = "";

    if (history.length === 0) {
        const li = document.createElement("li");
        li.innerText = "No history yet!";
        list.appendChild(li);
    } else {
        history.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>[${item.timestamp}]</strong> ${item.entry}`;
            list.appendChild(li);
        });
    }
}

function clearHistory() {
    if (confirm("Are you sure you want to clear all history?")) {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
        showToast("History cleared!");
    }
}

// COPY
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast-message ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        toast.addEventListener('transitionend', () => toast.remove());
    }, 2500); // Display for 2.5 seconds
}

function copyToClipboard(textToCopy, successMessage = "Copied to clipboard!") {
    if (!textToCopy) {
        showToast("Nothing to copy!", "error");
        return;
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(successMessage);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy text. Please try again.', 'error');
    });
}

// General function to get a value from an input or its innerText
function getElementValue(id) {
    const element = document.getElementById(id);
    if (!element) return "";
    if (element.value!== undefined) return element.value;
    return element.innerText;
}

// LOREM IPSUM GENERATOR
const LOREM_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const LOREM_SENTENCES = LOREM_TEXT.match(/[^.!?]+[.!?]\s*/g) || [LOREM_TEXT];
const LOREM_WORDS = LOREM_TEXT.split(/\s+/);

function generateLorem() {
    const countInput = document.getElementById("loremCount");
    const count = parseInt(countInput.value, 10);
    const typeParagraphs = document.getElementById("loremTypeParagraphs").checked;
    const typeSentences = document.getElementById("loremTypeSentences").checked;
    const typeWords = document.getElementById("loremTypeWords").checked;
    const startClassic = document.getElementById("loremStartClassic").checked;
    const loremOutput = document.getElementById("loremOutput");

    if (isNaN(count) || count <= 0) {
        loremOutput.innerText = "Please enter a valid positive number.";
        return;
    }
    if (count > 1000 && (typeWords || typeSentences)) { // Higher limit for words/sentences
         loremOutput.innerText = "Generating more than 1000 items might be slow. Please choose a smaller number.";
         return;
    }
    if (count > 100 && typeParagraphs) {
        loremOutput.innerText = "Generating more than 100 paragraphs might be slow. Please choose a smaller number.";
        return;
    }

    let result = "";
    let unit = "";

    if (typeParagraphs) {
        unit = "paragraphs";
        if (startClassic) {
            result += LOREM_TEXT + "\n\n";
            for (let i = 1; i < count; i++) result += LOREM_TEXT + "\n\n";
        } else {
            for (let i = 0; i < count; i++) result += LOREM_TEXT + "\n\n";
        }
    } else if (typeSentences) {
        unit = "sentences";
        const sentencesPool = LOREM_SENTENCES.slice();
        if (startClassic) {
            result += sentencesPool[0] + " ";
            for (let i = 1; i < count; i++) {
                result += sentencesPool[Math.floor(Math.random() * sentencesPool.length)] + " ";
            }
        } else {
            for (let i = 0; i < count; i++) {
                result += sentencesPool[Math.floor(Math.random() * sentencesPool.length)] + " ";
            }
        }
        result = result.trim();
    } else if (typeWords) {
        unit = "words";
        const wordsPool = LOREM_WORDS.slice();
        if (startClassic) {
            result += wordsPool[0] + " ";
            for (let i = 1; i < count; i++) {
                result += wordsPool[Math.floor(Math.random() * wordsPool.length)] + " ";
            }
        } else {
            for (let i = 0; i < count; i++) {
                result += wordsPool[Math.floor(Math.random() * wordsPool.length)] + " ";
            }
        }
        result = result.trim();
    }

    loremOutput.innerText = result;
    addHistory(`Generated ${count} ${unit} of Lorem Ipsum`);

    if (document.getElementById("autoCopyLorem").checked) {
        copyToClipboard(result, "Lorem Ipsum copied!");
    }
}

// PASSWORD GENERATOR
function generatePassword() {
    const lengthInput = document.getElementById("passLength");
    let length = parseInt(lengthInput.value, 10);
    const passwordOutput = document.getElementById("passwordOutput");

    const includeUppercase = document.getElementById("passIncludeUppercase").checked;
    const includeLowercase = document.getElementById("passIncludeLowercase").checked;
    const includeNumbers = document.getElementById("passIncludeNumbers").checked;
    const includeSymbols = document.getElementById("passIncludeSymbols").checked;
    const excludeSimilar = document.getElementById("passExcludeSimilar").checked;

    let chars = "";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+=-{}[]|:;'<>,.?/~";

    if (excludeSimilar) {
        chars = chars.replace(/[l1IO0]/g, ""); // Remove similar looking characters
    }

    // Ensure at least one character type is selected
    if (chars.length === 0) {
        passwordOutput.value = "Select at least one character type.";
        checkStrength("");
        return;
    }

    if (isNaN(length) || length <= 0) {
        passwordOutput.value = "Length must be a positive number.";
        checkStrength("");
        return;
    }
    if (length < 4 || length > 64) {
        passwordOutput.value = "Length must be between 4 and 64 characters.";
        checkStrength("");
        return;
    }

    let pass = "";
    for (let i = 0; i < length; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
    }

    passwordOutput.value = pass;
    checkStrength(pass);
    addHistory(`Password Generated (Length: ${length}, Options: U${includeUppercase?'T':'F'}L${includeLowercase?'T':'F'}N${includeNumbers?'T':'F'}S${includeSymbols?'T':'F'}X${excludeSimilar?'T':'F'})`);

    if (document.getElementById("autoCopyPassword").checked) {
        copyToClipboard(pass, "Password copied!");
    }
}

function checkStrength(p) {
    const bar = document.getElementById("strengthBar");
    const text = document.getElementById("strengthText");
    const progressBar = document.querySelector("#password.strength"); // Corrected selector

    if (!p) {
        bar.style.width = "0%";
        bar.style.background = "none";
        text.innerText = "";
        if (progressBar) progressBar.setAttribute('aria-valuenow', 0);
        return;
    }

    let strengthScore = 0;

    // Length score
    strengthScore += p.length * 4;

    // Character types
    const hasLower = /[a-z]/.test(p);
    const hasUpper = /[A-Z]/.test(p);
    const hasNumber = /[0-9]/.test(p);
    const hasSymbol = /[!@#$%^&*()_+=-{}[\]|:;'<>,.?/~]/.test(p);

    if (hasLower) strengthScore += 10;
    if (hasUpper) strengthScore += 10;
    if (hasNumber) strengthScore += 10;
    if (hasSymbol) strengthScore += 20; // Symbols contribute more

    // Bonus for combinations
    let numTypes = (hasLower? 1 : 0) + (hasUpper? 1 : 0) + (hasNumber? 1 : 0) + (hasSymbol? 1 : 0);
    if (numTypes > 2) strengthScore += numTypes * 10; // Extra bonus for variety

    // Penalties for patterns
    if (/(.)\1\1/.test(p)) strengthScore -= 15; // Three consecutive identical characters
    if (/abc|123|xyz|pqr|qwe|zxc|asd/.test(p.toLowerCase())) strengthScore -= 10; // Common sequences

    // Clamp score to reasonable range for visual representation
    strengthScore = Math.max(0, Math.min(100, strengthScore));

    let barWidth = strengthScore;
    let barColor = "red";
    let strengthText = "Very Weak";

    if (strengthScore >= 80) {
        barColor = "green";
        strengthText = "Very Strong";
    } else if (strengthScore >= 60) {
        barColor = "lightgreen";
        strengthText = "Strong";
    } else if (strengthScore >= 40) {
        barColor = "orange";
        strengthText = "Medium";
    } else if (strengthScore >= 20) {
        barColor = "#FF8C00"; // Darker orange
        strengthText = "Weak";
    } else {
        barColor = "red";
        strengthText = "Very Weak";
    }

    bar.style.width = `${barWidth}%`;
    bar.style.background = barColor; // Simple color for now, gradient will override
    text.innerText = strengthText;
    if (progressBar) progressBar.setAttribute('aria-valuenow', barWidth);
}

// COLOR GENERATOR
function generateColor() {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    document.getElementById("colorBox").style.background = color;
    document.getElementById("colorCode").innerText = color;
    addHistory(`Generated color: ${color}`);
}

function saveColor() {
    const color = document.getElementById("colorCode").innerText;
    if (!color || color === "" || color === "#1C1C1C" || color === "#1c1c1c") { // Check for default bg color
        showToast("Generate a color first!", "error");
        return;
    }

    let saved = JSON.parse(localStorage.getItem(SAVED_COLORS_KEY)) || [];
    if (!saved.includes(color)) {
        saved.unshift(color);
        if (saved.length > 10) {
            saved = saved.slice(0, 10);
        }
        localStorage.setItem(SAVED_COLORS_KEY, JSON.stringify(saved));
        renderColors();
        addHistory(`Saved color: ${color}`);
        showToast(`Saved color: ${color}`);
    } else {
        showToast("This color is already saved!");
    }
}

function renderColors() {
    const container = document.getElementById("savedColors");
    const saved = JSON.parse(localStorage.getItem(SAVED_COLORS_KEY)) || [];
    container.innerHTML = "";

    if (saved.length === 0) {
        container.innerText = "No saved colors yet! Generate and save some.";
        return;
    }

    saved.forEach(c => {
        const div = document.createElement("div");
        div.className = "colorItem";
        div.style.background = c;
        div.title = `Click to copy ${c}`;
        div.tabIndex = 0; // Make div focusable
        div.setAttribute('role', 'button'); // Indicate it's clickable
        div.setAttribute('aria-label', `Saved color ${c}, click to copy`);
        div.addEventListener('click', () => {
            copyToClipboard(c, `Copied color: ${c}`);
        });
        div.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyToClipboard(c, `Copied color: ${c}`);
            }
        });
        container.appendChild(div);
    });
}

function clearSavedColors() {
    if (confirm("Are you sure you want to clear all saved colors?")) {
        localStorage.removeItem(SAVED_COLORS_KEY);
        renderColors();
        showToast("Saved colors cleared!");
    }
}

// EMOJI GENERATOR
const EMOJIS = ["😀", "😂", "😎", "🔥", "🚀", "🌈", "🐱", "🍕", "🎉", "💯", "✅", "🤔", "💡", "🌟", "✨", "❤️", "👍", "🙏", "🤩", "🤯", "👍", "👏", "🙌", "🙏", "💪", "💫", "✨", "🌟", "🔥", "💯", "✅", "✔️", "❎", "❌", "❓", "❕", "❗", "⁉️", "🚫", "🚷", "🚯", "🚳", "🚱", "🔞", "☢️", "☣️", "⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️", "↕️", "↔️", "↩️", "↪️", "⤴️", "⤵️", "🔃", "🔄", "🔙", "🔚", "🔛", "🔜", "🔝", "🛐", "⚛️", "🕉️", "✡️", "☸️", "☯️", "✝️", "☦️", "☪️", " Peace", "⚜️", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎", "♀️", "♂️", "⚧️", "🔻", "🔺", "❕", "❔", "❗", "⁉️", "〰️", "〽️", "▪️", "▫️", "◻️", "◼️", "◽", "◾", "⬛", "⬜", "🔸", "🔹", "🔶", "🔷", "🔺", "▪️", "▫️", "⚫", "⚪", "🔴", "🔵", "🟤", "🟣", "🟠", "🟡", "🟢", "⚪", "⚫", "🟥", "🟦", "🟧", "🟨", "🟩", "🟪", "🟫", "▪️", "▫️"];

function generateEmoji() {
    const e = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    document.getElementById("emojiOutput").innerText = e;
    addHistory(`Generated emoji: ${e}`);

    if (document.getElementById("autoCopyEmoji").checked) {
        copyToClipboard(e, `Copied emoji: ${e}`);
    }
}

// QR CODE GENERATOR
let qrInstance;

function generateQR() {
    const qrInput = document.getElementById("qrInput");
    const text = qrInput.value.trim();
    const qrcodeContainer = document.getElementById("qrCodeContainer");
    const downloadQrBtn = document.getElementById("downloadQrBtn");
    const errorCorrectionLevel = document.getElementById("qrErrorCorrection").value;

    if (text === "") {
        qrcodeContainer.innerHTML = "<p class='error-message' aria-live='assertive'>Please enter text or a URL to generate a QR code.</p>";
        downloadQrBtn.disabled = true;
        return;
    }

    qrcodeContainer.innerHTML = "";
    downloadQrBtn.disabled = false;

    // QRCode.CorrectLevel values are L, M, Q, H
    const levels = { 'L': QRCode.CorrectLevel.L, 'M': QRCode.CorrectLevel.M, 'Q': QRCode.CorrectLevel.Q, 'H': QRCode.CorrectLevel.H };

    if (!qrInstance || qrInstance._el!== qrcodeContainer) {
        qrInstance = new QRCode(qrcodeContainer, {
            text: text,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: levels[errorCorrectionLevel]
        });
    } else {
        qrInstance.makeCode(text);
    }

    addHistory(`QR created for: "${text.substring(0, 30)}${text.length > 30? '...' : ''}" (ECC: ${errorCorrectionLevel})`);
}

function downloadQR() {
    const canvas = document.querySelector("#qrCodeContainer canvas");
    if (!canvas) {
        showToast("No QR code generated yet!", "error");
        return;
    }

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("QR Code downloaded!");
}

// RANDOM NUMBER GENERATOR
function generateNumber() {
    const minNumInput = document.getElementById("minNum");
    const maxNumInput = document.getElementById("maxNum");
    const countInput = document.getElementById("randomNumberCount");
    const uniqueCheckbox = document.getElementById("randomUnique");
    const randomOutput = document.getElementById("randomOutput");

    const min = parseInt(minNumInput.value, 10);
    const max = parseInt(maxNumInput.value, 10);
    const count = parseInt(countInput.value, 10);
    const unique = uniqueCheckbox.checked;

    if (isNaN(min) || isNaN(max)) {
        randomOutput.innerText = "Please enter valid whole numbers for Min and Max.";
        return;
    }
    if (isNaN(count) || count <= 0) {
        randomOutput.innerText = "Please enter a valid positive number for results count.";
        return;
    }
    if (min > max) {
        randomOutput.innerText = "Min value cannot be greater than Max value.";
        return;
    }
    if (unique && (max - min + 1) < count) {
        randomOutput.innerText = `Cannot generate ${count} unique numbers between ${min} and ${max}. There are only ${max - min + 1} possible unique numbers.`;
        return;
    }

    let generatedNumbers = [];
    if (unique) {
        const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            generatedNumbers.push(pool.splice(randomIndex, 1)[0]);
        }
    } else {
        for (let i = 0; i < count; i++) {
            generatedNumbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
    }

    const resultText = generatedNumbers.join(", ");
    randomOutput.innerText = resultText;
    addHistory(`Generated ${count} random numbers between ${min}-${max}: ${resultText.substring(0, 50)}${resultText.length > 50? '...' : ''}`);

    if (document.getElementById("autoCopyRandom").checked) {
        copyToClipboard(resultText, "Random numbers copied!");
    }
}

// FILE GENERATOR (New section)
let currentFileSubGenerator = 'txt'; // Keep track of active sub-generator

function showFileSubGenerator(type) {
    const subGenerators = document.querySelectorAll('.file-sub-generator');
    subGenerators.forEach(gen => gen.classList.add('hidden'));
    document.getElementById(`file${type.charAt(0).toUpperCase() + type.slice(1)}Generator`).classList.remove('hidden');

    const tabs = document.querySelectorAll('.file-type-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(`fileType${type.charAt(0).toUpperCase() + type.slice(1)}Btn`).classList.add('active');

    currentFileSubGenerator = type; // Update active type
    saveSetting('file', 'lastActiveTab', type); // Save last active tab
}

function downloadFile(filename, content, type, historyEntry) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the object URL

    addHistory(historyEntry);
    showToast(`Downloaded ${filename}!`);
}

function downloadTxtFile() {
    let filename = document.getElementById('txtFilename').value.trim();
    const content = document.getElementById('txtContent').value;

    if (!filename) {
        showToast("Please enter a filename.", "error");
        return;
    }
    if (!content) {
        showToast("Please enter some content for the TXT file.", "error");
        return;
    }
    filename = (filename.endsWith('.txt'))? filename : `${filename}.txt`;
    downloadFile(filename, content, 'text/plain', `Generated and downloaded TXT: ${filename}`);
}

function downloadCsvFile() {
    let filename = document.getElementById('csvFilename').value.trim();
    const header = document.getElementById('csvHeader').value.trim();
    const data = document.getElementById('csvData').value.trim();

    if (!filename) {
        showToast("Please enter a filename.", "error");
        return;
    }
    
    // Validate that if headers exist, data rows match column count
    const headerColumns = header? header.split(',').length : 0;
    const dataRows = data.split('\n').filter(row => row.trim()!== '');
    
    if (!header &&!data) {
        showToast("Please enter some headers and/or data for the CSV file.", "error");
        return;
    }

    let isValid = true;
    for (const row of dataRows) {
        if (row.split(',').length!== headerColumns && headerColumns > 0) { // Only validate if headers are provided
            isValid = false;
            break;
        }
    }
    if (!isValid) {
        showToast("CSV data columns do not match header columns. Please check your input.", "error");
        return;
    }

    const content = header? `${header}\n${data}` : data; // Only add header if it exists
    filename = (filename.endsWith('.csv'))? filename : `${filename}.csv`;
    downloadFile(filename, content, 'text/csv', `Generated and downloaded CSV: ${filename}`);
}

function downloadJsonFile() {
    let filename = document.getElementById('jsonFilename').value.trim();
    const contentInput = document.getElementById('jsonContent').value;

    if (!filename) {
        showToast("Please enter a filename.", "error");
        return;
    }
    if (!contentInput.trim()) {
        showToast("Please enter some JSON content.", "error");
        return;
    }

    let formattedContent = contentInput;
    try {
        // Try to parse and re-stringify to ensure valid JSON and consistent formatting
        const parsed = JSON.parse(contentInput);
        formattedContent = JSON.stringify(parsed, null, 2); // Prettify
        document.getElementById('jsonContent').value = formattedContent; // Update textarea with formatted content
    } catch (e) {
        showToast(`Invalid JSON format: ${e.message}`, "error");
        return;
    }

    filename = (filename.endsWith('.json'))? filename : `${filename}.json`;
    downloadFile(filename, formattedContent, 'application/json', `Generated and downloaded JSON: ${filename}`);
}

function formatJsonContent() {
    const contentInput = document.getElementById('jsonContent');
    try {
        const parsed = JSON.parse(contentInput.value);
        contentInput.value = JSON.stringify(parsed, null, 2); // Prettify with 2 spaces
        showToast("JSON formatted successfully!");
    } catch (e) {
        showToast(`Invalid JSON to format: ${e.message}`, "error");
    }
}

function downloadHtmlFile() {
    let filename = document.getElementById('htmlFilename').value.trim();
    const title = document.getElementById('htmlTitle').value;
    const bodyContent = document.getElementById('htmlBody').value;

    if (!filename) {
        showToast("Please enter a filename.", "error");
        return;
    }
    if (!bodyContent.trim()) {
        showToast("Please enter some body content for the HTML file.", "error");
        return;
    }

    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Generated Page'}</title>
</head>
<body>
${bodyContent}
</body>
</html>`;

    filename = (filename.endsWith('.html'))? filename : `${filename}.html`;
    downloadFile(filename, content, 'text/html', `Generated and downloaded HTML: ${filename}`);
}

// SETTINGS & LOCAL STORAGE
const generatorSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};

function saveSetting(generatorId, settingName, value) {
    if (!generatorSettings[generatorId]) {
        generatorSettings[generatorId] = {};
    }
    generatorSettings[generatorId][settingName] = value;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(generatorSettings));
}

function loadSetting(generatorId, settingName, defaultValue) {
    if (generatorSettings[generatorId] && generatorSettings[generatorId][settingName]!== undefined) {
        return generatorSettings[generatorId][settingName];
    }
    return defaultValue;
}

function applySavedSettings() {
    // Lorem Ipsum
    document.getElementById("loremCount").value = loadSetting('lorem', 'count', 5);
    // Ensure only one radio button is checked based on loaded setting, or default to paragraphs
    const loremType = loadSetting('lorem', 'type', 'paragraphs');
    document.getElementById(`loremType${loremType.charAt(0).toUpperCase() + loremType.slice(1)}`).checked = true;

    document.getElementById("loremStartClassic").checked = loadSetting('lorem', 'startClassic', true);
    document.getElementById("autoCopyLorem").checked = loadSetting('lorem', 'autoCopy', false);

    // Password
    document.getElementById("passLength").value = loadSetting('password', 'length', 12);
    document.getElementById("passIncludeUppercase").checked = loadSetting('password', 'includeUppercase', true);
    document.getElementById("passIncludeLowercase").checked = loadSetting('password', 'includeLowercase', true);
    document.getElementById("passIncludeNumbers").checked = loadSetting('password', 'includeNumbers', true);
    document.getElementById("passIncludeSymbols").checked = loadSetting('password', 'includeSymbols', true);
    document.getElementById("passExcludeSimilar").checked = loadSetting('password', 'excludeSimilar', false);
    document.getElementById("autoCopyPassword").checked = loadSetting('password', 'autoCopy', false);

    // QR Code
    document.getElementById("qrErrorCorrection").value = loadSetting('qr', 'errorCorrection', 'H');

    // Random Number
    document.getElementById("minNum").value = loadSetting('random', 'min', 1);
    document.getElementById("maxNum").value = loadSetting('random', 'max', 100);
    document.getElementById("randomNumberCount").value = loadSetting('random', 'count', 1);
    document.getElementById("randomUnique").checked = loadSetting('random', 'unique', false);
    document.getElementById("autoCopyRandom").checked = loadSetting('random', 'autoCopy', false);

    // File Generator (inputs for each sub-generator)
    document.getElementById("txtContent").value = loadSetting('file', 'txtContent', "");
    document.getElementById("txtFilename").value = loadSetting('file', 'txtFilename', "my-document");
    document.getElementById("csvHeader").value = loadSetting('file', 'csvHeader', "Name,Email,Age");
    document.getElementById("csvData").value = loadSetting('file', 'csvData', "John Doe,john@example.com,30\nJane Smith,jane@example.com,25");
    document.getElementById("csvFilename").value = loadSetting('file', 'csvFilename', "my-data");
    document.getElementById("jsonContent").value = loadSetting('file', 'jsonContent', JSON.stringify({
        "name": "Example Data",
        "version": "1.0",
        "items": [
          {"id": 1, "description": "First item"},
          {"id": 2, "description": "Second item"}
        ]
      }, null, 2));
    document.getElementById("jsonFilename").value = loadSetting('file', 'jsonFilename', "my-object");
    document.getElementById("htmlTitle").value = loadSetting('file', 'htmlTitle', "My Awesome Page");
    document.getElementById("htmlBody").value = loadSetting('file', 'htmlBody', `<h1>Welcome to my Page!</h1>
<p>This HTML file was generated using the Generator Hub.</p>
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>`);
    document.getElementById("htmlFilename").value = loadSetting('file', 'htmlFilename', "my-page");

    // Restore last active file tab
    const lastFileTab = loadSetting('file', 'lastActiveTab', 'txt');
    showFileSubGenerator(lastFileTab);
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentYear(); // Update the year in the footer
    applySavedSettings(); // Apply settings on load
    renderHistory();
    renderColors();
    showSection('lorem'); // Show initial section

    // Navigation Buttons
    Object.keys(NAV_BUTTONS).forEach(buttonId => {
        document.getElementById(buttonId).addEventListener('click', () => {
            showSection(NAV_BUTTONS[buttonId]);
        });
    });

    // Read More / Read Less functionality
    document.querySelectorAll('.tool.read-more-btn').forEach(button => {
        const infoSection = button.closest('.info-section');
        const expandableContent = infoSection? infoSection.querySelector('.expandable-content') : null;

        if (expandableContent && expandableContent.textContent.trim().length === 0) {
            button.style.display = 'none'; // Hide button if no content to expand
        } else {
            button.addEventListener('click', () => {
                if (infoSection) {
                    infoSection.classList.toggle('expanded');
                    button.textContent = infoSection.classList.contains('expanded')? 'Read Less' : 'Read More';
                }
            });
            // Ensure initial state is "Read More" and collapsed
            infoSection.classList.remove('expanded');
            button.textContent = 'Read More';
        }
    });

    // Lorem Ipsum
    document.getElementById("generateLoremBtn").addEventListener("click", generateLorem);
    document.getElementById("copyLoremBtn").addEventListener("click", () => copyToClipboard(getElementValue("loremOutput"), "Lorem Ipsum copied!"));
    document.getElementById("loremCount").addEventListener("change", (e) => saveSetting('lorem', 'count', e.target.value));
    document.querySelectorAll('input[name="loremType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                saveSetting('lorem', 'type', e.target.value);
            }
        });
    });
    document.getElementById("loremStartClassic").addEventListener("change", (e) => saveSetting('lorem', 'startClassic', e.target.checked));
    document.getElementById("autoCopyLorem").addEventListener("change", (e) => saveSetting('lorem', 'autoCopy', e.target.checked));

    // Password Generator
    document.getElementById("generatePasswordBtn").addEventListener("click", generatePassword);
    document.getElementById("copyPasswordBtn").addEventListener("click", () => copyToClipboard(getElementValue("passwordOutput"), "Password copied!"));
    document.getElementById("passLength").addEventListener("input", (e) => {
        saveSetting('password', 'length', e.target.value);
        checkStrength(document.getElementById("passwordOutput").value); // Update strength on length change
    });
    document.getElementById("passIncludeUppercase").addEventListener("change", (e) => saveSetting('password', 'includeUppercase', e.target.checked));
    document.getElementById("passIncludeLowercase").addEventListener("change", (e) => saveSetting('password', 'includeLowercase', e.target.checked));
    document.getElementById("passIncludeNumbers").addEventListener("change", (e) => saveSetting('password', 'includeNumbers', e.target.checked));
    document.getElementById("passIncludeSymbols").addEventListener("change", (e) => saveSetting('password', 'includeSymbols', e.target.checked));
    document.getElementById("passExcludeSimilar").addEventListener("change", (e) => saveSetting('password', 'excludeSimilar', e.target.checked));
    document.getElementById("autoCopyPassword").addEventListener("change", (e) => saveSetting('password', 'autoCopy', e.target.checked));

    // Color Generator
    document.getElementById("generateColorBtn").addEventListener("click", generateColor);
    document.getElementById("copyColorBtn").addEventListener("click", () => copyToClipboard(getElementValue("colorCode"), "Color code copied!"));
    document.getElementById("saveColorBtn").addEventListener("click", saveColor);
    document.getElementById("clearSavedColorsBtn").addEventListener("click", clearSavedColors);

    // Emoji Generator
    document.getElementById("generateEmojiBtn").addEventListener("click", generateEmoji);
    document.getElementById("copyEmojiBtn").addEventListener("click", () => copyToClipboard(getElementValue("emojiOutput"), `Copied emoji: ${getElementValue("emojiOutput")}`));
    document.getElementById("autoCopyEmoji").addEventListener("change", (e) => saveSetting('emoji', 'autoCopy', e.target.checked));

    // QR Code Generator
    document.getElementById("generateQrBtn").addEventListener("click", generateQR);
    document.getElementById("downloadQrBtn").addEventListener("click", downloadQR);
    document.getElementById("qrErrorCorrection").addEventListener("change", (e) => saveSetting('qr', 'errorCorrection', e.target.value));

    // Random Number Generator
    document.getElementById("generateRandomBtn").addEventListener("click", generateNumber);
    document.getElementById("copyRandomBtn").addEventListener("click", () => copyToClipboard(getElementValue("randomOutput"), "Random numbers copied!"));
    document.getElementById("minNum").addEventListener("change", (e) => saveSetting('random', 'min', e.target.value));
    document.getElementById("maxNum").addEventListener("change", (e) => saveSetting('random', 'max', e.target.value));
    document.getElementById("randomNumberCount").addEventListener("change", (e) => saveSetting('random', 'count', e.target.value));
    document.getElementById("randomUnique").addEventListener("change", (e) => saveSetting('random', 'unique', e.target.checked));
    document.getElementById("autoCopyRandom").addEventListener("change", (e) => saveSetting('random', 'autoCopy', e.target.checked));

    // File Generator
    document.getElementById('fileTypeTxtBtn').addEventListener('click', () => showFileSubGenerator('txt'));
    document.getElementById('fileTypeCsvBtn').addEventListener('click', () => showFileSubGenerator('csv'));
    document.getElementById('fileTypeJsonBtn').addEventListener('click', () => showFileSubGenerator('json'));
    document.getElementById('fileTypeHtmlBtn').addEventListener('click', () => showFileSubGenerator('html'));

    document.getElementById('downloadTxtBtn').addEventListener('click', downloadTxtFile);
    document.getElementById('txtContent').addEventListener('input', (e) => saveSetting('file', 'txtContent', e.target.value));
    document.getElementById('txtFilename').addEventListener('input', (e) => saveSetting('file', 'txtFilename', e.target.value));

    document.getElementById('downloadCsvBtn').addEventListener('click', downloadCsvFile);
    document.getElementById('csvHeader').addEventListener('input', (e) => saveSetting('file', 'csvHeader', e.target.value));
    document.getElementById('csvData').addEventListener('input', (e) => saveSetting('file', 'csvData', e.target.value));
    document.getElementById('csvFilename').addEventListener('input', (e) => saveSetting('file', 'csvFilename', e.target.value));

    document.getElementById('downloadJsonBtn').addEventListener('click', downloadJsonFile);
    document.getElementById('formatJsonBtn').addEventListener('click', formatJsonContent);
    document.getElementById('jsonContent').addEventListener('input', (e) => saveSetting('file', 'jsonContent', e.target.value));
    document.getElementById('jsonFilename').addEventListener('input', (e) => saveSetting('file', 'jsonFilename', e.target.value));

    document.getElementById('downloadHtmlBtn').addEventListener('click', downloadHtmlFile);
    document.getElementById('htmlTitle').addEventListener('input', (e) => saveSetting('file', 'htmlTitle', e.target.value));
    document.getElementById('htmlBody').addEventListener('input', (e) => saveSetting('file', 'htmlBody', e.target.value));
    document.getElementById('htmlFilename').addEventListener('input', (e) => saveSetting('file', 'htmlFilename', e.target.value));

    // History
    document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);
});