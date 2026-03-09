import React from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const snap = useSnapshot(state);

  const activeStyles = isFilterTab && isActiveTab
   ? { backgroundColor: snap.color, opacity: 0.8 } // Slightly higher opacity for active filter
    : { backgroundColor: "transparent", opacity: 1 };

  // New: Define hover styles (using Tailwind utility classes for simplicity in this example)
  // For more complex hover effects, you might use a dedicated CSS class
  const hoverClasses = isFilterTab? 'hover:bg-gray-100 hover:opacity-90' : 'hover:scale-110'; // Example hover effects

  return (
    <div
      key={tab.name}
      className={`tab-btn relative flex items-center justify-center cursor-pointer ${isFilterTab? 'rounded-full glassmorphism' : 'rounded-md'} ${hoverClasses}`} // New: Hover classes, flex utilities
      onClick={handleClick}
      style={activeStyles}
      title={tab.name} // New: Tooltip for accessibility and clarity
      aria-label={`${tab.name} ${isActiveTab? ' (active)' : ''}`} // New: Accessibility
    >
      <img
        src={tab.icon}
        alt={tab.name}
        className={`${isFilterTab? 'w-2/3 h-2/3' : 'w-11/12 h-11/12 object-contain'} transition-transform duration-200 ease-in-out`} // New: Transition for icon scale
      />
      {/* New: Optional notification badge (example) */}
      {/* {tab.hasNewContent && (
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      )} */}
    </div>
  );
};

export default Tab;