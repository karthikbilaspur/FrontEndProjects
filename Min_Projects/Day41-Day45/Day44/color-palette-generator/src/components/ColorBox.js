import React from 'react';

function ColorBox({ color, onLock, locked }) {
  return (
    <div className="color-box">
      <div className="color" style={{ backgroundColor: color }} />
      <div className="color-info">
        <span className="hex-value">{color.toUpperCase()}</span>
        <i className={`far fa-${locked ? 'lock' : 'lock-open'} lock-btn`} onClick={onLock} />
      </div>
    </div>
  );
}

export default ColorBox;