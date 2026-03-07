const shape = document.getElementById("shape");
const preview = document.querySelector(".preview"); // Main preview container

const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const radius = document.getElementById("radius");
const rotate = document.getElementById("rotate");
const effect = document.getElementById("effect");
const cssCode = document.getElementById("cssCode");

// Shape controls
const shapeType = document.getElementById("shapeType");
const widthControl = document.getElementById("width");
const heightControl = document.getElementById("height");
const widthLabel = document.getElementById("widthLabel"); // Label parent of width control
const heightLabel = document.getElementById("heightLabel"); // Label parent of height control

// Filter controls
const filterSaturate = document.getElementById("filterSaturate");
const filterContrast = document.getElementById("filterContrast");
const filterSepia = document.getElementById("filterSepia");
const filterGrayscale = document.getElementById("filterGrayscale");
const filterHueRotate = document.getElementById("filterHueRotate");

// Gradient controls
const gradientType = document.getElementById("gradientType");
const gradientDirection = document.getElementById("gradientDirection");
const gradientDirectionLabel = document.getElementById("gradientDirectionLabel");

// Advanced Effects Controls (new UI)
const enableMultiShadow = document.getElementById("enableMultiShadow");
const multiShadowControls = document.getElementById("multiShadowControls");
const numShadowsControl = document.getElementById("numShadows");

const enableAnimation = document.getElementById("enableAnimation");
const animationControls = document.getElementById("animationControls");
const animationTypeControl = document.getElementById("animationType");
const animationDurationControl = document.getElementById("animationDuration");

const enablePseudo = document.getElementById("enablePseudo");
const pseudoElementControls = document.getElementById("pseudoElementControls");
const pseudoOffsetControl = document.getElementById("pseudoOffset");
const pseudoColorControl = document.getElementById("pseudoColor");

// Preset Controls (new UI)
const presetNameInput = document.getElementById("presetName");
const presetListDiv = document.getElementById("presetList");

// Interaction Displays
const positionDisplay = document.getElementById("positionDisplay");
const zoomDisplay = document.getElementById("zoomDisplay");

// Buttons (for copy feedback)
const copyCssButton = document.querySelector('button[onclick="copyCSS()"]');

// --- INTERNAL STATE FOR ADVANCED EFFECTS AND INTERACTION ---
let shadowSettings = []; // Stores individual shadow properties

// Zoom state
let currentScale = 1;
const ZOOM_STEP = 0.001; // Fine-tuned for smoother zoom
const MIN_SCALE = 0.05;
const MAX_SCALE = 5;

// Dragging state
let isDragging = false;
let startPointerPosition = { x: 0, y: 0 }; // Initial pointer position
let startOffset = { x: 0, y: 0 }; // Initial shape offset
let xOffset = 0; // Shape's relative X position from center
let yOffset = 0; // Shape's relative Y position from center

// Touch state for pinch-to-zoom
let touchStartDistance = null;
let touchStartScale = 1;
let initialTouchPositions = [];

// --- Configuration / Settings ---
const includeVendorPrefixes = true; // Toggle for vendor prefixes in generated CSS

// --- Helper Functions for Safe Parsing and Randomness ---
function getParsedInt(element) {
    const val = parseInt(element.value, 10);
    return isNaN(val)? 0 : val;
}

function getParsedFloat(element) {
    const val = parseFloat(element.value);
    return isNaN(val)? 0 : val;
}

function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Core Functions: Getters for CSS Properties ---
function getGradientString() {
    const c1 = color1.value;
    const c2 = color2.value;
    const type = gradientType.value;
    const dir = getParsedInt(gradientDirection);

    switch (type) {
        case "linear":
            return `linear-gradient(${dir}deg, ${c1}, ${c2})`;
        case "radial":
            return `radial-gradient(circle, ${c1}, ${c2})`;
        case "conic":
            return `conic-gradient(from ${dir}deg at 50% 50%, ${c1}, ${c2})`;
        default:
            return `linear-gradient(135deg, ${c1}, ${c2})`;
    }
}

function getFilterString() {
    let filters = [];
    if (getParsedInt(filterSaturate)!== 100) filters.push(`saturate(${getParsedInt(filterSaturate)}%)`);
    if (getParsedInt(filterContrast)!== 100) filters.push(`contrast(${getParsedInt(filterContrast)}%)`);
    if (getParsedInt(filterSepia)!== 0) filters.push(`sepia(${getParsedInt(filterSepia)}%)`);
    if (getParsedInt(filterGrayscale)!== 0) filters.push(`grayscale(${getParsedInt(filterGrayscale)}%)`);
    if (getParsedInt(filterHueRotate)!== 0) filters.push(`hue-rotate(${getParsedInt(filterHueRotate)}deg)`);
    return filters.length? filters.join(" ") : "none";
}

