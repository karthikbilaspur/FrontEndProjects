// src/components/calculators/AgeCalculator.tsx
'use client';

import React, { useState, useCallback } from 'react';
import InputGroup from '../Shared/InputGroup';
import DescriptionToggle from '../Shared/DescriptionToggle';

const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState<string>('');
  const [ageResult, setAgeResult] = useState<string>('');
  const [dobError, setDobError] = useState<boolean>(false);

  const calculateAge = useCallback(() => {
    setDobError(false); // Clear previous error

    if (!dob) {
      setAgeResult('Error: Please enter your birthdate.');
      setDobError(true);
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      setAgeResult('Error: Birthdate cannot be in the future.');
      setDobError(true);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    setAgeResult(`${age} years old`);
  }, [dob]);

  const resetCalculator = useCallback(() => {
    setDob('');
    setAgeResult('');
    setDobError(false);
  }, []);

  // Get today's date in YYYY-MM-DD format for the max attribute of the date input
  const todayDateString = new Date().toISOString().split('T')[0];

  return (
    <div className="calculator-section bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b-2 border-blue-500 pb-3">Age Calculator</h2>

      <InputGroup
        label="Enter your birthdate"
        id="dob"
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        error={dobError}
        max={todayDateString}
      />

      <div className="button-group flex flex-wrap gap-4 justify-center mt-6">
        <button
          onClick={calculateAge}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
        >
          Calculate Age
        </button>
        <button
          onClick={resetCalculator}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>

      {ageResult && (
        <p className="mt-6 text-xl text-center font-medium">
          Your age is: <span className={`font-bold ${dobError? 'text-red-600' : 'text-blue-700'}`}>{ageResult}</span>
        </p>
      )}

      <DescriptionToggle
        shortDescription="This tool helps you determine your current age based on your date of birth."
        fullDescription="Simply enter your birthdate in the provided field, and click 'Calculate Age'. The calculator will then provide your age in years. It accounts for leap years and the current date to give you an accurate result."
      />
    </div>
  );
};

export default AgeCalculator;