
// src/components/calculators/AreaCalculator.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import InputGroup from '../Shared/InputGroup';
import DescriptionToggle from '../Shared/DescriptionToggle';
import { isValidNumber } from '../../lib/utils';

type ShapeType = '' | 'circle' | 'square' | 'rectangle' | 'triangle';

const AreaCalculator: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>('');
  const [radius, setRadius] = useState<string>('');
  const [side, setSide] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [base, setBase] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [areaResult, setAreaResult] = useState<string>('');

  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});

  const shapeOptions = useMemo(() => [
    { value: '', label: '--Select a shape--' },
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Square' },
    { value: 'rectangle', label: 'Rectangle' },
    { value: 'triangle', label: 'Triangle' },
  ], []);

  const clearErrors = useCallback(() => {
    setInputErrors({});
    setAreaResult('');
  }, []);

  const handleShapeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShape(e.target.value as ShapeType);
    setRadius('');
    setSide('');
    setLength('');
    setWidth('');
    setBase('');
    setHeight('');
    clearErrors();
  }, [clearErrors]);

  const calculateArea = useCallback(() => {
    clearErrors();
    let calculatedArea: number | null = null;
    const errors: { [key: string]: boolean } = {};

    if (!selectedShape) {
      setAreaResult('Error: Please select a shape.');
      return;
    }

    switch (selectedShape) {
      case 'circle':
        const parsedRadius = parseFloat(radius);
        if (!isValidNumber(parsedRadius) || parsedRadius < 0) {
          errors.radius = true;
          setAreaResult('Error: Valid non-negative radius required.');
        } else {
          calculatedArea = Math.PI * parsedRadius * parsedRadius;
        }
        break;
      case 'square':
        const parsedSide = parseFloat(side);
        if (!isValidNumber(parsedSide) || parsedSide < 0) {
          errors.side = true;
          setAreaResult('Error: Valid non-negative side length required.');
        } else {
          calculatedArea = parsedSide * parsedSide;
        }
        break;
      case 'rectangle':
        const parsedLength = parseFloat(length);
        const parsedWidth = parseFloat(width);
        if (!isValidNumber(parsedLength) || parsedLength < 0) {
          errors.length = true;
          setAreaResult('Error: Valid non-negative length required.');
        }
        if (!isValidNumber(parsedWidth) || parsedWidth < 0) {
          errors.width = true;
          if (!errors.length) setAreaResult('Error: Valid non-negative width required.');
        }
        if (!errors.length &&!errors.width) {
          calculatedArea = parsedLength * parsedWidth;
        } else if (!errors.length ||!errors.width) {
            setAreaResult('Error: Valid non-negative length and width required.');
        }
        break;
      case 'triangle':
        const parsedBase = parseFloat(base);
        const parsedHeight = parseFloat(height);
        if (!isValidNumber(parsedBase) || parsedBase < 0) {
          errors.base = true;
          setAreaResult('Error: Valid non-negative base required.');
        }
        if (!isValidNumber(parsedHeight) || parsedHeight < 0) {
          errors.height = true;
          if (!errors.base) setAreaResult('Error: Valid non-negative height required.');
        }
        if (!errors.base &&!errors.height) {
          calculatedArea = 0.5 * parsedBase * parsedHeight;
        } else if (!errors.base ||!errors.height) {
            setAreaResult('Error: Valid non-negative base and height required.');
        }
        break;
    }

    setInputErrors(errors);

    if (calculatedArea!== null && Object.keys(errors).length === 0) {
      setAreaResult(calculatedArea.toFixed(2));
    }
  }, [selectedShape, radius, side, length, width, base, height, clearErrors]);

  const resetCalculator = useCallback(() => {
    setSelectedShape('');
    setRadius('');
    setSide('');
    setLength('');
    setWidth('');
    setBase('');
    setHeight('');
    clearErrors();
  }, [clearErrors]);

  return (
    <div className="calculator-section bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b-2 border-blue-500 pb-3">Multi-Shape Area Calculator</h2>

      <div className="input-group flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-5 gap-2 sm:gap-4">
        <label htmlFor="shapeType" className="w-full sm:w-36 font-semibold text-gray-700 text-base sm:text-lg">
          Select Shape:
        </label>
        <select
          id="shapeType"
          value={selectedShape}
          onChange={handleShapeChange}
          className="flex-grow p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 bg-white appearance-none bg-no-repeat bg-[right_15px_center] bg-[length:10px] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095.1a17.6%2017.6%200%200%200%205.4-12.9c0-5-1.8-9.3-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')]">
          {shapeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="shape-input-group mt-6 border-t pt-4 border-gray-200">
        {selectedShape === 'circle' && (
          <InputGroup
            label="Radius"
            id="circleRadius"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            error={inputErrors.radius}
          />
        )}
        {selectedShape === 'square' && (
          <InputGroup
            label="Side Length"
            id="squareSide"
            value={side}
            onChange={(e) => setSide(e.target.value)}
            error={inputErrors.side}
          />
        )}
        {selectedShape === 'rectangle' && (
          <>
            <InputGroup
              label="Length"
              id="rectangleLength"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              error={inputErrors.length}
            />
            <InputGroup
              label="Width"
              id="rectangleWidth"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              error={inputErrors.width}
            />
          </>
        )}
        {selectedShape === 'triangle' && (
          <>
            <InputGroup
              label="Base"
              id="triangleBase"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              error={inputErrors.base}
            />
            <InputGroup
              label="Height"
              id="triangleHeight"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              error={inputErrors.height}
            />
          </>
        )}
      </div>

      <div className="button-group flex flex-wrap gap-4 justify-center mt-6">
        <button
          onClick={calculateArea}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
        >
          Calculate Area
        </button>
        <button
          onClick={resetCalculator}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>

      {areaResult && (
        <p className="mt-6 text-xl text-center font-medium">
          Area: <span className={`font-bold ${Object.keys(inputErrors).length > 0? 'text-red-600' : 'text-blue-700'}`}>{areaResult}</span>
        </p>
      )}

      <DescriptionToggle
        shortDescription="Calculate the area of various 2D shapes like circles, squares, rectangles, and triangles."
        fullDescription="Select the shape you need, enter the required dimensions (radius for circle, side for square, length/width for rectangle, base/height for triangle), and click 'Calculate Area'. The tool uses standard geometric formulas to provide accurate area measurements."
      />
    </div>
  );
};

export default AreaCalculator;