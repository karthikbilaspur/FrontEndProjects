import React from 'react';
import { SketchPicker } from 'react-color';
import { useSnapshot } from 'valtio';

import state from '../store';
// New: Import React-Color's ColorResult type for better typing (if using TypeScript)
// import { ColorResult } from 'react-color';

const ColorPicker = () => {
  const snap = useSnapshot(state);

  // New: Define some common color presets
  const presetColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', // Primary/Secondary
    '#FFFFFF', '#000000', '#C0C0C0', '#808080', '#A52A2A', '#800080', // Neutrals and common
    '#FF4500', '#FFA500', '#32CD32', '#4169E1', '#8A2BE2', '#DC143C' // More vibrant/popular
  ];

  return (
    <div
      className="absolute left-full ml-3 p-2 bg-white shadow-lg rounded-lg z-10" // Enhanced styling + z-index
      style={{ maxWidth: '220px' }} // New: Limit width for smaller screens
    >
      <SketchPicker
        color={snap.color}
        disableAlpha
        // New: Add preset colors
        presetColors={presetColors.map(color => ({ color: color, title: color }))} // Use an array of objects for preset colors
        onChange={(color) => state.color = color.hex}
        // New: Add manual HEX input (SketchPicker supports this out of the box)
        // You can also add more format support if needed, e.g., onChangeComplete
      />
      {/* New: Display current color hex code for confirmation */}
      <div className="mt-2 text-center text-gray-700 text-sm font-semibold">
        Current Color: <span className="uppercase">{snap.color}</span>
      </div>
    </div>
  );
};

export default ColorPicker;