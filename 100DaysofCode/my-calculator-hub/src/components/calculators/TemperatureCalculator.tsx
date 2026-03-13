'use client';

import React, { useState, useCallback, useMemo } from 'react';
import InputGroup from '../Shared/InputGroup';
import DescriptionToggle from '../Shared/DescriptionToggle';

import {
  isValidNumber,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  celsiusToKelvin,
  kelvinToCelsius
} from '../../lib/utils';

type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';

const TemperatureConverter: React.FC = () => {
  const [celsiusInput, setCelsiusInput] = useState('');
  const [fahrenheitInput, setFahrenheitInput] = useState('');
  const [kelvinInput, setKelvinInput] = useState('');
  const [activeInput, setActiveInput] = useState<TemperatureUnit | null>(null);

  const performConversion = useCallback((unit: TemperatureUnit, valueStr: string) => {
    const parsedValue = parseFloat(valueStr);

    if (!valueStr || !isValidNumber(parsedValue)) {
      return { c: '', f: '', k: '', error: null };
    }

    let c: number | null = null;
    let f: number | null = null;
    let k: number | null = null;
    let error: TemperatureUnit | null = null;

    try {
      switch (unit) {
        case 'celsius':
          c = parsedValue;
          f = celsiusToFahrenheit(c);
          k = celsiusToKelvin(c);
          break;

        case 'fahrenheit':
          f = parsedValue;
          c = fahrenheitToCelsius(f);
          k = celsiusToKelvin(c);
          break;

        case 'kelvin':
          if (parsedValue < 0) {
            error = 'kelvin';
            return { c: 'Error', f: 'Error', k: valueStr, error };
          }

          k = parsedValue;
          c = kelvinToCelsius(k);
          f = celsiusToFahrenheit(c);
          break;
      }

      return {
        c: c !== null ? c.toFixed(2) : '',
        f: f !== null ? f.toFixed(2) : '',
        k: k !== null ? k.toFixed(2) : '',
        error
      };

    } catch (err) {
      console.error('Temperature conversion error:', err);
      return { c: 'Error', f: 'Error', k: 'Error', error: null };
    }

  }, []);

  const result = useMemo(() => {
    if (!activeInput) {
      return { c: '', f: '', k: '', error: null };
    }

    const inputMap = {
      celsius: celsiusInput,
      fahrenheit: fahrenheitInput,
      kelvin: kelvinInput
    };

    return performConversion(activeInput, inputMap[activeInput]);

  }, [activeInput, celsiusInput, fahrenheitInput, kelvinInput, performConversion]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, unit: TemperatureUnit) => {
      const value = e.target.value;

      if (unit === 'celsius') setCelsiusInput(value);
      if (unit === 'fahrenheit') setFahrenheitInput(value);
      if (unit === 'kelvin') setKelvinInput(value);

      setActiveInput(unit);
    },
    []
  );

  const resetCalculator = useCallback(() => {
    setCelsiusInput('');
    setFahrenheitInput('');
    setKelvinInput('');
    setActiveInput(null);
  }, []);

  return (
    <div className="calculator-section bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b-2 border-blue-500 pb-3">
        Temperature Converter
      </h2>

      <InputGroup
        label="Celsius"
        id="celsius"
        value={activeInput === 'celsius' ? celsiusInput : result.c}
        onChange={(e) => handleChange(e, 'celsius')}
        error={result.c === 'Error'}
      />

      <InputGroup
        label="Fahrenheit"
        id="fahrenheit"
        value={activeInput === 'fahrenheit' ? fahrenheitInput : result.f}
        onChange={(e) => handleChange(e, 'fahrenheit')}
        error={result.f === 'Error'}
      />

      <InputGroup
        label="Kelvin"
        id="kelvin"
        value={activeInput === 'kelvin' ? kelvinInput : result.k}
        onChange={(e) => handleChange(e, 'kelvin')}
        error={result.error === 'kelvin'}
      />

      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <button
          onClick={resetCalculator}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>

      <DescriptionToggle
        shortDescription="Convert temperatures between Celsius, Fahrenheit, and Kelvin instantly."
        fullDescription="Enter a value in any field and the other two will update automatically. Kelvin inputs are validated to ensure they are above absolute zero."
      />
    </div>
  );
};

export default TemperatureConverter;