class AspectRatioCounter {
  constructor() {
    this.widthInput = document.getElementById('width');
    this.heightInput = document.getElementById('height');
    this.aspectRatioElement = document.getElementById('aspect-ratio');
    this.incrementWidthButton = document.getElementById('increment-width');
    this.decrementWidthButton = document.getElementById('decrement-width');
    this.incrementHeightButton = document.getElementById('increment-height');
    this.decrementHeightButton = document.getElementById('decrement-height');
    this.resetButton = document.getElementById('reset');
    this.applyAspectRatioButton = document.getElementById('apply-aspect-ratio');
    this.aspectRatioPresets = document.getElementById('aspect-ratio-presets');
    this.errorMessageElement = document.getElementById('error-message');
    this.calculatePixelDensityButton = document.getElementById('calculate-pixel-density');
    this.pixelDensityInput = document.getElementById('pixel-density');
    this.pixelDensityResultElement = document.getElementById('pixel-density-result');
    this.calculateFileSizeButton = document.getElementById('calculate-file-size');
    this.fileSizeInput = document.getElementById('file-size');
    this.fileSizeResultElement = document.getElementById('file-size-result');

    this.width = 1920;
    this.height = 1080;
    this.aspectRatio = this.calculateAspectRatio();

    this.addEventListeners();
    this.updateAspectRatio();
  }

  calculateAspectRatio() {
    return this.width / this.height;
  }

  updateAspectRatio() {
    this.aspectRatioElement.innerText = `Aspect Ratio: ${this.aspectRatio.toFixed(2)} (${this.width}:${this.height})`;
  }

  addEventListeners() {
    this.incrementWidthButton.addEventListener('click', () => {
      this.width++;
      this.updateHeight();
    });

    this.decrementWidthButton.addEventListener('click', () => {
      if (this.width > 1) {
        this.width--;
        this.updateHeight();
      }
    });

    this.incrementHeightButton.addEventListener('click', () => {
      this.height++;
      this.updateWidth();
    });

    this.decrementHeightButton.addEventListener('click', () => {
      if (this.height > 1) {
        this.height--;
        this.updateWidth();
      }
    });

    this.resetButton.addEventListener('click', () => {
      this.width = 1920;
      this.height = 1080;
      this.aspectRatio = this.calculateAspectRatio();
      this.updateInputs();
    });

    this.applyAspectRatioButton.addEventListener('click', () => {
      const selectedAspectRatio = this.aspectRatioPresets.value;
      const [widthRatio, heightRatio] = selectedAspectRatio.split(':').map(Number);
      this.aspectRatio = widthRatio / heightRatio;
      this.updateHeight();
    });

    this.widthInput.addEventListener('input', () => {
      try {
        this.width = parseInt(this.widthInput.value);
        if (isNaN(this.width) || this.width <= 0) {
          throw new Error('Invalid width');
        }
        this.updateHeight();
      } catch (error) {
        this.errorMessageElement.innerText = 'Invalid width';
      }
    });

    this.heightInput.addEventListener('input', () => {
      try {
        this.height = parseInt(this.heightInput.value);
        if (isNaN(this.height) || this.height <= 0) {
          throw new Error('Invalid height');
        }
        this.updateWidth();
      } catch (error) {
        this.errorMessageElement.innerText = 'Invalid height';
      }
    });

    this.calculatePixelDensityButton.addEventListener('click', () => {
      const pixelDensity = parseFloat(this.pixelDensityInput.value);
      if (isNaN(pixelDensity) || pixelDensity <= 0) {
        this.pixelDensityResultElement.innerText = 'Invalid pixel density';
        return;
      }
      const diagonal = Math.sqrt(this.width ** 2 + this.height ** 2);
      const screenSize = diagonal / pixelDensity;
      this.pixelDensityResultElement.innerText = `Screen size: ${screenSize.toFixed(2)} inches`;
    });

    this.calculateFileSizeButton.addEventListener('click', () => {
      const fileSize = parseFloat(this.fileSizeInput.value);
      if (isNaN(fileSize) || fileSize <= 0) {
        this.fileSizeResultElement.innerText = 'Invalid file size';
        return;
      }
      const fileSizeInBytes = fileSize * 1024 * 1024;
      const bitsPerPixel = 24;
      const totalPixels = this.width * this.height;
      const totalBits = totalPixels * bitsPerPixel;
      const totalBytes = totalBits / 8;
      const compressionRatio = fileSizeInBytes / totalBytes;
      this.fileSizeResultElement.innerText = `Compression ratio: ${compressionRatio.toFixed(2)}`;
    });
  }

  updateWidth() {
    this.width = Math.round(this.height * this.aspectRatio);
    this.updateInputs();
  }

  updateHeight() {
    this.height = Math.round(this.width / this.aspectRatio);
    this.updateInputs();
  }

  updateInputs() {
    this.widthInput.value = this.width;
    this.heightInput.value = this.height;
    this.aspectRatio = this.calculateAspectRatio();
    this.updateAspectRatio();
    this.errorMessageElement.innerText = '';
  }
}

const aspectRatioCounter = new AspectRatioCounter();