// --- Main Update Function ---
function updateShape() {
    // --- Safe parsing of control values ---
    const currentRadius = getParsedInt(radius);
    const currentRotate = getParsedInt(rotate);
    const currentWidth = getParsedInt(widthControl);
    const currentHeight = getParsedInt(heightControl);

    // --- Reset core properties for new shape calculation ---
    shape.style.width = currentWidth + "px";
    shape.style.height = currentHeight + "px";
    shape.style.background = getGradientString();
    shape.style.borderRadius = currentRadius + "%";
    shape.style.boxShadow = "none";
    shape.style.backdropFilter = "none";
    shape.style.clipPath = "none";
    shape.style.border = "none";
    shape.innerHTML = "";
    shape.style.backgroundColor = "initial";
    shape.style.filter = getFilterString();
    shape.style.animation = 'none'; // Reset animation
    shape.style.zIndex = ''; // Reset z-index

    // Update interaction displays
    positionDisplay.textContent = `Position: (${xOffset}px, ${yOffset}px)`;
    zoomDisplay.textContent = `Zoom: ${Math.round(currentScale * 100)}%`;

    // --- Control Visibility of UI Elements ---
    widthLabel.classList.remove('hidden');
    heightLabel.classList.remove('hidden');
    radius.parentElement.classList.remove('hidden');
    gradientDirectionLabel.classList.toggle('hidden',!(gradientType.value === "linear" || gradientType.value === "conic"));
    multiShadowControls.classList.toggle('hidden',!enableMultiShadow.checked);
    animationControls.classList.toggle('hidden',!enableAnimation.checked);
    pseudoElementControls.classList.toggle('hidden',!enablePseudo.checked);

    // --- Handle shape type ---
    let useBorderForShape = false; // Flag for triangles

    switch (shapeType.value) {
        case "square":
            widthControl.value = 220; heightControl.value = 220;
            shape.style.width = "220px"; shape.style.height = "220px";
            shape.style.borderRadius = currentRadius + "%";
            widthLabel.classList.add('hidden'); heightLabel.classList.add('hidden');
            break;
        case "rectangle":
            shape.style.borderRadius = currentRadius + "%";
            break;
        case "rounded-rectangle": // Fixed radius, overrides slider
            shape.style.borderRadius = "20px";
            radius.value = 20; // Update slider value too for consistency
            radius.parentElement.classList.add('hidden'); // Hide radius slider
            break;
        case "circle":
            widthControl.value = 220; heightControl.value = 220;
            shape.style.width = "220px"; shape.style.height = "220px";
            shape.style.borderRadius = "50%";
            widthLabel.classList.add('hidden'); heightLabel.classList.add('hidden');
            radius.parentElement.classList.add('hidden'); // Hide radius slider for circle
            break;
        case "triangle-up":
        case "triangle-down":
        case "triangle-left":
        case "triangle-right":
            useBorderForShape = true;
            shape.style.width = "0"; shape.style.height = "0";
            shape.style.background = "none";
            shape.style.borderRadius = "0";
            let bWidth = currentWidth; // Use currentWidth for border-based width
            let bHeight = currentHeight; // Use currentHeight for border-based height
            let triangleColor = color1.value; // Triangles use a single color for simplicity with borders

            switch (shapeType.value) {
                case "triangle-up":
                    shape.style.borderLeft = `${bWidth / 2}px solid transparent`;
                    shape.style.borderRight = `${bWidth / 2}px solid transparent`;
                    shape.style.borderBottom = `${bHeight}px solid ${triangleColor}`;
                    break;
                case "triangle-down":
                    shape.style.borderLeft = `${bWidth / 2}px solid transparent`;
                    shape.style.borderRight = `${bWidth / 2}px solid transparent`;
                    shape.style.borderTop = `${bHeight}px solid ${triangleColor}`;
                    break;
                case "triangle-left":
                    shape.style.borderTop = `${bHeight / 2}px solid transparent`;
                    shape.style.borderBottom = `${bHeight / 2}px solid transparent`;
                    shape.style.borderRight = `${bWidth}px solid ${triangleColor}`;
                    break;
                case "triangle-right":
                    shape.style.borderTop = `${bHeight / 2}px solid transparent`;
                    shape.style.borderBottom = `${bHeight / 2}px solid transparent`;
                    shape.style.borderLeft = `${bWidth}px solid ${triangleColor}`;
                    break;
            }
            break;
        case "pentagon": shape.style.clipPath = "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"; shape.style.borderRadius = "0"; break;
        case "hexagon": shape.style.clipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"; shape.style.borderRadius = "0"; break;
        case "octagon": shape.style.clipPath = "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"; shape.style.borderRadius = "0"; break;
        case "star": shape.style.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"; shape.style.borderRadius = "0"; break;
        case "diamond": shape.style.clipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"; shape.style.borderRadius = "0"; break;
        case "parallelogram": shape.style.clipPath = "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)"; shape.style.borderRadius = "0"; break;
        case "trapezoid": shape.style.clipPath = "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)"; shape.style.borderRadius = "0"; break;
    }

    // --- Apply primary background and effects ---
    if (!useBorderForShape) {
        if (effect.value === "pattern") {
            shape.style.background = `repeating-linear-gradient(45deg, ${color1.value}, ${color1.value} 10px, ${color2.value} 10px, ${color2.value} 20px)`;
        } else if (effect.value === "glass") {
            shape.style.background = "rgba(255,255,255,0.15)";
            shape.style.backdropFilter = "blur(10px)";
            shape.style.border = "1px solid rgba(255,255,255,0.3)";
        } else {
             shape.style.background = getGradientString(); // Default gradient
        }
    } else { // Triangles use borders for color
        if (effect.value === "glass") {
            const glassColor = "rgba(255,255,255,0.15)";
            const bWidth = currentWidth;
            const bHeight = currentHeight;
            if (shapeType.value === "triangle-up") shape.style.borderBottom = `${bHeight}px solid ${glassColor}`;
            if (shapeType.value === "triangle-down") shape.style.borderTop = `${bHeight}px solid ${glassColor}`;
            if (shapeType.value === "triangle-left") shape.style.borderRight = `${bWidth}px solid ${glassColor}`;
            if (shapeType.value === "triangle-right") shape.style.borderLeft = `${bWidth}px solid ${glassColor}`;
            shape.style.backdropFilter = "blur(10px)";
        } else {
            shape.style.background = "none"; // Ensure no background for border-shapes
        }
    }

    // --- Apply Multiple Box-Shadows ---
    if (enableMultiShadow.checked && shadowSettings.length > 0 && effect.value!== "neon") {
        shape.style.boxShadow = shadowSettings.map(s => `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`).join(', ');
    } else if (effect.value === "neon") {
        shape.style.boxShadow = `0 0 10px ${color1.value}, 0 0 20px ${color1.value}, 0 0 40px ${color2.value}`;
    } else {
        shape.style.boxShadow = "none";
    }

    // --- Apply Animations ---
    if (enableAnimation.checked && animationTypeControl.value!== "none") {
        const animationName = animationTypeControl.value;
        const animationDuration = getParsedFloat(animationDurationControl) + 's';
        const animationTimingFunction = 'ease-in-out';
        const animationIterationCount = 'infinite';
        const animationDirection = (animationName === 'rotateContinuous')? 'normal' : 'alternate';

        let styleSheet = document.getElementById('dynamic-keyframes');
        if (!styleSheet) {
            styleSheet = document.createElement("style");
            styleSheet.setAttribute('id', 'dynamic-keyframes');
            document.head.appendChild(styleSheet);
        }
        while(styleSheet.sheet && styleSheet.sheet.cssRules.length > 0) {
            styleSheet.sheet.deleteRule(0);
        }

        if (animationName === 'pulse') {
            styleSheet.sheet.insertRule(`
                @keyframes dynamicPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `);
            shape.style.animation = `dynamicPulse ${animationDuration} ${animationTimingFunction} ${animationIterationCount} ${animationDirection}`;
        } else if (animationName === 'rotateContinuous') {
             styleSheet.sheet.insertRule(`
                @keyframes dynamicRotation {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `);
            shape.style.animation = `dynamicRotation ${animationDuration} linear ${animationIterationCount}`;
        }
    } else {
        shape.style.animation = 'none'; // Disable animation if not checked or type is none
    }

    // --- Apply Pseudo-elements ---
    let pseudoStyleSheet = document.getElementById('pseudo-element-style');
    if (!pseudoStyleSheet) {
        pseudoStyleSheet = document.createElement("style");
        pseudoStyleSheet.setAttribute('id', 'pseudo-element-style');
        document.head.appendChild(pseudoStyleSheet);
    }
    while(pseudoStyleSheet.sheet && pseudoStyleSheet.sheet.cssRules.length > 0) {
        pseudoStyleSheet.sheet.deleteRule(0);
    }

    if (enablePseudo.checked &&!useBorderForShape) { // Avoid pseudo-elements on complex border shapes
        const pseudoElementOffset = getParsedInt(pseudoOffsetControl) + 'px';
        const pseudoElementColor = pseudoColorControl.value;

        pseudoStyleSheet.sheet.insertRule(`
            #shape::before, #shape::after {
                content: '';
                position: absolute;
                width: calc(100% - ${pseudoElementOffset} * 2);
                height: calc(100% - ${pseudoElementOffset} * 2);
                border-radius: inherit;
                z-index: -1;
            }
        `);
        pseudoStyleSheet.sheet.insertRule(`
            #shape::before {
                background: ${pseudoElementColor};
                top: ${pseudoElementOffset};
                left: ${pseudoElementOffset};
            }
        `);
        pseudoStyleSheet.sheet.insertRule(`
            #shape::after {
                background: ${color2.value};
                opacity: 0.5;
                top: -${pseudoElementOffset};
                left: -${pseudoElementOffset};
            }
        `);
        shape.style.position = 'relative'; // Ensure z-index works
        shape.style.zIndex = '1'; // Bring shape to front of its own pseudo elements
    } else {
        shape.style.position = 'relative'; // Always relative for dragging
        shape.style.zIndex = ''; // Reset z-index if pseudo elements are off
    }

    // --- Apply Transform with current drag/zoom/rotate values ---
    shape.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px)) rotate(${currentRotate}deg) scale(${currentScale})`;

    generateCSS();
}

// --- CSS Generation for Code Output ---
function generateCSS() {
    let cssText = `#shape {\n`;

    // Vendor Prefix helper
    const addPrefix = (prop, value) => {
        if (!includeVendorPrefixes) return ` ${prop}: ${value};\n`;
        let prefixed = '';
        if (prop === 'transform' || prop === 'filter' || prop === 'backdrop-filter' || prop === 'clip-path') {
            prefixed += ` -webkit-${prop}: ${value};\n`;
            prefixed += ` -moz-${prop}: ${value};\n`; // For Firefox, though less critical for these props
        }
        prefixed += ` ${prop}: ${value};\n`;
        return prefixed;
    };

    // Position and Transform (drag, rotate, scale)
    cssText += ` position: absolute;\n`;
    cssText += ` top: 50%;\n`;
    cssText += ` left: 50%;\n`;
    cssText += addPrefix('transform', `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px)) rotate(${getParsedInt(rotate)}deg) scale(${currentScale})`);

    // Dimensions
    if (shape.style.width && shape.style.width!== "0px") {
        cssText += ` width: ${shape.style.width};\n`;
    }
    if (shape.style.height && shape.style.height!== "0px") {
        cssText += ` height: ${shape.style.height};\n`;
    }

    // Shape-specific properties
    if (shapeType.value.startsWith("triangle-")) {
        cssText += ` width: 0;\n height: 0;\n`;
        if (shape.style.borderTop && shape.style.borderTop!== "0px solid transparent") cssText += ` border-top: ${shape.style.borderTop};\n`;
        if (shape.style.borderBottom && shape.style.borderBottom!== "0px solid transparent") cssText += ` border-bottom: ${shape.style.borderBottom};\n`;
        if (shape.style.borderLeft && shape.style.borderLeft!== "0px solid transparent") cssText += ` border-left: ${shape.style.borderLeft};\n`;
        if (shape.style.borderRight && shape.style.borderRight!== "0px solid transparent") cssText += ` border-right: ${shape.style.borderRight};\n`;
        cssText += ` border-color: transparent;\n`; // Ensure unused borders are transparent
        cssText += ` background: none;\n`; // Clear background for border-based shapes
    } else {
        if (shape.style.background && shape.style.background!== "none") {
            cssText += ` background: ${shape.style.background};\n`;
        }
        if (shape.style.borderRadius && shape.style.borderRadius!== "0px" && shape.style.borderRadius!== "initial") {
            cssText += ` border-radius: ${shape.style.borderRadius};\n`;
        }
        if (shape.style.clipPath && shape.style.clipPath!== "none") {
            cssText += addPrefix('clip-path', shape.style.clipPath);
        }
    }

    // Effects and Filters
    if (shape.style.boxShadow && shape.style.boxShadow!== "none") {
        cssText += ` box-shadow: ${shape.style.boxShadow};\n`;
    }
    if (shape.style.backdropFilter && shape.style.backdropFilter!== "none") {
        cssText += addPrefix('backdrop-filter', shape.style.backdropFilter);
    }
    if (shape.style.border && shape.style.border!== "none" &&!shapeType.value.startsWith("triangle-")) {
        cssText += ` border: ${shape.style.border};\n`;
    }
    if (shape.style.filter && shape.style.filter!== "none") {
        cssText += addPrefix('filter', shape.style.filter);
    }

    // Animation
    if (enableAnimation.checked && animationTypeControl.value!== "none") {
        const animationName = animationTypeControl.value;
        const animationDuration = getParsedFloat(animationDurationControl) + 's';
        const animationTimingFunction = 'ease-in-out';
        const animationIterationCount = 'infinite';
        const animationDirection = (animationName === 'rotateContinuous')? 'normal' : 'alternate';
        const animationValue = `${animationName === 'pulse'? 'dynamicPulse' : 'dynamicRotation'} ${animationDuration} ${animationTimingFunction} ${animationIterationCount} ${animationDirection}`;
        if (includeVendorPrefixes) {
            cssText += ` -webkit-animation: ${animationValue};\n`;
        }
        cssText += ` animation: ${animationValue};\n`;
    }
    if (shape.style.zIndex === '1') { // Only include if pseudo-elements are active
        cssText += ` z-index: 1;\n`;
    }

    cssText += `}\n`;

    // Keyframes for animations
    if (enableAnimation.checked && animationTypeControl.value!== "none") {
        const animationName = animationTypeControl.value;
        if (animationName === 'rotateContinuous') {
            if (includeVendorPrefixes) cssText += `\n@-webkit-keyframes dynamicRotation {\n 0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }\n 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\n}\n`;
            cssText += `\n@keyframes dynamicRotation {\n 0% { transform: rotate(0deg); }\n 100% { transform: rotate(360deg); }\n}\n`;
        } else if (animationName === 'pulse') {
            if (includeVendorPrefixes) cssText += `\n@-webkit-keyframes dynamicPulse {\n 0% { -webkit-transform: scale(1); transform: scale(1); }\n 50% { -webkit-transform: scale(1.05); transform: scale(1.05); }\n 100% { -webkit-transform: scale(1); transform: scale(1); }\n}\n`;
            cssText += `\n@keyframes dynamicPulse {\n 0% { transform: scale(1); }\n 50% { transform: scale(1.05); }\n 100% { transform: scale(1); }\n}\n`;
        }
    }

    // Pseudo-element CSS
    if (enablePseudo.checked &&!shapeType.value.startsWith("triangle-")) {
        const pseudoElementOffset = getParsedInt(pseudoOffsetControl) + 'px';
        const pseudoElementColor = pseudoColorControl.value;

        cssText += `\n#shape::before,\n#shape::after {\n`;
        cssText += ` content: '';\n`;
        cssText += ` position: absolute;\n`;
        cssText += ` width: calc(100% - ${pseudoElementOffset} * 2);\n`;
        cssText += ` height: calc(100% - ${pseudoElementOffset} * 2);\n`;
        cssText += ` border-radius: inherit;\n`;
        cssText += ` z-index: -1;\n`;
        cssText += `}\n\n`;
        cssText += `#shape::before {\n`;
        cssText += ` background: ${pseudoElementColor};\n`;
        cssText += ` top: ${pseudoElementOffset};\n`;
        cssText += ` left: ${pseudoElementOffset};\n`;
        cssText += `}\n\n`;
        cssText += `#shape::after {\n`;
        cssText += ` background: ${color2.value};\n`;
        cssText += ` opacity: 0.5;\n`;
        cssText += ` top: -${pseudoElementOffset};\n`;
        cssText += ` left: -${pseudoElementOffset};\n`;
        cssText += `}\n`;
    }

    cssCode.textContent = cssText;
}

