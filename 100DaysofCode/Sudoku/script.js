// --- Global Game State ---
const GAME_STATE = {
    grid: [], // Current state of the Sudoku grid (0 for empty cells)
    solution: [], // The complete solved Sudoku grid
    initialGrid: [], // The grid with pre-filled numbers (read-only for user)
    notes: Array(9).fill(0).map(() => Array(9).fill(0).map(() => new Set())), // Stores sets of candidate numbers for each cell
    selectedCell: null, // {row, col} of the currently selected cell
    difficulty: 'medium',
    timer: 0,
    timerInterval: null,
    history: [], // Stores [{type, row, col, oldValue, newValue, noteChanges: {added, removed}}] for undo/redo
    historyPointer: -1,
    isSolved: false,
    startTime: null,
    pausedTime: 0,
    isPaused: false,
    incorrectEntries: 0,
    maxIncorrectEntries: 5, // Game over after this many incorrect entries
    errorCheckingEnabled: true, // Toggle for real-time error highlighting
    isNoteMode: false, // Toggle for note-taking mode
    
    // UI elements to update, assuming they exist in HTML
    ui: {
        timerEl: null,
        messageEl: null,
        undoBtn: null,
        redoBtn: null,
        hintBtn: null,
        resetBtn: null,
        errorCountEl: null, // Assuming you add <span id="error-count">0</span>
        pencilModeToggleEl: null, // Assuming <button id="pencil-mode-toggle">Pencil</button>
        pauseBtn: null, // Assuming <button id="pause-btn">Pause</button>
        solveBtn: null, // Assuming <button id="solve-btn">Solve</button>
    }
};

// --- DOM Elements (Updated for new features) ---
const sudokuGridEl = document.getElementById('sudoku-grid');
const numberInputEl = document.getElementById('number-input');
const newGameBtn = document.getElementById('new-game-btn');
const difficultySelect = document.getElementById('difficulty');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
// Assign UI elements to GAME_STATE.ui
GAME_STATE.ui.timerEl = document.getElementById('timer');
GAME_STATE.ui.messageEl = document.getElementById('message');
GAME_STATE.ui.undoBtn = document.getElementById('undo-btn');
GAME_STATE.ui.redoBtn = document.getElementById('redo-btn');
GAME_STATE.ui.hintBtn = document.getElementById('hint-btn');
GAME_STATE.ui.resetBtn = document.getElementById('reset-btn');

// Assuming you've added these to your HTML, otherwise they'll be null
GAME_STATE.ui.errorCountEl = document.getElementById('error-count'); 
GAME_STATE.ui.pencilModeToggleEl = document.getElementById('pencil-mode-toggle');
GAME_STATE.ui.pauseBtn = document.getElementById('pause-btn');
GAME_STATE.ui.solveBtn = document.getElementById('solve-btn');
GAME_STATE.ui.errorCheckToggleEl = document.getElementById('error-check-toggle'); // Button to toggle error checking

// --- Sudoku Generation & Solving Algorithms ---

/**
 * Generates a full, valid Sudoku grid using a backtracking algorithm.
 * @returns {number[][]} A 9x9 solved Sudoku grid.
 */
function generateSolution() {
    const grid = Array(9).fill(0).map(() => Array(9).fill(0).map(() => 0));
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    function solve() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) {
                    shuffleArray(numbers); // Randomize numbers for different puzzles
                    for (const num of numbers) {
                        if (isValidPlacement(grid, r, c, num)) {
                            grid[r][c] = num;
                            if (solve()) {
                                return true;
                            }
                            grid[r][c] = 0; // Backtrack
                        }
                    }
                    return false; // No valid number found
                }
            }
        }
        return true; // Grid is full
    }

    solve();
    return grid;
}

/**
 * Creates a puzzle by removing numbers from a solved grid.
 * @param {number[][]} solvedGrid - The complete Sudoku solution.
 * @param {string} difficulty - 'easy', 'medium', 'hard', 'expert'.
 * @returns {number[][]} A 9x9 Sudoku puzzle grid.
 */
function createPuzzle(solvedGrid, difficulty) {
    let puzzle = JSON.parse(JSON.stringify(solvedGrid)); // Deep copy
    let cellsToRemove;

    switch (difficulty) {
        case 'easy': cellsToRemove = 40; break;
        case 'medium': cellsToRemove = 48; break;
        case 'hard': cellsToRemove = 54; break;
        case 'expert': cellsToRemove = 60; break;
        default: cellsToRemove = 48; break;
    }

    let attempts = 0;
    const allCells = [];
    for(let r = 0; r < 9; r++) {
        for(let c = 0; c < 9; c++) {
            allCells.push({r, c});
        }
    }
    shuffleArray(allCells); // Randomize removal order

    let removedCount = 0;
    while (removedCount < cellsToRemove && attempts < 200) {
        const {r, c} = allCells[attempts % allCells.length]; // Cycle through cells to remove
        if (puzzle[r][c]!== 0) {
            let temp = puzzle[r][c];
            puzzle[r][c] = 0;

            const solutions = countSolutions(JSON.parse(JSON.stringify(puzzle)));
            if (solutions === 1) {
                removedCount++;
            } else {
                puzzle[r][c] = temp; // Restore if not unique
            }
        }
        attempts++;
    }
    return puzzle;
}

