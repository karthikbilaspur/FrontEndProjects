import React from 'react';

function ColorInput({ color, onChange }) {
    return (
        <div>
            <input type="color" value={color} onChange={(e) => onChange(e.target.value)} />
            <input type="text" value={color} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

export default ColorInput;