// --- Dragging Functions ---
function getShapeCurrentVisualTransform() {
    const style = window.getComputedStyle(shape);
    const transformMatrix = new DOMMatrixReadOnly(style.transform);
    return {
        translateX: transformMatrix.m41,
        translateY: transformMatrix.m42
    };
}

function startDrag(clientX, clientY) {
    isDragging = true;
    shape.classList.add('dragging');
    shape.setAttribute('aria-grabbed', 'true'); // Accessibility

    const { translateX, translateY } = getShapeCurrentVisualTransform();

    startPointerPosition = { x: clientX, y: clientY };
    startOffset = { x: translateX, y: translateY };
}

function duringDrag(clientX, clientY) {
    if (!isDragging) return;

    const deltaX = clientX - startPointerPosition.x;
    const deltaY = clientY - startPointerPosition.y;

    let calculatedX = startOffset.x + deltaX;
    let calculatedY = startOffset.y + deltaY;

    // --- Dragging Boundary Check ---
    const shapeRect = shape.getBoundingClientRect();
    const previewRect = preview.getBoundingClientRect();

    // Max movement from the preview's center point
    // This accounts for the shape's actual rendered size and scale
    const currentShapeWidth = shapeRect.width;
    const currentShapeHeight = shapeRect.height;

    const maxX = (previewRect.width / 2) - (currentShapeWidth / 2);
    const maxY = (previewRect.height / 2) - (currentShapeHeight / 2);

    xOffset = Math.max(-maxX, Math.min(calculatedX, maxX));
    yOffset = Math.max(-maxY, Math.min(calculatedY, maxY));
    // --- End Dragging Boundary Check ---

    updateShape();
}

