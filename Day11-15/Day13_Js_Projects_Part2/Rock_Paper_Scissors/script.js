let playerScore = 0;
let computerScore = 0;

const choices = ['rock', 'paper', 'scissors'];
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const resultElement = document.getElementById('result');

document.getElementById('rock-button').addEventListener('click', () => playGame('rock'));
document.getElementById('paper-button').addEventListener('click', () => playGame('paper'));
document.getElementById('scissors-button').addEventListener('click', () => playGame('scissors'));

function playGame(playerChoice) {
  const computerChoice = choices[Math.floor(Math.random() * choices.length)];
  const result = getResult(playerChoice, computerChoice);

  if (result === 'win') {
    playerScore++;
    playerScoreElement.textContent = `Player Score: ${playerScore}`;
    resultElement.textContent = `You win! ${playerChoice} beats ${computerChoice}.`;
  } else if (result === 'lose') {
    computerScore++;
    computerScoreElement.textContent = `Computer Score: ${computerScore}`;
    resultElement.textContent = `You lose! ${computerChoice} beats ${playerChoice}.`;
  } else {
    resultElement.textContent = `It's a tie! Both chose ${playerChoice}.`;
  }
}

function getResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return 'tie';
  if ((playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')) {
    return 'win';
  }
  return 'lose';
}