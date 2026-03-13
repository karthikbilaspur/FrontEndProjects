import React from 'react';

function BoxStyle({
    size,
    border,
    radius,
    shadow,
    onSizeChange,
    onBorderChange,
    onRadiusChange,
    onShadowChange,
}) {
    return (
        <div>
            <label>Size:</label>
            <input type="range" min="50" max="500" value={size} onChange={onSizeChange} />
            <label>Border:</label>
            <input type="range" min="1" max="10" value={border} onChange={onBorderChange} />
            <label>Radius:</label>
            <input type="range" min="0" max="100" value={radius} onChange={onRadiusChange} />
            <label>Shadow:</label>
            <input type="range" min="0" max="20" value={shadow} onChange={onShadowChange} />
        </div>
    );
}

export default BoxStyle;