function endDrag() {
    isDragging = false;
    shape.classList.remove('dragging');
    shape.setAttribute('aria-grabbed', 'false'); // Accessibility
}

// --- Zoom Function (Mouse Wheel) ---
function zoom(e) {
    e.preventDefault();

    const oldScale = currentScale;
    const scaleAmount = e.deltaY * -1 * ZOOM_STEP; // Negative deltaY for zoom in
    currentScale = Math.min(Math.max(MIN_SCALE, currentScale + scaleAmount), MAX_SCALE);

    // Zoom relative to cursor position
    const previewRect = preview.getBoundingClientRect();
    const cursorX = e.clientX - previewRect.left;
    const cursorY = e.clientY - previewRect.top;

    // Calculate mouse position relative to the shape's current visual center
    const shapeRect = shape.getBoundingClientRect();
    const shapeCenterX = shapeRect.left + shapeRect.width / 2;
    const shapeCenterY = shapeRect.top + shapeRect.height / 2;

    const mouseOffsetX = cursorX - (shapeCenterX - previewRect.left);
    const mouseOffsetY = cursorY - (shapeCenterY - previewRect.top);

    // Adjust xOffset and yOffset to keep the cursor point stable relative to the shape
    xOffset += mouseOffsetX * (1 / oldScale - 1 / currentScale);
    yOffset += mouseOffsetY * (1 / oldScale - 1 / currentScale);

    // Re-apply boundary checks after zoom-induced offset change
    const currentShapeWidth = shapeRect.width * (currentScale / oldScale); // Estimate new size
    const currentShapeHeight = shapeRect.height * (currentScale / oldScale);

    const maxX = (previewRect.width / 2) - (currentShapeWidth / 2);
    const maxY = (previewRect.height / 2) - (currentShapeHeight / 2);

    xOffset = Math.max(-maxX, Math.min(xOffset, maxX));
    yOffset = Math.max(-maxY, Math.min(yOffset, maxY));

    updateShape();
}

