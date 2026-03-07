// main.js
        import { initTooltips, initToast, showNotification } from './utils.js';
        import { initializeConverterController } from './converterController.js';
// Global Bootstrap instance for Toast.
// We'll manage this in utils.js now, but keep the conceptual variable for clarity if needed.
let bsToast;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded. Initializing app...');

    // Initialize Bootstrap tooltips and Tippy.js tooltips
    initTooltips();

    // Initialize Bootstrap Toast once
    bsToast = initToast(); // Store the Bootstrap Toast instance if needed elsewhere

    // Initialize the main converter logic
    initializeConverterController();

    // Show a welcome notification
    showNotification("Welcome to the Converter Hub!", 'primary');
});