import React, { useState } from 'react';
import './ColorBox.css';
import ColorInput from './ColorInput';
import BoxStyle from './BoxStyle';

function ColorBox() {
    const [color, setColor] = useState('#ffffff');
    const [boxSize, setBoxSize] = useState(200);
    const [boxBorder, setBoxBorder] = useState(1);
    const [boxRadius, setBoxRadius] = useState(0);
    const [boxShadow, setBoxShadow] = useState(0);

    const handleColorChange = (newColor) => {
        setColor(newColor);
    };

    const handleSizeChange = (e) => {
        setBoxSize(e.target.value);
    };

    const handleBorderChange = (e) => {
        setBoxBorder(e.target.value);
    };

    const handleRadiusChange = (e) => {
        setBoxRadius(e.target.value);
    };

    const handleShadowChange = (e) => {
        setBoxShadow(e.target.value);
    };

    return (
        <div className="container">
            <h1>Color Box App</h1>
            <ColorInput color={color} onChange={handleColorChange} />
            <BoxStyle
                size={boxSize}
                border={boxBorder}
                radius={boxRadius}
                shadow={boxShadow}
                onSizeChange={handleSizeChange}
                onBorderChange={handleBorderChange}
                onRadiusChange={handleRadiusChange}
                onShadowChange={handleShadowChange}
            />
            <div
                className="box"
                style={{
                    backgroundColor: color,
                    width: `${boxSize}px`,
                    height: `${boxSize}px`,
                    border: `${boxBorder}px solid #000`,
                    borderRadius: `${boxRadius}px`,
                    boxShadow: `0px 0px ${boxShadow}px rgba(0, 0, 0, 0.5)`,
                }}
            ></div>
        </div>
    );
}

export default ColorBox;