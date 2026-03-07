   // backend-converters/tempConversions.js

   /**
    * Converts a temperature value from one unit to another.
    * @param {number} value - The numerical value to convert.
    * @param {string} fromUnit - The unit to convert from ('c', 'f', 'k').
    * @param {string} toUnit - The unit to convert to ('c', 'f', 'k').
    * @returns {number} The converted temperature.
    * @throws {Error} If unsupported temperature units are provided.
    */
   function convertTemperature(value, fromUnit, toUnit) {
       let celsius; // Convert everything to Celsius first

       if (fromUnit === "c") celsius = value;
       else if (fromUnit === "f") celsius = (value - 32) * 5 / 9;
       else if (fromUnit === "k") celsius = value - 273.15;
       else throw new Error(`Unsupported 'from' temperature unit: ${fromUnit}`);

       let result; // Then convert from Celsius to target unit
       if (toUnit === "c") result = celsius;
       else if (toUnit === "f") result = (celsius * 9 / 5) + 32;
       else if (toUnit === "k") result = celsius + 273.15;
       else throw new Error(`Unsupported 'to' temperature unit: ${toUnit}`);

       return result;
   }

        export default {
            convertTemperature
        };