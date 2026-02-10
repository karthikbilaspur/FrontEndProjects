// Get elements
const ageForm = document.getElementById('age-form');
const resultDiv = document.getElementById('result');
const shareFacebookBtn = document.getElementById('share-facebook');
const shareTwitterBtn = document.getElementById('share-twitter');
const shareWhatsappBtn = document.getElementById('share-whatsapp');
const shareLinkedinBtn = document.getElementById('share-linkedin');
const shareInstagramBtn = document.getElementById('share-instagram');
const printBtn = document.getElementById('print');
const pdfExportBtn = document.getElementById('pdf-export');
const languageSelect = document.getElementById('language');
const historyDiv = document.getElementById('history');

// Translations
const translations = {
    en: {
        'age-calculator': 'Age Calculator',
        'select-date': 'Select Date',
        'select-time': 'Select Time',
        'am-pm': 'AM/PM',
        'calculate-age': 'Calculate Age',
        'result': 'Result',
        'history': 'History',
        'no-history': 'No history available',
        'share': 'Share',
        'print': 'Print',
        'pdf-export': 'PDF Export',
        'you-are': 'You are',
        'years': 'years',
        'months': 'months',
        'days': 'days',
        'and': 'and',
    },
    hi: {
        'age-calculator': 'आज की उम्र',
        'select-date': 'तारीख चुनें',
        'select-time': 'समय चुनें',
        'am-pm': 'सु/शाम',
        'calculate-age': 'उम्र गणना करें',
        'result': 'परिणाम',
        'history': 'इतिहास',
        'no-history': 'कोई इतिहास उपलब्ध नहीं है',
        'share': 'साझा करें',
        'print': 'प्रिंट करें',
        'pdf-export': 'पीडीएफ निर्यात करें',
        'you-are': 'आपकी उम्र',
        'years': 'वर्ष',
        'months': 'माह',
        'days': 'दिन',
        'and': 'और',
    },
};

// Language
let language = 'en';

// History
let history = [];

// Load history from local storage
if (localStorage.getItem('history')) {
    history = JSON.parse(localStorage.getItem('history'));
    updateHistory();
}

// Update history
function updateHistory() {
    historyDiv.innerHTML = '';
    if (history.length === 0) {
        historyDiv.innerHTML = translations[language]['no-history'];
    } else {
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            let ageText = `${translations[language]['you-are']} ${item.age.years} ${translations[language]['years']}, ${item.age.months} ${translations[language]['months']}, ${translations[language]['and']} ${item.age.days} ${translations[language]['days']}`;
            if (language === 'hi') {
                ageText += `<br>आपकी उम्र ${item.age.years} वर्ष, ${item.age.months} माह, और ${item.age.days} दिन है।`;
            }
            historyItem.innerHTML = `${item.date} - ${ageText}`;
            historyDiv.appendChild(historyItem);
        });
    }
}

// Calculate age
function calculateAge(birthDate) {
    const today = new Date();
    const age = {};
    age.years = today.getFullYear() - birthDate.getFullYear();
    age.months = today.getMonth() - birthDate.getMonth();
    age.days = today.getDate() - birthDate.getDate();
    if (age.days < 0) {
        age.months--;
        age.days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (age.months < 0) {
        age.years--;
        age.months += 12;
    }
    return age;
}

// Age form submit
ageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const ampm = document.getElementById('ampm').value;
    if (!date || !time) {
        resultDiv.innerHTML = translations[language]['no-history'];
        return;
    }

    // Convert time to 24-hour format
    let hours = parseInt(time.split(':')[0]);
    let minutes = parseInt(time.split(':')[1]);
    if (ampm === 'PM' && hours !== 12) {
        hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
    }

    const birthDate = new Date(date);
    birthDate.setHours(hours);
    birthDate.setMinutes(minutes);

    if (isNaN(birthDate.getTime())) {
        resultDiv.innerHTML = translations[language]['no-history'];
        return;
    }
    if (birthDate > new Date()) {
        resultDiv.innerHTML = 'Please select a valid date';
        return;
    }
    const age = calculateAge(birthDate);
    const result = `${translations[language]['you-are']} ${age.years} ${translations[language]['years']}, ${age.months} ${translations[language]['months']}, ${translations[language]['and']} ${age.days} ${translations[language]['days']}`;
    resultDiv.innerHTML = result;
    history.push({ date: `${date} ${time} ${ampm}`, age: age });
    localStorage.setItem('history', JSON.stringify(history));
    updateHistory();
});

// Language change
languageSelect.addEventListener('change', (e) => {
    language = e.target.value;
    document.querySelectorAll('[data-translate]').forEach((element) => {
        const key = element.getAttribute('data-translate');
        element.innerHTML = translations[language][key];
    });
    updateHistory();
});

// Share buttons
shareFacebookBtn.addEventListener('click', () => {
    const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
});

shareTwitterBtn.addEventListener('click', () => {
    const url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
});

shareWhatsappBtn.addEventListener('click', () => {
    const url = 'https://wa.me/?text=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
});

shareLinkedinBtn.addEventListener('click', () => {
    const url = 'https://www.linkedin.com/sharing/share?url=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
});

shareInstagramBtn.addEventListener('click', () => {
    const url = 'https://www.instagram.com/direct/new/';
    window.open(url, '_blank');
});

// Print button
printBtn.addEventListener('click', () => {
    window.print();
});

// PDF export button
pdfExportBtn.addEventListener('click', () => {
    const doc = new jsPDF();
    doc.text(resultDiv.innerHTML, 10, 10);
    doc.save('age-calculator-result.pdf');
});