// Global Bootstrap instance for Toast and Tooltip initialization
let bsToast;

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Initialize Tippy.js for copy/reset buttons
    tippy('.copy-btn', {
        content: 'Copied!',
        trigger: 'click',
        theme: 'success',
        placement: 'top',
        arrow: true,
        animation: 'fade',
        onShow(instance) {
            setTimeout(() => {
                instance.hide();
            }, 1000); // Hide after 1 second
        }
    });

    tippy('.reset-btn', {
        content: 'Reset!',
        trigger: 'click',
        theme: 'danger',
        placement: 'top',
        arrow: true,
        animation: 'fade',
        onShow(instance) {
            setTimeout(() => {
                instance.hide();
            }, 1000); // Hide after 1 second
        }
    });

    // Initialize Bootstrap Toast once
    const toastElement = document.getElementById('liveToast');
    bsToast = new bootstrap.Toast(toastElement);

    // Manually trigger the conversion for the initially active 'length' section
    convertLength();

    // Setup centralized event listeners for all converters
    setupGlobalEventListeners();
});

// ===============================
// SECTION SWITCHING
// ===============================
// This function is mostly for triggering auto-conversion when tabs change.
// Bootstrap handles the visual active state of tabs.
function showSection(id) {
    const inputElement = document.getElementById(id + 'Input');
    if (inputElement && inputElement.value!== '') {
        const convertFunction = window['convert' + id.charAt(0).toUpperCase() + id.slice(1)];
        if (typeof convertFunction === 'function') {
            convertFunction();
        }
    }
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

// Generic function for displaying Bootstrap toasts
function showNotification(message, type = 'primary') { // type can be 'primary', 'success', 'danger', etc.
    const toastElement = document.getElementById('liveToast');
    const toastBody = toastElement.querySelector('.toast-body');

    toastBody.textContent = message;
    toastElement.className = `toast align-items-center text-bg-${type} border-0`; // Update background color dynamically

    bsToast.show();
}

// Validate input and provide visual feedback
function getInputValue(inputId) {
    const inputElement = document.getElementById(inputId);
    const value = parseFloat(inputElement.value);

    if (isNaN(value)) {
        showNotification("⚠ Please enter a valid number", 'danger');
        inputElement.classList.add('is-invalid'); // Add Bootstrap validation style
        return null;
    } else {
        inputElement.classList.remove('is-invalid');
        return value;
    }
}

// Format result using Numeral.js with dynamic precision
function formatResult(value, isCurrency = false) {
    // If it's currency, always show 2 decimal places
    if (isCurrency) {
        return numeral(value).format('0,0.00');
    }
    // For other values, determine precision dynamically
    if (Math.abs(value) < 0.0001 && value!== 0) { // Very small numbers
        return numeral(value).format('0,0.00000000'); // More precision
    } else if (Math.abs(value) < 100) { // Keep more precision for smaller numbers
        return numeral(value).format('0,0.[00000]');
    } else { // Less precision for larger numbers
        return numeral(value).format('0,0.[0000]');
    }
}

// Swap dropdown values
function swapUnits(fromId, toId) {
    const fromSelect = document.getElementById(fromId);
    const toSelect = document.getElementById(toId);

    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    // Trigger conversion after swapping
    const sectionId = fromId.replace(/(From|To)/, ''); // e.g., 'lengthFrom' -> 'length'
    const convertFunction = window['convert' + sectionId.charAt(0).toUpperCase() + sectionId.slice(1)];
    if (typeof convertFunction === 'function') {
        convertFunction();
    }
}

// Generic function to perform a conversion
async function performConversion(
    inputValueId,
    fromSelectId,
    toSelectId,
    unitRatesSource, // Object or async function to get rates
    resultParagraphId,
    transformFunc = null // Optional function for specific unit types (e.g., temperature)
) {
    const val = getInputValue(inputValueId);
    if (val === null) {
        document.getElementById(resultParagraphId).innerText = ''; // Clear result if input is invalid
        return;
    }

    const fromUnit = document.getElementById(fromSelectId).value;
    const toUnit = document.getElementById(toSelectId).value;

    let result;

    try {
        if (transformFunc) {
            result = transformFunc(val, fromUnit, toUnit);
        } else {
            // Await if unitRatesSource is an async function (like getCurrencyRates)
            const rates = typeof unitRatesSource === 'function'? await unitRatesSource() : unitRatesSource;
            if (!rates ||!rates[fromUnit] ||!rates[toUnit]) {
                showNotification(`Conversion rates not available for ${fromUnit} or ${toUnit}.`, 'danger');
                document.getElementById(resultParagraphId).innerText = 'Error';
                return;
            }
            result = (val * rates[fromUnit]) / rates[toUnit];
        }

        const isCurrency = toSelectId.includes('currency');
        const formattedResult = formatResult(result, isCurrency);
        document.getElementById(resultParagraphId).innerText = `Result: ${formattedResult} ${toUnit.toUpperCase()}`;
    } catch (error) {
        console.error(`Error during conversion for ${inputValueId}:`, error);
        showNotification(`Conversion failed for ${fromUnit} to ${toUnit}.`, 'danger');
        document.getElementById(resultParagraphId).innerText = 'Error';
    }
}

// ===============================
// CONVERSION LOGIC FOR EACH CATEGORY
// ===============================

// LENGTH CONVERTER (meter-based rates)
const lengthMeterRates = {
    m: 1,
    km: 1000,
    mile: 1609.34,
    ft: 0.3048,
    yard: 0.9144,
    cm: 0.01,
    in: 0.0254
};
function convertLength() {
    performConversion("lengthInput", "lengthFrom", "lengthTo", lengthMeterRates, "lengthResult");
}

// WEIGHT CONVERTER (kilogram-based rates)
const weightKgRates = {
    kg: 1,
    g: 0.001,
    lb: 0.453592,
    oz: 0.0283495,
    ton: 1000, // Metric Ton
    mg: 0.000001
};
function convertWeight() {
    performConversion("weightInput", "weightFrom", "weightTo", weightKgRates, "weightResult");
}

// TEMPERATURE CONVERTER (uses custom transform function)
function tempTransform(val, fromUnit, toUnit) {
    let celsius; // Convert everything to Celsius first

    if (fromUnit === "c") celsius = val;
    else if (fromUnit === "f") celsius = (val - 32) * 5 / 9;
    else if (fromUnit === "k") celsius = val - 273.15;

    let result; // Then convert from Celsius to target unit
    if (toUnit === "c") result = celsius;
    else if (toUnit === "f") result = (celsius * 9 / 5) + 32;
    else if (toUnit === "k") result = celsius + 273.15;

    return result;
}
function convertTemp() {
    performConversion("tempInput", "tempFrom", "tempTo", null, "tempResult", tempTransform);
}

// CURRENCY CONVERTER (mock API call with Axios)
let currencyRatesCache = null; // Cache for fetched rates

async function getCurrencyRates() {
    if (currencyRatesCache) {
        return currencyRatesCache; // Return cached rates if available
    }

    showNotification("Fetching latest currency rates...", 'info');
    try {
        // --- MOCK API CALL for demonstration ---
        // In a real application, you would replace this with an actual Axios call:
        // const apiKey = 'YOUR_API_KEY';
        // const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        // if (response.data.result === 'error') {
        // throw new Error(response.data['error-type']);
        // }
        // currencyRatesCache = response.data.conversion_rates;
        // showNotification("Currency rates updated!", 'success');
        // --- END MOCK ---

        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        currencyRatesCache = {
            USD: 1, INR: 83.33, EUR: 0.92, GBP: 0.79, JPY: 151.72, CAD: 1.36, AUD: 1.52
        };
        showNotification("Currency rates updated! (Mock Data)", 'success');
        return currencyRatesCache;

    } catch (error) {
        console.error("Error fetching currency rates:", error);
        showNotification(`Failed to fetch currency rates: ${error.message || error}. Using static fallback.`, 'danger');
        // Fallback to static rates if API fails or network issue
        currencyRatesCache = {
            USD: 1, INR: 83, EUR: 0.92, GBP: 0.85, JPY: 130, CAD: 1.3, AUD: 1.45
        };
        return currencyRatesCache;
    }
}
async function convertCurrency() {
    performConversion("currencyInput", "currencyFrom", "currencyTo", getCurrencyRates, "currencyResult");
}

// DATA STORAGE CONVERTER (byte-based rates)
const dataByteRates = {
    b: 1,
    kb: 1 / 1024,
    mb: 1 / (1024 * 1024),
    gb: 1 / (1024 * 1024 * 1024),
    tb: 1 / (1024 * 1024 * 1024 * 1024),
    pb: 1 / (1024 * 1024 * 1024 * 1024 * 1024)
};
function convertData() {
    performConversion("dataInput", "dataFrom", "dataTo", dataByteRates, "dataResult");
}

// AREA CONVERTER (square meter-based rates)
const areaSqMeterRates = {
    sqm: 1,
    sqkm: 1000000,
    sqmile: 2589988.11,
    sqft: 0.092903,
    sqyard: 0.836127,
    acre: 4046.86,
    hectare: 10000
};
function convertArea() {
    performConversion("areaInput", "areaFrom", "areaTo", areaSqMeterRates, "areaResult");
}

// VOLUME CONVERTER (liter-based rates)
const volumeLitreRates = {
    ml: 0.001,
    l: 1,
    cuin: 0.0163871, // 1 cubic inch = 0.0163871 liters
    cuft: 28.3168, // 1 cubic foot = 28.3168 liters
    gal: 3.78541, // 1 US gallon = 3.78541 liters
    qt: 0.946353, // 1 US quart = 0.946353 liters
    cup: 0.236588 // 1 US cup = 0.236588 liters
};
function convertVolume() {
    performConversion("volumeInput", "volumeFrom", "volumeTo", volumeLitreRates, "volumeResult");
}

// SPEED CONVERTER (meters per second-based rates)
const speedMpsRates = {
    mps: 1, // Meters per second
    kmph: 1 / 3.6, // 1 km/h = 1/3.6 m/s
    mph: 0.44704, // 1 mph = 0.44704 m/s
    knot: 0.514444, // 1 knot = 0.514444 m/s
    fps: 0.3048 // 1 foot/second = 0.3048 m/s
};
function convertSpeed() {
    performConversion("speedInput", "speedFrom", "speedTo", speedMpsRates, "speedResult");
}

// TIME CONVERTER (second-based rates)
const timeSecondRates = {
    sec: 1,
    min: 60,
    hr: 3600,
    day: 86400,
    week: 604800,
    month: 2629746, // Average month (365.25/12 days)
    year: 31556952 // Average year (365.25 days)
};
function convertTime() {
    performConversion("timeInput", "timeFrom", "timeTo", timeSecondRates, "timeResult");
}

// DIGITAL IMAGE RESOLUTION CONVERTER (pixel-based rates)
const resolutionPixelRates = {
    px: 1,
    mp: 1000000 // 1 Megapixel = 1,000,000 pixels
};
function convertResolution() {
    performConversion("resolutionInput", "resolutionFrom", "resolutionTo", resolutionPixelRates, "resolutionResult");
}

// ===============================
// CENTRALIZED EVENT LISTENERS
// ===============================
function setupGlobalEventListeners() {
    document.addEventListener('input', function(event) {
        // Check if the input or select element is within a tab-pane and has an ID ending with 'Input', 'From', or 'To'
        if (event.target.matches('.tab-pane input[type="number"],.tab-pane select')) {
            const sectionId = event.target.closest(".tab-pane").id.replace('pills-', '');
            const convertFunction = window['convert' + sectionId.charAt(0).toUpperCase() + sectionId.slice(1)];
            if (typeof convertFunction === 'function') {
                convertFunction();
            }
        }
    });

    document.addEventListener('click', function(event) {
        // Handle Copy button clicks
        if (event.target.matches('.copy-btn')) {
            const resultId = event.target.dataset.resultId;
            const resultText = document.getElementById(resultId).innerText;
            const valueToCopy = resultText.replace("Result: ", "").trim();

            if (!valueToCopy) {
                showNotification("⚠ Nothing to copy!", 'warning');
                return;
            }

            navigator.clipboard.writeText(valueToCopy)
               .catch(() => showNotification("❌ Copy failed (check browser permissions)", 'danger'));
        }

        // Handle Reset button clicks
        if (event.target.matches('.reset-btn')) {
            const sectionId = event.target.dataset.sectionId;
            const inputElement = document.getElementById(sectionId + 'Input');
            const resultElement = document.getElementById(sectionId + 'Result');

            if (inputElement) inputElement.value = '';
            if (resultElement) resultElement.innerText = '';
            if (inputElement) inputElement.classList.remove('is-invalid'); // Clear validation feedback

            showNotification("Section reset!", 'info');
        }

        // Handle Tab button clicks to trigger initial conversion
        if (event.target.matches('.nav-pills.nav-link')) {
            const tabTargetId = event.target.dataset.bsTarget; // e.g., #pills-length
            const sectionId = tabTargetId.replace('#pills-', '');
            showSection(sectionId); // Call showSection to trigger conversion
        }
    });
}