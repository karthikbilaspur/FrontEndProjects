const minSlider = document.getElementById('min-slider');
const maxSlider = document.getElementById('max-slider');
const minThumb = document.querySelector('.min-thumb');
const maxThumb = document.querySelector('.max-thumb');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const minDisplay = document.getElementById('min-display');
const maxDisplay = document.getElementById('max-display');
const resetButton = document.getElementById('reset-button');
const tooltip = document.getElementById('tooltip');

let minPrice = 0;
let maxPrice = 10000;

const updateMinThumb = () => {
    minThumb.style.left = `${(minPrice / 10000) * 100}%`;
    minPriceInput.value = minPrice;
    minDisplay.textContent = `₹${minPrice}`;
    minThumb.setAttribute('aria-valuenow', minPrice);
};

const updateMaxThumb = () => {
    maxThumb.style.right = `${100 - (maxPrice / 10000) * 100}%`;
    maxPriceInput.value = maxPrice;
    maxDisplay.textContent = `₹${maxPrice}`;
    maxThumb.setAttribute('aria-valuenow', maxPrice);
};

minSlider.addEventListener('input', () => {
    minPrice = parseInt(minSlider.value);
    updateMinThumb();
    if (minPrice > maxPrice) {
        maxPrice = minPrice;
        maxSlider.value = maxPrice;
        updateMaxThumb();
    }
    showTooltip(minThumb, minPrice);
});

maxSlider.addEventListener('input', () => {
    maxPrice = parseInt(maxSlider.value);
    updateMaxThumb();
    if (maxPrice < minPrice) {
        minPrice = maxPrice;
        minSlider.value = minPrice;
        updateMinThumb();
    }
    showTooltip(maxThumb, maxPrice);
});

minPriceInput.addEventListener('input', () => {
    minPrice = parseInt(minPriceInput.value);
    minSlider.value = minPrice;
    updateMinThumb();
});

maxPriceInput.addEventListener('input', () => {
    maxPrice = parseInt(maxPriceInput.value);
    maxSlider.value = maxPrice;
    updateMaxThumb();
});

resetButton.addEventListener('click', () => {
    minPrice = 0;
    maxPrice = 10000;
    minSlider.value = minPrice;
    maxSlider.value = maxPrice;
    updateMinThumb();
    updateMaxThumb();
});

const showTooltip = (thumb, price) => {
    tooltip.textContent = `₹${price}`;
    tooltip.style.display = 'block';
    const thumbRect = thumb.getBoundingClientRect();
    tooltip.style.top = `${thumbRect.top - 30}px`;
    tooltip.style.left = `${thumbRect.left + (thumbRect.width / 2) - (tooltip.offsetWidth / 2)}px`;
};

minThumb.addEventListener('mouseover', () => showTooltip(minThumb, minPrice));
minThumb.addEventListener('mouseout', () => tooltip.style.display = 'none');
maxThumb.addEventListener('mouseover', () => showTooltip(maxThumb, maxPrice));
maxThumb.addEventListener('mouseout', () => tooltip.style.display = 'none');

// Initialize thumbs
updateMinThumb();
updateMaxThumb();