const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// --- Global Game State Variables ---
let paddleW, basePaddleH, ballSize; // These will be scaled
let combo = 0;
let rage = 0;
const maxRage = 10;
let upgradeChoice = false;

let player = {}; // Initialized in resetGame to ensure scaling
let ai = {}; // Initialized in resetGame to ensure scaling

let balls = []; // Initialized in resetGame
let particles = [];
let powerups = [];
let bullets = [];

let portals = []; // Initialized in resetGame
let gravity = {}; // Initialized in resetGame

let boss = {}; // Initialized in resetGame

let destructibleWalls = [];
const wallSegmentCount = 10;
const wallSegmentHealth = 3;

let arenaEffect = {}; // Initialized in resetGame
const arenaEffectDuration = 10 * 60; // 10 seconds at 60fps
const arenaEffectInterval = 30 * 60; // Spawn new effect every 30 seconds
let arenaEffectCountdown; // Initialized in resetGame

let shake = 0;
let freeze = 0;
let slowmo = 0;
let paused = false;
let aiDifficulty = 0.08;

let pScore = 0, aiScore = 0;
const maxScore = 10;
let gameOver = false;
let gameWinner = null;

// --- Utility Functions ---

// Scales values based on a reference resolution (e.g., 800x600)
function scaleX(value) { return value * (canvas.width / 800); }
function scaleY(value) { return value * (canvas.height / 600); }

// --- Canvas Resizing and Game Setup ---
function resizeCanvas() {
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.7;
    const aspectRatio = 16 / 9; // Common game aspect ratio

    let newWidth = maxWidth;
    let newHeight = maxWidth / aspectRatio;

    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
    }

    // Ensure minimum size for playability
    newWidth = Math.max(newWidth, 400); // Minimum width 400px
    newHeight = Math.max(newHeight, 300); // Minimum height 300px

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Re-initialize game elements that depend on canvas size
    initializeGameVariables();
    if (!gameOver) { // Only reset if not showing game over screen
       resetGame(true); // true means just re-init positions, not score
    } else {
        // If game is over, re-center the game over text properly
        draw();
    }
}

function initializeGameVariables() {
    paddleW = scaleX(14);
    basePaddleH = scaleY(110);
    ballSize = scaleX(12);

    portals = [{ x: scaleX(200), y: scaleY(200) }, { x: scaleX(600), y: scaleY(400) }]; // Adjusted second portal X to 600 for better spread
    gravity = { x: canvas.width / 2, y: canvas.height / 2, power: 0.15 };
}

// --- Game State Management ---
function resetGame(softReset = false) {
    if (!softReset) { // Full reset
        pScore = 0;
        aiScore = 0;
        combo = 0;
        rage = 0;
        gameOver = false;
        gameWinner = null;
        arenaEffectCountdown = arenaEffectInterval; // Reset effect timer
    }
    
    // Reset player and AI positions and properties
    player = { y: canvas.height / 2 - basePaddleH / 2, dy: 0, h: basePaddleH, dash: 0, rageShotReady: false, hasRageShot: false };
    ai = { y: player.y, dy: 0, h: basePaddleH, buff: null, buffTimer: 0 };
    
    // Reset boss
    boss = { active: false, y: canvas.height / 2, health: 240, phase: 1, lastBallSplit: 0 };

    // Reset balls
    balls = [{
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: scaleX(6) * (Math.random() > 0.5? 1 : -1), // Random initial direction
        vy: scaleY(3) * (Math.random() > 0.5? 1 : -1),
        speed: scaleX(6),
        ghost: false,
        seeking: false
    }];
    
    // Clear transient elements
    particles = [];
    powerups = [];
    bullets = [];
    
    // Re-initialize destructible walls
    initializeWalls();

    // Reset arena effect
    arenaEffect = { type: null, timer: 0 };
    
    shake = 0;
    freeze = 0;
    slowmo = 0;
    paused = false;
    aiDifficulty = 0.08; // Ensure AI difficulty is reset
}

function initializeWalls() {
    destructibleWalls = [];
    const wallSegmentWidth = canvas.width / wallSegmentCount;
    for (let i = 0; i < wallSegmentCount; i++) {
        destructibleWalls.push({
            y: 0,
            x: i * wallSegmentWidth,
            width: wallSegmentWidth,
            height: paddleW, // Use scaled paddleW for thickness
            health: wallSegmentHealth,
            broken: false
        });
        destructibleWalls.push({
            y: canvas.height - paddleW, // Position at bottom
            x: i * wallSegmentWidth,
            width: wallSegmentWidth,
            height: paddleW,
            health: wallSegmentHealth,
            broken: false
        });
    }
}

