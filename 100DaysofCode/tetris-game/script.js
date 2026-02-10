/* =====================================================
   ADVANCED TETRIS GAME ENGINE (Tier 1–4)
   File: index.js
   ===================================================== */

/* ---------------- CONFIG ---------------- */

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const MODES = {
  MARATHON: "marathon",
  SPRINT: "sprint",
  ULTRA: "ultra",
  ZEN: "zen"
};

/* ---------------- GAME STATE ---------------- */

let board = [];
let currentPiece = null;
let nextQueue = [];
let holdPiece = null;
let holdUsed = false;

let score = 0;
let level = 1;
let linesCleared = 0;
let combo = 0;
let gameMode = MODES.MARATHON;

let isPaused = false;
let isGameOver = false;

/* Timing */
let dropInterval = 1000;
let lastDropTime = 0;

/* Lock delay */
let lockDelay = 500;
let lockStart = null;

/* Replay */
let inputLog = [];
let replayData = null;
let replayIndex = 0;
let replayTimer = null;

/* AI */
let aiEnabled = false;
let aiInterval = null;

/* Settings */
const settings = {
  reducedMotion: false,
  aiDemo: false
};

/* ---------------- UTILITIES ---------------- */

function createMatrix(w, h) {
  return Array.from({ length: h }, () => Array(w).fill(0));
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------------- TETROMINOS ---------------- */

const SHAPES = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]],
  J: [[1,0,0],[1,1,1]],
  L: [[0,0,1],[1,1,1]]
};

const COLORS = {
  I: 1, O: 2, T: 3, S: 4, Z: 5, J: 6, L: 7
};

const BAG = Object.keys(SHAPES);

/* ---------------- PIECE ---------------- */

function createPiece(type) {
  return {
    type,
    matrix: SHAPES[type].map(r => [...r]),
    x: Math.floor(COLS / 2) - 1,
    y: 0
  };
}

/* ---------------- INIT ---------------- */

function initGame(mode = MODES.MARATHON) {
  board = createMatrix(COLS, ROWS);
  nextQueue = [];
  holdPiece = null;
  holdUsed = false;

  score = 0;
  level = 1;
  linesCleared = 0;
  combo = 0;

  isPaused = false;
  isGameOver = false;
  gameMode = mode;

  inputLog = [];
  lockStart = null;

  loadSettings();
  fillBag();
  spawnPiece();
}

/* ---------------- BAG SYSTEM ---------------- */

function fillBag() {
  const bag = [...BAG];
  while (bag.length) {
    const pick = randomFrom(bag);
    bag.splice(bag.indexOf(pick), 1);
    nextQueue.push(pick);
  }
}

function spawnPiece() {
  if (nextQueue.length < 7) fillBag();
  currentPiece = createPiece(nextQueue.shift());
  holdUsed = false;

  if (collides(board, currentPiece)) {
    isGameOver = true;
  }
}

/* ---------------- COLLISION ---------------- */

function collides(b, piece) {
  for (let y = 0; y < piece.matrix.length; y++) {
    for (let x = 0; x < piece.matrix[y].length; x++) {
      if (
        piece.matrix[y][x] &&
        (b[y + piece.y]?.[x + piece.x] !== 0)
      ) return true;
    }
  }
  return false;
}

/* ---------------- MERGE ---------------- */

function merge(b, piece) {
  piece.matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val) b[y + piece.y][x + piece.x] = COLORS[piece.type];
    });
  });
}

/* ---------------- SCORING ---------------- */

function sweepLines() {
  let cleared = 0;

  outer: for (let y = ROWS - 1; y >= 0; y--) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x] === 0) continue outer;
    }
    board.splice(y, 1);
    board.unshift(Array(COLS).fill(0));
    cleared++;
    y++;
  }

  if (cleared) {
    combo++;
    linesCleared += cleared;
    score += calculateScore(cleared);
    updateLevel();
  } else {
    combo = 0;
  }
}

function calculateScore(lines) {
  const table = [0, 100, 300, 500, 800];
  return (table[lines] || 0) * level + combo * 50;
}

function updateLevel() {
  level = Math.floor(linesCleared / 10) + 1;
  dropInterval = Math.max(100, 1000 - level * 80);
}

/* ---------------- MOVEMENT ---------------- */

function move(dx) {
  currentPiece.x += dx;
  if (collides(board, currentPiece)) currentPiece.x -= dx;
}

function softDrop() {
  currentPiece.y++;
  if (collides(board, currentPiece)) {
    currentPiece.y--;
    if (!lockStart) lockStart = Date.now();
    if (Date.now() - lockStart > lockDelay) {
      lockStart = null;
      lockPiece();
    }
  } else {
    lockStart = null;
  }
}

function hardDrop() {
  while (!collides(board, currentPiece)) currentPiece.y++;
  currentPiece.y--;
  lockPiece();
  score += 20;
}

/* ---------------- ROTATION (MODERN) ---------------- */

function rotate(piece) {
  const old = piece.matrix;
  const rotated = piece.matrix[0].map((_, i) =>
    piece.matrix.map(row => row[i]).reverse()
  );
  piece.matrix = rotated;

  const kicks = [0, -1, 1, -2, 2];
  for (let k of kicks) {
    piece.x += k;
    if (!collides(board, piece)) return;
    piece.x -= k;
  }
  piece.matrix = old;
}