/**
 * Counts the number of solutions for a given Sudoku puzzle.
 * Used to ensure puzzle uniqueness.
 * @param {number[][]} grid - The Sudoku puzzle to check.
 * @returns {number} The number of unique solutions found (up to 2).
 */
function countSolutions(grid) {
    let solutions = 0;
    const testGrid = JSON.parse(JSON.stringify(grid)); // Work on a copy

    function solveAndCount() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (testGrid[r][c] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValidPlacement(testGrid, r, c, num)) {
                            testGrid[r][c] = num;
                            if (solveAndCount()) {
                                solutions++;
                                if (solutions > 1) { // Found more than one, stop
                                    testGrid[r][c] = 0; // Backtrack
                                    return true;
                                }
                            }
                            testGrid[r][c] = 0; // Backtrack
                        }
                    }
                    return false; // No valid number
                }
            }
        }
        return true; // Grid is full, found a solution
    }
    solveAndCount();
    return solutions;
}

/**
 * Solves a Sudoku grid using a backtracking algorithm.
 * @param {number[][]} grid - The Sudoku grid to solve.
 * @returns {boolean} True if solved, false if no solution.
 */
function solveSudoku(grid) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidPlacement(grid, r, c, num)) {
                        grid[r][c] = num;
                        if (solveSudoku(grid)) {
                            return true;
                        }
                        grid[r][c] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

/**
 * Checks if placing a number at a given position is valid.
 * @param {number[][]} grid - The current grid.
 * @param {number} row - The row index.
 * @param {number} col - The column index.
 * @param {number} num - The number to place.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidPlacement(grid, row, col, num) {
    if (num === 0) return true; // Clearing a cell is always "valid" for placement logic

    // Check row
    for (let x = 0; x < 9; x++) {
        if (x!== col && grid[row][x] === num) return false;
    }
    // Check column
    for (let x = 0; x < 9; x++) {
        if (x!== row && grid[x][col] === num) return false;
    }
    // Check 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if ((startRow + r!== row || startCol + c!== col) && grid[startRow + r][startCol + c] === num) return false;
        }
    }
    return true;
}

/**
 * Shuffles an array in place.
 * @param {Array} array - The array to shuffle.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Game Initialization & Control ---

/**
 * Starts a new Sudoku game.
 */
function startNewGame() {
    stopTimer();
    GAME_STATE.timer = 0;
    GAME_STATE.startTime = null;
    GAME_STATE.pausedTime = 0;
    GAME_STATE.isPaused = false;
    GAME_STATE.selectedCell = null;
    GAME_STATE.history = [];
    GAME_STATE.historyPointer = -1;
    GAME_STATE.isSolved = false;
    GAME_STATE.incorrectEntries = 0;
    GAME_STATE.isNoteMode = false;
    GAME_STATE.notes = Array(9).fill(0).map(() => Array(9).fill(0).map(() => new Set()));

    GAME_STATE.ui.messageEl.textContent = '';
    GAME_STATE.ui.messageEl.classList.remove('win-message', 'error-message');

    // Generate a new puzzle
    GAME_STATE.solution = generateSolution();
    GAME_STATE.initialGrid = createPuzzle(GAME_STATE.solution, GAME_STATE.difficulty);
    GAME_STATE.grid = JSON.parse(JSON.stringify(GAME_STATE.initialGrid)); // Deep copy for current play

    renderGrid();
    updateControlsState();
    startTimer();
    saveGameState(); // Save initial game state
    logMessage(`New game started! Difficulty: ${GAME_STATE.difficulty.toUpperCase()}`);
}

/**
 * Resets the current game to its initial state.
 */
function resetGame() {
    if (!confirm('Are you sure you want to reset the current game?')) return;
    
    stopTimer();
    GAME_STATE.timer = 0;
    GAME_STATE.startTime = null;
    GAME_STATE.pausedTime = 0;
    GAME_STATE.isPaused = false;
    GAME_STATE.selectedCell = null;
    GAME_STATE.history = [];
    GAME_STATE.historyPointer = -1;
    GAME_STATE.isSolved = false;
    GAME_STATE.incorrectEntries = 0;
    GAME_STATE.isNoteMode = false;
    GAME_STATE.notes = Array(9).fill(0).map(() => Array(9).fill(0).map(() => new Set()));

    GAME_STATE.ui.messageEl.textContent = '';
    GAME_STATE.ui.messageEl.classList.remove('win-message', 'error-message');

    GAME_STATE.grid = JSON.parse(JSON.stringify(GAME_STATE.initialGrid)); // Reset to initial puzzle
    
    renderGrid();
    updateControlsState();
    startTimer();
    saveGameState();
    logMessage('Game reset to initial state.');
}

/**
 * Solves the current puzzle and displays the solution.
 */
function solveCurrentPuzzle() {
    if (GAME_STATE.isSolved) return;
    if (!confirm('Are you sure you want to reveal the solution? Your current game will end.')) return;

    // Deep copy solution to grid
    GAME_STATE.grid = JSON.parse(JSON.stringify(GAME_STATE.solution));
    GAME_STATE.isSolved = true;
    stopTimer();
    GAME_STATE.selectedCell = null;
    logMessage('Puzzle solved!', 'success');
    renderGrid();
    updateControlsState();
    saveGameState();
}

/**
 * Toggles the game's paused state.
 */
function togglePause() {
    if (GAME_STATE.isSolved) return;

    GAME_STATE.isPaused =!GAME_STATE.isPaused;
    if (GAME_STATE.isPaused) {
        stopTimer();
        logMessage('Game Paused', 'info');
        if (GAME_STATE.ui.pauseBtn) GAME_STATE.ui.pauseBtn.textContent = 'Resume';
    } else {
        startTimer();
        logMessage('Game Resumed');
        if (GAME_STATE.ui.pauseBtn) GAME_STATE.ui.pauseBtn.textContent = 'Pause';
    }
    updateControlsState();
}

/**
 * Toggles real-time error checking.
 */
function toggleErrorChecking() {
    GAME_STATE.errorCheckingEnabled =!GAME_STATE.errorCheckingEnabled;
    logMessage(`Error checking ${GAME_STATE.errorCheckingEnabled? 'enabled' : 'disabled'}.`);
    if (GAME_STATE.ui.errorCheckToggleEl) {
        GAME_STATE.ui.errorCheckToggleEl.textContent = `Errors: ${GAME_STATE.errorCheckingEnabled? 'ON' : 'OFF'}`;
    }
    renderGrid(); // Re-render to apply/remove error highlighting
}

/**
 * Toggles note-taking mode.
 */
function toggleNoteMode() {
    GAME_STATE.isNoteMode =!GAME_STATE.isNoteMode;
    logMessage(`Input mode: ${GAME_STATE.isNoteMode? 'NOTES' : 'NUMBERS'}`);
    if (GAME_STATE.ui.pencilModeToggleEl) {
        GAME_STATE.ui.pencilModeToggleEl.textContent = GAME_STATE.isNoteMode? 'Pencil (ON)' : 'Pencil (OFF)';
    }
}

// --- Timer Functions ---
function startTimer() {
    if (GAME_STATE.isPaused || GAME_STATE.isSolved) return; // Don't start if paused or solved

    if (!GAME_STATE.startTime) {
        GAME_STATE.startTime = Date.now();
    } else if (GAME_STATE.pausedTime > 0) { // Resume from pause
        GAME_STATE.startTime = Date.now() - GAME_STATE.pausedTime;
        GAME_STATE.pausedTime = 0;
    }
    
    GAME_STATE.timerInterval = setInterval(() => {
        if (!GAME_STATE.isPaused &&!GAME_STATE.isSolved) {
            GAME_STATE.timer = Math.floor((Date.now() - GAME_STATE.startTime) / 1000);
            updateTimerDisplay();
            saveGameState(); // Periodically save timer
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(GAME_STATE.timerInterval);
    if (!GAME_STATE.isSolved) { // Only record pausedTime if not solved
        GAME_STATE.pausedTime = Date.now() - GAME_STATE.startTime;
    }
}

function updateTimerDisplay() {
    const minutes = String(Math.floor(GAME_STATE.timer / 60)).padStart(2, '0');
    const seconds = String(GAME_STATE.timer % 60).padStart(2, '0');
    if (GAME_STATE.ui.timerEl) GAME_STATE.ui.timerEl.textContent = `${minutes}:${seconds}`;
}

// --- UI Rendering ---

/**
 * Renders or updates the Sudoku grid in the DOM.
 */
function renderGrid() {
    sudokuGridEl.innerHTML = ''; // Clear existing grid

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.classList.add('sudoku-cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            const value = GAME_STATE.grid[r][c];

            if (value!== 0) {
                cell.textContent = value;
                cell.classList.remove('has-notes');
            } else {
                cell.textContent = '';
                const notes = GAME_STATE.notes[r][c];
                if (notes.size > 0) {
                    const notesEl = document.createElement('div');
                    notesEl.classList.add('cell-notes'); // Needs CSS
                    notesEl.textContent = Array.from(notes).sort().join(' ');
                    cell.appendChild(notesEl);
                    cell.classList.add('has-notes');
                } else {
                    cell.classList.remove('has-notes');
                }
            }

            if (GAME_STATE.initialGrid[r][c]!== 0) {
                cell.classList.add('given'); // Pre-filled numbers
            } else {
                cell.tabIndex = 0; // Make user-fillable cells focusable
            }

            // Add selected, highlighted, invalid classes
            applyCellStyling(cell, r, c);
            
            cell.addEventListener('click', () => selectCell(r, c));
            sudokuGridEl.appendChild(cell);
        }
    }
    updateErrorHighlighting();
}

/**
 * Applies CSS classes to a cell based on its state (selected, highlighted, invalid).
 * @param {HTMLElement} cellEl - The cell's DOM element.
 * @param {number} r - Row index.
 * @param {number} c - Column index.
 */
function applyCellStyling(cellEl, r, c) {
    const value = GAME_STATE.grid[r][c];
    
    cellEl.classList.remove('selected', 'highlighted', 'invalid', 'invalid-highlight', 'fade-in', 'hint', 'error-cell');

    // Selected cell
    if (GAME_STATE.selectedCell && GAME_STATE.selectedCell.row === r && GAME_STATE.selectedCell.col === c) {
        cellEl.classList.add('selected');
    }

    // Highlight related cells (same row, col, 3x3 block, or same value)
    if (GAME_STATE.selectedCell) {
        const sr = GAME_STATE.selectedCell.row;
        const sc = GAME_STATE.selectedCell.col;
        const selectedValue = GAME_STATE.grid[sr][sc];

        const isRelated = (r === sr || c === sc || 
                           (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3)));
        
        if (isRelated && (r!== sr || c!== sc)) { // Highlight but not the selected cell itself
            cellEl.classList.add('highlighted');
        }
        if (selectedValue!== 0 && value === selectedValue && (r!== sr || c!== sc)) {
            cellEl.classList.add('highlighted'); // Highlight all cells with the same value
        }
    }
}

/**
 * Updates real-time error highlighting across the grid.
 */
function updateErrorHighlighting() {
    if (!GAME_STATE.errorCheckingEnabled || GAME_STATE.isSolved) {
        // Remove all error highlights if feature is off or game is solved
        sudokuGridEl.querySelectorAll('.error-cell').forEach(el => el.classList.remove('error-cell'));
        sudokuGridEl.querySelectorAll('.invalid-text').forEach(el => el.classList.remove('invalid-text')); // Assuming you'd apply this to text
        return;
    }

    // Deep copy of current grid to check validity
    const currentGridCopy = JSON.parse(JSON.stringify(GAME_STATE.grid));
    
    // Clear existing error classes first
    sudokuGridEl.querySelectorAll('.error-cell').forEach(el => el.classList.remove('error-cell'));
    sudokuGridEl.querySelectorAll('.invalid-text').forEach(el => el.classList.remove('invalid-text'));

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cellValue = currentGridCopy[r][c];
            if (cellValue!== 0) {
                // Temporarily clear the cell's value to check its validity against others
                currentGridCopy[r][c] = 0; 
                if (!isValidPlacement(currentGridCopy, r, c, cellValue)) {
                    const cellEl = sudokuGridEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    if (cellEl) {
                        cellEl.classList.add('error-cell'); // General error background
                        // Optionally, for just text error: cellEl.classList.add('invalid-text');
                    }
                }
                currentGridCopy[r][c] = cellValue; // Restore the value
            }
        }
    }
}