// --- Game Effects ---
function spawnParticles(x, y, c = 6, color = "#00f7ff") {
    for (let i = 0; i < c; i++) {
        particles.push({ x, y, vx: scaleX((Math.random() - 0.5) * 6), vy: scaleY((Math.random() - 0.5) * 6), life: 30, color });
    }
}

function triggerHitEffect() {
    shake = 12;
    freeze = 2;
}

// --- Power-ups ---
function spawnPower() {
    if (Math.random() < 0.005 &&!upgradeChoice &&!boss.active) {
        powerups.push({
            x: Math.random() * canvas.width * 0.6 + canvas.width * 0.2,
            y: Math.random() * canvas.height,
            type: ["big", "slow", "multi", "invis"][Math.floor(Math.random() * 4)]
        });
    }
}

function applyPower(type, ball) {
    if (type === "big") {
        player.h = basePaddleH * 1.6;
        setTimeout(() => player.h = basePaddleH, 6000);
    } else if (type === "slow") {
        balls.forEach(b => { b.vx *= 0.6; b.vy *= 0.6; });
    } else if (type === "multi") {
        balls.push({...ball, vx: -ball.vx });
    } else if (type === "invis") {
        player.ghost = true; // Placeholder for future ghost mechanic
        // setTimeout(() => player.ghost = false, 5000); // Uncomment if ghost has duration
    }
}

// --- AI Buffs ---
function applyAIBuff() {
    if (Math.random() < 0.02 && ai.buffTimer === 0 &&!boss.active) {
        const buffTypes = ["speed", "big"];
        ai.buff = buffTypes[Math.floor(Math.random() * buffTypes.length)];
        ai.buffTimer = 6 * 60; // 6 seconds buff
        if (ai.buff === "big") {
            ai.h = basePaddleH * 1.5;
        } else if (ai.buff === "speed") {
            aiDifficulty = 0.15; // AI becomes faster
        }
    }
}

function removeAIBuff() {
    if (ai.buffTimer > 0) {
        ai.buffTimer--;
        if (ai.buffTimer === 0) {
            if (ai.buff === "big") {
                ai.h = basePaddleH;
            } else if (ai.buff === "speed") {
                aiDifficulty = 0.08; // Reset AI difficulty
            }
            ai.buff = null;
        }
    }
}

// --- Arena Effects ---
function activateArenaEffect() {
    arenaEffectCountdown--;
    if (arenaEffectCountdown <= 0 && arenaEffect.timer === 0) {
        const effects = ["low_gravity", "high_friction", "paddle_clamp"];
        arenaEffect.type = effects[Math.floor(Math.random() * effects.length)];
        arenaEffect.timer = arenaEffectDuration;
        arenaEffectCountdown = arenaEffectInterval;
    }

    if (arenaEffect.timer > 0) {
        arenaEffect.timer--;
        if (arenaEffect.timer === 0) {
            arenaEffect.type = null;
        }
    }
}

// --- Ball & Paddle Physics ---
function bounce(paddleY, ball, isPlayerPaddle) {
    let paddleHeight = isPlayerPaddle? player.h : ai.h;
    let collide = (ball.y - (paddleY + paddleHeight / 2)) / (paddleHeight / 2);
    let angle = collide * Math.PI / 4;
    ball.vx = Math.sign(ball.vx) * ball.speed * Math.cos(angle);
    ball.vy = ball.speed * Math.sin(angle);

    if (isPlayerPaddle && player.hasRageShot) {
        ball.speed += scaleX(3); // Huge speed boost
        player.hasRageShot = false;
        spawnParticles(ball.x, ball.y, 20, "#ff0000");
    } else {
        ball.speed += scaleX(0.4);
    }

    if (arenaEffect.type === "high_friction") {
        ball.speed = Math.max(ball.speed * 0.9, scaleX(3)); // Reduce speed
    }

    triggerHitEffect();
    spawnParticles(ball.x, ball.y, 12, isPlayerPaddle? "#00f7ff" : "#ff00ff");

    if (isPlayerPaddle) {
        combo++;
        rage += 0.1;
        if (rage > maxRage) rage = maxRage;
        if (combo > 7) mutateBall(ball);
    }
    ball.seeking = false; // Reset seeking after a hit
}

function mutateBall(ball) {
    if (Math.random() < 0.2) ball.ghost = true;
    if (Math.random() < 0.2) ball.vy *= 1.5;
    if (Math.random() < 0.1) ball.seeking = true;
}