/* ---------------- HOLD ---------------- */

function hold() {
  if (holdUsed) return;
  holdUsed = true;

  if (!holdPiece) {
    holdPiece = currentPiece.type;
    spawnPiece();
  } else {
    const temp = holdPiece;
    holdPiece = currentPiece.type;
    currentPiece = createPiece(temp);
  }
}

/* ---------------- LOCK ---------------- */

function lockPiece() {
  merge(board, currentPiece);
  sweepLines();
  spawnPiece();
}

/* ---------------- INPUT ---------------- */

function handleInput(action) {
  if (isGameOver) return;
  inputLog.push({ action, time: Date.now() });

  switch (action) {
    case "LEFT": move(-1); break;
    case "RIGHT": move(1); break;
    case "ROTATE": rotate(currentPiece); break;
    case "SOFT_DROP": softDrop(); break;
    case "HARD_DROP": hardDrop(); break;
    case "HOLD": hold(); break;
    case "PAUSE": isPaused = !isPaused; break;
  }
}

/* ---------------- GAME LOOP ---------------- */

function update(time = 0) {
  if (!isPaused && !isGameOver && time - lastDropTime > dropInterval) {
    softDrop();
    lastDropTime = time;
  }
  drawBoard();
  requestAnimationFrame(update);
}

/* ---------------- REPLAY ---------------- */

function exportReplay() {
  return JSON.stringify({ mode: gameMode, inputs: inputLog });
}

function loadReplay(json) {
  const data = JSON.parse(json);
  initGame(data.mode);
  replayData = data.inputs;
  replayIndex = 0;
  isPaused = true;
}

function playReplay(speed = 1) {
  if (!replayData) return;
  isPaused = false;

  replayTimer = setInterval(() => {
    if (replayIndex >= replayData.length) {
      clearInterval(replayTimer);
      return;
    }
    handleInput(replayData[replayIndex++].action);
  }, 200 / speed);
}

/* ---------------- AI ---------------- */

function evaluateBoard(b) {
  let holes = 0, height = 0;
  for (let x = 0; x < COLS; x++) {
    let block = false;
    for (let y = 0; y < ROWS; y++) {
      if (b[y][x]) {
        block = true;
        height += ROWS - y;
      } else if (block) holes++;
    }
  }
  return height + holes * 5;
}

function simulatePlacement(piece, dx, rot) {
  const testBoard = board.map(r => [...r]);
  const p = JSON.parse(JSON.stringify(piece));
  for (let i = 0; i < rot; i++) rotate(p);
  p.x += dx;
  while (!collides(testBoard, p)) p.y++;
  p.y--;
  merge(testBoard, p);
  return evaluateBoard(testBoard);
}

function runAI() {
  if (!aiEnabled || isPaused || isGameOver) return;

  let best = Infinity, move = null;
  for (let r = 0; r < 4; r++) {
    for (let x = -5; x <= 5; x++) {
      const s = simulatePlacement(currentPiece, x, r);
      if (s < best) {
        best = s;
        move = { x, r };
      }
    }
  }

  if (!move) return;
  for (let i = 0; i < move.r; i++) handleInput("ROTATE");
  if (move.x < 0) for (let i = 0; i < -move.x; i++) handleInput("LEFT");
  if (move.x > 0) for (let i = 0; i < move.x; i++) handleInput("RIGHT");
  handleInput("HARD_DROP");
}

function toggleAI() {
  aiEnabled = !aiEnabled;
  aiEnabled
    ? aiInterval = setInterval(runAI, 300)
    : clearInterval(aiInterval);
}

/* ---------------- SETTINGS ---------------- */

function saveSettings() {
  localStorage.setItem("tetrisSettings", JSON.stringify(settings));
}

function loadSettings() {
  const s = localStorage.getItem("tetrisSettings");
  if (s) Object.assign(settings, JSON.parse(s));
}

/* ---------------- MOBILE ---------------- */

let touchX = 0, touchY = 0;

window.addEventListener("touchstart", e => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
});

window.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  if (Math.abs(dx) > Math.abs(dy)) handleInput(dx > 0 ? "RIGHT" : "LEFT");
  else handleInput(dy > 0 ? "SOFT_DROP" : "ROTATE");
});

/* ---------------- CANVAS ---------------- */

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

const COLOR_MAP = [
  "#000","#00f0f0","#f0f000","#a000f0",
  "#00f000","#f00000","#0000f0","#f0a000"
];

function drawCell(x, y, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) =>
    row.forEach((v, x) => v && drawCell(x, y, COLOR_MAP[v]))
  );

  currentPiece.matrix.forEach((row, y) =>
    row.forEach((v, x) =>
      v && drawCell(currentPiece.x + x, currentPiece.y + y,
        COLOR_MAP[COLORS[currentPiece.type]])
    )
  );
}

/* ---------------- PUBLIC API ---------------- */

window.TetrisGame = {
  initGame,
  update,
  handleInput,
  getStats: () => ({ score, level, linesCleared, combo, gameMode, isGameOver }),
  exportReplay,
  loadReplay,
  playReplay,
  toggleAI
};

/* ---------------- START ---------------- */

initGame();
requestAnimationFrame(update);
