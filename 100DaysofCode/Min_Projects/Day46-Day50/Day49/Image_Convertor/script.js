// Get elements
const inputImage = document.getElementById('input-image');
const outputFormat = document.getElementById('output-format');
const resizeOption = document.getElementById('resize-option');
const customSizeGroup = document.getElementById('custom-size-group');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('quality-value');
const watermarkInput = document.getElementById('watermark');
const rotateInput = document.getElementById('rotate');
const flipInput = document.getElementById('flip');
const cropInput = document.getElementById('crop');
const compressInput = document.getElementById('compress');
const convertBtn = document.getElementById('convert-btn');
const imagePreview = document.getElementById('image-preview');
const downloadLink = document.getElementById('download-link');
const progressBar = document.getElementById('progress-bar');

// API endpoint
const apiEndpoint = 'https://api.imgbb.com/1/upload';

// API key
const apiKey = 'YOUR_API_KEY_HERE';

// Image files
let imageFiles = [];

// Event listeners
inputImage.addEventListener('change', handleImageChange);
resizeOption.addEventListener('change', handleResizeOptionChange);
qualityInput.addEventListener('input', handleQualityInput);
convertBtn.addEventListener('click', handleConvertBtnClick);

// Functions
async function handleImageChange(e) {
  try {
    imageFiles = e.target.files;
    if (imageFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.innerHTML = `<img src="${reader.result}" alt="Image Preview">`;
      };
      reader.readAsDataURL(imageFiles[0]);
    }
  } catch (error) {
    console.error('Error handling image change:', error);
    alert('Error handling image change');
  }
}

function handleResizeOptionChange() {
  try {
    customSizeGroup.style.display = resizeOption.value === 'custom' ? 'block' : 'none';
  } catch (error) {
    console.error('Error handling resize option change:', error);
    alert('Error handling resize option change');
  }
}

function handleQualityInput() {
  try {
    qualityValue.textContent = `${qualityInput.value}%`;
  } catch (error) {
    console.error('Error handling quality input:', error);
    alert('Error handling quality input');
  }
}

async function handleConvertBtnClick(e) {
  try {
    e.preventDefault();
    if (!imageFiles || imageFiles.length === 0) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFiles[0]);
    formData.append('key', apiKey);

    // Apply transformations
    const transformations = applyTransformations();
    formData.append('transformations', JSON.stringify(transformations));

    // Send request to API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    // Get image URL
    const imageUrl = data.data.url;

    // Display download link
    downloadLink.innerHTML = `<a href="${imageUrl}" download="output.${outputFormat.value}">Download Image</a>`;
  } catch (error) {
    console.error('Error converting image:', error);
    alert('Error converting image');
  }
}

function applyTransformations() {
  try {
    const transformations = {
      resize: {},
      watermark: {},
      rotate: {},
      flip: {},
      crop: {},
      compress: {},
    };

    if (resizeOption.value === 'custom') {
      transformations.resize.width = parseInt(widthInput.value);
      transformations.resize.height = parseInt(heightInput.value);
    }

    if (watermarkInput.value) {
      transformations.watermark.image = watermarkInput.value;
    }

    if (rotateInput.value) {
      transformations.rotate.degrees = parseInt(rotateInput.value);
    }

    if (flipInput.value) {
      transformations.flip.direction = flipInput.value;
    }

    if (cropInput.value) {
      const cropValues = cropInput.value.split(',').map(Number);
      if (cropValues.length === 4 && cropValues.every(Number.isFinite)) {
        transformations.crop.left = cropValues[0];
        transformations.crop.top = cropValues[1];
        transformations.crop.width = cropValues[2];
        transformations.crop.height = cropValues[3];
      } else {
        alert('Invalid crop value. Please use the format "x,y,w,h"');
      }
    }

    if (compressInput.value) {
      transformations.compress.quality = parseInt(compressInput.value);
    }

    return transformations;
  } catch (error) {
    console.error('Error applying transformations:', error);
    alert('Error applying transformations');
  }
}

// Drag-and-drop image upload
document.addEventListener('dragover', (e) => {
  try {
    e.preventDefault();
  } catch (error) {
    console.error('Error handling drag-over:', error);
  }
});

document.addEventListener('drop', (e) => {
  try {
    e.preventDefault();
    const files = e.dataTransfer.files;
    inputImage.files = files;
    handleImageChange({ target: inputImage });
  } catch (error) {
    console.error('Error handling drop:', error);
  }
});