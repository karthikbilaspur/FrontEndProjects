const form = document.getElementById('bmi-form');
const resultDiv = document.getElementById('result');
const chartCanvas = document.getElementById('bmi-chart');
const languageSelect = document.getElementById('language');

// Initialize flatpickr
flatpickr("#dob", {
    dateFormat: "Y-m-d",
});

// Add event listener to form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const name = document.getElementById('name').value.trim();
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const waistCircumference = parseFloat(document.getElementById('waist-circumference').value);
    const hipCircumference = parseFloat(document.getElementById('hip-circumference').value);
    const unit = document.getElementById('unit').value;
    const language = languageSelect.value;

    // Validate input
    if (!validateInput(name, gender, dob, height, weight, waistCircumference, hipCircumference)) {
        return;
    }

    // Calculate age
    const age = calculateAge(dob);

    // Calculate BMI
    let bmi;
    if (unit === 'metric') {
        bmi = weight / ((height / 100) ** 2);
    } else {
        // Convert imperial to metric
        const heightInMeters = ((height * 0.3048) + (height % 1 * 0.0254));
        const weightInKg = weight * 0.453592;
        bmi = weightInKg / (heightInMeters ** 2);
    }

    // Determine BMI category
    const bmiCategory = getBmiCategory(bmi, age);

    // Calculate waist-to-hip ratio
    const waistToHipRatio = waistCircumference / hipCircumference;

    // Calculate health risks
    const healthRisks = getHealthRisks(bmi, waistToHipRatio);

    // Display results
    displayResults(name, age, bmi, bmiCategory, waistToHipRatio, healthRisks, language);

    // Update chart
    updateChart(bmi);
});

// Function to validate input
function validateInput(name, gender, dob, height, weight, waistCircumference, hipCircumference) {
    if (!name || !gender || !dob || !height || !weight || !waistCircumference || !hipCircumference) {
        alert('Please fill in all fields');
        return false;
    }

    if (isNaN(height) || isNaN(weight) || isNaN(waistCircumference) || isNaN(hipCircumference)) {
        alert('Invalid input');
        return false;
    }

    return true;
}

// Function to calculate age
function calculateAge(dob) {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Function to determine BMI category
function getBmiCategory(bmi, age) {
    if (age < 18) {
        // Use WHO's BMI-for-age charts for children and adolescents
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    } else {
        // Use WHO's BMI categories for adults
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }
}

// Function to calculate health risks
function getHealthRisks(bmi, waistToHipRatio) {
    let healthRisks = '';

    if (bmi >= 30) healthRisks += 'High risk of chronic diseases, ';
    else if (bmi >= 25) healthRisks += 'Moderate risk of chronic diseases, ';
    else healthRisks += 'Low risk of chronic diseases, ';

    if (waistToHipRatio >= 0.9) healthRisks += 'High risk of cardiovascular disease, ';
    else if (waistToHipRatio >= 0.8) healthRisks += 'Moderate risk of cardiovascular disease, ';
    else healthRisks += 'Low risk of cardiovascular disease, ';

    return healthRisks;
}

// Function to display results
function displayResults(name, age, bmi, bmiCategory, waistToHipRatio, healthRisks, language) {
    const translations = {
        en: {
            title: 'Results',
            bmi: 'BMI',
            bmiCategory: 'BMI Category',
            waistToHipRatio: 'Waist-to-Hip Ratio',
            healthRisks: 'Health Risks'
        },
        es: {
            title: 'Resultados',
            bmi: 'IMC',
            bmiCategory: 'Categoría de IMC',
            waistToHipRatio: 'Relación Cintura-Cadera',
            healthRisks: 'Riesgos para la Salud'
        }
    };

    const translation = translations[language];

    resultDiv.innerHTML = `
        <h2>${translation.title}</h2>
        <p>Hello ${name}, your age is ${age} years.</p>
        <p>${translation.bmi}: ${bmi.toFixed(2)}</p>
        <p>${translation.bmiCategory}: ${bmiCategory}</p>
        <p>${translation.waistToHipRatio}: ${waistToHipRatio.toFixed(2)}</p>
        <p>${translation.healthRisks}: ${healthRisks}</p>
        <button id="share-btn" class="btn btn-primary">Share</button>
        <button id="pdf-btn" class="btn btn-secondary">Download as PDF</button>
    `;

    document.getElementById('share-btn').addEventListener('click', () => {
        shareResults(name, age, bmi, bmiCategory, waistToHipRatio, healthRisks);
    });

    document.getElementById('pdf-btn').addEventListener('click', () => {
        downloadAsPdf(name, age, bmi, bmiCategory, waistToHipRatio, healthRisks);
    });
}

// Function to share results
function shareResults(name, age, bmi, bmiCategory, waistToHipRatio, healthRisks) {
    const shareText = `Hello ${name}, your age is ${age} years. Your BMI is ${bmi.toFixed(2)} (${bmiCategory}). Your waist-to-hip ratio is ${waistToHipRatio.toFixed(2)}. Health risks: ${healthRisks}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: 'BMI Results',
            text: shareText,
            url: shareUrl,
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
        alert('Sharing is not supported in this browser');
    }
}

// Function to download as PDF
function downloadAsPdf(name, age, bmi, bmiCategory, waistToHipRatio, healthRisks) {
    const pdfContent = `
        <h2>BMI Results</h2>
        <p>Hello ${name}, your age is ${age} years.</p>
        <p>BMI: ${bmi.toFixed(2)}</p>
        <p>BMI Category: ${bmiCategory}</p>
        <p>Waist-to-Hip Ratio: ${waistToHipRatio.toFixed(2)}</p>
        <p>Health Risks: ${healthRisks}</p>
    `;

    const pdf = new jsPDF();
    pdf.fromHTML(pdfContent);
    pdf.save('bmi-results.pdf');
}

// Function to update chart
function updateChart(bmi) {
    const ctx = chartCanvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Underweight', 'Normal weight', 'Overweight', 'Obese'],
            datasets: [{
                label: 'BMI Range',
                data: [18.5, 24.9, 29.9, 40],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Add a line for the user's BMI
    const plugin = {
        id: 'bmiLine',
        afterDraw: (chart, args, options) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(chart.scales.x.getPixelForTick(0), chart.scales.y.getPixelForValue(bmi));
            ctx.lineTo(chart.scales.x.getPixelForTick(3), chart.scales.y.getPixelForValue(bmi));
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
    };
    chart.register(plugin);
}