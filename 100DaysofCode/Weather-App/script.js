// --- Configuration ---
// IMPORTANT: For client-side JavaScript, API keys are always exposed.
// For production, consider a backend proxy to protect your API key.
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"; // Replace with your actual API key
const OPENWEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5";
const DEFAULT_CITY = "Bangalore"; // New: Default city to load on startup

// --- DOM Element References (Cached for Performance) ---
const DOM = {
  headerCityInput: document.getElementById("headerCityInput"),
  headerSearchBtn: document.getElementById("headerSearchBtn"),
  cityInput: document.getElementById("cityInput"),
  searchBtn: document.getElementById("searchBtn"),
  locationBtn: document.getElementById("locationBtn"),
  loader: document.getElementById("loader"),
  errorDisplay: document.getElementById("error"),
  weatherCard: document.getElementById("weather"),
  forecastContainer: document.getElementById("forecastContainer"),
  themeToggle: document.getElementById("themeToggle"),
  unitToggle: document.getElementById("unitToggle"),
  currentCity: document.getElementById("city"),
  weatherIcon: document.getElementById("icon"),
  currentTemp: document.getElementById("temp"),
  currentCondition: document.getElementById("condition"),
  currentHumidity: document.getElementById("humidity"),
  currentWind: document.getElementById("wind"),
  feelsLikeTemp: document.getElementById("feelsLikeTemp"),
  pressure: document.getElementById("pressure"),
  visibility: document.getElementById("visibility"),
  sunrise: document.getElementById("sunrise"),
  sunset: document.getElementById("sunset"),
  lastUpdated: document.getElementById("lastUpdated"),
  searchHistoryList: document.getElementById("searchHistoryList"),
  currentWeatherSkeleton: document.getElementById("currentWeatherSkeleton"),
  forecastSkeleton: document.getElementById("forecastSkeleton"),

  // New DOM elements
  dailyDetailsSection: document.getElementById("dailyDetailsSection"),
  dailyDetailsLoader: document.getElementById("dailyDetailsLoader"),
  dailyDetailsContainer: document.getElementById("dailyDetailsContainer"),
  refreshInterval: document.getElementById("refreshInterval"),
  refreshValue: document.getElementById("refreshValue"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
};

// --- State Variables ---
let isMetric = localStorage.getItem("isMetric") === "false"? false : true; // false for Fahrenheit, true for Celsius
let currentWeatherData = null; // Stores fetched data for unit toggling
let forecastData = null; // Stores fetched forecast data for unit toggling (all 3-hour entries)
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || []; // Stores search history
let currentCityName = DEFAULT_CITY; // Track the currently displayed city
let autoRefreshIntervalId = null; // To store the interval ID for auto-refresh

// --- Utility Functions ---

/**
 * Shows the main loader and skeletons, hides content.
 */
const startLoadingState = () => {
  DOM.loader.classList.remove("hidden");
  DOM.errorDisplay.classList.add("hidden");
  DOM.weatherCard.classList.add("hidden");
  DOM.forecastContainer.innerHTML = "";
  DOM.forecastContainer.classList.remove("forecast-grid"); // Remove grid display while empty
  DOM.dailyDetailsSection.classList.add("hidden"); // Hide daily details when fetching new city

  // Show skeletons
  DOM.currentWeatherSkeleton.classList.remove("hidden");
  DOM.forecastSkeleton.classList.remove("hidden");

  // Disable buttons while loading to prevent multiple requests
  DOM.searchBtn.disabled = true;
  DOM.headerSearchBtn.disabled = true;
  DOM.locationBtn.disabled = true;
};

/**
 * Hides the main loader and skeletons, enables interactive elements.
 */
const endLoadingState = () => {
  DOM.loader.classList.add("hidden");
  DOM.currentWeatherSkeleton.classList.add("hidden");
  DOM.forecastSkeleton.classList.add("hidden");
  DOM.weatherCard.classList.remove("hidden"); // Show weather card
  DOM.forecastContainer.classList.add("forecast-grid"); // Re-add grid display

  // Enable buttons once loading is complete
  DOM.searchBtn.disabled = false;
  DOM.headerSearchBtn.disabled = false;
  DOM.locationBtn.disabled = false;
};

/**
 * Displays an error message to the user.
 * @param {string} message - The error message to display.
 */
const displayError = (message) => {
  DOM.errorDisplay.textContent = `Error: ${message}`;
  DOM.errorDisplay.classList.remove("hidden");
  DOM.weatherCard.classList.add("hidden");
  DOM.forecastContainer.innerHTML = "<p class='no-data-message'>No 5-day forecast available.</p>"; // Clear forecast
  DOM.forecastContainer.classList.remove("forecast-grid");
  DOM.dailyDetailsSection.classList.add("hidden"); // Hide daily details on error
  endLoadingState(); // Ensure loading state ends on error
};

/**
 * Clears any currently displayed error message.
 */
const clearError = () => {
  DOM.errorDisplay.classList.add("hidden");
  DOM.errorDisplay.textContent = "";
};

/**
 * Formats a Unix timestamp into a readable date string.
 * @param {number} timestamp - The Unix timestamp in seconds.
 * @param {boolean} includeTime - Whether to include time in the format.
 * @param {string} type - 'date', 'time', or 'datetime' to control output.
 * @returns {string} The formatted date string.
 */
const formatDate = (timestamp, type = 'datetime') => {
  const date = new Date(timestamp * 1000);
  let options;
  if (type === 'date') {
    options = { weekday: "short", month: "short", day: "numeric" };
  } else if (type === 'time') {
    options = { hour: "numeric", minute: "numeric", hour12: true };
  } else { // datetime
    options = {
      month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true
    };
  }
  return date.toLocaleDateString("en-US", options);
};

/**
 * Converts temperature from Kelvin to Celsius or Fahrenheit.
 * @param {number} tempKelvin - Temperature in Kelvin.
 * @param {boolean} toMetric - True for Celsius, false for Fahrenheit.
 * @returns {string} The converted temperature, formatted to one decimal place.
 */
const convertTemperature = (tempKelvin, toMetric) => {
  if (toMetric) {
    return (tempKelvin - 273.15).toFixed(0); // Celsius (no decimals for cleaner display)
  } else {
    return ((tempKelvin - 273.15) * 9 / 5 + 32).toFixed(0); // Fahrenheit (no decimals)
  }
};

/**
 * Returns the appropriate temperature unit symbol.
 * @param {boolean} metric - True for Celsius, false for Fahrenheit.
 * @returns {string} The unit symbol (°C or °F).
 */
const getUnitSymbol = (metric) => (metric? "°C" : "°F");

/**
 * Generates the OpenWeatherMap icon URL.
 * @param {string} iconCode - The icon code from the OpenWeatherMap API.
 * @returns {string} The full URL for the weather icon.
 */
const getWeatherIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

/**
 * Delays a function call. Useful for debouncing input.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} A debounced version of the function.
 */
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Updates search history in localStorage and renders it.
 * @param {string} city - The city name to add to history.
 */
const updateSearchHistory = (city) => {
  if (city) {
    // Remove if already exists to move it to the top
    searchHistory = searchHistory.filter(item => item.toLowerCase()!== city.toLowerCase());
    searchHistory.unshift(city); // Add to the beginning
    searchHistory = searchHistory.slice(0, 5); // Keep only the last 5
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
  }
};

/**
 * Renders the search history in the UI.
 */
const renderSearchHistory = () => {
  DOM.searchHistoryList.innerHTML = "";
  if (searchHistory.length === 0) {
    DOM.searchHistoryList.innerHTML = "<li class='no-history-message'>No recent searches</li>";
  }
  searchHistory.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.classList.add("search-history-item");
    li.tabIndex = 0; // Make list items focusable
    li.setAttribute('role', 'button'); // Improve accessibility
    li.addEventListener("click", () => handleCitySearch(city));
    li.addEventListener("keypress", (e) => { // Allow activation with Enter key
      if (e.key === "Enter") {
        handleCitySearch(city);
      }
    });
    DOM.searchHistoryList.appendChild(li);
  });
};

