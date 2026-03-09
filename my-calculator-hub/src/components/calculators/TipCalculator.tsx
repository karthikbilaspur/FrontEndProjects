// src/components/calculators/TipCalculator.tsx
'use client';

import React, { useState, useCallback } from 'react';
import InputGroup from '../Shared/InputGroup';
import DescriptionToggle from '../Shared/DescriptionToggle';
import { isValidNumber } from '../../lib/utils';

const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<string>('15'); // Default to 15%
  const [tipAmountResult, setTipAmountResult] = useState<string>('');
  const [totalBillResult, setTotalBillResult] = useState<string>('');
  const [billAmountError, setBillAmountError] = useState<boolean>(false);
  const [tipPercentageError, setTipPercentageError] = useState<boolean>(false);

  const calculateTip = useCallback(() => {
    setBillAmountError(false);
    setTipPercentageError(false);
    setTipAmountResult('');
    setTotalBillResult('');

    const parsedBillAmount = parseFloat(billAmount);
    const parsedTipPercentage = parseFloat(tipPercentage);

    if (!isValidNumber(parsedBillAmount) || parsedBillAmount < 0) {
      setTipAmountResult('Error: Please enter a valid non-negative bill amount.');
      setBillAmountError(true);
      return;
    }
    if (!isValidNumber(parsedTipPercentage) || parsedTipPercentage < 0) {
      setTipAmountResult('Error: Please enter a valid non-negative tip percentage.');
      setTipPercentageError(true);
      return;
    }

    const tipAmount = parsedBillAmount * (parsedTipPercentage / 100);
    const totalBill = parsedBillAmount + tipAmount;

    setTipAmountResult(tipAmount.toFixed(2));
    setTotalBillResult(totalBill.toFixed(2));
  }, [billAmount, tipPercentage]);

  const applyTipPercentage = useCallback((percentage: number) => {
    setTipPercentage(percentage.toString());
    // Recalculate immediately if there's a bill amount
    if (isValidNumber(parseFloat(billAmount)) && parseFloat(billAmount) >= 0) {
      const tipAmount = parseFloat(billAmount) * (percentage / 100);
      const totalBill = parseFloat(billAmount) + tipAmount;
      setTipAmountResult(tipAmount.toFixed(2));
      setTotalBillResult(totalBill.toFixed(2));
    }
  }, [billAmount]);

  const resetCalculator = useCallback(() => {
    setBillAmount('');
    setTipPercentage('15');
    setTipAmountResult('');
    setTotalBillResult('');
    setBillAmountError(false);
    setTipPercentageError(false);
  }, []);

  return (
    <div className="calculator-section bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b-2 border-blue-500 pb-3">Tip Calculator</h2>

      <InputGroup
        label="Bill Amount ($)"
        id="billAmount"
        value={billAmount}
        onChange={(e) => setBillAmount(e.target.value)}
        step="0.01"
        error={billAmountError}
      />
      <InputGroup
        label="Tip Percentage (%)"
        id="tipPercentage"
        value={tipPercentage}
        onChange={(e) => setTipPercentage(e.target.value)}
        step="1"
        error={tipPercentageError}
      />

      <div className="tip-percentage-buttons flex flex-wrap gap-3 justify-center mb-6">
        {[10, 15, 20, 25].map((percentage) => (
          <button
            key={percentage}
            onClick={() => applyTipPercentage(percentage)}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors text-sm"
          >
            {percentage}%
          </button>
        ))}
      </div>

      <div className="button-group flex flex-wrap gap-4 justify-center mt-6">
        <button
          onClick={calculateTip}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
        >
          Calculate Tip
        </button>
        <button
          onClick={resetCalculator}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>

      {(tipAmountResult || totalBillResult) && (
        <p className="mt-6 text-xl text-center font-medium">
          Tip Amount: $<span className={`font-bold ${billAmountError || tipPercentageError? 'text-red-600' : 'text-blue-700'}`}>{tipAmountResult}</span>
          <br />
          Total Bill: $<span className={`font-bold ${billAmountError || tipPercentageError? 'text-red-600' : 'text-green-700'}`}>{totalBillResult}</span>
        </p>
      )}

      <DescriptionToggle
        shortDescription="Easily calculate the tip amount and the total bill based on your dining experience."
        fullDescription="Enter your total bill amount and the desired tip percentage. You can also use the quick buttons to apply common tip percentages. The calculator will instantly show you the tip amount and the new total bill. Great for splitting checks or just figuring out a fair tip."
      />
    </div>
  );
};

export default TipCalculator;