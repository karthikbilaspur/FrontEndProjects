// src/components/Card.tsx
'use client'; // This is a client component

import React from 'react';

interface CardProps {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
}

const Card: React.FC<CardProps> = ({ id, emoji, isFlipped, isMatched, onClick }) => {
  const handleClick = () => {
    if (!isFlipped &&!isMatched) { // Only clickable if not flipped and not matched
      onClick(id);
    }
  };

  return (
    <div
      className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 
                  rounded-lg cursor-pointer transform transition-transform duration-300 ease-in-out perspective-1000
                  ${(isFlipped || isMatched)? 'rotate-y-180' : ''}
                  ${isMatched? 'opacity-70' : ''}`}
      onClick={handleClick}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s'
      }}
    >
      {/* Card Back */}
      <div className={`absolute w-full h-full backface-hidden rounded-lg
                      bg-gradient-to-br from-indigo-500 to-purple-600
                      flex items-center justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold
                      shadow-lg border-4 border-indigo-700
                      ${(isFlipped || isMatched)? 'hidden' : 'block'}`} // Hide back when flipped
      >
        ❓
      </div>

      {/* Card Front */}
      <div className={`absolute w-full h-full backface-hidden rounded-lg
                      bg-gradient-to-br from-gray-200 to-gray-400
                      flex items-center justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                      shadow-lg border-4 border-gray-500
                      transform rotate-y-180
                      ${(isFlipped || isMatched)? 'block' : 'hidden'}`} // Show front when flipped
      >
        {emoji}
      </div>
    </div>
  );
};

export default Card;