// --- Touch Events for Mobile (Drag & Pinch-to-Zoom) ---
function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function touchStart(e) {
    e.preventDefault(); // Prevent scrolling

    initialTouchPositions = Array.from(e.touches); // Store initial touches
    endDrag(); // Ensure dragging state is reset

    if (e.touches.length === 1) { // Single touch for dragging
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) { // Two touches for pinch-to-zoom
        touchStartDistance = getDistance(e.touches);
        touchStartScale = currentScale;
    }
}

function touchMove(e) {
    e.preventDefault();

    if (e.touches.length === 1 && isDragging) { // Single touch drag
        duringDrag(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && touchStartDistance!== null) { // Pinch-to-zoom
        const currentDistance = getDistance(e.touches);
        let pinchScale = currentDistance / touchStartDistance;

        // Apply scale
        const oldScale = currentScale;
        currentScale = Math.min(Math.max(MIN_SCALE, touchStartScale * pinchScale), MAX_SCALE);

        // Simple center zoom for touch, more complex centering would be needed for exact pinch point
        const previewRect = preview.getBoundingClientRect();
        const shapeRect = shape.getBoundingClientRect();

        // Calculate a centroid for the two touches for a more intuitive zoom center
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - previewRect.left;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - previewRect.top;

        const shapeCenterX = shapeRect.left + shapeRect.width / 2 - previewRect.left;
        const shapeCenterY = shapeRect.top + shapeRect.height / 2 - previewRect.top;

        const mouseOffsetX = centerX - shapeCenterX;
        const mouseOffsetY = centerY - shapeCenterY;

        xOffset += mouseOffsetX * (1 / oldScale - 1 / currentScale);
        yOffset += mouseOffsetY * (1 / oldScale - 1 / currentScale);

        // Boundary check after zoom
        const currentShapeWidth = shapeRect.width * (currentScale / oldScale);
        const currentShapeHeight = shapeRect.height * (currentScale / oldScale);

        const maxX = (previewRect.width / 2) - (currentShapeWidth / 2);
        const maxY = (previewRect.height / 2) - (currentShapeHeight / 2);

        xOffset = Math.max(-maxX, Math.min(xOffset, maxX));
        yOffset = Math.max(-maxY, Math.min(yOffset, maxY));

        updateShape();
    }
}

function touchEnd(e) {
    isDragging = false;
    shape.classList.remove('dragging');
    shape.setAttribute('aria-grabbed', 'false'); // Accessibility
    touchStartDistance = null;
    initialTouchPositions = [];
}

// --- Preset Saving/Loading Functions ---
function savePreset(name) {
    // Sanitize name to be safe for localStorage key
    const safeName = name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    if (!safeName) {
        alert("Please enter a valid name for your preset.");
        return;
    }

    const preset = {
        color1: color1.value,
        color2: color2.value,
        radius: getParsedInt(radius),
        rotate: getParsedInt(rotate),
        effect: effect.value,
        shapeType: shapeType.value,
        width: getParsedInt(widthControl),
        height: getParsedInt(heightControl),
        filterSaturate: getParsedInt(filterSaturate),
        filterContrast: getParsedInt(filterContrast),
        filterSepia: getParsedInt(filterSepia),
        filterGrayscale: getParsedInt(filterGrayscale),
        filterHueRotate: getParsedInt(filterHueRotate),
        gradientType: gradientType.value,
        gradientDirection: getParsedInt(gradientDirection),
        shadowSettings: shadowSettings,
        enableMultiShadow: enableMultiShadow.checked,
        numShadows: getParsedInt(numShadowsControl),
        enableAnimation: enableAnimation.checked,
        animationType: animationTypeControl.value,
        animationDuration: getParsedFloat(animationDurationControl),
        enablePseudo: enablePseudo.checked,
        pseudoOffset: getParsedInt(pseudoOffsetControl),
        pseudoColor: pseudoColorControl.value,
        xOffset: xOffset,
        yOffset: yOffset,
        currentScale: currentScale
    };
    try {
        localStorage.setItem(`cssArtStudioPreset_${safeName}`, JSON.stringify(preset));
        alert(`Preset "${safeName}" saved!`);
        renderPresetList();
    } catch (e) {
        console.error("Error saving preset:", e);
        alert("Error saving preset. Local storage might be full or blocked.");
    }
}

function loadPreset(name) {
    try {
        const storedPreset = localStorage.getItem(`cssArtStudioPreset_${name}`);
        if (storedPreset) {
            const preset = JSON.parse(storedPreset);

            // Set UI control values
            color1.value = preset.color1 || '#3498db';
            color2.value = preset.color2 || '#9b59b6';
            radius.value = preset.radius || 20;
            rotate.value = preset.rotate || 0;
            effect.value = preset.effect || 'none';
            shapeType.value = preset.shapeType || 'square';
            widthControl.value = preset.width || 220;
            heightControl.value = preset.height || 220;
            filterSaturate.value = preset.filterSaturate || 100;
            filterContrast.value = preset.filterContrast || 100;
            filterSepia.value = preset.filterSepia || 0;
            filterGrayscale.value = preset.filterGrayscale || 0;
            filterHueRotate.value = preset.filterHueRotate || 0;
            gradientType.value = preset.gradientType || 'linear';
            gradientDirection.value = preset.gradientDirection || 135;

            // Load advanced effect settings
            shadowSettings = preset.shadowSettings || [];
            enableMultiShadow.checked = preset.enableMultiShadow || false;
            numShadowsControl.value = preset.numShadows || 1;

            enableAnimation.checked = preset.enableAnimation || false;
            animationTypeControl.value = preset.animationType || 'none';
            animationDurationControl.value = preset.animationDuration || '2';

            enablePseudo.checked = preset.enablePseudo || false;
            pseudoOffsetControl.value = preset.pseudoOffset || '10';
            pseudoColorControl.value = preset.pseudoColor || '#cccccc';

            xOffset = preset.xOffset || 0;
            yOffset = preset.yOffset || 0;
            currentScale = preset.currentScale || 1;

            updateShape();
            alert(`Preset "${name}" loaded!`);
        } else {
            alert(`Preset "${name}" not found.`);
        }
    } catch (e) {
        console.error("Error loading preset:", e);
        alert("Error loading preset. Data might be corrupted or local storage blocked.");
    }
}

function deletePreset(name) {
    if (confirm(`Are you sure you want to delete preset "${name}"?`)) {
        localStorage.removeItem(`cssArtStudioPreset_${name}`);
        alert(`Preset "${name}" deleted.`);
        renderPresetList();
    }
}

function renderPresetList() {
    presetListDiv.innerHTML = "";
    const presets = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("cssArtStudioPreset_")) {
            presets.push(key.replace("cssArtStudioPreset_", ""));
        }
    }

    if (presets.length === 0) {
        presetListDiv.innerHTML = "<p>No presets saved yet.</p>";
        return;
    }
    presets.sort().forEach(name => {
        const presetItem = document.createElement("div");

        const loadButton = document.createElement("button");
        loadButton.textContent = name;
        loadButton.className = "preset-load-button";
        loadButton.onclick = () => loadPreset(name);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.className = "delete-preset";
        deleteButton.onclick = (e) => {
            e.stopPropagation(); // prevent loading preset
            deletePreset(name);
        };

        presetItem.style.position = "relative"; // Ensure position for delete button
        presetItem.appendChild(loadButton);
        presetItem.appendChild(deleteButton);

        presetListDiv.appendChild(presetItem);
    });
}