/**
 * Clears all search history from localStorage and the UI.
 */
const clearSearchHistory = () => {
  searchHistory = [];
  localStorage.removeItem("searchHistory");
  renderSearchHistory();
};

// --- Core Weather Fetching & Display Logic ---

/**
 * Fetches current weather and 5-day/3-hour forecast data for a given city.
 * @param {string} city - The name of the city.
 */
async function fetchWeatherByCity(city) {
  if (!city) {
    displayError("Please enter a city name.");
    return;
  }
  startLoadingState();
  clearError();

  try {
    const currentWeatherUrl = `${OPENWEATHER_API_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`;
    const forecastUrl = `${OPENWEATHER_API_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    if (!currentResponse.ok ||!forecastResponse.ok) {
      if (currentResponse.status === 404 || forecastResponse.status === 404) {
        throw new Error("City not found. Please check the spelling and try again.");
      }
      throw new Error(`Failed to fetch weather data. Status: ${currentResponse.status}. Please try again later.`);
    }

    const currentData = await currentResponse.json();
    const forecastDataResult = await forecastResponse.json();

    currentWeatherData = currentData; // Store for unit toggling
    forecastData = forecastDataResult; // Store for unit toggling (full 3-hour list)
    currentCityName = currentData.name; // Update current city name

    displayCurrentWeather(currentData);
    displayFiveDayForecast(forecastDataResult);
    updateSearchHistory(currentData.name); // Use the city name returned by API for history
  } catch (error) {
    console.error("Error fetching weather data:", error);
    displayError(error.message);
  } finally {
    endLoadingState();
  }
}

/**
 * Fetches current weather and 5-day forecast data for given coordinates.
 * @param {number} latitude - The latitude.
 * @param {number} longitude - The longitude.
 */
async function fetchWeatherByCoordinates(latitude, longitude) {
  startLoadingState();
  clearError();

  try {
    const currentWeatherUrl = `${OPENWEATHER_API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;
    const forecastUrl = `${OPENWEATHER_API_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    if (!currentResponse.ok ||!forecastResponse.ok) {
      throw new Error(`Failed to fetch weather data for your location. Status: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();
    const forecastDataResult = await forecastResponse.json();

    currentWeatherData = currentData;
    forecastData = forecastDataResult;
    currentCityName = currentData.name; // Update current city name

    displayCurrentWeather(currentData);
    displayFiveDayForecast(forecastDataResult);
    updateSearchHistory(currentData.name); // Add location city to history
  } catch (error) {
    console.error("Error fetching weather data:", error);
    displayError(error.message);
  } finally {
    endLoadingState();
  }
}

/**
 * Renders the current weather data onto the UI.
 * @param {object} data - The current weather data object from OpenWeatherMap.
 */
function displayCurrentWeather(data) {
  const temp = convertTemperature(data.main.temp, isMetric);
  const feelsLike = convertTemperature(data.main.feels_like, isMetric);
  const unit = getUnitSymbol(isMetric);

  DOM.currentCity.textContent = `${data.name}, ${data.sys.country}`;
  DOM.weatherIcon.src = getWeatherIconUrl(data.weather[0].icon);
  DOM.weatherIcon.alt = data.weather[0].description;
  DOM.currentTemp.textContent = `${temp}${unit}`;
  DOM.currentCondition.textContent = `${data.weather[0].description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`; // Capitalize each word
  DOM.currentHumidity.textContent = `${data.main.humidity}%`;

  let windSpeedValue;
  let windUnit;
  if (isMetric) {
    windSpeedValue = (data.wind.speed * 3.6).toFixed(0); // km/h
    windUnit = "km/h";
  } else {
    windSpeedValue = (data.wind.speed * 2.237).toFixed(0); // mph
    windUnit = "mph";
  }
  DOM.currentWind.textContent = `${windSpeedValue} ${windUnit}`;

  DOM.feelsLikeTemp.textContent = `${feelsLike}${unit}`;
  DOM.pressure.textContent = `${data.main.pressure} hPa`;
  DOM.visibility.textContent = `${(data.visibility / 1000).toFixed(0)} km`; // Convert meters to km
  DOM.sunrise.textContent = formatDate(data.sys.sunrise, 'time');
  DOM.sunset.textContent = formatDate(data.sys.sunset, 'time');
  DOM.lastUpdated.textContent = `Last Updated: ${formatDate(data.dt, 'datetime')}`;
}

/**
 * Renders the 5-day forecast data onto the UI, summarizing each day.
 * @param {object} data - The full forecast data object from OpenWeatherMap (3-hour intervals).
 */
function displayFiveDayForecast(data) {
  DOM.forecastContainer.innerHTML = "";
  const dailyForecasts = {}; // Stores one representative forecast item per day

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    date.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
    const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

    // Skip today's entries for the 5-day forecast summary
    if (date.getTime() === today.getTime()) {
      return;
    }

    // Initialize daily forecast if not present, or update if this item is closer to noon
    if (!dailyForecasts[dateKey] || (Math.abs(new Date(item.dt * 1000).getHours() - 12) < Math.abs(new Date(dailyForecasts[dateKey].dt * 1000).getHours() - 12))) {
      dailyForecasts[dateKey] = item;
    }
  });

  const forecastDates = Object.keys(dailyForecasts).sort().slice(0, 5); // Get next 5 days

  if (forecastDates.length === 0) {
    DOM.forecastContainer.innerHTML = "<p class='no-data-message'>No 5-day forecast available.</p>";
    return;
  }

  forecastDates.forEach((dateKey, index) => {
    const item = dailyForecasts[dateKey];
    const temp = convertTemperature(item.main.temp, isMetric);
    const unit = getUnitSymbol(isMetric);

    const forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");
    forecastCard.setAttribute('data-date', dateKey); // Store date for click handler
    forecastCard.setAttribute('tabindex', '0'); // Make focusable
    forecastCard.setAttribute('role', 'button'); // Indicate it's clickable
    forecastCard.setAttribute('aria-label', `Forecast for ${formatDate(item.dt, 'date')}: ${item.weather[0].description}, ${temp}${unit}`);

    forecastCard.innerHTML = `
        <h4>${formatDate(item.dt, 'date')}</h4>
        <img src="${getWeatherIconUrl(item.weather[0].icon)}" alt="${item.weather[0].description}" />
        <p class="forecast-temp">${temp}${unit}</p>
        <p class="forecast-condition">${item.weather[0].main}</p>
      `;
    forecastCard.addEventListener('click', () => displayHourlyForecast(dateKey));
    forecastCard.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') displayHourlyForecast(dateKey);
    });

    DOM.forecastContainer.appendChild(forecastCard);
  });
}

