const canvas = new fabric.Canvas('memeCanvas');

// --- Undo/Redo History ---
let history = [];
let historyPointer = -1;
let isRedoing = false;
let isUndoable = false; // Flag to indicate if canvas state is from undo/redo

const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

function saveCanvasState() {
    if (isRedoing) {
        isRedoing = false;
        return;
    }

    // Only save if the change wasn't initiated by an undo/redo operation
    if (!isUndoable) {
        const json = JSON.stringify(canvas.toJSON());
        if (historyPointer < history.length - 1) {
            history = history.slice(0, historyPointer + 1); // Truncate redo history
        }
        history.push(json);
        historyPointer = history.length - 1;
    } else {
        isUndoable = false; // Reset the flag after processing the undo/redo
    }
    updateHistoryButtons();
}

function updateHistoryButtons() {
    undoBtn.disabled = (historyPointer <= 0);
    redoBtn.disabled = (historyPointer >= history.length - 1);
}

function undo() {
    if (historyPointer > 0) {
        historyPointer--;
        isRedoing = true;
        isUndoable = true; // Set flag to indicate this is an undo action
        canvas.loadFromJSON(history[historyPointer], () => {
            canvas.renderAll();
            updateLayerPanel();
            updateControls();
            autoSave(false); // Do not save history for undo/redo ops
        });
    }
    updateHistoryButtons();
}

function redo() {
    if (historyPointer < history.length - 1) {
        historyPointer++;
        isRedoing = true;
        isUndoable = true; // Set flag to indicate this is a redo action
        canvas.loadFromJSON(history[historyPointer], () => {
            canvas.renderAll();
            updateLayerPanel();
            updateControls();
            autoSave(false); // Do not save history for undo/redo ops
        });
    }
    updateHistoryButtons();
}

undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

// --- Canvas Initialization & Auto-Save ---
canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));

// Modified autoSave to optionally not save to history (for undo/redo loads)
function autoSave(saveToHistory = true) {
    if (saveToHistory) {
        saveCanvasState(); // Save current state for undo/redo
    }

    // Only save to localStorage if there's actual content or if cleared
    if (canvas.getObjects().length > 0 || canvas.backgroundColor!== '#ffffff') {
        localStorage.setItem("memeV2", JSON.stringify(canvas.toJSON()));
    } else {
        localStorage.removeItem("memeV2"); // Clear save if canvas is truly empty
    }
    updateLayerPanel();
    updateControls(); // Update controls when object changes or selection changes
}

canvas.on('object:added', () => autoSave());
canvas.on('object:modified', () => autoSave());
canvas.on('object:removed', () => autoSave());
canvas.on('selection:created', updateControls);
canvas.on('selection:updated', updateControls);
canvas.on('selection:cleared', updateControls);

window.onload = function() {
    let data = localStorage.getItem("memeV2");
    if (data) {
        canvas.loadFromJSON(data, () => {
            canvas.renderAll();
            history = [data]; // Initialize history with loaded state
            historyPointer = 0;
            updateLayerPanel();
            updateControls();
            updateHistoryButtons();
        });
    } else {
        saveCanvasState(); // Save initial empty state
        updateControls();
        updateHistoryButtons();
    }
};

