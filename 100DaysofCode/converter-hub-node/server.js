   // Load environment variables from.env file
   require('dotenv').config();

   import express, { json, static as staticMiddleware } from 'express';
   import { join } from 'path';
   import { get } from 'axios'; // For making HTTP requests to external APIs
   import { convertStandardUnit } from './backend-converters/unitConversions';
   import { convertTemperature } from './backend-converters/tempConversions';
   const app = express();
   const PORT = process.env.PORT || 3000;

   // Middleware to parse JSON requests (needed for POST /api/convert)
   app.use(json()); // NEW

   // --- Serve Static Files ---
   app.use(staticMiddleware(join(__dirname, 'public')));

   // --- API Endpoint for Currency Rates ---
   let currencyRatesCache = null;
   let lastFetchTime = 0;
   const CACHE_DURATION = 1000 * 60 * 60; // Cache for 1 hour

   app.get('/api/currency-rates', async (req, res) => {
       const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
       const BASE_CURRENCY = 'USD';

       if (!API_KEY) {
           console.error('EXCHANGE_RATE_API_KEY is not set in.env file!');
           return res.status(500).json({ error: 'Server configuration error: API key missing.' });
       }

       const currentTime = Date.now();

       if (currencyRatesCache && (currentTime - lastFetchTime < CACHE_DURATION)) {
           console.log('Serving currency rates from cache.');
           return res.json(currencyRatesCache);
       }

       console.log('Fetching new currency rates from external API...');
       try {
           const response = await get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`);

           if (response.data.result === 'success') {
               currencyRatesCache = response.data.conversion_rates;
               lastFetchTime = currentTime;
               console.log('Currency rates fetched and cached successfully.');
               return res.json(currencyRatesCache);
           } else {
               console.error('Error from currency API:', response.data['error-type']);
               return res.status(response.status).json({ error: response.data['error-type'] });
           }
       } catch (error) {
           console.error('Failed to fetch currency rates:', error.message);
           if (currencyRatesCache) {
               console.log('Failed to fetch new rates, serving expired cache.');
               return res.json(currencyRatesCache);
           }
           res.status(500).json({ error: 'Failed to fetch currency rates from external service.' });
       }
   });

   // --- NEW: API Endpoint for Generic Unit Conversions ---
   app.post('/api/convert', (req, res) => {
       const { value, fromUnit, toUnit, type } = req.body;

       if (typeof value!== 'number' || isNaN(value)) {
           return res.status(400).json({ error: 'Invalid numerical value provided.' });
       }
       if (!fromUnit ||!toUnit ||!type) {
           return res.status(400).json({ error: 'Missing fromUnit, toUnit, or type in request body.' });
       }

       try {
           let result;
           if (type === 'temperature') {
               result = convertTemperature(value, fromUnit, toUnit);
           } else {
               result = convertStandardUnit(value, fromUnit, toUnit, type);
           }
           res.json({ result });
       } catch (error) {
           console.error(`Error during backend conversion for type ${type}:`, error.message);
           res.status(400).json({ error: error.message });
       }
   });

   // --- Start the Server ---
   app.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}`);
   });