/**
 * Displays the hourly forecast for a selected day.
 * @param {string} selectedDateKey - The date key (YYYY-MM-DD) for the selected day.
 */
function displayHourlyForecast(selectedDateKey) {
  if (!forecastData ||!forecastData.list) {
    DOM.dailyDetailsContainer.innerHTML = "<p class='no-data-message'>No hourly forecast data available.</p>";
    DOM.dailyDetailsSection.classList.remove("hidden");
    return;
  }

  DOM.dailyDetailsSection.classList.remove("hidden");
  DOM.dailyDetailsLoader.classList.remove("hidden");
  DOM.dailyDetailsContainer.innerHTML = ""; // Clear previous details
  DOM.dailyDetailsContainer.classList.add("hidden"); // Hide container while loading

  const hourlyForecastsForDay = forecastData.list.filter(item => {
    const itemDate = new Date(item.dt * 1000).toISOString().split("T")[0];
    return itemDate === selectedDateKey;
  });

  if (hourlyForecastsForDay.length === 0) {
    DOM.dailyDetailsContainer.innerHTML = "<p class='no-data-message'>No detailed hourly forecast for this day.</p>";
    DOM.dailyDetailsLoader.classList.add("hidden");
    DOM.dailyDetailsContainer.classList.remove("hidden");
    return;
  }

  const dailyDetailsTitle = document.createElement('h3');
  dailyDetailsTitle.id = 'daily-details-heading-dynamic';
  dailyDetailsTitle.textContent = `Hourly Forecast for ${formatDate(hourlyForecastsForDay[0].dt, 'date')}`;
  dailyDetailsTitle.classList.add('daily-details-title');
  DOM.dailyDetailsContainer.appendChild(dailyDetailsTitle);

  const hourlyGrid = document.createElement('div');
  hourlyGrid.classList.add('hourly-forecast-grid');

  hourlyForecastsForDay.forEach(item => {
    const temp = convertTemperature(item.main.temp, isMetric);
    const feelsLike = convertTemperature(item.main.feels_like, isMetric);
    const unit = getUnitSymbol(isMetric);
    const windSpeedValue = isMetric? (item.wind.speed * 3.6).toFixed(0) : (item.wind.speed * 2.237).toFixed(0);
    const windUnit = isMetric? "km/h" : "mph";

    const hourlyCard = document.createElement('div');
    hourlyCard.classList.add('hourly-forecast-card');
    hourlyCard.innerHTML = `
            <p class="hourly-time">${formatDate(item.dt, 'time')}</p>
            <img src="${getWeatherIconUrl(item.weather[0].icon)}" alt="${item.weather[0].description}">
            <p class="hourly-temp">${temp}${unit}</p>
            <p class="hourly-condition">${item.weather[0].main}</p>
            <div class="hourly-extra-details">
                <p>Feels like: ${feelsLike}${unit}</p>
                <p>Humidity: ${item.main.humidity}%</p>
                <p>Wind: ${windSpeedValue} ${windUnit}</p>
            </div>
        `;
    hourlyGrid.appendChild(hourlyCard);
  });

  DOM.dailyDetailsContainer.appendChild(hourlyGrid);
  DOM.dailyDetailsLoader.classList.add("hidden");
  DOM.dailyDetailsContainer.classList.remove("hidden");
}