// --- Panel Control Updaters ---
function updateControls() {
    const activeObject = canvas.getActiveObject();
    const isText = activeObject && activeObject.type === 'i-text';
    const isImage = activeObject && activeObject.type === 'image';

    // General controls (opacity, transform buttons)
    document.getElementById("opacity").disabled =!activeObject;
    document.getElementById("bringForward").disabled =!activeObject;
    document.getElementById("sendBackward").disabled =!activeObject;

    // Text-specific controls
    document.getElementById("fontFamily").disabled =!isText;
    document.getElementById("textColor").disabled =!isText;
    document.getElementById("strokeColor").disabled =!isText;
    document.getElementById("fontSize").disabled =!isText;
    document.getElementById("textAlign").disabled =!isText;
    document.getElementById("shadowColor").disabled =!isText;
    document.getElementById("shadowBlur").disabled =!isText;
    document.getElementById("shadowOffsetX").disabled =!isText;
    document.getElementById("shadowOffsetY").disabled =!isText;

    // Image-specific filters
    document.getElementById("filterGrayscale").disabled =!isImage;
    document.getElementById("filterSepia").disabled =!isImage;
    document.getElementById("filterInvert").disabled =!isImage;
    document.getElementById("filterContrast").disabled =!isImage;
    document.getElementById("filterBlur").disabled =!isImage;
    document.getElementById("filterRemove").disabled =!isImage;
    document.getElementById("contrastValue").disabled =!isImage;
    document.getElementById("blurValue").disabled =!isImage;

    // Update values if an object is selected
    if (activeObject) {
        document.getElementById("opacity").value = activeObject.opacity || 1;

        if (isText) {
            document.getElementById("fontFamily").value = activeObject.fontFamily || "Impact";
            document.getElementById("textColor").value = activeObject.fill || "#ffffff";
            document.getElementById("strokeColor").value = activeObject.stroke || "#000000";
            document.getElementById("fontSize").value = activeObject.fontSize || 40;
            document.getElementById("textAlign").value = activeObject.textAlign || "left";

            // Text shadow properties
            const shadow = activeObject.shadow || {
                color: "#000000",
                blur: 0,
                offsetX: 0,
                offsetY: 0
            };
            document.getElementById("shadowColor").value = shadow.color;
            document.getElementById("shadowBlur").value = shadow.blur;
            document.getElementById("shadowOffsetX").value = shadow.offsetX;
            document.getElementById("shadowOffsetY").value = shadow.offsetY;

        } else if (isImage) {
             // Update image filter values if they are active
            let contrastFilter = activeObject.filters.find(f => f.type === 'Contrast');
            document.getElementById("contrastValue").value = contrastFilter? contrastFilter.contrast : 0;

            let blurFilter = activeObject.filters.find(f => f.type === 'Blur');
            document.getElementById("blurValue").value = blurFilter? blurFilter.blur : 0;
        }
    }
}

// --- Image Upload ---
document.getElementById("uploadImage").addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function(f) {
        fabric.Image.fromURL(f.target.result, function(img) {
            img.scaleToWidth(canvas.getWidth() * 0.7); // Scale to 70% of canvas width
            img.set({
                left: (canvas.getWidth() - img.getScaledWidth()) / 2,
                top: (canvas.getHeight() - img.getScaledHeight()) / 2
            });
            canvas.add(img);
            canvas.setActiveObject(img); // Make it active for immediate manipulation
            canvas.renderAll();
            autoSave();
        }, { crossOrigin: 'anonymous' }); // Added for potential cross-origin image loading
    };
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
    }
});

// --- Add Text ---
function addText() {
    let text = new fabric.IText("Your Meme Text", {
        left: 50,
        top: 50,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 2,
        fontSize: 40,
        fontFamily: "Impact",
        textAlign: "center",
        shadow: {
            color: "#000000",
            blur: 0,
            offsetX: 0,
            offsetY: 0
        }
    });
    canvas.add(text);
    canvas.setActiveObject(text); // Make it active
    canvas.renderAll();
    autoSave();
}

// --- Canvas Background ---
document.getElementById("bgColor").oninput = function() {
    canvas.setBackgroundColor(this.value, canvas.renderAll.bind(canvas));
    autoSave(); // Save background color changes
};

// --- Text Controls ---
document.getElementById("fontFamily").onchange = function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set("fontFamily", this.value);
        canvas.renderAll();
        autoSave();
    }
};

document.getElementById("textColor").oninput = function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set("fill", this.value);
        canvas.renderAll();
        autoSave();
    }
};

document.getElementById("strokeColor").oninput = function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set("stroke", this.value);
        canvas.renderAll();
        autoSave();
    }
};

document.getElementById("fontSize").oninput = function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set("fontSize", parseInt(this.value));
        canvas.renderAll();
        autoSave();
    }
};

