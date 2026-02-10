# WeatherWise: Instant Global Weather Forecasts 🌎

Project Status: Active License: MIT Powered by OpenWeatherMap

Brief Description: WeatherWise is a modern, responsive web application designed to provide users with quick and accurate weather forecasts for any location across the globe. It offers real-time current conditions, a comprehensive 5-day outlook with detailed hourly forecasts, and a highly customizable user experience including unit toggling, theme switching, and persistent search history. Built with a focus on usability and accessibility, WeatherWise aims to be your go-to source for weather information.

📄 What Each Page (File) Does:
index.html: This is the main entry point and structural backbone of the application. It defines all the UI elements like the header, search forms, current weather display, 5-day forecast cards, hourly forecast detail section, and the sidebar for search history and settings. It also includes SEO meta tags and links to the CSS and JavaScript files.
style.css: This file contains all the styling rules for the application. It uses CSS variables for a consistent and easily manageable theme (light and dark mode), implements responsive design through media queries to ensure optimal viewing on all devices, and includes animations for loading states (skeletons and spinners) and interactive elements.
script.js: This JavaScript file powers all the interactivity and data fetching. It manages API calls to OpenWeatherMap for current and forecast data, handles unit conversions (Celsius/Fahrenheit), updates the DOM dynamically based on fetched data, stores search history in local storage, manages the theme toggle, and implements an auto-refresh feature. It's the brain behind WeatherWise's dynamic behavior.
🚀 Major Functionalities:
Global City Search: Users can effortlessly search for weather conditions in any city worldwide using dedicated search input fields in both the header and the main content area.
Current Location Weather: A "My Location" button leverages the browser's geolocation API to fetch and display weather for the user's current geographical position.
Comprehensive Current Conditions: Displays detailed real-time weather metrics including temperature, "feels like" temperature, humidity, wind speed (with unit conversion), atmospheric pressure, visibility, and accurate sunrise/sunset times.
Interactive 5-Day Forecast: Presents a summarized 5-day weather outlook. Each day's card is clickable to reveal more detailed hourly forecasts.
Detailed Hourly Forecast: Upon clicking a day in the 5-day forecast, a dedicated section expands to show hourly temperature, conditions, "feels like," humidity, and wind speed for that specific day.
Unit Toggling: Seamlessly switch temperature units between Celsius (°C) and Fahrenheit (°F) with a single click, with preferences saved locally.
Dynamic Theme Switching: Users can toggle between a light and dark mode theme to suit their preference, with the chosen theme persisted across sessions.
Persistent Search History: Automatically stores and displays up to the last 5 searched cities in a sidebar for quick access, and includes a "Clear History" option.
Configurable Auto-Refresh: A settings slider allows users to set an automatic refresh interval (in minutes) for weather data, keeping information up-to-date.
Enhanced User Experience (UX):
Skeleton Loaders: Provides visual feedback during data fetching with sleek skeleton screens for both current weather and forecast sections.
Smooth Transitions: Implements CSS transitions for theme changes, button interactions, and card hovers for a polished feel.
Error Handling: Displays user-friendly error messages for network issues or city not found.
Accessibility (A11y): Utilizes semantic HTML5, ARIA attributes (role, aria-label, aria-pressed, aria-valuenow, aria-valuetext, aria-live), and keyboard navigation support to ensure the application is usable by a broad audience, including those using assistive technologies.

🛠️ Tech Stack:
Frontend:
HTML5: For page structure and semantic content.
CSS3: For styling, responsive design, animations, and transitions (leveraging CSS Variables for theming).
JavaScript (ES6+): For all dynamic functionalities, API interactions, and DOM manipulation.
API:
OpenWeatherMap API: Provides current weather data and 5-day/3-hour forecast data.
Fonts & Icons:
Google Fonts: Poppins typeface for modern typography.
Font Awesome: For scalable vector icons (or Unicode emojis, as noted in the code).

Prerequisites
You'll need a modern web browser and a text editor.

Obtain an OpenWeatherMap API Key:
Go to the OpenWeatherMap website and sign up for a free account.
Once logged in, navigate to your "API keys" section to generate or retrieve your personal API key.
Configure API Key in script.js:
Open the script.js file in your preferred text editor.
Locate the line const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";
Replace "YOUR_OPENWEATHER_API_KEY" with the API key you obtained from OpenWeatherMap.
    // script.js
    const OPENWEATHER_API_KEY = "YOUR_ACTUAL_OPENWEATHER_API_KEY_HERE";
code.js
2 lines (2 loc) · 88 B
Open in Browser:
Simply open the index.html file directly in your web browser. There's no build process required for this client-side application.
🎮 Usage:
Search by City:
Enter a city name into the input field in the header or the main section.
Press Enter or click the "Search" button.
Use My Location:
Click the "My Location" button.
Grant permission if prompted by your browser to access your geographical location.
Toggle Units:
Click the °F / °C button in the header to switch between Fahrenheit and Celsius temperatures.
Toggle Theme:
Click the 🌙 / ☀️ button in the header to switch between the dark and light themes.
View Forecast Details:
The 5-day forecast will appear below the current weather. Click on any forecast card to reveal a detailed hourly forecast for that specific day.
Access Recent Searches:
Your recent city searches will be listed in the right sidebar. Click on a city name to quickly load its weather.
Set Auto-Refresh Interval:
In the sidebar's "Settings" section, adjust the slider to set how often the weather data should automatically refresh (in minutes). Set to "Off" to disable.
Clear Search History:
Click the "Clear History" button in the sidebar to remove all saved search entries.
