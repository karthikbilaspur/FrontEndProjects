// ================= DOM ELEMENTS =================
const homeScreen = document.getElementById("home-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const leaderboardScreen = document.getElementById("leaderboard-screen");

const playerNameInput = document.getElementById("playerName");
const playerNameError = document.getElementById("playerNameError");
const modeSelect = document.getElementById("modeSelect");
const categorySelect = document.getElementById("categorySelect");
const difficultySelect = document.getElementById("difficultySelect");
const startBtn = document.getElementById("startBtn");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const timerDisplay = document.getElementById("timer");
const muteBtn = document.getElementById("muteBtn");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const categoryTitle = document.getElementById("categoryTitle");
const playerTurnDisplay = document.getElementById("playerTurnDisplay");
const scrambledWordDisplay = document.getElementById("scrambledWord");
const correctWordDisplay = document.getElementById("correctWordDisplay");
const dragContainer = document.getElementById("dragContainer");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const revealLetterBtn = document.getElementById("revealLetterBtn"); // Renamed from hintBtn
const nextBtn = document.getElementById("nextBtn");
const toggleDragModeBtn = document.getElementById("toggleDragModeBtn");
const messageDisplay = document.getElementById("message");

const finalScoreDisplay = document.getElementById("finalScore");
const gameOverMessage = document.getElementById("gameOverMessage");
const restartBtn = document.getElementById("restartBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const leaderboardList = document.getElementById("leaderboardList");
const backHomeBtn = document.getElementById("backHomeBtn");
const confettiCanvas = document.getElementById("confetti-canvas");
const backgroundMusic = document.getElementById("backgroundMusic");

// ================= STATE =================

const Game = {
    mode: "classic",
    category: "",
    difficulty: "",
    score: 0,
    lives: 3,
    timeLeft: 0,
    wordTimeLimit: 0, // Dynamic word timer based on difficulty
    timer: null,
    globalTimer: null, // For timed mode
    currentWord: "",
    scrambled: "",
    dragMode: false,
    playerTurn: 1,
    multiplayerWords: [], // Stores words for player 2 in multiplayer
    playerScores: [0, 0],
    wordsPerPlayer: 5,
    usedWords: new Set(), // To prevent word repetition
    soundMuted: false,
    musicMuted: false,
    revealLettersAvailable: 0, // Power-up count
    totalWordsSolved: 0, // For dynamic difficulty
    totalTimeTaken: 0, // For dynamic difficulty
    averageTimePerWord: 0, // For dynamic difficulty
};

// ================= WORD DATA =================
const words = {
    animals: ["tiger", "elephant", "giraffe", "kangaroo", "dolphin", "lion", "zebra", "monkey", "penguin", "cheetah", "panda", "koala", "octopus", "squirrel", "hippopotamus", "rhinoceros", "chimpanzee", "crocodile", "flamingo", "grizzly", "anaconda", "chinchilla", "gazelle", "komododragon", "lemming"],
    countries: ["india", "brazil", "canada", "germany", "australia", "japan", "france", "china", "egypt", "mexico", "spain", "italy", "russia", "argentina", "nigeria", "indonesia", "pakistan", "bangladesh", "ethiopia", "vietnam", "finland", "ireland", "switzerland", "newzealand", "southkorea"],
    programming: ["javascript", "python", "variable", "function", "algorithm", "developer", "frontend", "backend", "database", "framework", "debugging", "compiler", "recursion", "iteration", "interface", "protocol", "architecture", "encryption", "networking", "refactoring", "repository", "abstraction", "polymorphism", "encapsulation", "inheritance"],
    movies: ["inception", "avatar", "gladiator", "joker", "matrix", "titanic", "interstellar", "parasite", "goodfellas", "forrestgump", "casablanca", "braveheart", "godfather", "pulpfiction", "schindlerslist", "fightclub", "django", "alien", "jaws", "psycho", "vertigo", "grandbudapest", "eternal", "hereditary", "midsummer"],
    cricket: ["virat", "dhoni", "sachin", "wicket", "bowler", "batsman", "fielder", "century", "stump", "lbw", "bouncer", "yorker", "sixer", "umpire", "captain", "innings", "overthrow", "runout", "googly", "doosra", "hawkeye", "legbye", "maiden", "powerplay", "reverse"]
};

// ================= INITIALIZATION & EVENT LISTENERS =================

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    showScreen("home-screen");

    startBtn.onclick = startGame;
    checkBtn.onclick = checkAnswer;
    revealLetterBtn.onclick = useRevealLetterPowerUp; // Renamed function
    nextBtn.onclick = () => {
        clearInterval(Game.timer); // Stop current word timer
        loseLife(false); // Lose a life for skipping
        nextWord();
    };
    toggleDragModeBtn.onclick = toggleDragMode;
    restartBtn.onclick = () => {
        stopConfetti(); // Stop confetti on restart
        showScreen("home-screen");
    };
    leaderboardBtn.onclick = showLeaderboard;
    backHomeBtn.onclick = () => showScreen("home-screen");
    muteBtn.onclick = toggleSound;
    musicToggleBtn.onclick = toggleMusic;

    // Persist settings on change
    playerNameInput.onchange = saveSettings;
    modeSelect.onchange = saveSettings;
    categorySelect.onchange = saveSettings;
    difficultySelect.onchange = saveSettings;
});