document.getElementById("opacity").oninput = function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) { // Opacity can apply to any object
        activeObject.set("opacity", parseFloat(this.value));
        canvas.renderAll();
        autoSave();
    }
};

document.getElementById("textAlign").onchange = function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set("textAlign", this.value);
        canvas.renderAll();
        autoSave();
    }
};

// --- Text Shadow Controls ---
function updateTextShadow() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set({
            shadow: new fabric.Shadow({
                color: document.getElementById("shadowColor").value,
                blur: parseInt(document.getElementById("shadowBlur").value),
                offsetX: parseInt(document.getElementById("shadowOffsetX").value),
                offsetY: parseInt(document.getElementById("shadowOffsetY").value)
            })
        });
        canvas.renderAll();
        autoSave();
    }
}
document.getElementById("shadowColor").oninput = updateTextShadow;
document.getElementById("shadowBlur").oninput = updateTextShadow;
document.getElementById("shadowOffsetX").oninput = updateTextShadow;
document.getElementById("shadowOffsetY").oninput = updateTextShadow;

// --- Image Filters ---
function applyFilter(filterType, value = 0) {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type!== 'image') {
        alert("Please select an image to apply filters.");
        return;
    }

    let filter;
    switch (filterType) {
        case 'Grayscale':
            filter = new fabric.Image.filters.Grayscale();
            break;
        case 'Sepia':
            filter = new fabric.Image.filters.Sepia();
            break;
        case 'Invert':
            filter = new fabric.Image.filters.Invert();
            break;
        case 'Contrast':
            filter = new fabric.Image.filters.Contrast({ contrast: value });
            break;
        case 'Blur':
            filter = new fabric.Image.filters.Blur({ blur: value });
            break;
        default:
            return;
    }

    // Remove existing filter of the same type or update it
    activeObject.filters = activeObject.filters.filter(f => f.type!== filterType);
    if (filterType!== 'Remove') { // 'Remove' is not a real filter, just clears
        activeObject.filters.push(filter);
    }
    activeObject.applyFilters();
    canvas.renderAll();
    autoSave();
    updateControls(); // To update range slider values if changed
}

document.getElementById("filterGrayscale").onclick = () => applyFilter('Grayscale');
document.getElementById("filterSepia").onclick = () => applyFilter('Sepia');
document.getElementById("filterInvert").onclick = () => applyFilter('Invert');
document.getElementById("filterContrast").onclick = () => applyFilter('Contrast', parseFloat(document.getElementById("contrastValue").value));
document.getElementById("filterBlur").onclick = () => applyFilter('Blur', parseFloat(document.getElementById("blurValue").value));
document.getElementById("filterRemove").onclick = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        activeObject.filters = [];
        activeObject.applyFilters();
        canvas.renderAll();
        autoSave();
        updateControls();
    } else {
        alert("Please select an image to clear filters.");
    }
};

document.getElementById("contrastValue").oninput = function() {
    applyFilter('Contrast', parseFloat(this.value));
};
document.getElementById("blurValue").oninput = function() {
    applyFilter('Blur', parseFloat(this.value));
};

// --- Effects ---
function applyGradient() {
    let obj = canvas.getActiveObject();
    if (obj && obj.type === "i-text") {
        obj.set("fill", new fabric.Gradient({
            type: 'linear',
            coords: {
                x1: 0,
                y1: 0,
                x2: obj.width,
                y2: 0
            },
            colorStops: [{
                offset: 0,
                color: 'red'
            }, {
                offset: 0.5,
                color: 'yellow'
            }, {
                offset: 1,
                color: 'blue'
            }]
        }));
        canvas.renderAll();
        autoSave();
    } else {
        alert("Please select a text object to apply gradient.");
    }
}

function applyNeon() {
    let obj = canvas.getActiveObject();
    if (obj) {
        obj.set({
            shadow: new fabric.Shadow({
                color: "cyan",
                blur: 30,
                offsetX: 0,
                offsetY: 0
            })
        });
        canvas.renderAll();
        autoSave();
    } else {
        alert("Please select an object to apply neon effect.");
    }
}

