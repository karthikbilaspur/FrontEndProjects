import * as THREE from 'three'; // New: Import THREE for texture encoding/decoding

// New: Interface for FileReader result for better typing
// type DataURL = string;

export const downloadCanvasToImage = (fileName = "custom_shirt") => { // New: Optional fileName parameter
  const canvas = document.querySelector("canvas");
  if (!canvas) { // New: Basic error handling
    console.error("Canvas element not found for download.");
    return;
  }

  // New: Option to specify image format and quality
  const dataURL = canvas.toDataURL("image/png", 1.0); // Default to PNG, full quality

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = `${fileName}.png`; // New: Use dynamic fileName
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// New: Async/await for cleaner Promise usage
export const reader = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file) { // New: Basic error handling for no file
      reject(new Error("No file provided to reader."));
      return;
    }
    if (!file.type.startsWith('image/')) { // New: Basic file type validation
      reject(new Error("File is not an image."));
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error); // New: Handle FileReader errors
    fileReader.readAsDataURL(file);
  });
};

// New: Enhanced contrast calculation using Luma
// More robust for different color spaces and perceptual brightness
export const getContrastingColor = (colorHex) => { // Renamed 'color' to 'colorHex' for clarity
  if (!colorHex || typeof colorHex!== 'string' ||!/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(colorHex)) {
    console.warn('Invalid color hex provided, defaulting to black.');
    return 'black'; // New: Handle invalid input more gracefully
  }

  const hex = colorHex.startsWith('#')? colorHex.slice(1) : colorHex;
  let r, g, b;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return 'black'; // Should not happen with regex check, but as a fallback
  }

  // Calculate perceived brightness (Luma) - more accurate than simple average
  // ITU-R BT.709 standard for HDTV and sRGB
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Use a threshold for contrast (typically 0.5 for light/dark)
  return luma > 0.5? "black" : "white";
};

// New: Helper to encode image data for Three.js textures
// This function will ensure the texture is in sRGB for proper color display
export const encodeTexture = (dataURL) => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(dataURL);
  texture.encoding = THREE.sRGBEncoding; // Ensure sRGB encoding for correct color space
  texture.flipY = false; // Prevents texture from being loaded upside down
  return texture;
};