import React from 'react';
import CustomButton from './CustomButton';
// New: Icon for clearing prompt
import { MdClear } from 'react-icons/md'; // Assuming you have react-icons installed, if not, choose another icon library or use a simple 'x'

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit, aiError, clearAiError }) => {
  // New: Function to clear the prompt
  const handleClearPrompt = () => {
    setPrompt('');
    if (clearAiError) clearAiError(); // Clear any previous errors
  };

  return (
    <div className="aipicker-container p-4 bg-white shadow-lg rounded-lg"> {/* Enhanced styling */}
      <div className="relative mb-3"> {/* Added relative for clear button positioning */}
        <textarea
          placeholder={aiError? aiError : "Describe your AI design here... (e.g., 'a cyberpunk dragon logo', 'abstract geometric pattern')"} // Enhanced placeholder
          rows={5}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (clearAiError) clearAiError(); // Clear error on new input
          }}
          className={`aipicker-textarea w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 ${aiError? 'border-red-500 focus:ring-red-300 text-red-700' : 'border-gray-300 focus:ring-blue-300'}`} // Enhanced styling
        />
        {/* New: Clear prompt button */}
        {prompt && ( // Only show if prompt has content
          <button
            onClick={handleClearPrompt}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white transition-colors"
            aria-label="Clear prompt"
          >
            <MdClear size={20} /> {/* Assuming MdClear icon */}
          </button>
        )}
      </div>

      {/* New: Display error message if present */}
      {aiError && (
        <p className="text-red-500 text-sm mb-3">
          Error: {aiError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {generatingImg? (
          <CustomButton
            type="outline"
            title="Asking AI..."
            customStyles="text-xs opacity-70 cursor-not-allowed" // Indicate disabled state
            disabled // New: Disable button while generating
          />
        ) : (
          <>
            <CustomButton
              type="outline"
              title="AI Logo"
              handleClick={() => handleSubmit('logo')}
              customStyles="text-xs flex-1" // New: Flex-1 for equal width
            />

            <CustomButton
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmit('full')}
              customStyles="text-xs flex-1" // New: Flex-1 for equal width
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AIPicker;