// --- Randomization Functions ---
function randomDesign() {
    color1.value = randomColor();
    color2.value = randomColor();

    radius.value = rand(0, 50);
    rotate.value = rand(0, 360);

    let effects = ["none", "glass", "neon", "blob", "pattern"];
    effect.value = effects[rand(0, effects.length - 1)];

    let shapes = [
        "square", "rectangle", "rounded-rectangle", "circle",
        "triangle-up", "triangle-down", "triangle-left", "triangle-right",
        "pentagon", "hexagon", "octagon", "star", "diamond",
        "parallelogram", "trapezoid"
    ];
    shapeType.value = shapes[rand(0, shapes.length - 1)];

    // Random filters
    filterSaturate.value = rand(0, 200);
    filterContrast.value = rand(0, 200);
    filterSepia.value = rand(0, 100);
    filterGrayscale.value = rand(0, 100);
    filterHueRotate.value = rand(0, 360);

    // Random gradient
    let gradientTypes = ["linear", "radial", "conic"];
    gradientType.value = gradientTypes[rand(0, gradientTypes.length - 1)];
    gradientDirection.value = rand(0, 360);

    widthControl.value = rand(50, 300);
    heightControl.value = rand(50, 300);

    // --- Randomize Advanced Effects ---
    enableMultiShadow.checked = rand(0, 1) === 1;
    if (enableMultiShadow.checked) {
        shadowSettings = [];
        const numShadows = rand(1, parseInt(numShadowsControl.max)); // Use max from UI control
        numShadowsControl.value = numShadows; // Update UI
        for (let i = 0; i < numShadows; i++) {
            shadowSettings.push({
                x: rand(-10, 10), y: rand(-10, 10),
                blur: rand(5, 30), spread: rand(-5, 5),
                color: randomColor() + '80'
            });
        }
    } else {
        shadowSettings = []; // Clear shadows if disabled
    }

    enableAnimation.checked = rand(0, 1) === 1;
    if (enableAnimation.checked) {
        let animTypes = ["pulse", "rotateContinuous"];
        animationTypeControl.value = animTypes[rand(0, animTypes.length - 1)];
        animationDurationControl.value = rand(1, 4); // Random duration
    } else {
        animationTypeControl.value = 'none';
    }

    enablePseudo.checked = rand(0, 1) === 1;
    if (enablePseudo.checked) {
        pseudoOffsetControl.value = rand(1, 50);
        pseudoColorControl.value = randomColor();
    }

    // Reset drag and zoom for random designs
    xOffset = 0;
    yOffset = 0;
    currentScale = 1;

    updateShape();
}