// --- Auto-Refresh Logic ---
const startAutoRefresh = (intervalMinutes) => {
  if (autoRefreshIntervalId) {
    clearInterval(autoRefreshIntervalId);
  }
  if (intervalMinutes > 0) {
    autoRefreshIntervalId = setInterval(() => {
      console.log(`Auto-refreshing weather for ${currentCityName}...`);
      fetchWeatherByCity(currentCityName);
    }, intervalMinutes * 60 * 1000); // Convert minutes to milliseconds
    console.log(`Auto-refresh set for every ${intervalMinutes} minutes.`);
  } else {
    console.log("Auto-refresh turned off.");
  }
};

// --- Event Handlers ---

/**
 * Handles the city search action.
 * @param {string} cityValue - The value from the city input field.
 */
const handleCitySearch = (cityValue) => {
  const city = cityValue.trim();
  if (city) {
    fetchWeatherByCity(city);
    DOM.cityInput.value = "";
    DOM.headerCityInput.value = "";
  } else {
    displayError("City name cannot be empty.");
  }
};

DOM.searchBtn.addEventListener("click", () => handleCitySearch(DOM.cityInput.value));
DOM.headerSearchBtn.addEventListener("click", () => handleCitySearch(DOM.headerCityInput.value));

DOM.cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleCitySearch(DOM.cityInput.value);
  }
});
DOM.headerCityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleCitySearch(DOM.headerCityInput.value);
  }
});

