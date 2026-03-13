// Get the canvas and score element
const canvas = document.getElementById('gameCanvas');
const scoreElement = document.getElementById('score');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 400;
canvas.height = 400;

// Set the snake and food properties
let snake = [
    {x: canvas.width / 2, y: canvas.height / 2},
    {x: canvas.width / 2 + 20, y: canvas.height / 2},
    {x: canvas.width / 2 + 40, y: canvas.height / 2}
];
let food = {
    x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
    y: Math.floor(Math.random() * (canvas.height / 20)) * 20
};
let score = 0;
let direction = 'right';

// Draw the snake and food
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lime';
        ctx.fillRect(segment.x, segment.y, 20, 20);
    });
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

// Update the game state
function update() {
    let head = snake[0];
    let newHead;
    switch (direction) {
        case 'up':
            newHead = {x: head.x, y: head.y - 20};
            break;
        case 'down':
            newHead = {x: head.x, y: head.y + 20};
            break;
        case 'left':
            newHead = {x: head.x - 20, y: head.y};
            break;
        case 'right':
            newHead = {x: head.x + 20, y: head.y};
            break;
    }
    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        food = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20
        };
    } else {
        snake.pop();
    }
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height || snake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        alert(`Game Over! Your score is ${score}.`);
        snake = [
            {x: canvas.width / 2, y: canvas.height / 2},
            {x: canvas.width / 2 + 20, y: canvas.height / 2},
            {x: canvas.width / 2 + 40, y: canvas.height / 2}
        ];
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        direction = 'right';
    }
}

// Handle user input
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Main game loop
setInterval(() => {
    update();
    draw();
}, 1000 / 10);