// --- Reset Functions (Exposed via UI for now) ---
function resetAllControls() {
    color1.value = "#3498db";
    color2.value = "#9b59b6";
    radius.value = 20;
    rotate.value = 0;
    effect.value = "none";
    shapeType.value = "square";
    widthControl.value = 220;
    heightControl.value = 220;
    filterSaturate.value = 100;
    filterContrast.value = 100;
    filterSepia.value = 0;
    filterGrayscale.value = 0;
    filterHueRotate.value = 0;
    gradientType.value = "linear";
    gradientDirection.value = 135;

    enableMultiShadow.checked = false;
    shadowSettings = [];
    numShadowsControl.value = 1;

    enableAnimation.checked = false;
    animationTypeControl.value = "none";
    animationDurationControl.value = 2;

    enablePseudo.checked = false;
    pseudoOffsetControl.value = 10;
    pseudoColorControl.value = "#cccccc";

    resetPositionAndZoom();
    updateShape();
}

function resetPositionAndZoom() {
    xOffset = 0;
    yOffset = 0;
    currentScale = 1;
    updateShape();
}

// --- Copy CSS Function with Feedback ---
function copyCSS() {
    navigator.clipboard.writeText(cssCode.textContent);
    const originalText = copyCssButton.textContent;
    copyCssButton.textContent = "Copied!";
    setTimeout(() => {
        copyCssButton.textContent = originalText;
    }, 1500);
}

