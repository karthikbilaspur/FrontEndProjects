// src/components/Shared/DescriptionToggle.tsx
'use client';

import React, { useState } from 'react';

interface DescriptionToggleProps {
  shortDescription: string;
  fullDescription: string;
}

const DescriptionToggle: React.FC<DescriptionToggleProps> = ({ shortDescription, fullDescription }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="calculator-details mt-8 pt-6 border-t border-dashed border-gray-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">About this Calculator:</h3>
      <p className="text-gray-600 mb-2">{shortDescription}</p>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600">{fullDescription}</p>
      </div>
      <button
        onClick={toggleDescription}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
      >
        {isExpanded? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

export default DescriptionToggle;