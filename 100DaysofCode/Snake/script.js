const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
const cols = Math.floor(canvas.width / grid);
const rows = Math.floor(canvas.height / grid);

const ui = {
  mode: document.getElementById('mode'),
  speed: document.getElementById('speed'),
  start: document.getElementById('start'),
  pause: document.getElementById('pause'),
  restart: document.getElementById('restart'),
  score: document.getElementById('score'),
  high: document.getElementById('high'),
  time: document.getElementById('time'),
  lives: document.getElementById('lives'),
  bossLife: document.getElementById('bossLife'),
  soundBtn: document.getElementById('soundBtn'),
  skinBtn: document.getElementById('skinBtn'),
  leaderboard: document.getElementById('leaderboard'),
};

let state = {};
const HS_KEY = 'ultimate_snake_high';
const LB_KEY = 'ultimate_snake_leaderboard';
ui.high.textContent = localStorage.getItem(HS_KEY) || 0;

let skin = 0;
// Original modern retro, green-blue, red-pink
const skins = [
  ['#9db2ff', '#7c9cff'],
  ['#00e5a8', '#00bfff'],
  ['#ff9db2', '#ff7c9c'],
];

// Sound effects (placeholders)
const soundFx = {
  eat: new Audio('path/to/eat.mp3'), // Replace with actual sound files
  gameOver: new Audio('path/to/gameover.mp3'),
  // Add more as needed
};

function playSound(effect) {
  if (state.sound) {
    soundFx[effect].currentTime = 0;
    soundFx[effect].play();
  }
}

function reset() {
  const mode = ui.mode.value;
  state = {
    mode,
    snake: [{ x: 5, y: 5 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: spawnFood(),
    score: 0,
    high: +localStorage.getItem(HS_KEY) || 0,
    tick: 0,
    speed: +ui.speed.value,
    running: false,
    over: false,
    sound: false, // Default to off
    timeLeft: mode === 'time'? 60 : 0,
    lives: mode === 'life'? 3 : 0,
    aiSnake: (mode === 'vsai')? [{ x: cols - 6, y: rows - 6 }] : null,
    aiDir: (mode === 'vsai')? { x: -1, y: 0 } : null,
    obstacles: (mode === 'levels')? genObstacles() : [],
    boss: (mode === 'boss')? { x: cols / 2 | 0, y: rows / 2 | 0, life: 20 } : null,
  };
  updateUI();
  showLeaderboard(); // Update leaderboard on reset
}

function spawnFood() {
  while (true) {
    const f = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    const collisionWithSnake = state.snake.some(s => s.x === f.x && s.y === f.y);
    const collisionWithObstacle = state.obstacles.some(o => o.x === f.x && o.y === f.y);
    const collisionWithBoss = state.mode === 'boss' && state.boss.x === f.x && state.boss.y === f.y;
    const collisionWithAISnake = state.aiSnake && state.aiSnake.some(s => s.x === f.x && s.y === f.y);

    if (!collisionWithSnake &&!collisionWithObstacle &&!collisionWithBoss &&!collisionWithAISnake) {
      return f;
    }
  }
}

function genObstacles() {
  const newObstacles = [];
  const numObstacles = 10 + Math.floor(state.score / 50); // More obstacles as score increases
  for (let i = 0; i < numObstacles; i++) {
    let obstacle;
    do {
      obstacle = { x: Math.random() * cols | 0, y: Math.random() * rows | 0 };
    } while (state.snake.some(s => s.x === obstacle.x && s.y === obstacle.y) || // Avoid snake
             (obstacle.x === state.food.x && obstacle.y === state.food.y)); // Avoid food
    newObstacles.push(obstacle);
  }
  return newObstacles;
}

function updateUI() {
  ui.score.textContent = state.score;
  ui.high.textContent = state.high;
  ui.time.textContent = state.mode === 'time'? Math.max(0, Math.ceil(state.timeLeft)) : 'N/A';
  ui.lives.textContent = state.mode === 'life'? state.lives : 'N/A';
  ui.bossLife.textContent = state.mode === 'boss' && state.boss? state.boss.life : 'N/A';
  ui.soundBtn.textContent = 'Sound: ' + (state.sound? 'On' : 'Off');
}

function setDir(x, y) {
  // Prevent immediate reverse direction
  if (state.dir.x === -x && state.dir.y === -y) return;
  state.nextDir = { x, y };
}

document.addEventListener('keydown', e => {
  if (['ArrowUp', 'w', 'W'].includes(e.key)) setDir(0, -1);
  if (['ArrowDown', 's', 'S'].includes(e.key)) setDir(0, 1);
  if (['ArrowLeft', 'a', 'A'].includes(e.key)) setDir(-1, 0);
  if (['ArrowRight', 'd', 'D'].includes(e.key)) setDir(1, 0);
  if (e.key === 'p' || e.key === 'P') togglePause();
  if (e.key === 'r' || e.key === 'R') start();
});

// Touch controls for mobile
let startX, startY;
canvas.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', e => {
  const deltaX = e.changedTouches[0].clientX - startX;
  const deltaY = e.changedTouches[0].clientY - startY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    setDir(Math.sign(deltaX), 0);
  } else {
    // Vertical swipe
    setDir(0, Math.sign(deltaY));
  }
});

