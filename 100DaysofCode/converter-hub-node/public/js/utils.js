// utils.js
let bsToastInstance; // Global instance for the Bootstrap Toast

/**
  * Initializes Bootstrap tooltips and Tippy.js tooltips.
 */
export function initTooltips() {
    // Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Tippy.js for copy/reset buttons
    tippy('.copy-btn', {
        content: 'Copied!',
        trigger: 'click',
        theme: 'success',
        placement: 'top',
        arrow: true,
        animation: 'fade',
        onShow(instance) {
            setTimeout(() => instance.hide(), 1000); // Hide after 1 second
        }
    });

    tippy('.reset-btn', {
        content: 'Reset!',
        trigger: 'click',
        theme: 'danger',
        placement: 'top',
        arrow: true,
        animation: 'fade',
        onShow(instance) {
            setTimeout(() => instance.hide(), 1000); // Hide after 1 second
        }
    });
}

/**
  * Initializes and returns the Bootstrap Toast instance.
  * @returns {bootstrap.Toast} The Bootstrap Toast instance.
 */
export function initToast() {
    const toastElement = document.getElementById('liveToast');
    bsToastInstance = new bootstrap.Toast(toastElement);
    return bsToastInstance;
}

/**
  * Displays a Bootstrap toast notification.
  * @param {string} message - The message to display.
  * @param {string} [type='primary'] - The type of toast (e.g., 'primary', 'success', 'danger', 'info', 'warning').
 */
export function showNotification(message, type = 'primary') {
    if (!bsToastInstance) {
        console.warn('Toast not initialized. Initializing now.');
        initToast();
    }
    const toastElement = document.getElementById('liveToast');
    const toastBody = toastElement.querySelector('.toast-body');

    toastBody.textContent = message;
    // Update background color dynamically, ensure text-bg class is set for custom CSS
    toastElement.className = `toast align-items-center text-bg-${type} border-0`;

    bsToastInstance.show();
}

/**
  * Validates a numerical input field and provides visual feedback.
  * @param {string} inputId - The ID of the input element.
  * @returns {number|null} The parsed float value if valid, otherwise null.
 */
export function getInputValue(inputId) {
    const inputElement = document.getElementById(inputId);
    const value = parseFloat(inputElement.value);

    if (isNaN(value)) {
        showNotification("⚠ Please enter a valid number", 'danger');
        inputElement.classList.add('is-invalid');
        return null;
    } else {
        inputElement.classList.remove('is-invalid');
        return value;
    }
}

/**
  * Formats a numerical result using Numeral.js with dynamic precision.
  * @param {number} value - The number to format.
  * @param {boolean} [isCurrency=false] - True if the value is a currency, for specific formatting.
  * @returns {string} The formatted number.
 */
export function formatResult(value, isCurrency = false) {
    if (isCurrency) {
        return numeral(value).format('0,0.00'); // Always 2 decimal places for currency
    }
    if (Math.abs(value) < 0.0001 && value!== 0) {
        return numeral(value).format('0,0.00000000'); // More precision for very small numbers
    } else if (Math.abs(value) < 100) {
        return numeral(value).format('0,0.[00000]'); // Keep more precision for smaller numbers
    } else {
        return numeral(value).format('0,0.[0000]'); // Less precision for larger numbers
    }
}

/**
  * Swaps the selected values between two dropdowns.
  * @param {string} fromId - The ID of the "from" select element.
  * @param {string} toId - The ID of the "to" select element.
 */
export function swapUnitSelections(fromId, toId) {
    const fromSelect = document.getElementById(fromId);
    const toSelect = document.getElementById(toId);

    if (fromSelect && toSelect) {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
    } else {
        console.error(`Could not find select elements with IDs: ${fromId}, ${toId}`);
    }
}

/**
  * Clears the input and result for a given section.
  * @param {string} sectionId - The base ID of the section (e.g., 'length').
 */
export function resetSection(sectionId) {
    const inputElement = document.getElementById(sectionId + 'Input');
    const resultElement = document.getElementById(sectionId + 'Result');

    if (inputElement) {
        inputElement.value = '';
        inputElement.classList.remove('is-invalid'); // Clear validation feedback
    }
    if (resultElement) resultElement.innerText = '';
    showNotification(`Converter reset!`, 'info');
}