/**
 * Selects a cell and updates the UI.
 * @param {number} r - Row index.
 * @param {number} c - Column index.
 */
function selectCell(r, c) {
    if (GAME_STATE.isSolved || GAME_STATE.isPaused) return;
    if (GAME_STATE.selectedCell && GAME_STATE.selectedCell.row === r && GAME_STATE.selectedCell.col === c) {
        // Deselect if clicking the same cell twice
        GAME_STATE.selectedCell = null;
    } else {
        GAME_STATE.selectedCell = { row: r, col: c };
    }
    renderGrid(); // Re-render to update selected/highlighted states
    updateControlsState(); // Update keypad state
}

/**
 * Handles number input (from keyboard or virtual keypad).
 * @param {number} num - The number to enter (0 for clear).
 */
function handleNumberInput(num) {
    if (GAME_STATE.isSolved ||!GAME_STATE.selectedCell || GAME_STATE.isPaused) return;

    const { row, col } = GAME_STATE.selectedCell;

    if (GAME_STATE.initialGrid[row][col]!== 0) {
        logMessage("You cannot change pre-filled numbers!", 'error');
        return;
    }

    // Note mode handling
    if (GAME_STATE.isNoteMode) {
        const currentNotes = GAME_STATE.notes[row][col];
        const oldNotes = new Set(currentNotes); // Clone for history
        let noteChanges = { added: [], removed: [] };

        if (currentNotes.has(num)) {
            currentNotes.delete(num);
            noteChanges.removed.push(num);
        } else {
            currentNotes.add(num);
            noteChanges.added.push(num);
        }
        addHistoryEntry('notes', row, col, Array.from(oldNotes), Array.from(currentNotes), noteChanges);
        renderGrid();
        updateControlsState();
        saveGameState();
        return;
    }

    // Number mode handling
    const oldValue = GAME_STATE.grid[row][col];
    const newValue = num;

    if (oldValue === newValue) return; // No change

    // Clear notes when a number is placed
    if (newValue!== 0) {
        const currentNotes = GAME_STATE.notes[row][col];
        if (currentNotes.size > 0) {
            // Record clearing of notes in history
            addHistoryEntry('notes', row, col, Array.from(currentNotes), [], { removed: Array.from(currentNotes), added: [] });
            GAME_STATE.notes[row][col].clear();
        }
    }

    // Check if the move is incorrect
    const isCurrentMoveCorrect = (newValue === 0) || (newValue === GAME_STATE.solution[row][col]);
    
    // Add to history
    addHistoryEntry('number', row, col, oldValue, newValue);

    GAME_STATE.grid[row][col] = newValue;
    
    // Update incorrect entries count
    if (newValue!== 0 &&!isCurrentMoveCorrect) {
        GAME_STATE.incorrectEntries++;
        logMessage(`Incorrect! Errors: ${GAME_STATE.incorrectEntries}/${GAME_STATE.maxIncorrectEntries}`, 'error');
        if (GAME_STATE.incorrectEntries >= GAME_STATE.maxIncorrectEntries) {
            gameOver();
            return;
        }
    }

    renderGrid(); // Re-render to show new number and update styling
    updateControlsState();
    checkWinCondition();
    saveGameState();
}

