let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let moveHistory = [];
let redoHistory = [];
let scoreX = 0;
let scoreO = 0;
let scoreTie = 0;
let darkMode = false;
let difficulty = 'easy';

const cells = document.querySelectorAll('.cell');
const resultElement = document.getElementById('result');
const resetBtn = document.getElementById('reset-btn');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const scoreTieElement = document.getElementById('score-tie');
const symbolXInput = document.getElementById('symbol-x');
const symbolOInput = document.getElementById('symbol-o');
const darkModeBtn = document.getElementById('dark-mode-btn');
const difficultySelect = document.createElement('select');
difficultySelect.innerHTML = `
  <option value="easy">Easy</option>
  <option value="hard">Hard</option>
`;
document.querySelector('.settings').appendChild(difficultySelect);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
  cell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleCellClick(index);
  });
});

resetBtn.addEventListener('click', resetGame);
undoBtn.addEventListener('click', undoMove);
redoBtn.addEventListener('click', redoMove);
darkModeBtn.addEventListener('click', toggleDarkMode);
difficultySelect.addEventListener('change', (e) => {
  difficulty = e.target.value;
});

function handleCellClick(index) {
  if (gameOver || cells[index].textContent !== '') return;

  const symbolX = symbolXInput.value;
  const symbolO = symbolOInput.value;

  cells[index].textContent = currentPlayer === 'X' ? symbolX : symbolO;
  gameBoard[index] = currentPlayer;
  moveHistory.push(index);
  redoHistory = [];

  checkWinner();

  if (!gameOver && currentPlayer === 'X') {
    setTimeout(() => {
      const bestMove = getBestMove();
      handleCellClick(bestMove);
    }, 500);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }

  updateUndoRedoButtons();
}

function getBestMove() {
  if (difficulty === 'easy') {
    const availableMoves = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  } else {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === '') {
        gameBoard[i] = 'O';
        const score = minimax(gameBoard, 0, false);
        gameBoard[i] = '';
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinnerSim(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (!board.includes('')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinnerSim(board) {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] === board[b] && board[b] === board[c] && board[a] !== '') {
      return board[a];
    }
  }
  return null;
}

function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c] && gameBoard[a] !== '') {
      resultElement.textContent = `Player ${gameBoard[a]} wins!`;
      gameOver = true;
      if (gameBoard[a] === 'X') scoreX++; else scoreO++;
      updateScore();
      return;
    }
  }

  if (!gameBoard.includes('')) {
    resultElement.textContent = 'It\'s a tie!';
    gameOver = true;
    scoreTie++;
    updateScore();
  }
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  currentPlayer = 'X';
  moveHistory = [];
  redoHistory = [];
  cells.forEach(cell => {
    cell.textContent = '';
  });
  resultElement.textContent = '';
  updateUndoRedoButtons();
}

function undoMove() {
  if (moveHistory.length === 0) return;

  const lastMove = moveHistory.pop();
  redoHistory.push(lastMove);
  gameBoard[lastMove] = '';
  cells[lastMove].textContent = '';
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  gameOver = false;
  resultElement.textContent = '';
  updateUndoRedoButtons();
}

function redoMove() {
  if (redoHistory.length === 0) return;

  const nextMove = redoHistory.pop();
  moveHistory.push(nextMove);
  gameBoard[nextMove] = currentPlayer;
  cells[nextMove].textContent = currentPlayer === 'X' ? symbolXInput.value : symbolOInput.value;
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  checkWinner();
  updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
  undoBtn.disabled = moveHistory.length === 0;
  redoBtn.disabled = redoHistory.length === 0;
}

function updateScore() {
  scoreXElement.textContent = scoreX;
  scoreOElement.textContent = scoreO;
  scoreTieElement.textContent = scoreTie;
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode');
}