DOM.locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    startLoadingState();
    clearError();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        endLoadingState();
        let errorMessage = "An unknown error occurred while getting location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Geolocation denied. Please allow location access to use this feature.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Geolocation request timed out. Please try again.";
            break;
        }
        displayError(errorMessage);
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Geolocation options for better accuracy
    );
  } else {
    displayError("Geolocation is not supported by your browser.");
  }
});

DOM.themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  DOM.themeToggle.textContent = isDark? "☀️" : "🌙";
  localStorage.setItem("theme", isDark? "dark" : "light");
  DOM.themeToggle.setAttribute('aria-pressed', isDark);
  // Update CSS custom property for dynamic theming (e.g., button background)
  document.documentElement.style.setProperty('--toggle-bg', isDark? 'var(--dark-mode-button-bg)' : 'var(--light-mode-button-bg)');
});

DOM.unitToggle.addEventListener("click", () => {
  isMetric =!isMetric;
  DOM.unitToggle.textContent = isMetric? "°F" : "°C"; // Button shows the unit it will convert TO
  localStorage.setItem("isMetric", isMetric); // Persist unit preference
  DOM.unitToggle.setAttribute('aria-pressed',!isMetric);

  // Re-display current weather and forecast with the new unit if data exists
  if (currentWeatherData) {
    displayCurrentWeather(currentWeatherData); // Re-display current with new unit
  }
  if (forecastData) {
    displayFiveDayForecast(forecastData); // Re-display 5-day forecast with new unit
    // If daily details are visible, re-render them too
    const activeDailyDetails = DOM.dailyDetailsContainer.querySelector('.daily-details-title');
    if (activeDailyDetails) {
        const selectedDateKey = new Date(activeDailyDetails.textContent.replace('Hourly Forecast for ', '')).toISOString().split('T')[0];
        displayHourlyForecast(selectedDateKey);
    }
  }
});

