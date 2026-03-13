// src/components/Shared/InputGroup.tsx
'use client';

import React from 'react';

interface InputGroupProps {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  step?: string;
  unitOptions?: { value: string; label: string }[];
  unitValue?: string;
  onUnitChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: boolean;
  min?: string; // <--- ADD THIS LINE
  max?: string; // <--- ADD THIS LINE
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  id,
  type = 'number',
  value,
  onChange,
  step = '0.1',
  unitOptions,
  unitValue,
  onUnitChange,
  error = false,
  min, // <--- ADD THIS LINE
  max, // <--- ADD THIS LINE
}) => {
  return (
    <div className="input-group flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-5 gap-2 sm:gap-4">
      <label htmlFor={id} className="w-full sm:w-36 font-semibold text-gray-700 text-base sm:text-lg">
        {label}:
      </label>
      <div className="flex-grow flex w-full sm:w-auto">
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          step={step}
          min={min} // <--- PASS THIS TO THE INPUT
          max={max} // <--- PASS THIS TO THE INPUT
          className={`flex-grow p-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200
                      ${error? 'border-red-500 ring-red-300' : 'border-gray-300'}`}
        />
        {unitOptions && onUnitChange && (
          <select
            id={`${id}Unit`}
            value={unitValue}
            onChange={onUnitChange}
            className="ml-2 p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 bg-white"
          >
            {unitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default InputGroup;