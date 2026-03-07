// apiService.js
import { showNotification } from './utils.js';

let currencyRatesCache = null;
let isFetchingRates = false; // Prevent multiple simultaneous fetches

/**
  * Fetches currency exchange rates from the backend.
  * Caches the rates to minimize API calls.
  * @returns {Promise<Object|null>} A promise that resolves with the currency rates object, or null if fetching fails.
 */
export async function getCurrencyRates() {
    if (currencyRatesCache) {
        return currencyRatesCache; // Return cached rates immediately
    }

    if (isFetchingRates) {
        // If a fetch is already in progress, wait for it
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (currencyRatesCache) {
                    clearInterval(checkInterval);
                    resolve(currencyRatesCache);
                }
            }, 100);
        });
    }

    isFetchingRates = true;
    showNotification("Fetching latest currency rates...", 'info');
    try {
        const response = await axios.get('/api/currency-rates');
        currencyRatesCache = response.data; // Server sends `conversion_rates` directly
        showNotification("Currency rates updated!", 'success');
        return currencyRatesCache;
    } catch (error) {
        console.error("Error fetching currency rates from backend:", error);
        showNotification(`Failed to fetch currency rates: ${error.message || error}. Using static fallback.`, 'danger');
        // Fallback to a static set of rates if the backend call fails
        currencyRatesCache = {
            USD: 1, INR: 83, EUR: 0.92, GBP: 0.85, JPY: 130, CAD: 1.3, AUD: 1.45
        };
        return currencyRatesCache;
    } finally {
        isFetchingRates = false;
    }
}