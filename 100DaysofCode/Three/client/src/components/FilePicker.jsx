import React, { useRef, useState } from 'react'; // New: useRef for drag/drop, useState for drag state
import CustomButton from './CustomButton';
// New: Icons for file actions
import { MdClear, MdCloudUpload } from 'react-icons/md'; // Assuming react-icons

const FilePicker = ({ file, setFile, readFile, fileError, clearFileError }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); // New: State for drag-and-drop visual feedback

  // New: Handle clearing the selected file
  const handleClearFile = () => {
    setFile('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input field
    }
    if (clearFileError) clearFileError();
  };

  // New: Drag and Drop Handlers
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      if (clearFileError) clearFileError();
    }
  };

  // New: Generate image preview URL
  const previewUrl = file && typeof file!== 'string'? URL.createObjectURL(file) : null;

  return (
    <div
      className={`filepicker-container p-4 bg-white shadow-lg rounded-lg ${isDragging? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'}`} // Enhanced styling for drag & drop
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex-1 flex flex-col items-center justify-center mb-4 border-2 border-dashed border-gray-300 rounded-md p-4 bg-gray-50 text-center relative min-h-[100px]"> {/* Enhanced styling */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          ref={fileInputRef} // New: Assign ref
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
              if (clearFileError) clearFileError();
            }
          }}
          className="hidden" // Hide the default input
        />
        <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center justify-center">
          <MdCloudUpload size={24} className="mr-2" /> {/* New: Upload icon */}
          Upload or Drag & Drop File
        </label>

        {/* New: Display file name and clear button, or upload instructions */}
        <p className="mt-2 text-gray-500 text-xs truncate w-full text-center">
          {file && file.name? file.name : "No file selected"}
        </p>
        {file && file.name && ( // Only show clear button if a file is selected
          <button
            onClick={handleClearFile}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white transition-colors"
            aria-label="Clear selected file"
          >
            <MdClear size={20} />
          </button>
        )}
      </div>

      {/* New: Image Preview */}
      {previewUrl && (
        <div className="mb-4 text-center">
          <p className="text-gray-700 text-sm mb-2">Image Preview:</p>
          <img src={previewUrl} alt="Preview" className="max-w-full h-auto max-h-32 object-contain mx-auto border border-gray-200 rounded-md" />
        </div>
      )}

      {/* New: Display error message if present */}
      {fileError && (
        <p className="text-red-500 text-sm mb-3">
          Error: {fileError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={() => readFile('logo')}
          customStyles="text-xs flex-1"
          disabled={!file} // New: Disable buttons if no file is selected
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={() => readFile('full')}
          customStyles="text-xs flex-1"
          disabled={!file} // New: Disable buttons if no file is selected
        />
      </div>
    </div>
  );
};

export default FilePicker;