/**
 * Game over logic when max incorrect entries are reached.
 */
function gameOver() {
    GAME_STATE.isSolved = true;
    stopTimer();
    GAME_STATE.selectedCell = null;
    logMessage(`Game Over! You made ${GAME_STATE.maxIncorrectEntries} incorrect entries.`, 'error');
    alert(`Game Over! You made ${GAME_STATE.maxIncorrectEntries} incorrect entries. Try again!`);
    updateControlsState();
    saveGameState();
}

/**
 * Displays a temporary message to the user.
 * @param {string} msg - The message to display.
 * @param {string} type - 'success', 'error', 'info' or empty for default.
 */
function logMessage(msg, type = 'info') { // Default to 'info' type
    if (GAME_STATE.ui.messageEl) {
        GAME_STATE.ui.messageEl.textContent = msg;
        GAME_STATE.ui.messageEl.className = 'info-box'; // Reset class
        if (type) {
            GAME_STATE.ui.messageEl.classList.add(`${type}-message`);
        }
        // Optionally, clear after a few seconds
        // setTimeout(() => GAME_STATE.ui.messageEl.textContent = '', 3000);
    }
}

// --- Undo/Redo ---

/**
 * Adds an action to the history stack.
 * @param {string} type - 'number' or 'notes'.
 * @param {number} row
 * @param {number} col
 * @param {*} oldValue - Number or Array of notes.
 * @param {*} newValue - Number or Array of notes.
 * @param {object} [noteChanges] - {added: [], removed: []} for notes.
 */