function applyGlitch() {
    let obj = canvas.getActiveObject();
    if (obj) {
        const originalLeft = obj.left;
        gsap.to(obj, {
            left: originalLeft + 5,
            repeat: 5,
            yoyo: true,
            duration: 0.05,
            ease: "power1.inOut",
            onUpdate: () => canvas.renderAll(),
            onComplete: () => {
                obj.set({
                    left: originalLeft
                });
                canvas.renderAll();
                autoSave();
            }
        });
    } else {
        alert("Please select an object to apply glitch effect.");
    }
}

// --- Object Transform ---
function flipX() {
    let obj = canvas.getActiveObject();
    if (obj) {
        obj.toggle("flipX");
        canvas.renderAll();
        autoSave();
    } else {
        alert("Please select an object to flip.");
    }
}

function flipY() {
    let obj = canvas.getActiveObject();
    if (obj) {
        obj.toggle("flipY");
        canvas.renderAll();
        autoSave();
    } else {
        alert("Please select an object to flip.");
    }
}

function rotateObject() {
    let obj = canvas.getActiveObject();
    if (obj) {
        let newAngle = obj.angle + 15;
        obj.set({
            angle: newAngle
        });
        canvas.renderAll();
        autoSave();
    } else {
        alert("Please select an object to rotate.");
    }
}

function bringForward() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.bringForward(activeObject);
        canvas.renderAll();
        autoSave();
    } else {
        alert("Please select an object to bring forward.");
    }
}
function sendBackward() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.sendBackward(activeObject);
        canvas.renderAll();
        autoSave();
    } else {
        alert("Please select an object to send backward.");
    }
}
document.getElementById('bringForward').onclick = bringForward;
document.getElementById('sendBackward').onclick = sendBackward;

// --- Layer Panel ---
let sortableList; // Declare Sortable instance globally

function updateLayerPanel() {
    let list = document.getElementById("layerList");
    list.innerHTML = ""; // Clear existing list

    // Destroy previous Sortable instance if it exists
    if (sortableList) {
        sortableList.destroy();
    }

    // Reverse order for more intuitive layering (topmost objects in Fabric are last in array)
    const objects = canvas.getObjects().slice().reverse();
    objects.forEach((obj) => {
        const originalIndex = canvas.getObjects().indexOf(obj); // Get original index for selection
        let li = document.createElement("li");
        li.setAttribute('data-fabric-id', obj.id || obj.__eventListeners.length); // Use a unique ID for sorting
        li.innerText = (obj.type === 'i-text'? "Text: " + obj.text.substring(0, 15) : "Image") + (obj.visible? "" : " (hidden)");
        if (obj.type === 'image' && obj.getSrc()) {
             li.innerText = `Image (${obj.getSrc().split('/').pop().substring(0,15)})` + (obj.visible? "" : " (hidden)");
        }

        // Layer actions (visibility toggle, delete)
        let actionsSpan = document.createElement("span");
        actionsSpan.className = "layer-actions";

        let visibilityIcon = document.createElement("i");
        visibilityIcon.className = obj.visible? "fas fa-eye" : "fas fa-eye-slash";
        visibilityIcon.title = obj.visible? "Hide" : "Show";
        visibilityIcon.onclick = (e) => {
            e.stopPropagation(); // Prevent li click from selecting object
            toggleObjectVisibility(obj);
        };
        actionsSpan.appendChild(visibilityIcon);

        let deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash";
        deleteIcon.title = "Delete";
        deleteIcon.onclick = (e) => {
            e.stopPropagation(); // Prevent li click from selecting object
            deleteObject(obj);
        };
        actionsSpan.appendChild(deleteIcon);

        li.appendChild(actionsSpan);

        li.onclick = (e) => {
            e.stopPropagation(); // Prevent issues with SortableJS
            canvas.setActiveObject(obj);
            canvas.renderAll();
            updateControls();
            // Remove active class from all and add to clicked one
            document.querySelectorAll('#layerList li').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
        };

        // Add active class if this object is currently selected
        if (canvas.getActiveObject() === obj) {
            li.classList.add('active');
        }

        list.appendChild(li);
    });

    // Initialize SortableJS
    sortableList = Sortable.create(list, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: function(evt) {
            const oldIndex = evt.oldIndex; // Index in the displayed list (reversed)
            const newIndex = evt.newIndex; // Index in the displayed list (reversed)

            const fabricObjects = canvas.getObjects();
            const actualOldIndex = fabricObjects.length - 1 - oldIndex; // Convert to Fabric's internal index
            const actualNewIndex = fabricObjects.length - 1 - newIndex; // Convert to Fabric's internal index

            const movedObject = fabricObjects[actualOldIndex];
            fabricObjects.splice(actualOldIndex, 1); // Remove from old position
            fabricObjects.splice(actualNewIndex, 0, movedObject); // Insert into new position

            canvas.renderAll();
            autoSave(); // Save state after reordering
        }
    });
}

