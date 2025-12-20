let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (gameOver || cell.textContent !== '') return;
    cell.textContent = currentPlayer;
    board[index] = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  });
});

resetButton.addEventListener('click', () => {
  board = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  currentPlayer = 'X';
  cells.forEach((cell) => {
    cell.textContent = '';
  });
});

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combination of winningCombinations) {
    if (
      board[combination[0]] !== '' &&
      board[combination[0]] === board[combination[1]] &&
      board[combination[0]] === board[combination[2]]
    ) {
      gameOver = true;
      alert(`Player ${board[combination[0]]} wins!`);
      return;
    }
  }

  if (!board.includes('')) {
    gameOver = true;
    alert('It\'s a tie!');
  }
}