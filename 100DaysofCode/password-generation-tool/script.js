const generatorSelector = document.getElementById('generator-selector');
const simpleGenerator = document.getElementById('simple-generator');
const advancedGenerator = document.getElementById('advanced-generator');
const languageSelect = document.getElementById('language');

let translations = {
    en: {
        'password': 'Password',
        'generate': 'Generate',
        'copy': 'Copy',
        'length': 'Length:',
        'uppercase': 'Uppercase:',
        'numbers': 'Numbers:',
        'special': 'Special:',
        'exclude-similar': 'Exclude Similar:',
        'require-each': 'Require Each:',
        'expiration': 'Expiration:',
        'password-history': 'Password History:',
        'clear-history': 'Clear History',
        'verify-2fa': 'Verify 2FA',
        'dark-mode': 'Dark Mode',
    },
    es: {
        'password': 'Contraseña',
        'generate': 'Generar',
        'copy': 'Copiar',
        'length': 'Longitud:',
        'uppercase': 'Mayúsculas:',
        'numbers': 'Números:',
        'special': 'Especial:',
        'exclude-similar': 'Excluir Similares:',
        'require-each': 'Requerir Cada:',
        'expiration': 'Expiración:',
        'password-history': 'Historial de Contraseñas:',
        'clear-history': 'Borrar Historial',
        'verify-2fa': 'Verificar 2FA',
        'dark-mode': 'Modo Oscuro',
    },
    fr: {
        'password': 'Mot de passe',
        'generate': 'Générer',
        'copy': 'Copier',
        'length': 'Longueur:',
        'uppercase': 'Majuscules:',
        'numbers': 'Nombres:',
        'special': 'Spécial:',
        'exclude-similar': 'Exclure Similaires:',
        'require-each': 'Exiger Chaque:',
        'expiration': 'Expiration:',
        'password-history': 'Historique des Mots de Passe:',
        'clear-history': 'Effacer Historique',
        'verify-2fa': 'Vérifier 2FA',
        'dark-mode': 'Mode Sombre',
    },
    hi: {
        'password': 'पासवर्ड',
        'generate': 'उत्पन्न करें',
        'copy': 'कॉपी करें',
        'length': 'लंबाई:',
        'uppercase': 'अक्षर बड़े:',
        'numbers': 'संख्या:',
        'special': 'विशेष:',
        'exclude-similar': 'समान को बाहर करें:',
        'require-each': 'प्रत्येक आवश्यक:',
        'expiration': 'समाप्ति:',
        'password-history': 'पासवर्ड इतिहास:',
        'clear-history': 'इतिहास साफ़ करें',
        'verify-2fa': '2एफए सत्यापित करें',
        'dark-mode': 'डार्क मोड',
    },
    kn: {
        'password': 'ಪಾಸ್ವರ್ಡ್',
        'generate': 'ಉತ್ಪತ್ತಿ ಮಾಡಿ',
        'copy': 'ನಕಲಿಸಿ',
        'length': 'ಉದ್ದ:',
        'uppercase': 'ಅಕ್ಷರಗಳು ದೊಡ್ಡ:',
        'numbers': 'ಸಂಖ್ಯೆ:',
        'special': 'ವಿಶೇಷ:',
        'exclude-similar': 'ಸಮಾನವನ್ನು ಹೊರತುಪಡಿಸಿ:',
        'require-each': 'ಪ್ರತಿ ಅಗತ್ಯ:',
        'expiration': 'ಅಂತ್ಯ:',
        'password-history': 'ಪಾಸ್ವರ್ಡ್ ಇತಿಹಾಸ:',
        'clear-history': 'ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಿ',
        'verify-2fa': '2ಎಫ್‌ಎ ಪರಿಶೀಲಿಸಿ',
        'dark-mode': 'ಡಾರ್ಕ್ ಮೋಡ್',
    },
    mr: {
        'password': 'पासवर्ड',
        'generate': 'उत्पन्न करा',
        'copy': 'प्रत करा',
        'length': 'लंबाई:',
        'uppercase': 'अक्षरे मोठी:',
        'numbers': 'संख्या:',
        'special': 'विशेष:',
        'exclude-similar': 'समान वगळा:',
        'require-each': 'प्रत्येक आवश्यक:',
        'expiration': 'समाप्ती:',
        'password-history': 'पासवर्ड इतिहास:',
        'clear-history': 'इतिहास साफ करा',
        'verify-2fa': '2एफए सत्यापित करा',
        'dark-mode': 'डार्क मोड',
    },
};

generatorSelector.addEventListener('change', (e) => {
    const selectedGenerator = e.target.value;
    if (selectedGenerator === 'simple') {
        simpleGenerator.style.display = 'block';
        advancedGenerator.style.display = 'none';
    } else {
        simpleGenerator.style.display = 'none';
        advancedGenerator.style.display = 'block';
    }
});

languageSelect.addEventListener('change', updateTranslations);

function updateTranslations() {
    const lang = languageSelect.value;
    const translation = translations[lang];
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translation[key];
    });
}

function generatePassword(length, uppercase, numbers, special) {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) chars += '0123456789';
    if (special) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function updateStrengthMeter(password, strengthBar) {
    const strength = calculatePasswordStrength(password);
    strengthBar.style.width = `${strength}%`;
    if (strength < 33) {
        strengthBar.style.backgroundColor = '#f00';
    } else if (strength < 66) {
        strengthBar.style.backgroundColor = '#ff0';
    } else {
        strengthBar.style.backgroundColor = '#0f0';
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 12) strength += 30;
    if (password.match(/[a-z]/)) strength += 10;
    if (password.match(/[A-Z]/)) strength += 10;
    if (password.match(/[0-9]/)) strength += 10;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 30;
    return Math.min(strength, 100);
}

const simpleGenerateBtn = document.getElementById('simple-generate-btn');
const simplePasswordInput = document.getElementById('simple-password');
const simpleStrengthBar = document.getElementById('simple-strength-bar');
const simpleCopyBtn = document.getElementById('simple-copy-btn');

simpleGenerateBtn.addEventListener('click', () => {
    const length = parseInt(document.getElementById('simple-length').value);
    const uppercase = document.getElementById('simple-uppercase').checked;
    const numbers = document.getElementById('simple-numbers').checked;
    const special = document.getElementById('simple-special').checked;
    const password = generatePassword(length, uppercase, numbers, special);
    simplePasswordInput.value = password;
    updateStrengthMeter(password, simpleStrengthBar);
});

simpleCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(simplePasswordInput.value).then(() => {
        alert('Password copied to clipboard!');
    });
});

const advancedGenerateBtn = document.getElementById('advanced-generate-btn');
const advancedPasswordInput = document.getElementById('advanced-password');
const advancedStrengthBar = document.getElementById('advanced-strength-bar');
const advancedCopyBtn = document.getElementById('advanced-copy-btn');

advancedGenerateBtn.addEventListener('click', () => {
    const length = parseInt(document.getElementById('advanced-length').value);
    const uppercase = document.getElementById('advanced-uppercase').checked;
    const numbers = document.getElementById('advanced-numbers').checked;
    const special = document.getElementById('advanced-special').checked;
    const password = generatePassword(length, uppercase, numbers, special);
    advancedPasswordInput.value = password;
    updateStrengthMeter(password, advancedStrengthBar);
});

advancedCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(advancedPasswordInput.value).then(() => {
        alert('Password copied to clipboard!');
    });
});

const darkModeToggle = document.getElementById('dark-mode');

darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});