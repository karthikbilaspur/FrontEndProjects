import React from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { getContrastingColor } from '../config/helpers';
// New: React.createElement for dynamic icon rendering
// import { IconType } from 'react-icons'; // If using TypeScript

const CustomButton = ({ type, title, customStyles, handleClick, disabled = false, IconComponent }) => { // New: disabled prop, IconComponent prop
  const snap = useSnapshot(state);

  const generateStyle = (buttonType) => { // Renamed type to buttonType to avoid conflict with prop
    if (buttonType === 'filled') {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
        // New: Hover effect for filled button
        // CSS in JS for hover is complex, usually prefer Tailwind's `hover:` classes or dedicated CSS
      };
    } else if (buttonType === "outline") {
      return {
        borderWidth: '1px',
        borderColor: snap.color,
        color: snap.color,
        // New: Hover effect for outline button
        // Usually prefer Tailwind's `hover:` classes or dedicated CSS
      };
    }
  };

  // New: Define dynamic classes for disabled state
  const disabledClasses = disabled? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`px-4 py-2 flex items-center justify-center gap-2 rounded-md font-bold transition-all duration-200 ease-in-out ${customStyles} ${disabledClasses}`} // New: Flex for icon, transition, disabled classes
      style={generateStyle(type)}
      onClick={!disabled? handleClick : undefined} // New: Prevent click if disabled
      disabled={disabled} // New: Pass disabled prop to the button element
      aria-label={title} // New: Accessibility
    >
      {IconComponent && React.createElement(IconComponent, { size: 18 })} {/* New: Render icon if provided */}
      {title}
    </button>
  );
};

export default CustomButton;