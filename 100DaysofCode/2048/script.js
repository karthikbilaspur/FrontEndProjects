/* =========================
   2048 ADVANCED GAME ENGINE
   ========================= */

let size = 4;
let board = [];
let score = 0;
let best = Number(localStorage.getItem("best")) || 0;
let hasWon = false;

/* ---------- TILE ID ---------- */
let tileId = 0;
const createTile = value => ({ id: tileId++, value });

/* ---------- UNDO / REDO ---------- */
let undoStack = [];
let redoStack = [];

/* ---------- AI ---------- */
let autoPlay = false;
let autoInterval = null;
let aiSpeed = 180;

/* ---------- MODES ---------- */
let mode = "classic"; // classic | hard | timed
let timeLeft = 120;
let timer = null;

/* ---------- REPLAY ---------- */
let replayMoves = [];
let replayIndex = 0;
let replayInterval = null;

/* ---------- STATS ---------- */
let stats = JSON.parse(localStorage.getItem("stats")) || {
    games: 0,
    wins: 0,
    moves: 0,
    bestTile: 0
};

/* ---------- DOM ---------- */
const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const winScreen = document.getElementById("winScreen");

bestEl.textContent = best;

/* ======================
   GAME INITIALIZATION
   ====================== */

function startGame() {
    board = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null)
    );
    score = 0;
    hasWon = false;
    undoStack = [];
    redoStack = [];
    replayMoves = [];
    replayIndex = 0;

    winScreen.classList.remove("show");

    addTile();
    addTile();
    render();
}

/* ======================
   SAVE & LOAD
   ====================== */

function saveGame() {
    localStorage.setItem("gameState", JSON.stringify({
        board,
        score,
        size,
        hasWon,
        mode,
        replayMoves
    }));
}

function loadGame() {
    const data = JSON.parse(localStorage.getItem("gameState"));
    if (!data) return false;

    board = data.board;
    score = data.score;
    size = data.size;
    hasWon = data.hasWon;
    mode = data.mode || "classic";
    replayMoves = data.replayMoves || [];
    render();
    return true;
}

/* ======================
   CORE HELPERS
   ====================== */

const clone = b => b.map(r => r.map(c => c ? { ...c } : null));

const boardsEqual = (a, b) =>
    a.flat().every((v, i) => v?.value === b.flat()[i]?.value);

const countEmpty = b => b.flat().filter(v => !v).length;

function getSpawnValue() {
    if (mode === "hard") return Math.random() < 0.5 ? 4 : 2;
    return Math.random() < 0.9 ? 2 : 4;
}

/* ======================
   TILE LOGIC
   ====================== */

function addTile() {
    const empty = [];
    board.forEach((row, r) =>
        row.forEach((v, c) => !v && empty.push({ r, c }))
    );
    if (!empty.length) return;

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = createTile(getSpawnValue());
}

function slide(row) {
    return row.filter(v => v)
              .concat(Array(size).fill(null))
              .slice(0, size);
}

function combine(row) {
    for (let i = 0; i < size - 1; i++) {
        if (row[i] && row[i + 1] && row[i].value === row[i + 1].value) {
            row[i] = createTile(row[i].value * 2);
            score += row[i].value;
            row[i + 1] = null;

            if (row[i].value === 2048 && !hasWon) {
                hasWon = true;
                winScreen.classList.add("show");
                stats.wins++;
            }
        }
    }
    return row;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < size; r++) {
        const old = board[r].map(t => t?.value).toString();
        let row = slide(combine(slide(board[r])));
        board[r] = row;
        if (old !== row.map(t => t?.value).toString()) moved = true;
    }
    return moved;
}

function rotateBoard() {
    board = board[0].map((_, i) =>
        board.map(row => row[i]).reverse()
    );
}

/* ======================
   MOVE / UNDO / REDO
   ====================== */

function saveUndo() {
    undoStack.push({ board: clone(board), score });
    if (undoStack.length > 50) undoStack.shift();
    redoStack = [];
}

function move(dir) {
    saveUndo();

    const before = clone(board);
    for (let i = 0; i < dir; i++) rotateBoard();
    const moved = moveLeft();
    for (let i = 0; i < (4 - dir) % 4; i++) rotateBoard();

    if (moved) {
        addTile();
        stats.moves++;
        replayMoves.push(dir);
        render();
        checkGameOver();
    } else {
        undoStack.pop();
    }
}

function undo() {
    if (!undoStack.length) return;
    redoStack.push({ board: clone(board), score });
    const prev = undoStack.pop();
    board = clone(prev.board);
    score = prev.score;
    render();
}

function redo() {
    if (!redoStack.length) return;
    undoStack.push({ board: clone(board), score });
    const next = redoStack.pop();
    board = clone(next.board);
    score = next.score;
    render();
}

/* ======================
   GAME OVER
   ====================== */

function canMove() {
    if (countEmpty(board)) return true;
    for (let d = 0; d < 4; d++) {
        const backup = clone(board);
        move(d);
        const changed = !boardsEqual(board, backup);
        board = backup;
        if (changed) return true;
    }
    return false;
}

function checkGameOver() {
    if (!canMove()) {
        alert("Game Over!");
        stats.games++;
        saveStats();
    }
}

/* ======================
   AI
   ====================== */

function monotonicScore(b) {
    let s = 0;
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size - 1; c++)
            if ((b[r][c]?.value || 0) >= (b[r][c + 1]?.value || 0)) s++;
    return s;
}

function simulate(dir) {
    const backup = clone(board);
    const backupScore = score;

    move(dir);
    const gain = score - backupScore;
    const value = gain * 10 + countEmpty(board) * 5 + monotonicScore(board);

    board = backup;
    score = backupScore;
    return value;
}

function runAI() {
    if (hasWon) return;

    let bestMove = 0;
    let bestVal = -Infinity;

    for (let d = 0; d < 4; d++) {
        const val = simulate(d);
        if (val > bestVal) {
            bestVal = val;
            bestMove = d;
        }
    }
    move(bestMove);
}

/* ======================
   REPLAY SYSTEM
   ====================== */

function startReplay(speed = 300) {
    startGame();
    replayIndex = 0;
    replayInterval = setInterval(() => {
        if (replayIndex >= replayMoves.length) {
            clearInterval(replayInterval);
            return;
        }
        move(replayMoves[replayIndex++]);
    }, speed);
}

/* ======================
   STATS
   ====================== */

function saveStats() {
    stats.bestTile = Math.max(
        stats.bestTile,
        ...board.flat().map(t => t?.value || 0)
    );
    localStorage.setItem("stats", JSON.stringify(stats));
}

/* ======================
   RENDER
   ====================== */

function render() {
    boardEl.innerHTML = "";
    boardEl.className = `board size-${size}`;

    board.flat().forEach(cell => {
        const tile = document.createElement("div");
        tile.className = "tile";
        if (cell) {
            tile.textContent = cell.value;
            tile.dataset.id = cell.id;
            tile.classList.add(`tile-${cell.value}`);
        }
        boardEl.appendChild(tile);
    });

    scoreEl.textContent = score;
    if (score > best) {
        best = score;
        localStorage.setItem("best", best);
    }
    bestEl.textContent = best;

    saveGame();
}

/* ======================
   INPUT
   ====================== */

document.addEventListener("keydown", e => {
    const keys = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 };
    if (keys[e.key] !== undefined) move(keys[e.key]);
});

/* ======================
   START
   ====================== */

if (!loadGame()) startGame();
