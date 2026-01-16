import React from 'react';
import { formatInput } from '../utils/inputFormatter';

const CardInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    const formattedValue = formatInput(e.target.value);
    onChange(formattedValue);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Enter credit card number"
      aria-label="Credit card number"
    />
  );
};

export default CardInput;