function toggleObjectVisibility(obj) {
    obj.visible =!obj.visible;
    canvas.renderAll();
    autoSave();
}

function deleteObject(obj) {
    if (confirm("Are you sure you want to delete this object?")) {
        canvas.remove(obj);
        canvas.discardActiveObject(); // Deselect it
        canvas.renderAll();
        autoSave();
    }
}

// --- Clear Canvas ---
function clearCanvas() {
    if (confirm("Are you sure you want to clear the entire canvas? This cannot be undone.")) {
        canvas.clear();
        canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
        autoSave(); // Trigger save after clearing
        updateControls(); // Clear controls
    }
}

// --- Download Meme ---
function downloadMeme() {
    canvas.discardActiveObject(); // Ensure nothing is selected before downloading
    canvas.renderAll(); // Re-render without active object controls

    let link = document.createElement("a");
    link.download = "meme-v2.png";
    link.href = canvas.toDataURL({
        format: "png",
        multiplier: 2 // Export at higher resolution
    });
    document.body.appendChild(link); // Append to body to make click work in all browsers
    link.click();
    document.body.removeChild(link); // Clean up
}

// --- Keyboard Shortcuts ---
document.addEventListener("keydown", function(e) {
    // Delete selected object(s)
    if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault(); // Prevent browser back navigation for Backspace
        const activeObject = canvas.getActiveObject();
        const activeGroup = canvas.getActiveGroup();

        if (activeGroup) {
            activeGroup.forEachObject(function(object) {
                canvas.remove(object);
            });
            canvas.discardActiveGroup().renderAll();
        } else if (activeObject) {
            canvas.remove(activeObject);
        }
        autoSave();
    }
    // Ctrl+D (or Cmd+D) to duplicate or add text
    if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.clone(function(clonedObj) {
                canvas.discardActiveObject();
                clonedObj.set({
                    left: clonedObj.left + 10,
                    top: clonedObj.top + 10,
                    evented: true,
                });
                if (clonedObj.type === 'activeSelection') {
                    clonedObj.canvas = canvas;
                    clonedObj.forEachObject(function(obj) {
                        canvas.add(obj);
                    });
                    clonedObj.setCoords();
                } else {
                    canvas.add(clonedObj);
                }
                canvas.setActiveObject(clonedObj);
                canvas.renderAll();
                autoSave();
            });
        } else {
            addText(); // If nothing is selected, add a new text box
        }
    }
    // Ctrl+Z (Cmd+Z) for Undo
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
    }
    // Ctrl+Y (Cmd+Y) or Ctrl+Shift+Z (Cmd+Shift+Z) for Redo
    if (((e.ctrlKey || e.metaKey) && e.key === "y") || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Z")) {
        e.preventDefault();
        redo();
    }
});

// --- Language Selection (Placeholder) ---
document.getElementById("memeLanguage").onchange = function() {
    alert("Language changed to: " + this.options[this.selectedIndex].text + " (Functionality to be implemented!)");
};

// --- Initial control update when script loads ---
updateControls();
updateHistoryButtons(); // Also update history buttons initially