DOM.refreshInterval.addEventListener("input", (e) => {
  const minutes = parseInt(e.target.value);
  if (minutes === 0) {
    DOM.refreshValue.textContent = "Off";
  } else {
    DOM.refreshValue.textContent = `${minutes} min`;
  }
  e.target.setAttribute('aria-valuenow', minutes);
  e.target.setAttribute('aria-valuetext', minutes === 0? "Off" : `${minutes} minutes`);
  startAutoRefresh(minutes);
  localStorage.setItem("autoRefreshInterval", minutes); // Save preference
});

DOM.clearHistoryBtn.addEventListener('click', clearSearchHistory);

// --- Initialization ---

/**
 * Initializes the application state and UI based on saved preferences.
 */
const initializeApp = () => {
  // Apply saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    DOM.themeToggle.textContent = "☀️";
    DOM.themeToggle.setAttribute('aria-pressed', 'true');
    document.documentElement.style.setProperty('--toggle-bg', 'var(--dark-mode-button-bg)');
  } else {
    DOM.themeToggle.textContent = "🌙";
    DOM.themeToggle.setAttribute('aria-pressed', 'false');
    document.documentElement.style.setProperty('--toggle-bg', 'var(--light-mode-button-bg)');
  }

  // Set initial unit toggle text and accessibility attribute
  DOM.unitToggle.textContent = isMetric? "°F" : "°C";
  DOM.unitToggle.setAttribute('aria-pressed',!isMetric);

  // Set initial auto-refresh value
  const savedRefreshInterval = parseInt(localStorage.getItem("autoRefreshInterval") || "0");
  DOM.refreshInterval.value = savedRefreshInterval;
  if (savedRefreshInterval === 0) {
    DOM.refreshValue.textContent = "Off";
  } else {
    DOM.refreshValue.textContent = `${savedRefreshInterval} min`;
  }
  DOM.refreshInterval.setAttribute('aria-valuenow', savedRefreshInterval);
  DOM.refreshInterval.setAttribute('aria-valuetext', savedRefreshInterval === 0? "Off" : `${savedRefreshInterval} minutes`);
  startAutoRefresh(savedRefreshInterval);

  // Render search history on load
  renderSearchHistory();

  // Load weather for a default city or user's last search on startup
  const lastSearchedCity = searchHistory[0];
  if (lastSearchedCity) {
    fetchWeatherByCity(lastSearchedCity);
  } else {
    fetchWeatherByCity(DEFAULT_CITY); // Use defined default city
  }
};

document.addEventListener("DOMContentLoaded", initializeApp);