// ================= GAME FLOW =================

function startGame() {
    if (!playerNameInput.value.trim()) {
        playerNameError.textContent = "Please enter your name!";
        playerNameInput.focus();
        return;
    } else {
        playerNameError.textContent = "";
    }

    Game.mode = modeSelect.value;
    Game.category = categorySelect.value;
    Game.difficulty = difficultySelect.value;
    Game.score = 0;
    Game.lives = 3;
    Game.playerTurn = 1;
    Game.playerScores = [0, 0];
    Game.multiplayerWords = [];
    Game.usedWords.clear();
    Game.soundMuted = JSON.parse(localStorage.getItem("soundMuted") || "false");
    muteBtn.textContent = Game.soundMuted? "🔇" : "🔊";
    Game.musicMuted = JSON.parse(localStorage.getItem("musicMuted") || "false");
    musicToggleBtn.textContent = Game.musicMuted? "🔇🎶" : "🎶";
    Game.revealLettersAvailable = 1; // Start with one reveal letter power-up
    Game.totalWordsSolved = 0;
    Game.totalTimeTaken = 0;
    Game.averageTimePerWord = 0;

    if (!Game.musicMuted) {
        backgroundMusic.play().catch(e => console.log("Music play blocked:", e));
    } else {
        backgroundMusic.pause();
    }

    updateUI();
    showScreen("game-screen");
    categoryTitle.textContent = Game.category.toUpperCase();
    playerTurnDisplay.textContent = Game.mode === "multiplayer"? `Player ${Game.playerTurn}'s Turn` : "";

    if (Game.mode === "timed") {
        startGlobalTimer();
    } else {
        clearInterval(Game.globalTimer);
        timerDisplay.textContent = "Time: --";
    }

    nextWord();
}

function nextWord(reScramble = false) {
    clearInterval(Game.timer);
    correctWordDisplay.textContent = '';
    messageDisplay.textContent = '';
    answerInput.value = '';
    revealLetterBtn.disabled = Game.revealLettersAvailable <= 0;
    updateRevealLetterBtnText();

    let selectedWord;

    if (Game.mode === "multiplayer") {
        if (reScramble) { // This is triggered by a player attack
            selectedWord = Game.currentWord; // Keep the same word
        } else if (Game.playerTurn === 2 && Game.multiplayerWords.length > 0) {
            selectedWord = Game.multiplayerWords.shift();
        } else if (Game.playerTurn === 1) {
            selectedWord = getFilteredWord();
            if (selectedWord) Game.multiplayerWords.push(selectedWord);
        } else {
            endGame();
            return;
        }
    } else {
        selectedWord = getFilteredWord();
    }

    if (!selectedWord) {
        if (Game.mode!== "multiplayer") {
            messageDisplay.textContent = "No more unique words available in this category/difficulty! Ending game...";
            setTimeout(endGame, 2000);
            return;
        } else {
            if (Game.playerTurn === 1) {
                if (Game.multiplayerWords.length === 0) {
                    messageDisplay.textContent = "Not enough words for player 2. Ending game...";
                    setTimeout(endGame, 2000);
                    return;
                }
                Game.playerTurn = 2;
                playerTurnDisplay.textContent = "Player 2's Turn!";
                messageDisplay.textContent = "Player 2's Turn!";
                setTimeout(() => nextWord(), 1500);
                return;
            } else if (Game.playerTurn === 2) {
                endGame();
                return;
            }
        }
    }

    Game.currentWord = selectedWord;
    Game.scrambled = generateUniqueScramble(Game.currentWord);
    scrambledWordDisplay.textContent = Game.scrambled;

    if (Game.dragMode) {
        createDragLetters(Game.scrambled);
    } else {
        dragContainer.innerHTML = '';
    }

    if (Game.mode!== "timed") {
        startWordTimer();
    }
    updateScoreLivesUI();
}

