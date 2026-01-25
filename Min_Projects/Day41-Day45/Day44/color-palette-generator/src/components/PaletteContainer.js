import React from 'react';
import ColorBox from './ColorBox';

function PaletteContainer({ colors, onLock, lockedColors }) {
  return (
    <div className="palette-container">
      {colors.map((color, index) => (
        <ColorBox key={index} color={color} onLock={() => onLock(index)} locked={lockedColors.includes(index)} />
      ))}
    </div>
  );
}

export default PaletteContainer;