ui.start.onclick = start;
ui.restart.onclick = start;
ui.pause.onclick = togglePause;
ui.soundBtn.onclick = () => {
  state.sound =!state.sound;
  updateUI();
};
ui.skinBtn.onclick = () => {
  skin = (skin + 1) % skins.length;
};

function start() {
  reset();
  state.running = true;
  // If no animation frame loop is active, start one
  if (!state.animationFrameId) {
    state.animationFrameId = requestAnimationFrame(loop);
  }
}

function togglePause() {
  state.running =!state.running;
}

function aiMoveSimple(aiSnakeHead, targetFood) {
  const dx = Math.sign(targetFood.x - aiSnakeHead.x);
  const dy = Math.sign(targetFood.y - aiSnakeHead.y);

  // Try to move towards food
  if (dx!== 0) return { x: dx, y: 0 };
  if (dy!== 0) return { x: 0, y: dy };
  return { x: 0, y: 0 }; // Should not happen if food is reachable
}

function step() {
  if (!state.running || state.over) return;
  state.tick++;

  // Control game speed based on slider
  const gameSpeed = 21 - state.speed; // Higher speed value means lower frame skip
  if (state.tick % Math.floor(gameSpeed)!== 0) return;

  state.dir = state.nextDir;
  const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };

  // Wrap for infinity mode
  if (state.mode === 'infinity') {
    head.x = (head.x + cols) % cols;
    head.y = (head.y + rows) % rows;
  }

  // Collisions
  const hitWall = head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows;
  const hitSelf = state.snake.some(s => s.x === head.x && s.y === head.y);
  const hitObstacle = state.obstacles.some(o => o.x === head.x && o.y === head.y);
  const hitAISnake = state.aiSnake && state.aiSnake.some(s => s.x === head.x && s.y === head.y);

  if (hitWall || hitSelf || hitObstacle || hitAISnake) {
    if (state.mode === 'life' && state.lives > 0) {
      state.lives--;
      state.snake = [{ x: 5, y: 5 }]; // Respawn
      state.dir = { x: 1, y: 0 };
      state.nextDir = state.dir;
      playSound('gameOver'); // Placeholder for a "hit" sound
      updateUI();
      return;
    }
    gameOver();
    return;
  }

  // Boss collision
  if (state.mode === 'boss' && state.boss.x === head.x && state.boss.y === head.y) {
    state.boss.life--;
    if (state.boss.life <= 0) {
      alert('Boss Defeated! You win!');
      gameOver(true); // Indicate a win
      return;
    }
    // Snake still moves past boss, but might be 'stunned' or lose health
    // For now, it just takes damage.
  }

  state.snake.unshift(head);

  if (head.x === state.food.x && head.y === state.food.y) {
    state.score += 10;
    state.food = spawnFood();
    playSound('eat');
    if (state.mode === 'levels') {
      state.obstacles = genObstacles(); // Regenerate obstacles on food eaten
    }
    if (state.score > state.high) {
      state.high = state.score;
      localStorage.setItem(HS_KEY, state.high);
    }
  } else {
    state.snake.pop();
  }

  // AI snake simple greedy logic
  if (state.mode === 'vsai') {
    const aiHead = { x: state.aiSnake[0].x, y: state.aiSnake[0].y };
    let newAiDir = aiMoveSimple(aiHead, state.food);

    // Basic collision avoidance for AI (avoid self, walls, player snake)
    const potentialNextX = aiHead.x + newAiDir.x;
    const potentialNextY = aiHead.y + newAiDir.y;

    const aiHitWall = potentialNextX < 0 || potentialNextY < 0 || potentialNextX >= cols || potentialNextY >= rows;
    const aiHitSelf = state.aiSnake.some((s, i) => i > 0 && s.x === potentialNextX && s.y === potentialNextY);
    const aiHitPlayer = state.snake.some(s => s.x === potentialNextX && s.y === potentialNextY);

    if (aiHitWall || aiHitSelf || aiHitPlayer) {
      // If direct path is blocked, try to find an alternative. This is very basic.
      const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }]; // Up, Down, Left, Right
      for (const d of directions) {
        const nextX = aiHead.x + d.x;
        const nextY = aiHead.y + d.y;
        if (nextX >= 0 && nextY >= 0 && nextX < cols && nextY < rows &&
           !state.aiSnake.some((s, i) => i > 0 && s.x === nextX && s.y === nextY) &&
           !state.snake.some(s => s.x === nextX && s.y === nextY)) {
          newAiDir = d;
          break;
        }
      }
    }
    state.aiDir = newAiDir; // Update AI's direction

    const newAiHead = { x: aiHead.x + state.aiDir.x, y: aiHead.y + state.aiDir.y };

    // If AI hits player
    if (state.snake.some(s => s.x === newAiHead.x && s.y === newAiHead.y)) {
      gameOver(); // Player loses if AI hits them
      return;
    }

    state.aiSnake.unshift(newAiHead);
    if (newAiHead.x === state.food.x && newAiHead.y === state.food.y) {
      state.food = spawnFood();
    } else {
      state.aiSnake.pop();
    }
  }

  if (state.mode === 'time') {
    state.timeLeft -= (state.tick % gameSpeed === 0)? (1 / 10) : 0; // Only decrement on actual step
    if (state.timeLeft <= 0) gameOver();
  }

  updateUI();
}

