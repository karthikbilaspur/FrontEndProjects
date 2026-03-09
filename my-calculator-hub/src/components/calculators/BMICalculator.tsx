// src/components/calculators/BMICalculator.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import InputGroup from '../Shared/InputGroup';
import DescriptionToggle from '../Shared/DescriptionToggle';
import { isValidNumber, convertLbsToKg, convertInchesToCm } from '../../lib/utils';

type WeightUnit = 'kg' | 'lbs';
type HeightUnit = 'cm' | 'inches';

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [height, setHeight] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [bmiResult, setBmiResult] = useState<string>('');
  const [bmiCategory, setBmiCategory] = useState<string>('');
  const [weightError, setWeightError] = useState<boolean>(false);
  const [heightError, setHeightError] = useState<boolean>(false);

  const weightUnitOptions = useMemo(() => [
    { value: 'kg', label: 'kg' },
    { value: 'lbs', label: 'lbs' },
  ], []);

  const heightUnitOptions = useMemo(() => [
    { value: 'cm', label: 'cm' },
    { value: 'inches', label: 'inches' },
  ], []);

  const calculateBMI = useCallback(() => {
    setWeightError(false);
    setHeightError(false);
    setBmiResult('');
    setBmiCategory('');

    let parsedWeight = parseFloat(weight);
    let parsedHeight = parseFloat(height);

    if (!isValidNumber(parsedWeight) || parsedWeight <= 0) {
      setBmiResult('Error: Please enter a valid positive weight.');
      setWeightError(true);
      return;
    }
    if (!isValidNumber(parsedHeight) || parsedHeight <= 0) {
      setBmiResult('Error: Please enter a valid positive height.');
      setHeightError(true);
      return;
    }

    // Convert weight to kg
    if (weightUnit === 'lbs') {
      parsedWeight = convertLbsToKg(parsedWeight);
    }

    // Convert height to meters
    if (heightUnit === 'inches') {
      parsedHeight = convertInchesToCm(parsedHeight);
    }
    const heightInMeters = parsedHeight / 100; // Convert cm to meters

    const bmi = parsedWeight / (heightInMeters * heightInMeters);

    setBmiResult(bmi.toFixed(2));

    // Determine BMI category
    if (bmi < 18.5) {
      setBmiCategory('Category: Underweight');
    } else if (bmi >= 18.5 && bmi < 24.9) {
      setBmiCategory('Category: Normal weight');
    } else if (bmi >= 25 && bmi < 29.9) {
      setBmiCategory('Category: Overweight');
    } else {
      setBmiCategory('Category: Obesity');
    }
  }, [weight, weightUnit, height, heightUnit]);

  const resetCalculator = useCallback(() => {
    setWeight('');
    setWeightUnit('kg');
    setHeight('');
    setHeightUnit('cm');
    setBmiResult('');
    setBmiCategory('');
    setWeightError(false);
    setHeightError(false);
  }, []);

  return (
    <div className="calculator-section bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b-2 border-blue-500 pb-3">BMI Calculator</h2>

      <InputGroup
        label="Weight"
        id="weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        step="0.1"
        unitOptions={weightUnitOptions}
        unitValue={weightUnit}
        onUnitChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
        error={weightError}
      />
      <InputGroup
        label="Height"
        id="height"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        step="0.1"
        unitOptions={heightUnitOptions}
        unitValue={heightUnit}
        onUnitChange={(e) => setHeightUnit(e.target.value as HeightUnit)}
        error={heightError}
      />

      <div className="button-group flex flex-wrap gap-4 justify-center mt-6">
        <button
          onClick={calculateBMI}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
        >
          Calculate BMI
        </button>
        <button
          onClick={resetCalculator}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>

      {(bmiResult || bmiCategory) && (
        <p className="mt-6 text-xl text-center font-medium">
          Your BMI is: <span className={`font-bold ${weightError || heightError? 'text-red-600' : 'text-blue-700'}`}>{bmiResult}</span>
          <br />
          <span className="font-semibold text-green-700">{bmiCategory}</span>
        </p>
      )}

      <DescriptionToggle
        shortDescription="The Body Mass Index (BMI) is a simple calculation using a person's height and weight."
        fullDescription="The formula is BMI = kg/m², where kg is a person's weight in kilograms and m² is their height in metres squared. A high BMI can indicate high body fatness. BMI screens for weight categories that may lead to health problems, but it does not diagnose the body fatness or health of an individual. It now supports both metric and imperial units."
      />
    </div>
  );
};

export default BMICalculator;