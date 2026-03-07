   // backend-converters/unitConversions.js

   const lengthMeterRates = {
       m: 1,
       km: 1000,
       mile: 1609.34,
       ft: 0.3048,
       yard: 0.9144,
       cm: 0.01,
       in: 0.0254
   };

   const weightKgRates = {
       kg: 1,
       g: 0.001,
       lb: 0.453592,
       oz: 0.0283495,
       ton: 1000, // Metric Ton
       mg: 0.000001
   };

   const dataByteRates = {
       b: 1,
       kb: 1 / 1024,
       mb: 1 / (1024 * 1024),
       gb: 1 / (1024 * 1024 * 1024),
       tb: 1 / (1024 * 1024 * 1024 * 1024),
       pb: 1 / (1024 * 1024 * 1024 * 1024 * 1024)
   };

   const areaSqMeterRates = {
       sqm: 1,
       sqkm: 1000000,
       sqmile: 2589988.11,
       sqft: 0.092903,
       sqyard: 0.836127,
       acre: 4046.86,
       hectare: 10000
   };

   const volumeLitreRates = {
       ml: 0.001,
       l: 1,
       cuin: 0.0163871, // 1 cubic inch = 0.0163871 liters
       cuft: 28.3168, // 1 cubic foot = 28.3168 liters
       gal: 3.78541, // 1 US gallon = 3.78541 liters
       qt: 0.946353, // 1 US quart = 0.946353 liters
       cup: 0.236588 // 1 US cup = 0.236588 liters
   };

   const speedMpsRates = {
       mps: 1, // Meters per second
       kmph: 1 / 3.6, // 1 km/h = 1/3.6 m/s
       mph: 0.44704, // 1 mph = 0.44704 m/s
       knot: 0.514444, // 1 knot = 0.514444 m/s
       fps: 0.3048 // 1 foot/second = 0.3048 m/s
   };

   const timeSecondRates = {
       sec: 1,
       min: 60,
       hr: 3600,
       day: 86400,
       week: 604800,
       month: 2629746, // Average month (365.25/12 days)
       year: 31556952 // Average year (365.25 days)
   };

   const resolutionPixelRates = {
       px: 1,
       mp: 1000000 // 1 Megapixel = 1,000,000 pixels
   };

   const conversionMaps = {
       length: lengthMeterRates,
       weight: weightKgRates,
       data: dataByteRates,
       area: areaSqMeterRates,
       volume: volumeLitreRates,
       speed: speedMpsRates,
       time: timeSecondRates,
       resolution: resolutionPixelRates
   };

   /**
    * Performs a conversion for standard units (not temperature or currency).
    * @param {number} value - The numerical value to convert.
    * @param {string} fromUnit - The unit to convert from.
    * @param {string} toUnit - The unit to convert to.
    * @param {string} type - The type of conversion (e.g., 'length', 'weight').
    * @returns {number} The converted value.
    * @throws {Error} If conversion rates are missing or type is unknown.
    */
   function convertStandardUnit(value, fromUnit, toUnit, type) {
       const rates = conversionMaps[type];
       if (!rates) {
           throw new Error(`Unknown conversion type: ${type}`);
       }
       if (!rates[fromUnit] ||!rates[toUnit]) {
           throw new Error(`Conversion rates not available for ${fromUnit} or ${toUnit} in ${type}.`);
       }

       // Data bytes are special, their rates are "1 / <base unit equivalent>"
       // For example, 1KB = 1024 Bytes. So, KB rate is 1/1024.
       // To convert from KB to Bytes, we need to divide by KB's rate.
       // Convert to base unit: value / rates[fromUnit]
       // Convert from base unit to target unit: * rates[toUnit]
       if (type === 'data') {
           return (value / rates[fromUnit]) * rates[toUnit];
       }

       // For all other types, rates are "base unit equivalent of 1 unit"
       // Convert to base unit: value * rates[fromUnit]
       // Convert from base unit to target unit: / rates[toUnit]
       return (value * rates[fromUnit]) / rates[toUnit];
   }

        export default {
            convertStandardUnit
        };