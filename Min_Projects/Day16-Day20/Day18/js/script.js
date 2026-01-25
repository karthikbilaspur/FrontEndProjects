const apiKey = 'YOUR_API_KEY'; // Get your API key from OpenWeatherMap
const countrySelect = document.getElementById('country-select');
const stateSelect = document.getElementById('state-select');
const citySelect = document.getElementById('city-select');
const getWeatherBtn = document.getElementById('get-weather-btn');
const cityNameElement = document.getElementById('city-name');
const temperatureElement = document.getElementById('temperature');
const weatherDescriptionElement = document.getElementById('weather-description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const forecastListElement = document.getElementById('forecast-list');
const contactForm = document.getElementById('contact-form');
const scrollToTopButton = document.getElementById('scroll-to-top');
const unitToggleBtn = document.getElementById('unit-toggle');
let isCelsius = true;
let cityData = {};

// Load country data from JSON file
fetch('json/city.json')
  .then(response => response.json())
  .then(data => {
    cityData = data;
    data.countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.name;
      option.textContent = country.name;
      countrySelect.appendChild(option);
    });
  })
  .catch(error => console.error(error));

// Populate state dropdown when country is selected
countrySelect.addEventListener('change', () => {
  const country = countrySelect.value;
  const selectedCountry = cityData.countries.find(c => c.name === country);
  stateSelect.innerHTML = '<option value="">Select State</option>';
  stateSelect.disabled = true;
  if (selectedCountry) {
    selectedCountry.states.forEach(state => {
      const option = document.createElement('option');
      option.value = state.name;
      option.textContent = state.name;
      stateSelect.appendChild(option);
    });
    stateSelect.disabled = false;
  }
});

// Populate city dropdown when state is selected
stateSelect.addEventListener('change', () => {
  const country = countrySelect.value;
  const state = stateSelect.value;
  const selectedCountry = cityData.countries.find(c => c.name === country);
  const selectedState = selectedCountry.states.find(s => s.name === state);
  citySelect.innerHTML = '<option value="">Select City</option>';
  citySelect.disabled = true;
  if (selectedState) {
    selectedState.cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
    citySelect.disabled = false;
  }
});

// Get weather data when city is selected
getWeatherBtn.addEventListener('click', () => {
  const city = citySelect.value;
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      cityNameElement.textContent = data.name;
      temperatureElement.textContent = `Temperature: ${data.main.temp}°C`;
      weatherDescriptionElement.textContent = `Weather: ${data.weather[0].description}`;
      humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
      windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    })
    .catch(error => console.error(error));

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const forecastList = data.list;
      forecastListElement.innerHTML = '';
      forecastList.forEach((forecast, index) => {
        if (index % 8 === 0) { // Display forecast for every 24 hours (8 * 3 hours)
          const forecastDate = new Date(forecast.dt * 1000);
          const forecastDay = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
          const forecastTemp = forecast.main.temp;
          const forecastDescription = forecast.weather[0].description;
          const forecastHtml = `
            <li>
              <h2>${forecastDay}</h2>
              <p>${forecastTemp}°C</p>
              <p>${forecastDescription}</p>
            </li>
          `;
          forecastListElement.insertAdjacentHTML('beforeend', forecastHtml);
        }
      });
    })
    .catch(error => console.error(error));
});

// Add event listener to toggle button
unitToggleBtn.addEventListener('click', () => {
  // Toggle temperature unit
  if (isCelsius) {
    unitToggleBtn.textContent = 'Switch to Celsius';
    temperatureElement.textContent = `Temperature: ${(cityNameElement.textContent === 'Temperature: undefined°C') ? '' : parseFloat(temperatureElement.textContent.split(': ')[1].split('°C')[0]) * 9/5 + 32}°F`;
    isCelsius = false;
  } else {
    unitToggleBtn.textContent = 'Switch to Fahrenheit';
    temperatureElement.textContent = `Temperature: ${(cityNameElement.textContent === 'Temperature: undefined°C') ? '' : parseFloat(temperatureElement.textContent.split(': ')[1].split('°F')[0]) * 5/9}°C`;
    isCelsius = true;
  }
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Validate form data
  if (name && email && message) {
    // Send form data to server or email service
    console.log('Form submitted:', { name, email, message });
    alert('Message sent successfully!');
    contactForm.reset();
  } else {
    alert('Please fill in all fields.');
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  });
});

// Scroll to top button
scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Get user's current location
navigator.geolocation.getCurrentPosition((position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // Display weather for current location
      cityNameElement.textContent = data.name;
      temperatureElement.textContent = `Temperature: ${data.main.temp}°C`;
      weatherDescriptionElement.textContent = `Weather: ${data.weather[0].description}`;
      humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
      windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    })
    .catch(error => console.error(error));
});