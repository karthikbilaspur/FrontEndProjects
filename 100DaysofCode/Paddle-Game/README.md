# Ultimate Chaos Pong: God Mode Edition

Experience Pong like never before! "Ultimate Chaos Pong: God Mode Edition" is a hyper-enhanced JavaScript Pong game that pushes the boundaries of the classic arcade experience. Featuring boss battles, dynamic power-ups, environmental hazards, a unique rage system, and a plethora of mutations, this game guarantees unparalleled chaos and endless fun.

## 🎮 How to Play

### Controls

Arrow Up/Down: Move your paddle.
Spacebar: Pause/Unpause the game.
Z Dash (move instantly up or down) or Shoot Bullets (if you have no dash cooldown).
X:Activate Rage Shot (when Rage meter is full).
1, 2, 3 Select upgrades from the upgrade menu when it appears.
Touch (Mobile): Drag your finger on the screen to move your paddle.
R (Game Over) Restart the game.

### Objective

Score points by getting the ball past your opponent. Be the first to reach 10 points or defeat the Boss to win!

## ✨ Features

This game is packed with mechanics from three progressively wilder versions of Pong, all mashed into one chaotic experience:

### Core Gameplay

Classic Pong Mechanics: The fundamental paddle and ball dynamics you know and love.
Juicy Effects:Particles, screen shake, and freeze-frame effects on impacts for satisfying hits.
Responsive Design: The game canvas and elements scale dynamically to fit different screen sizes.

### Power-ups & Upgrades

Power-ups: Small colored squares appear randomly, granting temporary buffs like `Big Paddle`, `Slow Ball`, `Multi Ball`, or `Invisible Paddle` (ghost mode).
Upgrade System: Every 3 player points, a special menu allows you to choose permanent upgrades like a bigger paddle, multi-ball, or a rage boost.
AI Buffs: The AI occasionally gets temporary buffs too (e.g., increased speed or a larger paddle), keeping the challenge high.

### Environmental Elements

Gravity Well:A central point that pulls the ball towards it, bending its trajectory.
Portals: Enter one purple portal, exit the other! Teleportation adds unpredictable movement.
Destructible Walls:The top and bottom walls have health. Hit them enough times to break segments, creating new routes for the ball!
Arena Effects: Random global modifiers like `Low Gravity`, `High Friction`, or `Paddle Clamp` (reducing paddle speed) activate periodically, changing the game's physics for a short duration.

### Player Abilities & Rage System

Dash: Press 'Z' for a quick, evasive dash.
Bullets:Use 'Z' to fire projectiles at the Boss or AI, but beware the cooldown!
Combo System: Build up combos by continuously hitting the ball without the AI scoring.
Rage Meter: Fills with combos and ball hits. High rage boosts bullet power and reduces dash cooldown.
Rage Shot: When your rage meter is full, unleash a super-powered 'X' shot for massive ball speed!

### Ball & Boss Mutations

Ball Mutations:High combos can cause the ball to mutate, becoming a `Ghost` ball (may pass through elements) or a `Seeking` ball (gently homes in on the opponent).

Boss Battle: After scoring 5 points, a Boss appears on the AI's side. It has multiple phases (indicated by color) and must be defeated by hitting it with the ball or bullets.

Ball Splitting: The Boss might sometimes split the ball into multiple pieces when hit, increasing the chaos!.

# Project Structure

`index.html`: The main HTML file, providing the game's structure, instructions, and meta-information.
`style.css`: Contains all the CSS styling for the page and game elements.
`script.js`: Holds all the JavaScript game logic, rendering, and interaction.