function addHistoryEntry(type, row, col, oldValue, newValue, noteChanges = null) {
    if (GAME_STATE.historyPointer < GAME_STATE.history.length - 1) {
        GAME_STATE.history = GAME_STATE.history.slice(0, GAME_STATE.historyPointer + 1);
    }
    GAME_STATE.history.push({ type, row, col, oldValue, newValue, noteChanges });
    GAME_STATE.historyPointer = GAME_STATE.history.length - 1;
}

function undoMove() {
    if (GAME_STATE.historyPointer < 0 || GAME_STATE.isSolved || GAME_STATE.isPaused) return;

    const entry = GAME_STATE.history[GAME_STATE.historyPointer];

    if (entry.type === 'number') {
        // Revert number
        const currentIncorrect = (GAME_STATE.grid[entry.row][entry.col]!== 0 && GAME_STATE.grid[entry.row][entry.col]!== GAME_STATE.solution[entry.row][entry.col]);
        const oldIncorrect = (entry.oldValue!== 0 && entry.oldValue!== GAME_STATE.solution[entry.row][entry.col]);

        GAME_STATE.grid[entry.row][entry.col] = entry.oldValue;
        if (currentIncorrect &&!oldIncorrect) { // If current was incorrect, but old is correct/empty
             GAME_STATE.incorrectEntries--;
        } else if (!currentIncorrect && oldIncorrect) { // If current was correct/empty, but old was incorrect
             // This case won't reduce incorrect entries, but could increase if redoing an incorrect
        }
    } else if (entry.type === 'notes') {
        // Revert notes
        GAME_STATE.notes[entry.row][entry.col] = new Set(entry.oldValue);
    }
    
    GAME_STATE.historyPointer--;
    
    renderGrid();
    updateControlsState();
    logMessage('Move undone.');

    // Visual feedback for undo/redo
    const cellEl = sudokuGridEl.querySelector(`[data-row="${entry.row}"][data-col="${entry.col}"]`);
    if (cellEl) {
        cellEl.classList.add('undo-redo-flash'); // Needs CSS for animation
        setTimeout(() => cellEl.classList.remove('undo-redo-flash'), 300);
    }
    saveGameState();
}

