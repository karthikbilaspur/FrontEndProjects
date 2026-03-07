   // apiService.js
   import { showNotification } from './utils.js';

   let currencyRatesCache = null;
   let isFetchingCurrencyRates = false; // Renamed for clarity

   /**
    * Fetches currency exchange rates from the backend.
    * Caches the rates to minimize API calls.
    * @returns {Promise<Object|null>} A promise that resolves with the currency rates object, or null if fetching fails.
    */
   export async function getCurrencyRates() {
       if (currencyRatesCache) {
           return currencyRatesCache; // Return cached rates immediately
       }

       if (isFetchingCurrencyRates) {
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

       isFetchingCurrencyRates = true; // Use the renamed flag
       showNotification("Fetching latest currency rates...", 'info');
       try {
           const response = await axios.get('/api/currency-rates');
           currencyRatesCache = response.data;
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
           isFetchingCurrencyRates = false; // Reset the flag
       }
   }

   /**
    * Makes an API call to the backend for generic unit conversions (all types except currency).
    * @param {number} value - The numerical value to convert.
    * @param {string} fromUnit - The unit to convert from.
    * @param {string} toUnit - The unit to convert to.
    * @param {string} type - The type of conversion (e.g., 'length', 'weight').
    * @returns {Promise<number>} A promise that resolves with the converted value.
    * @throws {Error} If the API call fails or returns an error.
    */
   export async function convertUnits(value, fromUnit, toUnit, type) {
       try {
           const response = await axios.post('/api/convert', {
               value,
               fromUnit,
               toUnit,
               type
           });
           if (response.data && typeof response.data.result === 'number') {
               return response.data.result;
           } else {
               throw new Error('Invalid response from conversion API.');
           }
       } catch (error) {
           console.error(`Error calling backend conversion for ${type}:`, error);
           const errorMessage = error.response?.data?.error || error.message || 'Unknown conversion error.';
           showNotification(`Conversion failed: ${errorMessage}`, 'danger');
           throw new Error(errorMessage);
       }
   }