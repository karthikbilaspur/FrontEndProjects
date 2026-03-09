// New: Import all assets at once, or be more specific as needed
import { swatch, fileIcon, ai, logoShirt, stylishShirt, javaScript, /* New: Add more icons here if needed */ } from "../assets";

// New: Interface for EditorTab for better type checking
// interface EditorTab {
// name: string;
// icon: string | React.ComponentType; // Can now be a string path or a React component
// label: string; // New: User-friendly label
// tooltip?: string; // New: Optional tooltip text
// disabled?: boolean; // New: Optional disable flag
// }

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch, // Still using string path for now
    label: "Color Picker", // New: Human-readable label
    tooltip: "Change the shirt's main color", // New: Descriptive tooltip
  },
  {
    name: "filepicker",
    icon: fileIcon,
    label: "File Upload",
    tooltip: "Upload your own logo or full image",
  },
  {
    name: "aipicker",
    icon: ai,
    label: "AI Design",
    tooltip: "Generate designs using AI prompts",
    // New: Example of disabling a tab
    // disabled: true,
  },
  // New: Example of a hypothetical new tab
  // {
  // name: "texteditor",
  // icon: 'textIcon',
  // label: "Add Text",
  // tooltip: "Add custom text to your shirt",
  // },
];

// New: Interface for FilterTab for better type checking
// interface FilterTab {
// name: string;
// icon: string | React.ComponentType;
// label: string;
// tooltip?: string;
// initialState: boolean; // New: Should this filter be active by default?
// }

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
    label: "Logo",
    tooltip: "Toggle logo display",
    initialState: true, // New: Logo is shown by default
  },
  {
    name: "stylishShirt",
    icon: stylishShirt,
    label: "Full Pattern",
    tooltip: "Toggle full pattern display",
    initialState: false, // New: Full pattern is hidden by default
  }, 
  {
    name: "javaScript",
    icon: javaScript,
    label: "JavaScript",
    tooltip: "Toggle JavaScript display",
    initialState: false,
  }
];

// New: Interface for DecalType for better type checking
// interface DecalType {
// stateProperty: 'logoDecal' | 'fullDecal'; // Specific union type for safety
// filterTab: string; // Refers to name in FilterTabs
// position?: [number, number, number]; // New: Default position for decal
// scale?: number; // New: Default scale for decal
// // Add more default properties for decals here if needed
// }

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
    position: [0, 0.04, 0.15], // New: Default position from Shirt.jsx
    scale: 0.15, // New: Default scale from Shirt.jsx
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
    position: [0, 0, 0], // New: Default position from Shirt.jsx
    scale: 1, // New: Default scale from Shirt.jsx
  },
  javascript: {
    stateProperty: "javascriptDecal",
    filterTab: "javaScript",
    position: [0, 0, 0], // New: Default position from Shirt.jsx
    scale: 1, // New: Default scale from Shirt.jsx
  },
};

// New: Default texture for Decals if an image is not loaded yet
// export const DEFAULT_DECAL_TEXTURE = 'path/to/placeholder_texture.png';