function redoMove() {
    if (GAME_STATE.historyPointer >= GAME_STATE.history.length - 1 || GAME_STATE.isSolved || GAME_STATE.isPaused) return;

    GAME_STATE.historyPointer++;
    const entry = GAME_STATE.history[GAME_STATE.historyPointer];

    if (entry.type === 'number') {
        // Apply number
        const currentIncorrect = (GAME_STATE.grid[entry.row][entry.col]!== 0 && GAME_STATE.grid[entry.row][entry.col]!== GAME_STATE.solution[entry.row][entry.col]);
        const newIncorrect = (entry.newValue!== 0 && entry.newValue!== GAME_STATE.solution[entry.row][entry.col]);

        GAME_STATE.grid[entry.row][entry.col] = entry.newValue;
        if (!currentIncorrect && newIncorrect) { // If current was correct/empty, but new is incorrect
             GAME_STATE.incorrectEntries++;
        }
    } else if (entry.type === 'notes') {
        // Apply notes
        GAME_STATE.notes[entry.row][entry.col] = new Set(entry.newValue);
    }

    renderGrid();
    updateControlsState();
    logMessage('Move redone.');

    // Visual feedback for undo/redo
    const cellEl = sudokuGridEl.querySelector(`[data-row="${entry.row}"][data-col="${entry.col}"]`);
    if (cellEl) {
        cellEl.classList.add('undo-redo-flash'); // Needs CSS for animation
        setTimeout(() => cellEl.classList.remove('undo-redo-flash'), 300);
    }
    saveGameState();
}

// --- Game Logic ---

/**
 * Checks if the current grid matches the solution.
 */
function checkWinCondition() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (GAME_STATE.grid[r][c]!== GAME_STATE.solution[r][c]) {
                return false; // Grid is not yet solved
            }
        }
    }
    GAME_STATE.isSolved = true;
    stopTimer();
    GAME_STATE.selectedCell = null; // Deselect cell on win
    logMessage(`Congratulations! You solved it in ${GAME_STATE.ui.timerEl?.textContent || 'unknown time'}!`, 'success');
    updateControlsState();
    saveGameState(); // Save final state
}

/**
 * Provides a hint by filling in one correct number.
 */
function provideHint() {
    if (GAME_STATE.isSolved || GAME_STATE.isPaused) return;

    const emptyCells = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (GAME_STATE.grid[r][c] === 0) {
                emptyCells.push({ r, c });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { r, c } = emptyCells[randomIndex];
        const correctValue = GAME_STATE.solution[r][c];

        // Record hint as a move for undo/redo
        addHistoryEntry('number', r, c, 0, correctValue);
        GAME_STATE.grid[r][c] = correctValue;
        
        logMessage(`Hint provided: ${correctValue} at (${r+1}, ${c+1})`);
        renderGrid();
        // Add a temporary highlight animation to the hinted cell
        const hintedCellEl = sudokuGridEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        if (hintedCellEl) {
            hintedCellEl.classList.add('hint'); // Needs CSS for animation
            setTimeout(() => hintedCellEl.classList.remove('hint'), 800);
        }
        updateControlsState();
        checkWinCondition();
        saveGameState();
    } else {
        logMessage('No empty cells left for a hint!');
    }
}

// --- Local Storage Persistence ---

/**
 * Saves the current game state to localStorage.
 */
function saveGameState() {
    localStorage.setItem('sudokuGameState', JSON.stringify({
        grid: GAME_STATE.grid,
        solution: GAME_STATE.solution,
        initialGrid: GAME_STATE.initialGrid,
        selectedCell: GAME_STATE.selectedCell,
        difficulty: GAME_STATE.difficulty,
        timer: GAME_STATE.timer,
        startTime: GAME_STATE.startTime,
        pausedTime: GAME_STATE.pausedTime,
        isPaused: GAME_STATE.isPaused,
        history: GAME_STATE.history,
        historyPointer: GAME_STATE.historyPointer,
        isSolved: GAME_STATE.isSolved,
        incorrectEntries: GAME_STATE.incorrectEntries,
        errorCheckingEnabled: GAME_STATE.errorCheckingEnabled,
        isNoteMode: GAME_STATE.isNoteMode,
        // Convert Set objects to arrays for JSON serialization
        notes: GAME_STATE.notes.map(row => row.map(cellNotes => Array.from(cellNotes))),
        lastSaveTime: Date.now() // Track last save
    }));
}

