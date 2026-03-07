   // converterController.js
        import { showNotification, getInputValue, formatResult, swapUnitSelections, resetSection } from './utils.js';
        import { getCurrencyRates, convertUnits } from './apiService.js';   // Map converter types to their conversion functions/methods
   // Now they all point to the backend or specific API services
   const converterPerformers = { // Renamed from converterFunctions for clarity
       length: async (value, fromUnit, toUnit) => await convertUnits(value, fromUnit, toUnit, 'length'),
       weight: async (value, fromUnit, toUnit) => await convertUnits(value, fromUnit, toUnit, 'weight'),
       temperature: async (value, fromUnit, toUnit) => await convertUnits(value, fromUnit, toUnit, 'temperature'),
       data: async (value, fromUnit, toUnit) => await convertUnits(value, fromUnit, toUnit, 'data'),
       area: async (value, fromUnit, toUnit) => await convertUnits(value, fromUnit, toUnit, 'area'),
       volume: async (value, fromUnit, toUnit) => await convertUnits(value, fromUnit, toUnit, 'volume'),
       speed: async (value, fromUnit, toUnit) => await convertUnits(value, fromUnit, toUnit, 'speed'),
       time: async (value, fromUnit, toUnit) => await convertUnits(value, fromUnit, toUnit, 'time'),
       resolution: async (value, fromUnit, toUnit) => await convertUnits(value, fromUnit, toUnit, 'resolution'),
       currency: async (value, fromUnit, toUnit) => { // Currency still has its specific logic
           const rates = await getCurrencyRates();
           if (!rates ||!rates[fromUnit] ||!rates[toUnit]) {
               throw new Error(`Currency conversion rates not available for ${fromUnit} or ${toUnit}.`);
           }
           return (value * rates[toUnit]) / rates[fromUnit];
       }
   };

   /**
    * Performs a generic conversion based on the converter type.
    * @param {string} converterType - The type of converter (e.g., 'length', 'currency').
    */
   async function performConversion(converterType) {
       const inputId = `${converterType}Input`;
       const fromSelectId = `${converterType}From`;
       const toSelectId = `${converterType}To`;
       const resultId = `${converterType}Result`;

       const value = getInputValue(inputId);
       if (value === null) {
           document.getElementById(resultId).innerText = ''; // Clear result if input is invalid
           return;
       }

       const fromUnit = document.getElementById(fromSelectId).value;
       const toUnit = document.getElementById(toSelectId).value;

       try {
           const performer = converterPerformers[converterType];
           if (!performer) {
               console.error(`No conversion performer found for type: ${converterType}`);
               showNotification('Conversion logic missing for this type.', 'danger');
               document.getElementById(resultId).innerText = 'Error';
               return;
           }

           const result = await performer(value, fromUnit, toUnit);

           const isCurrency = converterType === 'currency';
           const formattedResult = formatResult(result, isCurrency);
           document.getElementById(resultId).innerText = `Result: ${formattedResult} ${toUnit.toUpperCase()}`;
       } catch (error) {
           // Error handling is now primarily done in apiService, but re-throw if needed
           console.error(`Error during ${converterType} conversion:`, error);
           document.getElementById(resultId).innerText = 'Error';
           // showNotification(`Conversion failed for ${fromUnit} to ${toUnit}.`, 'danger'); // apiService handles this
       }
   }

   /**
    * Attaches all global event listeners for the converter hub.
    */
   function setupGlobalEventListeners() {
       // --- Input/Select Change Listeners ---
       document.addEventListener('input', function(event) {
           if (event.target.matches('.tab-pane input[type="number"],.tab-pane select')) {
               const activeTabPane = event.target.closest('.tab-pane.show.active');
               if (activeTabPane) {
                   const converterType = activeTabPane.id.replace('pills-', '');
                   performConversion(converterType);
               }
           }
       });

       // --- Button Click Listeners ---
       document.addEventListener('click', async function(event) {
           // Convert button
           if (event.target.matches('.convert-btn')) {
               const converterType = event.target.dataset.converterType;
               await performConversion(converterType);
           }

           // Copy button
           if (event.target.matches('.copy-btn')) {
               const resultId = event.target.dataset.resultId;
               const resultElement = document.getElementById(resultId);
               const valueToCopy = resultElement? resultElement.innerText.replace("Result: ", "").trim() : '';

               if (!valueToCopy) {
                   showNotification("⚠ Nothing to copy!", 'warning');
                   return;
               }

               navigator.clipboard.writeText(valueToCopy)
                .catch(() => showNotification("❌ Copy failed (check browser permissions)", 'danger'));
           }

           // Reset button
           if (event.target.matches('.reset-btn')) {
               const sectionId = event.target.dataset.sectionId;
               resetSection(sectionId);
           }

           // Swap Units button
           if (event.target.matches('.swap-units-btn')) {
               const fromId = event.target.dataset.fromId;
               const toId = event.target.dataset.toId;
               swapUnitSelections(fromId, toId);

               // Trigger conversion after swapping
               const activeTabPane = event.target.closest('.tab-pane.show.active');
               if (activeTabPane) {
                   const converterType = activeTabPane.id.replace('pills-', '');
                   performConversion(converterType);
               }
           }

           // Tab button (to trigger conversion when a new tab is selected)
           if (event.target.matches('.nav-pills.nav-link')) {
               const converterType = event.target.dataset.converterType;
               if (converterType) {
                   // Delay conversion slightly to allow Bootstrap's tab activation to complete
                   setTimeout(() => performConversion(converterType), 100);
               }
           }
       });
   }

   /**
    * Initializes the converter controller, setting up event listeners and initial conversion.
    */
   export function initializeConverterController() {
       setupGlobalEventListeners();

       // Trigger initial conversion for the active tab (Length by default)
       const activeTabButton = document.querySelector('.nav-pills.nav-link.active');
       if (activeTabButton) {
           const converterType = activeTabButton.dataset.converterType;
           performConversion(converterType);
       }
   }