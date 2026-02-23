// --- Global Function to Show/Hide Calculator Sections ---
function showCalculator() {
    const selectedCalculatorName = document.getElementById('calculatorType').value;
    const calculatorSections = document.querySelectorAll('.calculator-section');
    let targetCalculatorElement = null;

    calculatorSections.forEach(section => {
        section.style.display = 'none'; // Hide all sections first
    });

    if (selectedCalculatorName) {
        // Find the correct ID, as 'area' maps to 'areaCalculator' (and 'temperature' maps to 'temperatureCalculator')
        const targetId = selectedCalculatorName === 'area'? 'areaCalculator' : selectedCalculatorName + 'Calculator';
        targetCalculatorElement = document.getElementById(targetId);

        if (targetCalculatorElement) {
            targetCalculatorElement.style.display = 'block'; // Show the selected one

            // Call the specific reset function for the selected calculator
            // This ensures a clean slate when switching calculators
            let resetFunctionName;
            if (selectedCalculatorName === 'area') {
                resetFunctionName = 'resetAreaCalculator';
            } else if (selectedCalculatorName === 'temperature') {
                resetFunctionName = 'resetTemperatureCalculator';
            } else {
                resetFunctionName = 'reset' + selectedCalculatorName.charAt(0).toUpperCase() + selectedCalculatorName.slice(1) + 'Calculator';
            }

            if (typeof window[resetFunctionName] === 'function') {
                window[resetFunctionName]();
            }

            // Scroll to the selected calculator
            targetCalculatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// --- Toggle Read More/Read Less Description ---
function toggleDescription(calculatorPrefix) {
    const fullDesc = document.getElementById(calculatorPrefix + 'FullDesc');
    const readMoreBtn = fullDesc.parentElement.querySelector('.read-more-btn'); // Find buttons within parent
    const readLessBtn = fullDesc.parentElement.querySelector('.read-less-btn');

    if (fullDesc.classList.contains('active')) {
        fullDesc.classList.remove('active');
        fullDesc.style.height = 0; // Manually set height to 0 to trigger transition
        fullDesc.addEventListener('transitionend', function handler() {
            fullDesc.style.display = 'none';
            fullDesc.removeEventListener('transitionend', handler);
        });
        readMoreBtn.style.display = 'inline-block';
        readLessBtn.style.display = 'none';
    } else {
        fullDesc.style.display = 'block';
        fullDesc.style.height = 'auto'; // Set to auto to measure full height
        const fullHeight = fullDesc.scrollHeight + 'px'; // Get the measured height
        fullDesc.style.height = '0'; // Reset to 0 for transition start
        // Force reflow to ensure the transition is applied correctly
        fullDesc.offsetHeight; 
        fullDesc.style.height = fullHeight; // Transition to full height
        fullDesc.classList.add('active');

        readMoreBtn.style.display = 'none';
        readLessBtn.style.display = 'inline-block';
    }
}

// --- Age Calculator Logic ---
function calculateAge() {
    const dobInput = document.getElementById('dob');
    const ageResult = document.getElementById('ageResult');

    dobInput.classList.remove('error-input'); // Clear previous error state

    if (!dobInput.value) {
        ageResult.textContent = 'Error: Please enter your birthdate.';
        dobInput.classList.add('error-input');
        return;
    }

    const birthDate = new Date(dobInput.value);
    const today = new Date();

    if (birthDate > today) {
        ageResult.textContent = 'Error: Birthdate cannot be in the future.';
        dobInput.classList.add('error-input');
        return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    ageResult.textContent = age + ' years old';
}

function resetAgeCalculator() {
    document.getElementById('dob').value = '';
    document.getElementById('dob').classList.remove('error-input');
    document.getElementById('ageResult').textContent = '';
    // Reset description visibility
    const ageFullDesc = document.getElementById('ageFullDesc');
    if (ageFullDesc && ageFullDesc.classList.contains('active')) {
        toggleDescription('age');
    }
}

// --- BMI Calculator Logic ---
function calculateBMI() {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    let weight = parseFloat(weightInput.value);
    let height = parseFloat(heightInput.value);
    const weightUnit = document.getElementById('weightUnit').value;
    const heightUnit = document.getElementById('heightUnit').value;

    const bmiResult = document.getElementById('bmiResult');
    const bmiCategory = document.getElementById('bmiCategory');

    weightInput.classList.remove('error-input');
    heightInput.classList.remove('error-input');

    if (isNaN(weight) || weight <= 0) {
        bmiResult.textContent = 'Error: Please enter a valid positive weight.';
        bmiCategory.textContent = '';
        weightInput.classList.add('error-input');
        return;
    }
    if (isNaN(height) || height <= 0) {
        bmiResult.textContent = 'Error: Please enter a valid positive height.';
        bmiCategory.textContent = '';
        heightInput.classList.add('error-input');
        return;
    }

    // Convert weight to kg
    if (weightUnit === 'lbs') {
        weight = weight * 0.453592; // 1 lbs = 0.453592 kg
    }

    // Convert height to meters
    if (heightUnit === 'inches') {
        height = height * 2.54; // 1 inch = 2.54 cm
    }
    const heightM = height / 100; // Convert cm to meters

    const bmi = weight / (heightM * heightM);

    bmiResult.textContent = bmi.toFixed(2); // Display BMI rounded to 2 decimal places

    // BMI Categorization
    if (bmi < 18.5) {
        bmiCategory.textContent = 'Category: Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        bmiCategory.textContent = 'Category: Normal weight';
    } else if (bmi >= 25 && bmi < 29.9) {
        bmiCategory.textContent = 'Category: Overweight';
    } else {
        bmiCategory.textContent = 'Category: Obesity';
    }
}

function resetBMICalculator() {
    document.getElementById('weight').value = '';
    document.getElementById('height').value = '';
    document.getElementById('weightUnit').value = 'kg'; // Reset to default unit
    document.getElementById('heightUnit').value = 'cm'; // Reset to default unit
    document.getElementById('bmiResult').textContent = '';
    document.getElementById('bmiCategory').textContent = '';
    document.getElementById('weight').classList.remove('error-input');
    document.getElementById('height').classList.remove('error-input');
    // Reset description visibility
    const bmiFullDesc = document.getElementById('bmiFullDesc');
    if (bmiFullDesc && bmiFullDesc.classList.contains('active')) {
        toggleDescription('bmi');
    }
}

// --- Tip Calculator Logic ---
function calculateTip() {
    const billAmountInput = document.getElementById('billAmount');
    const tipPercentageInput = document.getElementById('tipPercentage');
    const billAmount = parseFloat(billAmountInput.value);
    const tipPercentage = parseFloat(tipPercentageInput.value);
    const tipAmountResult = document.getElementById('tipAmountResult');
    const totalBillResult = document.getElementById('totalBillResult');

    billAmountInput.classList.remove('error-input');
    tipPercentageInput.classList.remove('error-input');

    if (isNaN(billAmount) || billAmount < 0) {
        tipAmountResult.textContent = 'Error: Please enter a valid non-negative bill amount.';
        totalBillResult.textContent = '';
        billAmountInput.classList.add('error-input');
        return;
    }
    if (isNaN(tipPercentage) || tipPercentage < 0) {
        tipAmountResult.textContent = 'Error: Please enter a valid non-negative tip percentage.';
        totalBillResult.textContent = '';
        tipPercentageInput.classList.add('error-input');
        return;
    }

    const tipAmount = billAmount * (tipPercentage / 100);
    const totalBill = billAmount + tipAmount;

    tipAmountResult.textContent = tipAmount.toFixed(2);
    totalBillResult.textContent = totalBill.toFixed(2);
}

function applyTipPercentage(percentage) {
    document.getElementById('tipPercentage').value = percentage;
    calculateTip(); // Recalculate with the new percentage
}

function resetTipCalculator() {
    document.getElementById('billAmount').value = '';
    document.getElementById('tipPercentage').value = '15'; // Reset to default
    document.getElementById('tipAmountResult').textContent = '';
    document.getElementById('totalBillResult').textContent = '';
    document.getElementById('billAmount').classList.remove('error-input');
    document.getElementById('tipPercentage').classList.remove('error-input');
    // Reset description visibility
    const tipFullDesc = document.getElementById('tipFullDesc');
    if (tipFullDesc && tipFullDesc.classList.contains('active')) {
        toggleDescription('tip');
    }
}

// --- Multi-Shape Area Calculator Logic ---
function showShapeInputs() {
    const selectedShape = document.getElementById('shapeType').value;
    // Query directly within the #areaCalculator to avoid conflicts if other calculators had similar classes
    const inputGroups = document.querySelectorAll('#shapeInputs.shape-input-group');

    inputGroups.forEach(group => {
        group.style.display = 'none'; // Hide all input groups
        // Also clear input values when hiding
        group.querySelectorAll('input').forEach(input => {
            input.value = '';
            input.classList.remove('error-input'); // Clear error state on inputs
        });
    });
    document.getElementById('areaResult').textContent = ''; // Clear previous result

    if (selectedShape) {
        const targetInputGroup = document.getElementById(selectedShape + 'Inputs');
        if (targetInputGroup) {
            targetInputGroup.style.display = 'flex'; // Use flex for better layout
        }
    }
}

function calculateArea() {
    const selectedShape = document.getElementById('shapeType').value;
    const areaResult = document.getElementById('areaResult');
    let area;

    // Clear all error classes from shape inputs before validation
    document.querySelectorAll('#shapeInputs input').forEach(input => input.classList.remove('error-input'));

    if (!selectedShape) {
        areaResult.textContent = 'Error: Please select a shape.';
        return;
    }

    switch (selectedShape) {
        case 'circle':
            const circleRadiusInput = document.getElementById('circleRadius');
            const radius = parseFloat(circleRadiusInput.value);
            if (isNaN(radius) || radius < 0) {
                areaResult.textContent = 'Error: Please enter a valid non-negative radius.';
                circleRadiusInput.classList.add('error-input');
                return;
            }
            area = Math.PI * radius * radius;
            break;
        case 'square':
            const squareSideInput = document.getElementById('squareSide');
            const side = parseFloat(squareSideInput.value);
            if (isNaN(side) || side < 0) {
                areaResult.textContent = 'Error: Please enter a valid non-negative side length.';
                squareSideInput.classList.add('error-input');
                return;
            }
            area = side * side;
            break;
        case 'rectangle':
            const rectangleLengthInput = document.getElementById('rectangleLength');
            const rectangleWidthInput = document.getElementById('rectangleWidth');
            const length = parseFloat(rectangleLengthInput.value);
            const width = parseFloat(rectangleWidthInput.value);
            if (isNaN(length) || length < 0) {
                areaResult.textContent = 'Error: Please enter a valid non-negative length.';
                rectangleLengthInput.classList.add('error-input');
                return;
            }
            if (isNaN(width) || width < 0) {
                areaResult.textContent = 'Error: Please enter a valid non-negative width.';
                rectangleWidthInput.classList.add('error-input');
                return;
            }
            area = length * width;
            break;
        case 'triangle':
            const triangleBaseInput = document.getElementById('triangleBase');
            const triangleHeightInput = document.getElementById('triangleHeight');
            const base = parseFloat(triangleBaseInput.value);
            const height = parseFloat(triangleHeightInput.value);
            if (isNaN(base) || base < 0) {
                areaResult.textContent = 'Error: Please enter a valid non-negative base.';
                triangleBaseInput.classList.add('error-input');
                return;
            }
            if (isNaN(height) || height < 0) {
                areaResult.textContent = 'Error: Please enter a valid non-negative height.';
                triangleHeightInput.classList.add('error-input');
                return;
            }
            area = 0.5 * base * height;
            break;
        default:
            areaResult.textContent = 'Error: Unknown shape selected.';
            return;
    }

    areaResult.textContent = area.toFixed(2);
}

function resetAreaCalculator() {
    document.getElementById('shapeType').value = ''; // Reset dropdown
    document.querySelectorAll('#shapeInputs input').forEach(input => {
        input.value = '';
        input.classList.remove('error-input');
    }); // Clear all inputs and error states
    document.querySelectorAll('#shapeInputs.shape-input-group').forEach(group => group.style.display = 'none'); // Hide all input groups
    document.getElementById('areaResult').textContent = ''; // Clear result
    // Reset description visibility
    const areaFullDesc = document.getElementById('areaFullDesc');
    if (areaFullDesc && areaFullDesc.classList.contains('active')) {
        toggleDescription('area');
    }
}

// --- Temperature Converter Logic ---
function convertTemperature(unit) {
    const celsiusInput = document.getElementById('celsius');
    const fahrenheitInput = document.getElementById('fahrenheit');
    const kelvinInput = document.getElementById('kelvin');

    let celsius, fahrenheit, kelvin;

    // Clear error highlights
    celsiusInput.classList.remove('error-input');
    fahrenheitInput.classList.remove('error-input');
    kelvinInput.classList.remove('error-input');

    if (unit === 'celsius') {
        celsius = parseFloat(celsiusInput.value);
        if (isNaN(celsius)) {
            fahrenheitInput.value = '';
            kelvinInput.value = '';
            return;
        }
        fahrenheit = (celsius * 9/5) + 32;
        kelvin = celsius + 273.15;
    } else if (unit === 'fahrenheit') {
        fahrenheit = parseFloat(fahrenheitInput.value);
        if (isNaN(fahrenheit)) {
            celsiusInput.value = '';
            kelvinInput.value = '';
            return;
        }
        celsius = (fahrenheit - 32) * 5/9;
        kelvin = celsius + 273.15;
    } else if (unit === 'kelvin') {
        kelvin = parseFloat(kelvinInput.value);
        if (isNaN(kelvin)) {
            celsiusInput.value = '';
            fahrenheitInput.value = '';
            return;
        }
        // Validate Kelvin input - cannot be below absolute zero (0K = -273.15C)
        if (kelvin < 0) {
            kelvinInput.classList.add('error-input');
            celsiusInput.value = 'Error';
            fahrenheitInput.value = 'Error';
            return;
        }
        celsius = kelvin - 273.15;
        fahrenheit = (celsius * 9/5) + 32;
    }

    // Update other inputs, being careful not to trigger a loop if the input is empty
    if (unit!== 'celsius') celsiusInput.value = isNaN(celsius)? '' : celsius.toFixed(2);
    if (unit!== 'fahrenheit') fahrenheitInput.value = isNaN(fahrenheit)? '' : fahrenheit.toFixed(2);
    if (unit!== 'kelvin') kelvinInput.value = isNaN(kelvin)? '' : kelvin.toFixed(2);
}

function resetTemperatureCalculator() {
    document.getElementById('celsius').value = '';
    document.getElementById('fahrenheit').value = '';
    document.getElementById('kelvin').value = '';
    document.getElementById('celsius').classList.remove('error-input');
    document.getElementById('fahrenheit').classList.remove('error-input');
    document.getElementById('kelvin').classList.remove('error-input');
    // Reset description visibility
    const temperatureFullDesc = document.getElementById('temperatureFullDesc');
    if (temperatureFullDesc && temperatureFullDesc.classList.contains('active')) {
        toggleDescription('temperature');
    }
}

// --- Initialize on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    showCalculator(); // Call showCalculator once to set initial state (all hidden)
    // For area calculator, ensure its shape inputs are hidden on initial load if it's the default shown
    if (document.getElementById('areaCalculator').style.display === 'block') {
        showShapeInputs();
    }
});