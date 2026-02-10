// TemperatureConverter class
class TemperatureConverter {
  // Constructor
  constructor() {
    this.history = [];
    this.temperatureInput = document.getElementById('temperature');
    this.fromScaleSelect = document.getElementById('from-scale');
    this.toScaleSelect = document.getElementById('to-scale');
    this.precisionSelect = document.getElementById('precision');
    this.resultElement = document.getElementById('result');
    this.historyElement = document.getElementById('history');
    this.saveBtn = document.getElementById('save-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.exportCsvBtn = document.getElementById('export-csv-btn');
    this.exportPdfBtn = document.getElementById('export-pdf-btn');

    // Add event listeners
    this.temperatureInput.addEventListener('input', this.updateResult.bind(this));
    this.fromScaleSelect.addEventListener('change', this.updateResult.bind(this));
    this.toScaleSelect.addEventListener('change', this.updateResult.bind(this));
    this.precisionSelect.addEventListener('change', this.updateResult.bind(this));
    this.saveBtn.addEventListener('click', this.saveHistory.bind(this));
    this.resetBtn.addEventListener('click', this.resetHistory.bind(this));
    this.exportCsvBtn.addEventListener('click', this.exportToCsv.bind(this));
    this.exportPdfBtn.addEventListener('click', this.exportToPdf.bind(this));
  }

  // Update result
  updateResult() {
    try {
      const temperature = this.parseTemperature(this.temperatureInput.value);
      const fromScale = this.fromScaleSelect.value;
      const toScale = this.toScaleSelect.value;
      const precision = parseInt(this.precisionSelect.value);

      if (temperature === null) {
        this.displayError('Invalid input');
        return;
      }

      const result = this.convertTemperature(temperature, fromScale, toScale);
      this.displayResult(temperature, fromScale, toScale, result, precision);
    } catch (error) {
      console.error(error);
      this.displayError('An error occurred');
    }
  }

  // Parse temperature
  parseTemperature(value) {
    const temperature = parseFloat(value);
    if (isNaN(temperature)) return null;

    const fromScale = this.fromScaleSelect.value;
    const scaleLimits = {
      celsius: -273.15,
      fahrenheit: -459.67,
      kelvin: 0,
      rankine: 0,
      reaumur: -218.52,
    };

    if (temperature < scaleLimits[fromScale]) return null;

    return temperature;
  }

  // Display result
  displayResult(temperature, fromScale, toScale, result, precision) {
    const resultHtml = `
      <p>${temperature} ${this.getScaleSymbol(fromScale)} = ${result.toFixed(precision)} ${this.getScaleSymbol(toScale)}</p>
    `;
    this.resultElement.innerHTML = resultHtml;
  }

  // Display error
  displayError(message) {
    const errorHtml = `
      <p style="color: red;">${message}</p>
    `;
    this.resultElement.innerHTML = errorHtml;
  }

  // Convert temperature
  convertTemperature(temperature, fromScale, toScale) {
    const conversions = {
      celsius: {
        toKelvin: t => t + 273.15,
        toFahrenheit: t => t * 9 / 5 + 32,
        toRankine: t => (t + 273.15) * 9 / 5,
        toReaumur: t => t * 4 / 5,
      },
      fahrenheit: {
        toCelsius: t => (t - 32) * 5 / 9,
        toKelvin: t => (t - 32) * 5 / 9 + 273.15,
        toRankine: t => t + 459.67,
        toReaumur: t => (t - 32) * 4 / 9,
      },
      kelvin: {
        toCelsius: t => t - 273.15,
        toFahrenheit: t => (t - 273.15) * 9 / 5 + 32,
        toRankine: t => t * 9 / 5,
        toReaumur: t => (t - 273.15) * 4 / 5,
      },
      rankine: {
        toCelsius: t => (t - 491.67) * 5 / 9,
        toFahrenheit: t => t - 459.67,
        toKelvin: t => t * 5 / 9,
        toReaumur: t => (t - 491.67) * 4 / 9,
      },
      reaumur: {
        toCelsius: t => t * 5 / 4,
        toFahrenheit: t => t * 9 / 4 + 32,
        toKelvin: t => t * 5 / 4 + 273.15,
        toRankine: t => (t * 5 / 4 + 273.15) * 9 / 5,
      },
    };

    return conversions[fromScale][`to${toScale.charAt(0).toUpperCase() + toScale.slice(1)}`](temperature);
  }

  // Get scale symbol
  getScaleSymbol(scale) {
    const symbols = {
      celsius: '°C',
      fahrenheit: '°F',
      kelvin: 'K',
      rankine: '°R',
      reaumur: '°Ré',
    };
    return symbols[scale];
  }

  // Save history
  saveHistory() {
    const temperature = this.parseTemperature(this.temperatureInput.value);
    const fromScale = this.fromScaleSelect.value;
    const toScale = this.toScaleSelect.value;
    const result = this.convertTemperature(temperature, fromScale, toScale);
    this.history.push({ temperature, fromScale, toScale, result });
    this.updateHistory();
  }

  // Update history
  updateHistory() {
    const historyHtml = this.history.map((entry, index) => `
      <p>${entry.temperature} ${this.getScaleSymbol(entry.fromScale)} = ${entry.result} ${this.getScaleSymbol(entry.toScale)} <button class="delete-btn" data-index="${index}">Delete</button></p>
    `).join('');
    this.historyElement.innerHTML = historyHtml;

    // Add event listeners to delete buttons
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.history.splice(index, 1);
        this.updateHistory();
      });
    });
  }

  // Reset history
  resetHistory() {
    this.history = [];
    this.updateHistory();
    this.resultElement.innerHTML = '';
  }

  // Export to CSV
  exportToCsv() {
    const csvContent = this.history.map((entry) => {
      return `${entry.temperature},${this.getScaleSymbol(entry.fromScale)},${entry.result},${this.getScaleSymbol(entry.toScale)}`;
    }).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'temperature-conversions.csv';
    link.click();
  }

  // Export to PDF
  exportToPdf() {
    const pdfContent = this.history.map((entry) => {
      return `${entry.temperature} ${this.getScaleSymbol(entry.fromScale)} = ${entry.result} ${this.getScaleSymbol(entry.toScale)}`;
    }).join('<br>');
    const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
    const pdfLink = document.createElement('a');
    pdfLink.href = URL.createObjectURL(pdfBlob);
    pdfLink.download = 'temperature-conversions.pdf';
    pdfLink.click();
  }
}

const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Initialize temperature converter
const temperatureConverter = new TemperatureConverter();