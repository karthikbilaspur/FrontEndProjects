# 2048_game

Advanced – Feature-Rich HTML5 Game

A modern, fully-featured implementation of the classic 2048 puzzle game, built with HTML5, CSS3, and vanilla JavaScript.
This version goes far beyond the original, featuring AI autoplay, undo/redo, replay system, multiple game modes, persistent stats, and save & resume support.

🚀 Live Features
🧠 Core Gameplay

Classic 4×4 2048 gameplay

Keyboard and touch (swipe) controls

Smooth tile merging logic

Win detection at 2048

Game over detection when no moves remain

🔁 Advanced Controls

Undo / Redo (multi-step)

Replay System (records and replays full games)

Save & Resume (continues after page refresh)

Persistent Best Score

🤖 AI Autoplay

Smart heuristic-based AI

One-click autoplay

Adjustable speed (logic ready)

Ideal for learning game AI concepts

🎯 Game Modes

Classic – Standard 2048 rules

Hard – Higher chance of spawning 4

Timed – Time-limited gameplay (logic included)

📊 Statistics Tracking

Games played

Total moves

Wins

Highest tile achieved

Stored persistently using localStorage

🛠️ Tech Stack

HTML5 – Semantic structure & SEO

CSS3 – Responsive layout, modern UI, animations

JavaScript (ES6+) – Game engine, AI, state management

No frameworks – 100% vanilla code

📁 Project Structure
/
├── index.html      # Main HTML page
├── style.css       # Responsive, modern CSS
├── game.js         # Complete game engine + AI
└── README.md       # Project documentation

🎮 How to Play

Use Arrow Keys (or swipe on mobile) to move tiles.

Tiles slide in the chosen direction.

Tiles with the same number merge into one.

Each merge increases your score.

After every move, a new tile (2 or 4) appears.

Reach 2048 to win.

The game ends when no moves are possible.

⌨️ Controls
Action Input
Move Tiles Arrow Keys / Swipe
Restart Restart Button
Undo Undo Button
Redo Redo Button
AI Play AI Button
Replay Game Replay Button
🤖 AI Logic (Overview)

The AI evaluates all possible moves using heuristics such as:

Merge gain

Number of empty cells

Monotonic tile arrangement

It then selects the move with the highest score.

This system is extendable to Expectimax / Minimax algorithms.

💾 Save System

Game state is automatically saved using localStorage, including:

Board layout

Score

Mode

Replay history

Stats

Reloading the page resumes the game instantly.

📱 Responsive Design

Mobile-first layout

Works on phones, tablets, and desktops

Uses modern CSS features:

CSS variables

clamp()

Grid & Flexbox

prefers-reduced-motion

🌱 Future Improvements

True sliding animations (tile position tracking)

Expectimax AI (depth-based)

Replay timeline scrubber

Dark / Neon themes

Online leaderboard (Firebase)

Progressive Web App (PWA) support

📜 License

This project is open-source and available under the MIT License.

You are free to use, modify, and distribute it.

⭐ Final Note

This project is intentionally built without libraries to demonstrate:

Game logic design

State management

AI heuristics

Clean front-end architecture