/**
 * Loads game state from localStorage.
 * @returns {boolean} True if state was loaded, false otherwise.
 */
function loadGameState() {
    const savedState = localStorage.getItem('sudokuGameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        // Basic validation that it's a game state
        if (state.grid && state.solution && state.initialGrid) {
            Object.assign(GAME_STATE, state);
            
            // Re-parse grids if they were stored as strings or for safety
            GAME_STATE.grid = state.grid.map(row => row.map(Number));
            GAME_STATE.solution = state.solution.map(row => row.map(Number));
            GAME_STATE.initialGrid = state.initialGrid.map(row => row.map(Number));
            // Convert notes back to Set objects
            GAME_STATE.notes = state.notes.map(row => row.map(cellNotes => new Set(cellNotes)));

            // Resume timer if game was not solved and not paused
            if (!GAME_STATE.isSolved &&!GAME_STATE.isPaused) {
                 // Adjust startTime to account for elapsed time since last save
                if (GAME_STATE.startTime) {
                    // This recalculation is robust to page reloads during active play
                    const timeElapsedSinceLastSave = (Date.now() - state.lastSaveTime) / 1000;
                    GAME_STATE.timer += Math.floor(timeElapsedSinceLastSave);
                    GAME_STATE.startTime = Date.now() - (GAME_STATE.timer * 1000);
                } else { // Fallback if startTime was not correctly saved but timer was running
                    GAME_STATE.startTime = Date.now() - (GAME_STATE.timer * 1000);
                }
                startTimer();
            } else if (GAME_STATE.isPaused || GAME_STATE.isSolved) {
                updateTimerDisplay(); // Just show the paused/solved time
                if (GAME_STATE.ui.pauseBtn) GAME_STATE.ui.pauseBtn.textContent = 'Resume';
            }
            
            difficultySelect.value = GAME_STATE.difficulty; // Set difficulty dropdown
            if (GAME_STATE.ui.errorCheckToggleEl) GAME_STATE.ui.errorCheckToggleEl.textContent = `Errors: ${GAME_STATE.errorCheckingEnabled? 'ON' : 'OFF'}`;
            if (GAME_STATE.ui.pencilModeToggleEl) GAME_STATE.ui.pencilModeToggleEl.textContent = GAME_STATE.isNoteMode? 'Pencil (ON)' : 'Pencil (OFF)';

            renderGrid();
            updateControlsState();
            logMessage('Game loaded from previous session.');
            return true;
        }
    }
    return false;
}

// --- UI Control State Management ---

/**
 * Updates the disabled state of action buttons and keypad.
 */
function updateControlsState() {
    if (GAME_STATE.ui.undoBtn) GAME_STATE.ui.undoBtn.disabled = GAME_STATE.historyPointer < 0 || GAME_STATE.isSolved || GAME_STATE.isPaused;
    if (GAME_STATE.ui.redoBtn) GAME_STATE.ui.redoBtn.disabled = GAME_STATE.historyPointer >= GAME_STATE.history.length - 1 || GAME_STATE.isSolved || GAME_STATE.isPaused;
    if (GAME_STATE.ui.hintBtn) GAME_STATE.ui.hintBtn.disabled = GAME_STATE.isSolved || GAME_STATE.isPaused;
    if (GAME_STATE.ui.resetBtn) GAME_STATE.ui.resetBtn.disabled = GAME_STATE.isSolved && GAME_STATE.grid.every((row, r) => row.every((val, c) => val === GAME_STATE.initialGrid[r][c]));
    if (GAME_STATE.ui.pauseBtn) GAME_STATE.ui.pauseBtn.disabled = GAME_STATE.isSolved;
    if (GAME_STATE.ui.solveBtn) GAME_STATE.ui.solveBtn.disabled = GAME_STATE.isSolved || GAME_STATE.isPaused;

    if (GAME_STATE.ui.errorCountEl) GAME_STATE.ui.errorCountEl.textContent = GAME_STATE.incorrectEntries;

    // Disable number input if game is solved or no cell is selected
    const numberButtons = numberInputEl.querySelectorAll('button');
    const selected = GAME_STATE.selectedCell;

    numberButtons.forEach(button => {
        const num = parseInt(button.dataset.value);
        if (num === 0) { // Clear button
            button.disabled = GAME_STATE.isSolved ||!selected || GAME_STATE.isPaused;
            button.textContent = (GAME_STATE.isNoteMode)? 'Clear Note' : 'Clear';
            return;
        }

        button.disabled = GAME_STATE.isSolved ||!selected || GAME_STATE.isPaused;

        // Dynamic keypad feedback: disable if number is already filled 9 times
        if (!GAME_STATE.isNoteMode &&!button.disabled) {
            let count = 0;
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (GAME_STATE.grid[r][c] === num) count++;
                }
            }
            if (count >= 9) {
                button.disabled = true;
            }
        }
    });
}

