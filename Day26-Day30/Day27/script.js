let categorySelect = document.getElementById('category');
let difficultySelect = document.getElementById('difficulty');
let gameModeSelect = document.getElementById('game-mode');
let startBtn = document.getElementById('start-btn');
let scrambledWordP = document.getElementById('scrambled-word');
let guessInput = document.getElementById('guess');
let checkBtn = document.getElementById('check-btn');
let hintBtn = document.getElementById('hint-btn');
let resultP = document.getElementById('result');
let definitionP = document.getElementById('definition');
let scoreP = document.getElementById('score');
let timerP = document.getElementById('timer');
let leaderboardP = document.getElementById('leaderboard');
let shareBtn = document.getElementById('share-btn');
let facebookBtn = document.querySelector('a[title="Share on Facebook"]');
let twitterBtn = document.querySelector('a[title="Share on Twitter"]');
let instagramBtn = document.querySelector('a[title="Share on Instagram"]');
let linkedinBtn = document.querySelector('a[title="Share on LinkedIn"]');

let wordList = {};

let originalWord = {};
let scrambledWord = '';
let score = 0;
let timer = null;
let timeLeft = 0;
let leaderboard = [];

startBtn.addEventListener('click', startGame);
checkBtn.addEventListener('click', checkGuess);
hintBtn.addEventListener('click', showHint);
shareBtn.addEventListener('click', shareScore);
facebookBtn.addEventListener('click', shareOnFacebook);
twitterBtn.addEventListener('click', shareOnTwitter);
instagramBtn.addEventListener('click', shareOnInstagram);
linkedinBtn.addEventListener('click', shareOnLinkedIn);

loadWordList();
loadLeaderboard();

async function loadWordList() {
    try {
        const responseCountries = await fetch('countries.json');
        const countries = await responseCountries.json();
        const responseAnimals = await fetch('animals.json');
        const animals = await responseAnimals.json();
        const responseFood = await fetch('food.json');
        const food = await responseFood.json();
        wordList = { countries, animals, food };
    } catch (error) {
        console.error('Error loading word list:', error);
    }
}

function loadLeaderboard() {
    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
        leaderboard = JSON.parse(storedLeaderboard);
        updateLeaderboardDisplay();
    }
}

function startGame() {
    if (Object.keys(wordList).length === 0) {
        resultP.innerText = 'Error loading word list. Please try again later.';
        return;
    }
    let category = categorySelect.value;
    let difficulty = difficultySelect.value;
    let gameMode = gameModeSelect.value;
    originalWord = getWord(category, difficulty);
    scrambledWord = scrambleWord(originalWord.word);
    scrambledWordP.innerText = scrambledWord;
    guessInput.value = '';
    resultP.innerText = '';
    definitionP.innerText = '';
    timeLeft = 30; // 30 seconds per word
    timerP.innerText = `Time: ${timeLeft} seconds`;
    timer = setInterval(() => {
        timeLeft--;
        timerP.innerText = `Time: ${timeLeft} seconds`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            resultP.innerText = `Time's up! The word was ${originalWord.word}`;
            definitionP.innerText = originalWord.definition;
            updateLeaderboard();
        }
    }, 1000);
}

function getWord(category, difficulty) {
    let words = wordList[category];
    let filteredWords = words.filter(word => word.difficulty === difficulty);
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

function scrambleWord(word) {
    let arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function checkGuess() {
    let guess = guessInput.value.trim().toLowerCase();
    if (guess === originalWord.word) {
        clearInterval(timer);
        score++;
        scoreP.innerText = `Score: ${score}`;
        resultP.innerText = 'Correct!';
        definitionP.innerText = originalWord.definition;
        updateLeaderboard();
    } else {
        resultP.innerText = 'Try again!';
    }
}

function showHint() {
    resultP.innerText = `Hint: The word starts with ${originalWord.word[0]}`;
    definitionP.innerText = originalWord.definition;
}

function updateLeaderboard() {
    leaderboard.push({ score, time: moment().format('YYYY-MM-DD HH:mm:ss') });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10); // keep only top 10 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
    leaderboardP.innerText = 'Leaderboard:';
    leaderboard.forEach((entry, index) => {
        leaderboardP.innerText += `\n${index + 1}. Score: ${entry.score}, Time: ${entry.time}`;
    });
}

function shareScore() {
    let text = `I scored ${score} points in the Anagram Game!`;
    navigator.clipboard.writeText(text);
    alert('Score copied to clipboard!');
}

function shareOnFacebook() {
    let url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=I scored ${score} points in the Anagram Game!`;
    window.open(url, '_blank');
}

function shareOnTwitter() {
    let url = `https://twitter.com/intent/tweet?url=${window.location.href}&text=I scored ${score} points in the Anagram Game!`;
    window.open(url, '_blank');
}

function shareOnInstagram() {
    // Instagram doesn't have a direct share API, so we'll just open the Instagram homepage
    window.open('https://www.instagram.com/', '_blank');
}

function shareOnLinkedIn() {
    let url = `https://www.linkedin.com/sharing/share?url=${window.location.href}&title=I scored ${score} points in the Anagram Game!`;
    window.open(url, '_blank');
}