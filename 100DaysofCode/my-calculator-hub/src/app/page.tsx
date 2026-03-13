// src/app/page.tsx
'use client'; // This is the main client component for our interactive hub

import React, { useState, useCallback } from 'react';
import CalculatorSelector from '../components/CalculatorSelector';
// import AgeCalculator from '../components/calculators/AgeCalculator';
// import BMICalculator from '../components/calculators/BMICalculator';
// import TipCalculator from '../components/calculators/TipCalculator';
// import AreaCalculator from '../components/calculators/AreaCalculator';
// import TemperatureConverter from '../components/calculators/TemperatureConverter';

// Placeholder components for now, we'll create these next
function PlaceholderCalculator() {
  return (
    <div className="text-center p-8 text-gray-500 text-xl">
      Please select a calculator to get started!
    </div>
  );
}

export default function HomePage() {
  const [selectedCalculator, setSelectedCalculator] = useState('');

  // Function to reset the active calculator's state when switching
  // This will be important when we build out the individual calculators
  const resetCalculator = useCallback((calculatorType: string) => {
    // For now, we'll just set the selected calculator.
    // When individual calculators are built, they'll have their own internal reset logic
    // that can be triggered or they will simply re-mount when selectedCalculator changes.
    setSelectedCalculator(calculatorType);
  }, []);

  const handleCalculatorSelect = (type: string) => {
    resetCalculator(type);
  };

  return (
    <>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-green-700 mb-8 sm:mb-10 animate-fade-in">
        Your All-in-One Calculator Hub!
      </h1>

      <CalculatorSelector
        onSelect={handleCalculatorSelect}
        selectedCalculator={selectedCalculator}
      />

      <div className="mt-8">
        {/* {selectedCalculator === 'age' && <AgeCalculator />} */}
        {/* {selectedCalculator === 'bmi' && <BMICalculator />} */}
        {/* {selectedCalculator === 'tip' && <TipCalculator />} */}
        {/* {selectedCalculator === 'area' && <AreaCalculator />} */}
        {/* {selectedCalculator === 'temperature' && <TemperatureConverter />} */}

        {!selectedCalculator && <PlaceholderCalculator />}
      </div>
    </>
  );
}