// --- Upgrade System ---
function upgradeMenu() {
    if (!upgradeChoice) return;
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = `${scaleY(40)}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("Choose Your Upgrade!", canvas.width / 2, canvas.height * 0.2);
    ctx.fillText("1: Bigger Paddle (Player.h +30%)", canvas.width / 2, canvas.height * 0.33);
    ctx.fillText("2: Multi Ball (Spawn a new ball)", canvas.width / 2, canvas.height * 0.43);
    ctx.fillText("3: Rage Boost (+3 Rage, Faster Bullets/Dash)", canvas.width / 2, canvas.height * 0.53);
    ctx.textAlign = "left";
}

addEventListener("keydown", e => {
    if (!upgradeChoice) return;
    if (e.key === "1") {
        player.h *= 1.3;
        upgradeChoice = false;
    } else if (e.key === "2") {
        // Find a ball to duplicate, if any exist
        if (balls.length > 0) {
            const originalBall = balls[Math.floor(Math.random() * balls.length)];
            balls.push({...originalBall, vx: -originalBall.vx });
        }
        upgradeChoice = false;
    } else if (e.key === "3") {
        rage += 3;
        if (rage > maxRage) rage = maxRage;
        upgradeChoice = false;
    }
});

// --- Main Game Loop Functions ---

function update() {
    if (paused || freeze > 0 || upgradeChoice || gameOver) {
        if (freeze > 0) freeze--;
        return;
    }

    // Player controls and movement
    player.dash--;
    player.y += player.dy;
    // Apply paddle clamp effect to player
    let playerMoveSpeed = scaleY(8);
    if (arenaEffect.type === "paddle_clamp") {
        playerMoveSpeed = scaleY(3);
    }
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

    // Rage Shot ready check
    if (rage >= maxRage &&!player.rageShotReady) {
        player.rageShotReady = true;
    }

    // Environmental / AI updates
    spawnPower();
    applyAIBuff();
    removeAIBuff();
    activateArenaEffect();

    // Boss update
    if (boss.active) {
        boss.y += (balls[0].y - boss.y - scaleY(80)) * 0.05;
        if (boss.health <= 0) {
            gameOver = true;
            gameWinner = "Player"; // Player wins by defeating boss
            return; // End game immediately
        }
    }

    // Ball updates
    balls.forEach(ball => {
        // AI movement
        ai.y += (ball.y - ai.y - ai.h / 2) * aiDifficulty;
        ai.y = Math.max(0, Math.min(canvas.height - ai.h, ai.y));

        // Gravity effect
        let dx = gravity.x - ball.x;
        let dy = gravity.y - ball.y;
        let currentGravityPower = gravity.power;
        if (arenaEffect.type === "low_gravity") {
            currentGravityPower *= 0.3;
        }
        ball.vx += dx * 0.0004 * currentGravityPower;
        ball.vy += dy * 0.0004 * currentGravityPower;

        // Seeking behavior
        if (ball.seeking) {
            let targetPaddleY = (ball.x < canvas.width / 2)? ai.y + ai.h / 2 : player.y + player.h / 2;
            let seekDirection = (targetPaddleY - ball.y);
            ball.vy += seekDirection * 0.005;
        }

        ball.x += ball.vx;
        ball.y += ball.vy;

        // Destructible Wall collisions
        if (ball.y <= 0 || ball.y >= canvas.height) {
            let hitWall = false;
            let hitY = ball.y <= 0? 0 : canvas.height - paddleW;
            let wallColorToSpawn = "#aaaaaa";

            for (let i = 0; i < destructibleWalls.length; i++) {
                let wall = destructibleWalls[i];
                if (!wall.broken && Math.abs(wall.y - hitY) < ballSize / 2 && ball.x > wall.x && ball.x < wall.x + wall.width) {
                    wall.health--;
                    if (wall.health <= 0) {
                        wall.broken = true;
                        wallColorToSpawn = "#cccccc";
                    }
                    hitWall = true;
                    break;
                }
            }

            if (hitWall) {
                ball.vy *= -1;
                triggerHitEffect();
                spawnParticles(ball.x, hitY, 15, wallColorToSpawn);
            } else {
                // If it passes a broken wall segment, it just reflects off the boundary
                ball.vy *= -1;
                triggerHitEffect();
            }
        }

        // Paddle collisions
        if (ball.x <= paddleW && ball.y > player.y && ball.y < player.y + player.h) {
            if (Math.abs(ball.x - paddleW) < scaleX(25)) slowmo = 10;
            if (!ball.ghost) { // Ghost balls can pass through
                bounce(player.y, ball, true);
            }
        }

        if (ball.x >= canvas.width - paddleW && ball.y > ai.y && ball.y < ai.y + ai.h) {
            bounce(ai.y, ball, false);
        }

        // Boss collision
        if (boss.active && ball.x >= canvas.width - scaleX(30) && ball.y > boss.y && ball.y < boss.y + scaleY(160)) {
            ball.vx *= -1;
            boss.health -= 2;
            triggerHitEffect();
            spawnParticles(ball.x, ball.y, 8, "#ff0033");

            // Ball splitting
            if (Math.random() < 0.2 && (Date.now() - boss.lastBallSplit) > 1000) {
                // Create a new ball object with mirrored velocity, but adjust slightly to avoid immediate re-collision
                const newBall = {...ball, vx: -ball.vx, vy: -ball.vy };
                newBall.x = ball.x - newBall.vx * 2; // Move new ball slightly away
                newBall.y = ball.y - newBall.vy * 2;
                balls.push(newBall);
                boss.lastBallSplit = Date.now();
            }
        }

        // Portals
        portals.forEach((p, i) => {
            let other = portals[(i + 1) % 2];
            if (Math.hypot(ball.x - p.x, ball.y - p.y) < scaleX(20)) {
                ball.x = other.x;
                ball.y = other.y;
                spawnParticles(ball.x, ball.y, 6, "#ff00ff");
            }
        });

        // Scoring
        if (ball.x < 0) {
            aiScore++;
            combo = 0;
            resetBall(ball);
            if (aiScore >= maxScore) {
                gameOver = true;
                gameWinner = "AI";
            }
        }
        if (ball.x > canvas.width) {
            pScore++;
            if (pScore % 3 === 0) upgradeChoice = true;
            if (pScore >= 5) boss.active = true;
            resetBall(ball);
            if (pScore >= maxScore) {
                gameOver = true;
                gameWinner = "Player";
            }
        }
    });

    // Bullet updates
    bullets.forEach(b => b.x += b.vx);
    bullets = bullets.filter(b => b.x < canvas.width);

    bullets.forEach((b, i) => {
        if (boss.active && b.x > canvas.width - scaleX(30) && b.y > boss.y && b.y < boss.y + scaleY(160)) {
            boss.health -= 5 + rage;
            bullets.splice(i, 1);
            spawnParticles(b.x, b.y, 10, "#ffff00");
        }
    });

    // Powerup collision (with balls)
    powerups.forEach((p, i) => {
        balls.forEach(ball => {
            if (Math.abs(ball.x - p.x) < scaleX(15) && Math.abs(ball.y - p.y) < scaleY(15)) {
                applyPower(p.type, ball);
                powerups.splice(i, 1); // Remove collected powerup
                spawnParticles(p.x, p.y, 6, "#fff");
            }
        });
    });

    // Particle decay
    particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; });
    particles = particles.filter(p => p.life > 0);

    // Screen shake and slowmo decay
    shake *= 0.9;
    if (slowmo > 0) slowmo--;
}

function resetBall(ball) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = scaleX(6);
    ball.vx = scaleX(6) * (Math.random() > 0.5? 1 : -1);
    ball.vy = scaleY(3) * (Math.random() > 0.5? 1 : -1);
    ball.ghost = false;
    ball.seeking = false;
}

function draw() {
    ctx.save();
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = scaleX(20);
    ctx.shadowColor = "#00f7ff";
    ctx.fillStyle = "#00f7ff";

    // Paddles
    ctx.fillRect(0, player.y, paddleW, player.h);
    ctx.fillRect(canvas.width - paddleW, ai.y, paddleW, ai.h);

    // Destructible walls
    destructibleWalls.forEach(wall => {
        if (!wall.broken) {
            let color = `hsl(${wall.health * 40}, 100%, 50%)`;
            ctx.fillStyle = color;
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        }
    });

    // Balls
    balls.forEach(b => {
        ctx.fillStyle = b.ghost? "#999" : "#fff";
        ctx.shadowColor = b.seeking? "#ffaa00" : "#00f7ff"; // Orange glow for seeking ball
        ctx.fillRect(b.x, b.y, ballSize, ballSize);
    });

    // Reset shadow color for other elements
    ctx.shadowColor = "#00f7ff";

    // Portals
    ctx.strokeStyle = "#ff00ff";
    portals.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, scaleX(20), 0, Math.PI * 2); ctx.stroke(); });

    // Gravity well
    ctx.strokeStyle = "#00ffff";
    ctx.beginPath(); ctx.arc(gravity.x, gravity.y, scaleX(25), 0, Math.PI * 2); ctx.stroke();

    // Boss
    if (boss.active) {
        if (boss.health > 160) ctx.fillStyle = "#f33";
        else if (boss.health > 80) ctx.fillStyle = "#ff0";
        else ctx.fillStyle = "#0f0";
        ctx.fillRect(canvas.width - scaleX(30), boss.y, scaleX(20), scaleY(160));
        ctx.fillStyle = "#fff";
        ctx.font = `${scaleY(24)}px Arial`;
        ctx.textAlign = "right";
        ctx.fillText("BOSS: " + Math.max(0, boss.health), canvas.width - scaleX(40), boss.y + scaleY(160) / 2);
        ctx.textAlign = "left";
    }

    // Bullets
    ctx.fillStyle = "#ffff00";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, scaleX(6), scaleY(2)));

    // Powerups
    powerups.forEach(p => {
        if (p.type === "big") ctx.fillStyle = "#0f0";
        else if (p.type === "slow") ctx.fillStyle = "#ff0";
        else if (p.type === "multi") ctx.fillStyle = "#f0f";
        else if (p.type === "invis") ctx.fillStyle = "#0ff";
        ctx.fillRect(p.x, p.y, scaleX(10), scaleY(10));
    });

    // Particles
    particles.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, scaleX(3), scaleY(3));
        ctx.globalAlpha = 1;
    });

    ctx.fillStyle = "#fff";
    ctx.font = `${scaleY(40)}px Arial`;
    ctx.fillText(pScore, canvas.width / 4, scaleY(60));
    ctx.fillText(aiScore, canvas.width * 3 / 4, scaleY(60));

    ctx.font = `${scaleY(20)}px Arial`;
    ctx.fillText("Combo: " + combo, scaleX(20), scaleY(40));
    ctx.fillText("Rage: " + rage.toFixed(1) + " / " + maxRage, scaleX(20), scaleY(65));

    if (player.rageShotReady) {
        ctx.fillStyle = "#ff0000";
        ctx.fillText("RAGE SHOT READY (X)", scaleX(20), scaleY(90));
    } else {
        ctx.fillStyle = "#888";
        ctx.fillText("RAGE SHOT (X)", scaleX(20), scaleY(90));
    }

    ctx.fillStyle = "#fff";
    ctx.fillText("Dash: " + Math.max(0, player.dash), scaleX(20), scaleY(115));

    // Display AI buff
    if (ai.buff) {
        ctx.fillStyle = "#ffaa00";
        ctx.textAlign = "right";
        ctx.fillText(`AI Buff: ${ai.buff.toUpperCase()} (${(ai.buffTimer / 60).toFixed(0)}s)`, canvas.width - scaleX(20), scaleY(40));
        ctx.textAlign = "left";
    }

    // Display Arena Effect
    if (arenaEffect.type) {
        ctx.fillStyle = "#00ff00";
        ctx.textAlign = "center";
        ctx.fillText(`ARENA: ${arenaEffect.type.replace('_', ' ').toUpperCase()} (${(arenaEffect.timer / 60).toFixed(0)}s)`, canvas.width / 2, scaleY(40));
        ctx.textAlign = "left";
    } else if (arenaEffectCountdown > 0) {
        ctx.fillStyle = "#888888";
        ctx.textAlign = "center";
        ctx.fillText(`Next Arena Effect in ${(arenaEffectCountdown / 60).toFixed(0)}s`, canvas.width / 2, scaleY(40));
        ctx.textAlign = "left";
    }

    upgradeMenu();

    // Game Over screen
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = `${scaleY(60)}px Arial`;
        ctx.textAlign = "center";
        if (gameWinner === "Player" && boss.health <= 0) {
            ctx.fillText("BOSS DEFEATED!", canvas.width / 2, canvas.height / 2 - scaleY(50));
            ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2 + scaleY(20));
        } else {
            ctx.fillText(`${gameWinner} WINS!`, canvas.width / 2, canvas.height / 2 - scaleY(50));
        }
        ctx.font = `${scaleY(30)}px Arial`;
        ctx.fillText("Press 'R' to Restart", canvas.width / 2, canvas.height / 2 + scaleY(80));
    }

    ctx.restore();
}

// --- Game Loop ---
function loop() {
    if (gameOver) {
        draw();
        return;
    }

    if (slowmo > 0) {
        // Run update multiple times during slowmo for smoother effect
        for (let i = 0; i < 0.5; i++) update(); // Adjust iterations for desired slowmo intensity
    } else {
        update();
    }
    draw();
    requestAnimationFrame(loop);
}

// --- Initialization ---
window.addEventListener('resize', resizeCanvas); // Listen for window resize events
resizeCanvas(); // Initial canvas setup and game variable initialization

// Start the game loop
loop();



