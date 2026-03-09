import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

// Configuration, State, Helpers, Constants
import config from '../config/config';
import state from '../store';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { animationVariants } from '../config/motion'; // Using the unified animationVariants
// UI Components
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
// Icons for CustomButton where appropriate
import { MdDownload, MdArrowBack } from 'react-icons/md'; // Example icons

const Customizer = () => {
  const snap = useSnapshot(state);

  // State for file upload and AI generation
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);

  // State for errors
  const [aiError, setAiError] = useState('');
  const [fileError, setFileError] = useState('');

  // State for active tabs
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState(() => {
    // Initialize activeFilterTab from constants
    const initialFilterTabState = {};
    FilterTabs.forEach(tab => {
      initialFilterTabState[tab.name] = tab.initialState || false;
    });
    return initialFilterTabState;
  });

  // Effect to update shirt state based on activeFilterTab
  useEffect(() => {
    state.isLogoTexture = activeFilterTab.logoShirt;
    state.isFullTexture = activeFilterTab.stylishShirt;
  }, [activeFilterTab]);

  // Helper function to render content for the active editor tab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
          fileError={fileError}
          clearFileError={() => setFileError('')}
        />;
      case "aipicker":
        return <AIPicker
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
          aiError={aiError}
          clearAiError={() => setAiError('')}
        />;
      default:
        return null;
    }
  };

  // Handles AI image generation via backend
  const handleSubmit = async (type) => {
    if (!prompt) {
      setAiError("Please enter a prompt.");
      return;
    }

    try {
      setGeneratingImg(true);
      setAiError(''); // Clear previous AI errors

      const response = await fetch(config.backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate AI image. Please try again.");
      }

      const data = await response.json();
      handleDecals(type, `data:image/png;base64,${data.photo}`);

    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiError(error.message || "Something went wrong with AI generation.");
    } finally {
      setGeneratingImg(false);
      // Optional: Close the tab on success, keep open on error for re-try
      if (!aiError) setActiveEditorTab("");
    }
  };

  // Applies decal to shirt's state
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    // Automatically activate filter tab if decal applied
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  // Toggles filter tabs (logo/full)
  const handleActiveFilterTab = (tabName) => {
    // Update state based on the selected tab
    setActiveFilterTab((prevState) => {
      // If it's a "one-at-a-time" filter (e.g., only one decal type active)
      // you might want to disable others when one is active.
      // For logoShirt and stylishShirt, they can be independent or mutually exclusive.
      // Current logic toggles.
      const newState = {...prevState, [tabName]:!prevState[tabName] };

      // Optional: If you want only one of logoShirt or stylishShirt to be active at a time:
      // if (tabName === "logoShirt" && newState.logoShirt) {
      // newState.stylishShirt = false;
      // } else if (tabName === "stylishShirt" && newState.stylishShirt) {
      // newState.logoShirt = false;
      // }
      return newState;
    });
  };

  // Reads file and applies as decal
  const readFile = async (type) => {
    if (!file) {
      setFileError("No file selected.");
      return;
    }
    try {
      setFileError(''); // Clear previous file errors
      const result = await reader(file);
      handleDecals(type, result);
      setActiveEditorTab("");
    } catch (error) {
      console.error("File Reading Error:", error);
      setFileError(error.message || "Could not read file. Please ensure it's a valid image.");
    }
  };

  // Downloads the canvas image
  const handleDownloadClick = () => {
    downloadCanvasToImage("my_custom_shirt"); // Use a custom filename
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* Editor Tabs Section */}
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...animationVariants.slide('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      if (tab.disabled || generatingImg) return; // Prevent click if disabled or AI is generating
                      setActiveEditorTab(activeEditorTab === tab.name? "" : tab.name); // Toggle tab visibility
                    }}
                    isActiveTab={activeEditorTab === tab.name}
                    // Pass label and tooltip from constants for enhanced Tab component
                    label={tab.label}
                    tooltip={tab.tooltip}
                    // Disable tab if explicitly marked or if AI is busy
                    disabled={tab.disabled || generatingImg}
                  />
                ))}
              </div>
              {generateTabContent()}
            </div>
          </motion.div>

          {/* Go Back / Download Buttons */}
          <motion.div
            className="absolute z-10 top-5 right-5 flex gap-2" // Added flex gap for download button
            {...animationVariants.fade}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              IconComponent={MdArrowBack} // Example icon
            />
            {/* New: Download Button */}
            <CustomButton
              type="outline"
              title="Download"
              handleClick={handleDownloadClick}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              IconComponent={MdDownload} // Example icon
            />
          </motion.div>

          {/* Filter Tabs Section */}
          <motion.div
            className='filtertabs-container'
            {...animationVariants.slide("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                handleClick={() => handleActiveFilterTab(tab.name)}
                isActiveTab={activeFilterTab[tab.name]}
                // Pass label and tooltip from constants
                label={tab.label}
                tooltip={tab.tooltip}
                // Disable filter tab if AI is busy, for example
                disabled={generatingImg}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;