// --- Event Listeners ---
color1.addEventListener("input", updateShape);
color2.addEventListener("input", updateShape);
radius.addEventListener("input", updateShape);
rotate.addEventListener("input", updateShape);
effect.addEventListener("change", updateShape);
shapeType.addEventListener("change", updateShape);
widthControl.addEventListener("input", updateShape);
heightControl.addEventListener("input", updateShape);

// Filter listeners
filterSaturate.addEventListener("input", updateShape);
filterContrast.addEventListener("input", updateShape);
filterSepia.addEventListener("input", updateShape);
filterGrayscale.addEventListener("input", updateShape);
filterHueRotate.addEventListener("input", updateShape);

// Gradient listeners
gradientType.addEventListener("change", updateShape);
gradientDirection.addEventListener("input", updateShape);

// Advanced Effects listeners
enableMultiShadow.addEventListener("change", () => {
    if (enableMultiShadow.checked && shadowSettings.length === 0) {
        const num = getParsedInt(numShadowsControl);
        for (let i = 0; i < num; i++) {
            shadowSettings.push({ x: rand(-10, 10), y: rand(-10, 10), blur: rand(5, 30), spread: rand(-5, 5), color: randomColor() + '80' });
        }
    } else if (!enableMultiShadow.checked) {
        shadowSettings = []; // Clear shadows if disabled
    }
    updateShape();
});
numShadowsControl.addEventListener("change", () => {
    // Regenerate random shadows if count changes and enabled
    if (enableMultiShadow.checked) {
        shadowSettings = [];
        const num = getParsedInt(numShadowsControl);
        for (let i = 0; i < num; i++) {
            shadowSettings.push({ x: rand(-10, 10), y: rand(-10, 10), blur: rand(5, 30), spread: rand(-5, 5), color: randomColor() + '80' });
        }
    }
    updateShape();
});

enableAnimation.addEventListener("change", updateShape);
animationTypeControl.addEventListener("change", updateShape);
animationDurationControl.addEventListener("input", updateShape);

enablePseudo.addEventListener("change", updateShape);
pseudoOffsetControl.addEventListener("input", updateShape);
pseudoColorControl.addEventListener("input", updateShape);

// Dragging (Mouse)
shape.addEventListener("mousedown", (e) => {
    startDrag(e.clientX, e.clientY);
});
preview.addEventListener("mousemove", (e) => {
    if (isDragging) duringDrag(e.clientX, e.clientY);
});
preview.addEventListener("mouseup", endDrag);
preview.addEventListener("mouseleave", endDrag); // End drag if mouse leaves preview area

// Zoom (Mouse Wheel)
preview.addEventListener("wheel", zoom, { passive: false });

// Touch events for mobile dragging/pinch-zoom
preview.addEventListener("touchstart", touchStart, { passive: false });
preview.addEventListener("touchmove", touchMove, { passive: false });
preview.addEventListener("touchend", touchEnd);
preview.addEventListener("touchcancel", touchEnd);

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return; // Don't trigger shortcuts if typing in an input field
    }

    if (e.key === 'r' || e.key === 'R') {
        randomDesign();
    } else if (e.key === 'c' || e.key === 'C') {
        copyCSS();
    } else if (e.key === 'x' || e.key === 'X') { // Reset position/zoom
        resetPositionAndZoom();
    } else if (e.key === 'z' || e.key === 'Z') { // Reset all controls
        resetAllControls();
    }
});

// --- Initial Setup ---
updateShape();
renderPresetList(); // Load saved presets on startup