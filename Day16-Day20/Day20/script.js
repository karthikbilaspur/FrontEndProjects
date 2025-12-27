const loremIpsumText = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
];

const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const saveBtn = document.getElementById('save-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const output = document.getElementById('output');
const paragraphsInput = document.getElementById('paragraphs');
const wordsPerParagraphInput = document.getElementById('words-per-paragraph');
const textStyleSelect = document.getElementById('text-style');
const htmlOutputCheckbox = document.getElementById('html-output');

generateBtn.addEventListener('click', generateLoremIpsum);
copyBtn.addEventListener('click', copyToClipboard);
saveBtn.addEventListener('click', saveToFile);
darkModeBtn.addEventListener('click', toggleDarkMode);

function generateLoremIpsum() {
    const paragraphs = parseInt(paragraphsInput.value) || 1;
    const wordsPerParagraph = parseInt(wordsPerParagraphInput.value) || 10;
    const textStyle = textStyleSelect.value;
    const htmlOutput = htmlOutputCheckbox.checked;

    if (paragraphs <= 0 || wordsPerParagraph <= 0) {
        alert('Please enter positive numbers for paragraphs and words per paragraph.');
        return;
    }

    let loremIpsum = '';
    for (let i = 0; i < paragraphs; i++) {
        const randomText = loremIpsumText[Math.floor(Math.random() * loremIpsumText.length)];
        let paragraph = randomText + ' ';
        for (let j = 0; j < wordsPerParagraph; j++) {
            const randomWord = Math.random().toString(36).substr(2, 5);
            paragraph += randomWord + ' ';
        }

        switch (textStyle) {
            case 'uppercase':
                paragraph = paragraph.toUpperCase();
                break;
            case 'lowercase':
                paragraph = paragraph.toLowerCase();
                break;
            case 'title':
                paragraph = paragraph.toTitleCase();
                break;
        }

        if (htmlOutput) {
            loremIpsum += `<p>${paragraph}</p>\n`;
        } else {
            loremIpsum += paragraph + '\n\n';
        }
    }

    output.value = loremIpsum;
}

function copyToClipboard() {
    output.select();
    document.execCommand('copy');
    alert('Text copied to clipboard!');
}

function saveToFile() {
    const text = output.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lorem-ipsum.txt';
    link.click();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    darkModeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
}

// Add toTitleCase function to String prototype
String.prototype.toTitleCase = function() {
    return this.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Add reset functionality
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', resetForm);

function resetForm() {
    paragraphsInput.value = '1';
    wordsPerParagraphInput.value = '10';
    textStyleSelect.value = 'normal';
    htmlOutputCheckbox.checked = false;
    output.value = '';
    document.body.classList.remove('dark-mode');
    darkModeBtn.textContent = 'Dark Mode';
}

// Update copyToClipboard function to show status message
function copyToClipboard() {
    output.select();
    document.execCommand('copy');
    showStatusMessage('Text copied to clipboard!');
}

// Update saveToFile function to show status message
function saveToFile() {
    const text = output.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lorem-ipsum.txt';
    link.click();
    showStatusMessage('Text saved to file!');
}

// Add showStatusMessage function
function showStatusMessage(msg) {
    const statusMsg = document.getElementById('status-msg');
    statusMsg.textContent = msg;
    setTimeout(() => {
        statusMsg.textContent = '';
    }, 3000);
}