const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.querySelector(".palette-container");
const schemeSelect = document.getElementById("scheme-select");
const colorInput = document.getElementById("color-input");
const saveBtn = document.getElementById("save-btn");
const shareBtn = document.getElementById("share-btn");
const savedPalettesList = document.getElementById("saved-palettes-list");
const numColors = 5;
let savedPalettes = JSON.parse(localStorage.getItem("savedPalettes")) || [];

generateBtn.addEventListener("click", generatePalette);
paletteContainer.addEventListener("click", handleColorBoxClick);
schemeSelect.addEventListener("change", generatePalette);
colorInput.addEventListener("input", generatePalette);
saveBtn.addEventListener("click", savePalette);
shareBtn.addEventListener("click", sharePalette);

function handleColorBoxClick(e) {
  if (e.target.classList.contains("copy-btn")) {
    const hexValue = e.target.previousElementSibling.textContent;
    copyToClipboard(hexValue, e.target);
  } else if (e.target.classList.contains("color")) {
    const hexValue = e.target.nextElementSibling.querySelector(".hex-value").textContent;
    copyToClipboard(hexValue, e.target.nextElementSibling.querySelector(".copy-btn"));
  } else if (e.target.classList.contains("lock-btn")) {
    e.target.classList.toggle("locked");
  }
}

function copyToClipboard(hexValue, element) {
  navigator.clipboard
    .writeText(hexValue)
    .then(() => showCopySuccess(element))
    .catch((err) => console.log(err));
}

function showCopySuccess(element) {
  element.classList.remove("far", "fa-copy");
  element.classList.add("fas", "fa-check");
  element.style.color = "#48bb78";

  setTimeout(() => {
    element.classList.remove("fas", "fa-check");
    element.classList.add("far", "fa-copy");
    element.style.color = "";
  }, 1500);
}

function generatePalette() {
  const scheme = schemeSelect.value;
  const baseColor = colorInput.value;
  let colors;

  if (scheme === "random") {
    colors = Array(numColors).fill().map(() => generateRandomColor());
  } else {
    colors = generateColorScheme(scheme, baseColor);
  }

  updatePaletteDisplay(colors);
}

function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function generateColorScheme(scheme, baseColor) {
  const colors = [];
  const baseHSL = hexToHSL(baseColor);

  switch (scheme) {
    case "monochromatic":
      for (let i = 0; i < numColors; i++) {
        colors.push(hslToHex(baseHSL.h, baseHSL.s, baseHSL.l + (i * 10) % 100));
      }
      break;
    case "complementary":
      colors.push(baseColor);
      for (let i = 1; i < numColors; i++) {
        colors.push(hslToHex((baseHSL.h + (i * 180 / (numColors - 1))) % 360, baseHSL.s, baseHSL.l));
      }
      break;
    case "analogous":
      colors.push(baseColor);
      for (let i = 1; i < numColors; i++) {
        colors.push(hslToHex((baseHSL.h + (i * 30)) % 360, baseHSL.s, baseHSL.l));
      }
      break;
    default:
      colors.push(baseColor);
      for (let i = 1; i < numColors; i++) {
        colors.push(generateRandomColor());
      }
  }

  return colors;
}

function hexToHSL(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return `#${Math.round(f(0) * 255).toString(16).padStart(2, '0')}${Math.round(f(8) * 255).toString(16).padStart(2, '0')}${Math.round(f(4) * 255).toString(16).padStart(2, '0')}`;
}

function updatePaletteDisplay(colors) {
  paletteContainer.innerHTML = colors.map((color, index) => `
    <div class="color-box">
      <div class="color" style="background-color: ${color}"></div>
      <div class="color-info">
        <span class="hex-value">${color.toUpperCase()}</span>
        <i class="far fa-copy copy-btn" title="Copy to clipboard"></i>
        <i class="far fa-lock lock-btn" title="Lock color"></i>
      </div>
    </div>
  `).join('');
}

function savePalette() {
  const colors = Array.from(paletteContainer.children).map((box) => {
    return box.querySelector(".hex-value").textContent;
  });
  savedPalettes.push(colors);
  localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));
  updateSavedPalettesList();
}

function updateSavedPalettesList() {
  savedPalettesList.innerHTML = savedPalettes.map((palette, index) => `
    <li>
      <span>${palette.join(", ")}</span>
      <button class="delete-btn" data-index="${index}">Delete</button>
    </li>
  `).join('');
}

function sharePalette() {
  const colors = Array.from(paletteContainer.children).map((box) => {
    return box.querySelector(".hex-value").textContent;
  });
  const paletteString = colors.join(",");
  const url = `https://www.example.com/palette/${paletteString}`;
  const text = `Check out this color palette: ${paletteString}`;
  const shareData = {
    title: "Color Palette",
    text: text,
    url: url,
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    alert("Sharing not supported in this browser.");
  }
}

generatePalette();
updateSavedPalettesList();