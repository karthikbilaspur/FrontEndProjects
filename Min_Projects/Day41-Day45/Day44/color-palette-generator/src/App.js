import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import PaletteContainer from './components/PaletteContainer';
import SavedPalettes from './components/SavedPalettes';

function App() {
  const [colors, setColors] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [scheme, setScheme] = useState('random');
  const [baseColor, setBaseColor] = useState('#ffffff');
  const [lockedColors, setLockedColors] = useState([]);

  const generateRandomColor = useCallback(() => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  }, []);

  const generateColorScheme = useCallback((scheme, baseColor) => {
    const colors = [];
    const baseHSL = hexToHSL(baseColor);

    switch (scheme) {
      case 'monochromatic':
        for (let i = 0; i < 5; i++) {
          colors.push(hslToHex(baseHSL.h, baseHSL.s, baseHSL.l + (i * 10) % 100));
        }
        break;
      case 'complementary':
        colors.push(baseColor);
        for (let i = 1; i < 5; i++) {
          colors.push(hslToHex((baseHSL.h + (i * 180 / (5 - 1))) % 360, baseHSL.s, baseHSL.l));
        }
        break;
      case 'analogous':
        colors.push(baseColor);
        for (let i = 1; i < 5; i++) {
          colors.push(hslToHex((baseHSL.h + (i * 30)) % 360, baseHSL.s, baseHSL.l));
        }
        break;
      default:
        colors.push(baseColor);
        for (let i = 1; i < 5; i++) {
          colors.push(generateRandomColor());
        }
    }

    return colors;
  }, [generateRandomColor]);

  const hexToHSL = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      throw new Error('Invalid hex color');
    }
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
        default:
          h = 0;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return `#${Math.round(f(0) * 255).toString(16).padStart(2, '0')}${Math.round(f(8) * 255).toString(16).padStart(2, '0')}${Math.round(f(4) * 255).toString(16).padStart(2, '0')}`;
  };

  const generatePalette = useCallback(() => {
    let newColors;
    if (scheme === 'random') {
      newColors = Array(5).fill().map(() => generateRandomColor());
    } else {
      newColors = generateColorScheme(scheme, baseColor);
    }
    // Replace unlocked colors with new colors
    newColors = newColors.map((color, index) => lockedColors.includes(index) ? colors[index] : color);
    setColors(newColors);
  }, [scheme, baseColor, lockedColors, colors, generateColorScheme, generateRandomColor]);

  useEffect(() => {
    generatePalette();
  }, [scheme, baseColor, lockedColors, generatePalette]);

  const savePalette = () => {
    const newPalette = [...colors];
    setSavedPalettes([...savedPalettes, newPalette]);
  };

  const handleSchemeChange = (e) => {
    setScheme(e.target.value);
  };

  const handleBaseColorChange = (e) => {
    setBaseColor(e.target.value);
  };

  const handleLock = (index) => {
    if (lockedColors.includes(index)) {
      setLockedColors(lockedColors.filter((i) => i !== index));
    } else {
      setLockedColors([...lockedColors, index]);
    }
  };

  return (
    <div className="container">
      <h1>Color Palette Generator</h1>
      <button onClick={generatePalette}>Generate Palette</button>
      <select value={scheme} onChange={handleSchemeChange}>
        <option value="random">Random</option>
        <option value="monochromatic">Monochromatic</option>
        <option value="complementary">Complementary</option>
        <option value="analogous">Analogous</option>
      </select>
      <input type="color" value={baseColor} onChange={handleBaseColorChange} />
      <PaletteContainer colors={colors} onLock={handleLock} lockedColors={lockedColors} />
      <button onClick={savePalette}>Save Palette</button>
      <SavedPalettes savedPalettes={savedPalettes} />
    </div>
  );
}

export default App;