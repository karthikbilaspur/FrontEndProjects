const wordApiUrl = 'https://random-word-api.herokuapp.com/word?length=';
const quizApiUrl = 'https://opentdb.com/api.php?amount=1&category=18&difficulty=easy&type=multiple';
const hangmanCanvas = document.getElementById('hangman-canvas');
const ctx = hangmanCanvas.getContext('2d');
const wordDisplay = document.getElementById('word-display');
const keyboard = document.getElementById('keyboard');
const hintElement = document.getElementById('hint');
const restartBtn = document.getElementById('restart-btn');
const difficultyButtons = document.getElementById('difficulty-buttons');
const scoreElement = document.getElementById('score');

const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

const WORD_LENGTHS = {
  [DIFFICULTY_LEVELS.EASY]: 4,
  [DIFFICULTY_LEVELS.MEDIUM]: 6,
  [DIFFICULTY_LEVELS.HARD]: 8
};

const MAX_CHANCES = 6;
const HANGMAN_PARTS = [
  { type: 'base', x1: 50, y1: 150, x2: 150, y2: 150 },
  { type: 'head', x: 100, y: 120, radius: 20 },
  { type: 'body', x1: 100, y1: 140, x2: 100, y2: 180 },
  { type: 'leftArm', x1: 100, y1: 160, x2: 80, y2: 180 },
  { type: 'rightArm', x1: 100, y1: 160, x2: 120, y2: 180 },
  { type: 'leftLeg', x1: 100, y1: 180, x2: 80, y2: 200 },
  { type: 'rightLeg', x1: 100, y1: 180, x2: 120, y2: 200 }
];

let gameState = {
  word: '',
  guessedLetters: [],
  chances: MAX_CHANCES,
  hint: '',
  quizQuestion: '',
  quizAnswer: '',
  score: 0,
  currentDifficulty: DIFFICULTY_LEVELS.EASY,
  hintUsed: false
};

fetchWord();
fetchQuiz();

function fetchWord() {
  const url = `${wordApiUrl}${getWordLength(gameState.currentDifficulty)}`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      gameState.word = data[0];
      gameState.hint = `It's a computer-related term`;
      hintElement.textContent = gameState.hint;
      updateUI();
      createKeyboard();
      drawHangman();
    })
    .catch(error => {
      console.error('Error fetching word:', error);
      alert('Oops, something went wrong! Please try again.');
    });
}

function fetchQuiz() {
  fetch(quizApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      gameState.quizQuestion = data.results[0].question;
      gameState.quizAnswer = data.results[0].correct_answer;
    })
    .catch(error => {
      console.error('Error fetching quiz:', error);
      alert('Oops, something went wrong! Please try again.');
    });
}

function createKeyboard() {
  keyboard.innerHTML = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  alphabet.split('').forEach(letter => {
    const button = document.createElement('button');
    button.textContent = letter;
    button.addEventListener('click', () => guessLetter(letter));
    keyboard.appendChild(button);
  });
}

function guessLetter(letter) {
  if (gameState.guessedLetters.includes(letter)) return;
  gameState.guessedLetters.push(letter);
  if (!gameState.word.includes(letter)) {
    gameState.chances--;
  }
  updateUI();
  drawHangman();
  checkGameOver();
}

function updateUI() {
  wordDisplay.textContent = gameState.word.split('').map(letter => gameState.guessedLetters.includes(letter) ? letter : '_').join(' ');
  scoreElement.textContent = `Score: ${gameState.score}`;
  if (gameState.chances === 1 && !gameState.hintUsed) {
    const useHint = confirm('Do you want to use a hint?');
    if (useHint) {
      gameState.hintUsed = true;
      hintElement.textContent = `Hint: ${gameState.word}`;
    }
  }
}

function drawHangman() {
  ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
  HANGMAN_PARTS.forEach((part, index) => {
    if (gameState.chances < MAX_CHANCES - index) {
      drawPart(part);
    }
  });
}

function drawPart(part) {
  switch (part.type) {
    case 'base':
      ctx.beginPath();
      ctx.moveTo(part.x1, part.y1);
      ctx.lineTo(part.x2, part.y2);
      ctx.stroke();
      break;
    case 'head':
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'body':
      ctx.beginPath();
      ctx.moveTo(part.x1, part.y1);
      ctx.lineTo(part.x2, part.y2);
      ctx.stroke();
      break;
    case 'leftArm':
      ctx.beginPath();
      ctx.moveTo(part.x1, part.y1);
      ctx.lineTo(part.x2, part.y2);
      ctx.stroke();
      break;
    case 'rightArm':
      ctx.beginPath();
      ctx.moveTo(part.x1, part.y1);
      ctx.lineTo(part.x2, part.y2);
      ctx.stroke();
      break;
    case 'leftLeg':
      ctx.beginPath();
      ctx.moveTo(part.x1, part.y1);
      ctx.lineTo(part.x2, part.y2);
      ctx.stroke();
      break;
    case 'rightLeg':
      ctx.beginPath();
      ctx.moveTo(part.x1, part.y1);
      ctx.lineTo(part.x2, part.y2);
      ctx.stroke();
      break;
  }
}

function checkGameOver() {
  if (gameState.chances === 0) {
    const userAnswer = prompt(`Game Over! The word was ${gameState.word}. Answer the quiz question: ${gameState.quizQuestion}`);
    if (userAnswer.toLowerCase() === gameState.quizAnswer.toLowerCase()) {
      alert('Correct!');
    } else {
      alert(`Incorrect. The correct answer was ${gameState.quizAnswer}`);
    }
    restartGame();
  } else if (!gameState.word.split('').some(letter => !gameState.guessedLetters.includes(letter))) {
    gameState.score++;
    scoreElement.textContent = `Score: ${gameState.score}`;
    alert('Congratulations! You won!');
    restartGame();
  }
}

function restartGame() {
  fetchWord();
  fetchQuiz();
  gameState.chances = MAX_CHANCES;
  gameState.guessedLetters = [];
  gameState.hintUsed = false;
}

function getWordLength(difficulty) {
  return WORD_LENGTHS[difficulty];
}

const difficulties = [DIFFICULTY_LEVELS.EASY, DIFFICULTY_LEVELS.MEDIUM, DIFFICULTY_LEVELS.HARD];
difficulties.forEach(difficulty => {
  const button = document.createElement('button');
  button.textContent = difficulty;
  button.addEventListener('click', () => {
    gameState.currentDifficulty = difficulty;
    restartGame();
  });
  difficultyButtons.appendChild(button);
});

keyboard.addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    const letter = event.target.textContent;
    guessLetter(letter);
  }
});

document.addEventListener('keydown', event => {
  if (event.key.match(/^[a-z]$/)) {
    guessLetter(event.key);
  }
});

restartBtn.addEventListener('click', restartGame);