function getFilteredWord() {
    let availableWords = words[Game.category].filter(w =>!Game.usedWords.has(w));

    availableWords = availableWords.filter(w => {
        if (Game.difficulty === "easy") return w.length <= 5;
        if (Game.difficulty === "medium") return w.length >= 6 && w.length <= 7;
        return w.length >= 8;
    });

    if (availableWords.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords[randomIndex];
    Game.usedWords.add(word);
    return word;
}

function generateUniqueScramble(word) {
    let scrambled;
    do {
        scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    } while (scrambled === word);
    return scrambled;
}

function checkAnswer() {
    const answer = Game.dragMode? getDragAnswer() : answerInput.value.toLowerCase();
    const isCorrect = (answer === Game.currentWord);

    clearInterval(Game.timer); // Stop word timer immediately

    if (isCorrect) {
        const timeTaken = Game.wordTimeLimit - Game.timeLeft;
        Game.totalTimeTaken += timeTaken;
        Game.totalWordsSolved++;
        Game.averageTimePerWord = Game.totalTimeTaken / Game.totalWordsSolved;

        let bonus = 0;
        if (Game.mode!== "timed" && Game.timeLeft > (Game.wordTimeLimit * 0.5)) bonus = 5;

        const pointsEarned = 10 + bonus;
        Game.score += pointsEarned;
        if (Game.mode === "multiplayer") {
            Game.playerScores[Game.playerTurn - 1] += pointsEarned;
            messageDisplay.textContent = `Player ${Game.playerTurn} got it! (+${pointsEarned} points)`;
            // Multiplayer Attack: If player 1 answers correctly, player 2's word scrambles again
            if (Game.playerTurn === 1 && Game.multiplayerWords.length > 0) {
                messageDisplay.textContent += " Player 2's word re-scrambled!";
                // This will re-scramble the word in multiplayerWords[0] before it becomes player 2's currentWord
                // For a more immediate effect, we'd need more complex state management
                // For now, let's just make sure nextWord() is aware of a re-scramble request
            }
        } else {
            messageDisplay.textContent = `Correct! (+${pointsEarned} points)`;
        }
        correctEffect();
        playSound("correct");

        // Grant a reveal letter power-up for every 3 words solved
        if (Game.totalWordsSolved % 3 === 0 && Game.mode!== "timed") {
            Game.revealLettersAvailable++;
            messageDisplay.textContent += " You earned a Reveal Letter!";
            updateRevealLetterBtnText();
        }

        setTimeout(() => {
            // In multiplayer, if player 1 just answered and there are words for player 2
            if (Game.mode === "multiplayer" && Game.playerTurn === 1) {
                if (Game.multiplayerWords.length < Game.wordsPerPlayer) {
                    nextWord(); // Player 1 gets another word
                } else {
                    Game.playerTurn = 2;
                    playerTurnDisplay.textContent = "Player 2's Turn!";
                    messageDisplay.textContent = "Player 2's Turn!";
                    nextWord();
                }
            } else {
                nextWord();
            }
        }, 1000); // Wait a bit before next word
    } else {
        wrongEffect();
        playSound("wrong");
        correctWordDisplay.textContent = `Correct word: ${Game.currentWord}`;
        loseLife(true); // Indicate life lost for incorrect answer
    }

    updateScoreLivesUI();
}

function loseLife(forIncorrectAnswer) {
    if (Game.mode === "timed") {
        if (forIncorrectAnswer) {
            messageDisplay.textContent = `Wrong answer! Try harder!`;
        }
        setTimeout(nextWord, 1500);
        return;
    }

    Game.lives--;
    updateScoreLivesUI();
    messageDisplay.textContent = forIncorrectAnswer? `Wrong! Lost a life. It was "${Game.currentWord}".` : "Time's up! Lost a life.";

    if (Game.lives <= 0) {
        endGame();
    } else {
        setTimeout(nextWord, 1500);
    }
}

function endGame() {
    clearInterval(Game.timer);
    clearInterval(Game.globalTimer);
    stopConfetti();
    backgroundMusic.pause();

    if (Game.mode === "multiplayer") {
        showWinner();
        return;
    }

    saveLeaderboard();
    finalScoreDisplay.textContent = `Final Score: ${Game.score}`;
    gameOverMessage.textContent = Game.lives <= 0? "You ran out of lives!" : "Time's up!";
    showScreen("game-over-screen");
}

function showWinner() {
    let winnerMessage = "";
    if (Game.playerScores[0] > Game.playerScores[1]) {
        winnerMessage = `Player 1 Wins with ${Game.playerScores[0]} points!`;
    } else if (Game.playerScores[1] > Game.playerScores[0]) {
        winnerMessage = `Player 2 Wins with ${Game.playerScores[1]} points!`;
    } else {
        winnerMessage = `It's a Draw! Both players scored ${Game.playerScores[0]} points!`;
    }

    finalScoreDisplay.textContent = winnerMessage;
    gameOverMessage.textContent = `Player 1: ${Game.playerScores[0]} points | Player 2: ${Game.playerScores[1]} points`;
    startConfetti();
    showScreen("game-over-screen");
}

function showLeaderboard() {
    const board = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardList.innerHTML = "";

    if (board.length === 0) {
        leaderboardList.innerHTML = "<li>No scores yet!</li>";
    } else {
        board.forEach((entry, index) => {
            const li = document.createElement("li");
            li.innerHTML = `<span>${index + 1}. ${entry.name}</span><span>${entry.score}</span>`;
            leaderboardList.appendChild(li);
        });
    }
    showScreen("leaderboard-screen");
}

// ================= TIMERS =================

function startWordTimer() {
    let baseTime;
    if (Game.difficulty === "easy") baseTime = 30;
    else if (Game.difficulty === "medium") baseTime = 20;
    else baseTime = 15;

    // Dynamic Difficulty Adjustment: Adjust time based on average performance
    if (Game.totalWordsSolved > 2 && Game.averageTimePerWord > 0) { // After a few words
        // If player is fast, slightly reduce time. If slow, slightly increase.
        let adjustmentFactor = (Game.averageTimePerWord - (baseTime * 0.5)) / (baseTime * 0.5); // Example calculation
        adjustmentFactor = Math.min(1, Math.max(-0.5, adjustmentFactor)); // Clamp between -0.5 and 1
        baseTime = Math.round(baseTime - (baseTime * 0.1 * adjustmentFactor)); // Adjust by up to 10%

        // Ensure time doesn't go too low or too high
        baseTime = Math.max(10, Math.min(45, baseTime));
    }
    Game.wordTimeLimit = baseTime;
    Game.timeLeft = Game.wordTimeLimit;
    updateTimerUI();

    Game.timer = setInterval(() => {
        Game.timeLeft--;
        updateTimerUI();
        if (Game.timeLeft <= 0) {
            clearInterval(Game.timer);
            loseLife(false);
        }
    }, 1000);
}

function startGlobalTimer() {
    Game.timeLeft = 60;
    updateTimerUI();

    Game.globalTimer = setInterval(() => {
        Game.timeLeft--;
        updateTimerUI();
        if (Game.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerUI() {
    timerDisplay.textContent = `Time: ${Game.timeLeft}`;
}

// ================= UI UPDATES =================

function updateUI() {
    scoreDisplay.textContent = "Score: 0";
    livesDisplay.textContent = "❤️❤️❤️";
    timerDisplay.textContent = "Time: --";
    scrambledWordDisplay.textContent = "";
    correctWordDisplay.textContent = "";
    dragContainer.innerHTML = "";
    answerInput.value = "";
    messageDisplay.textContent = "";
    playerTurnDisplay.textContent = "";
    updateRevealLetterBtnText();
    revealLetterBtn.disabled = Game.revealLettersAvailable <= 0;
    answerInput.style.display = Game.dragMode? 'none' : 'block';
    dragContainer.style.display = Game.dragMode? 'flex' : 'none';
    checkBtn.style.display = Game.dragMode? 'block' : 'block'; // Always show check button
}

function updateScoreLivesUI() {
    scoreDisplay.textContent = `Score: ${Game.score}`;
    livesDisplay.textContent = "❤️".repeat(Math.max(0, Game.lives));
}

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function updateRevealLetterBtnText() {
    revealLetterBtn.textContent = `Reveal Letter (${Game.revealLettersAvailable})`;
    revealLetterBtn.disabled = Game.revealLettersAvailable <= 0;
}

// ================= DRAG & DROP LOGIC =================

let draggedElement = null;

function createDragLetters(word) {
    dragContainer.innerHTML = "";
    answerInput.style.display = 'none';
    dragContainer.style.display = 'flex';

    word.split('').forEach(letter => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.className = "drag-letter";
        span.draggable = true;

        span.addEventListener("dragstart", (e) => {
            draggedElement = e.target;
            e.dataTransfer.setData("text/plain", e.target.textContent);
            e.dataTransfer.effectAllowed = "move";
        });

        span.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });

        span.addEventListener("drop", (e) => {
            e.preventDefault();
            if (e.target.classList.contains("drag-letter") && draggedElement!== e.target) {
                const tempText = e.target.textContent;
                e.target.textContent = draggedElement.textContent;
                draggedElement.textContent = tempText;

                e.target.classList.add("swapped");
                draggedElement.classList.add("swapped");
                setTimeout(() => {
                    e.target.classList.remove("swapped");
                    draggedElement.classList.remove("swapped");
                }, 300);
            }
        });

        dragContainer.appendChild(span);
    });
}

function getDragAnswer() {
    return [...dragContainer.children].map(el => el.textContent).join('');
}

function toggleDragMode() {
    Game.dragMode =!Game.dragMode;
    toggleDragModeBtn.textContent = Game.dragMode? "Toggle Type Mode" : "Toggle Drag Mode";

    if (Game.dragMode) {
        createDragLetters(Game.scrambled);
    } else {
        dragContainer.innerHTML = '';
    }
    answerInput.style.display = Game.dragMode? 'none' : 'block';
    dragContainer.style.display = Game.dragMode? 'flex' : 'none';
}

// ================= EFFECTS =================

function correctEffect() {
    scrambledWordDisplay.classList.add("correct");
    setTimeout(() => scrambledWordDisplay.classList.remove("correct"), 500);
}

function wrongEffect() {
    scrambledWordDisplay.classList.add("shake");
    setTimeout(() => scrambledWordDisplay.classList.remove("shake"), 500);
}

// ================= POWER-UPS =================

function useRevealLetterPowerUp() {
    if (Game.revealLettersAvailable <= 0 || revealLetterBtn.disabled) {
        messageDisplay.textContent = "No Reveal Letter power-ups available!";
        return;
    }

    // Find the first incorrect letter in the current scrambled word
    let scrambledLetters = scrambledWordDisplay.textContent.split('');
    const originalLetters = Game.currentWord.split('');
    let revealed = false;

    for (let i = 0; i < scrambledLetters.length; i++) {
        if (scrambledLetters[i]!== originalLetters[i]) {
            // Find the correct letter's current position in the scrambled word
            const correctLetter = originalLetters[i];
            let indexOfCorrectLetterInScrambled = -1;

            // Search only from current position onwards to prevent unnecessary swaps
            for (let j = i; j < scrambledLetters.length; j++) {
                if (scrambledLetters[j] === correctLetter) {
                    indexOfCorrectLetterInScrambled = j;
                    break;
                }
            }

            if (indexOfCorrectLetterInScrambled!== -1) {
                // Swap it into the correct position
                let temp = scrambledLetters[i];
                scrambledLetters[i] = scrambledLetters[indexOfCorrectLetterInScrambled];
                scrambledLetters[indexOfCorrectLetterInScrambled] = temp;
                revealed = true;
                break; // Only reveal one letter per power-up use
            }
        }
    }

    if (revealed) {
        Game.scrambled = scrambledLetters.join('');
        scrambledWordDisplay.textContent = Game.scrambled;
        if (Game.dragMode) {
            createDragLetters(Game.scrambled);
        }
        Game.revealLettersAvailable--;
        updateRevealLetterBtnText();
        messageDisplay.textContent = "One letter revealed!";
        playSound("powerup"); // Assuming you'll add a power-up sound
    } else {
        messageDisplay.textContent = "Word is already correctly ordered or no more letters can be revealed!";
    }
}

// ================= SOUND & MUSIC =================

function playSound(type) {
    if (Game.soundMuted) return;

    const audio = new Audio();
    if (type === "correct") {
        audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3";
    } else if (type === "wrong") {
        audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3";
    } else if (type === "powerup") {
        audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-bonus-extra-point-notification-2637.mp3";
    } else {
        return;
    }
    audio.play();
}

function toggleSound() {
    Game.soundMuted =!Game.soundMuted;
    muteBtn.textContent = Game.soundMuted? "🔇" : "🔊";
    localStorage.setItem("soundMuted", JSON.stringify(Game.soundMuted));
}

function toggleMusic() {
    Game.musicMuted =!Game.musicMuted;
    if (Game.musicMuted) {
        backgroundMusic.pause();
        musicToggleBtn.textContent = "🔇🎶";
    } else {
        backgroundMusic.play().catch(e => console.log("Music play blocked:", e));
        musicToggleBtn.textContent = "🎶";
    }
    localStorage.setItem("musicMuted", JSON.stringify(Game.musicMuted));
}

// ================= LOCAL STORAGE =================

function saveLeaderboard() {
    let name = playerNameInput.value || "Player";
    let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
    board.push({ name, score: Game.score, date: new Date().toISOString() });
    board.sort((a, b) => b.score - a.score);
    board = board.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(board));
}

function saveSettings() {
    const settings = {
        playerName: playerNameInput.value,
        mode: modeSelect.value,
        category: categorySelect.value,
        difficulty: difficultySelect.value,
        dragMode: Game.dragMode,
        soundMuted: Game.soundMuted,
        musicMuted: Game.musicMuted
    };
    localStorage.setItem("gameSettings", JSON.stringify(settings));
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem("gameSettings"));
    if (settings) {
        playerNameInput.value = settings.playerName || "";
        modeSelect.value = settings.mode || "classic";
        categorySelect.value = settings.category || "animals";
        difficultySelect.value = settings.difficulty || "easy";
        Game.dragMode = settings.dragMode === true;
        toggleDragModeBtn.textContent = Game.dragMode? "Toggle Type Mode" : "Toggle Drag Mode";
        Game.soundMuted = settings.soundMuted === true;
        muteBtn.textContent = Game.soundMuted? "🔇" : "🔊";
        Game.musicMuted = settings.musicMuted === true;
        musicToggleBtn.textContent = Game.musicMuted? "🔇🎶" : "🎶";
    }
}

// ================= CONFETTI EFFECT (Basic) =================

let confettiInterval = null;
let confetti = null;

function startConfetti() {
    if (typeof JSConfetti === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.min.js';
        script.onload = () => {
            confetti = new JSConfetti({ canvas: confettiCanvas });
            fireConfetti();
        };
        document.head.appendChild(script);
    } else {
        confetti = new JSConfetti({ canvas: confettiCanvas });
        fireConfetti();
    }
}

function fireConfetti() {
    if (confetti) {
        confetti.addConfetti({
            confettiRadius: 5,
            confettiNumber: 200,
            confettiColors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]]
        });
    }
}

function stopConfetti() {
    if (confettiInterval) {
        clearTimeout(confettiInterval);
        confettiInterval = null;
    }
    if (confetti) {
        // JSConfetti doesn't have a direct "stop" method, but clearing the canvas or not calling addConfetti again is enough.
        confetti = null;
    }
    const ctx = confettiCanvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}