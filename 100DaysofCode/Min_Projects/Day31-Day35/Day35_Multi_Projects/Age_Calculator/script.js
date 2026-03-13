// Define constants
const RETIREMENT_AGE = 60;
const CHART_COLORS = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)'
];
const CHART_BORDER_COLORS = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)'
];

// Define chart configurations
const ageChartConfig = {
    type: 'bar',
    data: {
        labels: ['Years', 'Months', 'Days', 'Hours', 'Minutes'],
        datasets: [{
            label: 'Age',
            data: [],
            backgroundColor: CHART_COLORS,
            borderColor: CHART_BORDER_COLORS,
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
};

const lifeMilestonesChartConfig = {
    type: 'pie',
    data: [{
        values: [],
        labels: ['Years until retirement', 'Age'],
    }]
};

function getDOB() {
    // Get input values
    const dobInput = document.getElementById('inputDob').value;
    const currentDateInput = document.getElementById('cdate').value;

    // Validate input
    if (!dobInput || !currentDateInput) {
        alert('Please enter both Date of Birth and Current Date.');
        return;
    }

    // Parse dates
    const dob = moment(dobInput);
    const currentDate = moment(currentDateInput);

    // Calculate age and zodiac sign
    const age = currentDate.diff(dob, 'years');
    const zodiacSign = getZodiacSign(dob.month() + 1, dob.date());

    // Calculate age in different units
    const years = currentDate.diff(dob, 'years');
    const months = currentDate.diff(dob, 'months') % 12;
    const days = currentDate.diff(dob, 'days') % 30;
    const hours = currentDate.diff(dob, 'hours') % 24;
    const minutes = currentDate.diff(dob, 'minutes') % 60;

    // Calculate life milestones
    const yearsUntilRetirement = RETIREMENT_AGE - age;

    // Update UI
    document.getElementById('currentAge').textContent = age;
    document.getElementById('nextBirthday').textContent = getDaysUntilNextBirthday(dob, currentDate) + ' days';
    document.getElementById('zodiacSign').textContent = zodiacSign;
    document.getElementById('ageInUnits').textContent = `${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes`;
    document.getElementById('lifeMilestones').textContent = `Retirement in ${yearsUntilRetirement} years`;

    // Update charts
    updateAgeChart([years, months, days, hours, minutes]);
    updateLifeMilestonesChart([yearsUntilRetirement, age]);
}

function getZodiacSign(month, day) {
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius';
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius';
    return 'Capricorn';
}
function getDaysUntilNextBirthday(dob, currentDate) {
    const nextBirthday = moment(dob).year(currentDate.year());
    if (nextBirthday.isBefore(currentDate)) {
        nextBirthday.year(currentDate.year() + 1);
    }
    return nextBirthday.diff(currentDate, 'days');
}

function updateAgeChart(data) {
    ageChartConfig.data.datasets[0].data = data;
    const ctx = document.getElementById('ageChart').getContext('2d');
    new Chart(ctx, ageChartConfig);
}

function updateLifeMilestonesChart(data) {
    lifeMilestonesChartConfig.data[0].values = data;
    Plotly.newPlot('lifeMilestonesChart', lifeMilestonesChartConfig.data);
}

function saveResults() {
    const age = document.getElementById('currentAge').textContent;
    const nextBirthday = document.getElementById('nextBirthday').textContent;
    const zodiacSign = document.getElementById('zodiacSign').textContent;
    const ageInUnits = document.getElementById('ageInUnits').textContent;
    const lifeMilestones = document.getElementById('lifeMilestones').textContent;

    const results = `Age: ${age}\nNext Birthday: ${nextBirthday}\nZodiac Sign: ${zodiacSign}\nAge in Units: ${ageInUnits}\nLife Milestones: ${lifeMilestones}`;
    const blob = new Blob([results], { type: 'text/plain' });
    saveAs(blob, 'age_calculator_results.txt');
}

function shareOnFacebook() {
    const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
}

function shareOnTwitter() {
    const url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
}

function shareOnInstagram() {
    // Instagram doesn't have a direct sharing API, so we'll just open the Instagram website
    window.open('https://www.instagram.com/', '_blank');
}

function shareOnLinkedIn() {
    const url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
}

function shareOnPlatform(platform) {
    const url = window.location.href;
    const sharingUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        instagram: 'https://www.instagram.com/',
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
    };

    window.open(sharingUrls[platform], '_blank');
}