// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Centralized unit definitions
const unitCategories = {
  length: {
    base: 'meter',
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      mile: 1609.34,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
    },
  },
  weight: {
    base: 'kilogram',
    units: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      pound: 0.45359237, // More precise value
      ounce: 0.0283495231, // More precise value
      tonne: 1000,
    },
  },
  temperature: {
    base: 'celsius',
    units: {
      celsius: {
        toBase: (val) => val,
        fromBase: (val) => val,
      },
      fahrenheit: {
        toBase: (val) => (val - 32) * 5 / 9,
        fromBase: (val) => (val * 9 / 5) + 32,
      },
      kelvin: {
        toBase: (val) => val - 273.15,
        fromBase: (val) => val + 273.15,
      },
    },
  },
  volume: {
    base: 'liter',
    units: {
      liter: 1,
      milliliter: 0.001,
      gallon: 3.785411784,
      quart: 0.946352946,
      pint: 0.473176473,
      cup: 0.2365882365,
    },
  },
  time: {
    base: 'second',
    units: {
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2629800, // Approx (30.4375 days average)
      year: 31557600, // Approx (365.25 days average)
    },
  },
};

function App() {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [inputUnit, setInputUnit] = useState('meter');
  const [outputUnit, setOutputUnit] = useState('kilometer');
  const [errorMessage, setErrorMessage] = useState('');

  // Ref for input field to focus after clear/swap
  const inputRef = useRef(null);

  // Effect to reset units and clear values when category changes
  useEffect(() => {
    const category = unitCategories[selectedCategory];
    if (category) {
      const unitNames = Object.keys(category.units);
      setInputUnit(unitNames[0]);
      // Try to set a different unit for output, otherwise use the first one
      setOutputUnit(unitNames[1] && unitNames[1]!== unitNames[0]? unitNames[1] : unitNames[0]);
    }
    setInputValue('');
    setErrorMessage('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedCategory]);

  // Effect to perform conversion when relevant states change
  useEffect(() => {
    convertUnits();
  }, [inputValue, inputUnit, outputUnit, selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid numbers (including negative for temp)
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setInputValue(value);
      setErrorMessage(''); // Clear error message on new input
    } else {
      setErrorMessage('Please enter a valid number.');
    }
  };

  const convertUnits = () => {
    if (inputValue === '') {
      setOutputValue('');
      setErrorMessage('');
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setOutputValue('');
      // Error message already set by handleInputChange if invalid characters
      return;
    }

    const category = unitCategories[selectedCategory];
    if (!category) {
      setOutputValue('');
      setErrorMessage('Error: Invalid unit category selected.');
      return;
    }

    let result;
    if (selectedCategory === 'temperature') {
      const inputConversion = category.units[inputUnit];
      const outputConversion = category.units[outputUnit];

      if (!inputConversion ||!outputConversion) {
        setOutputValue('');
        setErrorMessage('Error: Invalid temperature unit.');
        return;
      }

      // Convert input to base (Celsius)
      const valueInBase = inputConversion.toBase(value);
      // Convert from base (Celsius) to output
      result = outputConversion.fromBase(valueInBase);

    } else { // For length, weight, volume, time
      const inputFactor = category.units[inputUnit];
      const outputFactor = category.units[outputUnit];

      if (!inputFactor ||!outputFactor) {
        setOutputValue('');
        setErrorMessage('Error: Invalid unit selected.');
        return;
      }
      // Convert input value to base unit, then convert from base unit to output unit
      result = (value * inputFactor) / outputFactor;
    }

    // Display result with more precision if needed, but round for readability
    const formattedResult = Number(result.toFixed(6)); // Convert back to number to remove trailing zeros
    setOutputValue(formattedResult.toString());
    setErrorMessage(''); // Clear any previous errors if conversion was successful
  };

  const swapUnits = () => {
    // Swap input and output units
    const tempUnit = inputUnit;
    setInputUnit(outputUnit);
    setOutputUnit(tempUnit);

    // Swap input and output values
    const tempValue = inputValue;
    setInputValue(outputValue);
    setOutputValue(tempValue);

    // Focus back on the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearInput = () => {
    setInputValue('');
    setOutputValue('');
    setErrorMessage('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const currentUnits = unitCategories[selectedCategory]?.units || {};

  return (
    <div className="unit-converter-app">
      <h1>Unit Converter</h1>

      <div className="converter-card">
        <div className="input-group category-select-group">
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {Object.keys(unitCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="conversion-row">
          <div className="input-section">
            <div className="input-group">
              <label htmlFor="input-value">Input Value:</label>
              <input
                ref={inputRef}
                type="text"
                id="input-value"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter value"
              />
              <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)}>
                {Object.keys(currentUnits).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <div className="action-buttons">
            <button className="swap-button" onClick={swapUnits} aria-label="Swap units">
              &#8646; {/* Unicode for up-down arrow */}
            </button>
            <button className="clear-button" onClick={clearInput} aria-label="Clear input">
              &#x2715; {/* Unicode for multiplication sign / X */}
            </button>
          </div>

          <div className="output-section">
            <div className="input-group"> {/* Using input-group for consistent styling */}
              <label htmlFor="output-value">Output Value:</label>
              <input
                type="text"
                id="output-value"
                value={outputValue}
                readOnly
                placeholder="Result"
              />
              <select value={outputUnit} onChange={(e) => setOutputUnit(e.target.value)}>
                {Object.keys(currentUnits).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;