// --- Event Listeners ---

// New Game Button
newGameBtn.addEventListener('click', startNewGame);

// Difficulty Selector
difficultySelect.addEventListener('change', (e) => {
    GAME_STATE.difficulty = e.target.value;
    logMessage(`Difficulty set to ${GAME_STATE.difficulty.toUpperCase()}. Start a new game!`);
    startNewGame(); // Auto-start new game on difficulty change
});

// Number Input Buttons (Virtual Keypad)
numberInputEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const value = parseInt(e.target.dataset.value);
        if (!isNaN(value)) {
            handleNumberInput(value);
        }
    }
});

// Keyboard Input
document.addEventListener('keydown', (e) => {
    // Only handle if a cell is selected and game not solved and not paused
    if (GAME_STATE.selectedCell &&!GAME_STATE.isSolved &&!GAME_STATE.isPaused) {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 0 && num <= 9) {
            handleNumberInput(num);
            e.preventDefault(); // Prevent default browser actions for number keys
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            handleNumberInput(0); // Clear cell
            e.preventDefault();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault(); // Prevent scrolling
            let { row, col } = GAME_STATE.selectedCell;
            switch (e.key) {
                case 'ArrowUp': row = (row === 0)? 8 : row - 1; break;
                case 'ArrowDown': row = (row === 8)? 0 : row + 1; break;
                case 'ArrowLeft': col = (col === 0)? 8 : col - 1; break;
                case 'ArrowRight': col = (col === 8)? 0 : col + 1; break;
            }
            selectCell(row, col);
        }
    }
    // Handle global shortcuts regardless of cell selection
    if (e.ctrlKey || e.metaKey) { // Ctrl for Windows/Linux, Cmd for Mac
        if (e.key === 'z') {
            e.preventDefault();
            undoMove();
        } else if (e.key === 'y' || (e.shiftKey && e.key === 'Z')) { // Ctrl+Y or Ctrl+Shift+Z for redo
            e.preventDefault();
            redoMove();
        }
    }
});

// Undo, Redo, Hint, Reset Buttons
if (GAME_STATE.ui.undoBtn) GAME_STATE.ui.undoBtn.addEventListener('click', undoMove);
if (GAME_STATE.ui.redoBtn) GAME_STATE.ui.redoBtn.addEventListener('click', redoMove);
if (GAME_STATE.ui.hintBtn) GAME_STATE.ui.hintBtn.addEventListener('click', provideHint);
if (GAME_STATE.ui.resetBtn) GAME_STATE.ui.resetBtn.addEventListener('click', resetGame);
if (GAME_STATE.ui.pauseBtn) GAME_STATE.ui.pauseBtn.addEventListener('click', togglePause);
if (GAME_STATE.ui.solveBtn) GAME_STATE.ui.solveBtn.addEventListener('click', solveCurrentPuzzle);
if (GAME_STATE.ui.pencilModeToggleEl) GAME_STATE.ui.pencilModeToggleEl.addEventListener('click', toggleNoteMode);
if (GAME_STATE.ui.errorCheckToggleEl) GAME_STATE.ui.errorCheckToggleEl.addEventListener('click', toggleErrorChecking);

// Theme Toggle
function loadTheme() {
    const savedTheme = localStorage.getItem('sudokuTheme');
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        body.className = 'light-theme'; // Default
    }
    themeToggleBtn.textContent = body.classList.contains('dark-theme')? '☀️' : '🌙';
}

function toggleTheme() {
    if (body.classList.contains('light-theme')) {
        body.className = 'dark-theme';
        localStorage.setItem('sudokuTheme', 'dark-theme');
    } else {
        body.className = 'light-theme';
        localStorage.setItem('sudokuTheme', 'light-theme');
    }
    themeToggleBtn.textContent = body.classList.contains('dark-theme')? '☀️' : '🌙';
}
themeToggleBtn.addEventListener('click', toggleTheme);

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    if (!loadGameState()) {
        // If no saved game, start a new one
        startNewGame();
    } else {
        // Ensure timer is stopped if game was solved or paused, and re-render grid
        if (GAME_STATE.isSolved || GAME_STATE.isPaused) {
             stopTimer();
             updateTimerDisplay(); // Make sure display is correct for paused/solved state
        }
        renderGrid();
        updateControlsState();
    }
});