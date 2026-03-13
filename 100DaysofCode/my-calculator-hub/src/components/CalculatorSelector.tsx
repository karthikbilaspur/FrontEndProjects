// src/components/CalculatorSelector.tsx
'use client';

import React from 'react';

interface CalculatorSelectorProps {
  onSelect: (calculatorType: string) => void;
  selectedCalculator: string;
}

const calculatorOptions = [
  { value: '', label: '--Select a calculator--' },
  { value: 'age', label: 'Age Calculator' },
  { value: 'bmi', label: 'BMI Calculator' },
  { value: 'tip', label: 'Tip Calculator' },
  { value: 'area', label: 'Multi-Shape Area Calculator' },
  { value: 'temperature', label: 'Temperature Converter' },
];

const CalculatorSelector: React.FC<CalculatorSelectorProps> = ({ onSelect, selectedCalculator }) => {
  return (
    <div className="calculator-selector text-center mb-10 p-6 bg-blue-50 rounded-xl shadow-inner">
      <label htmlFor="calculatorType" className="block text-xl font-bold text-indigo-800 mb-4">
        Choose a calculator:
      </label>
      <select
        id="calculatorType"
        onChange={(e) => onSelect(e.target.value)}
        value={selectedCalculator}
        className="w-full sm:w-2/3 md:w-1/2 p-3 sm:p-4 border border-blue-300 rounded-lg text-lg bg-white appearance-none cursor-pointer
                   focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200
                   bg-no-repeat bg-[right_15px_center] bg-[length:10px] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095.1a17.6%2017.6%200%200%200%205.4-12.9c0-5-1.8-9.3-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')]">
        {calculatorOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CalculatorSelector;