function gameOver(win = false) {
  state.over = true;
  state.running = false;
  cancelAnimationFrame(state.animationFrameId); // Stop the animation loop
  state.animationFrameId = null; // Clear the ID
  playSound('gameOver');
  saveScore(state.score);
  if (!win) {
    alert('Game Over! Your score: ' + state.score);
  }
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * grid + 1, y * grid + 1, grid - 2, grid - 2);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // grid glow
  ctx.fillStyle = 'rgba(124,156,255,.08)';
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) ctx.fillRect(i * grid, j * grid, 1, 1);

  // food
  drawCell(state.food.x, state.food.y, '#00e5a8');

  // obstacles
  state.obstacles.forEach(o => drawCell(o.x, o.y, '#ffcc00'));

  // snake
  state.snake.forEach((s, i) => drawCell(s.x, s.y, skins[skin][i? 1 : 0]));

  // ai snake
  if (state.mode === 'vsai') {
    state.aiSnake.forEach((s, i) => drawCell(s.x, s.y, i? '#ff7c9c' : '#ff9db2'));
  }

  // boss
  if (state.mode === 'boss' && state.boss.life > 0) {
    drawCell(state.boss.x, state.boss.y, '#ff0000');
  }

  if (state.over &&!state.running) { // Only show "Game Over" screen if not running (i.e., actually over)
    ctx.fillStyle = 'rgba(0,0,0,.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  }
}

function loop() {
  step();
  render();
  state.animationFrameId = requestAnimationFrame(loop);
}

function saveScore(s) {
  let lb = JSON.parse(localStorage.getItem(LB_KEY) || '[]');
  lb.push(s);
  lb.sort((a, b) => b - a); // Sort descending
  lb = lb.slice(0, 10); // Keep top 10
  localStorage.setItem(LB_KEY, JSON.stringify(lb));
  showLeaderboard();
}

function showLeaderboard() {
  ui.leaderboard.innerHTML = '';
  const lb = JSON.parse(localStorage.getItem(LB_KEY) || '[]');
  lb.forEach(score => {
    let li = document.createElement('li');
    li.textContent = score;
    ui.leaderboard.appendChild(li);
  });
}

reset();
showLeaderboard(); // Show leaderboard on initial load