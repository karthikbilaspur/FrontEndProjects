// Constants
const QUIZ_TYPES = ['frontend', 'backend', 'both'];
const QUESTION_DIFFICULTY = ['easy', 'medium', 'hard'];
const SELECTION_CONTAINER = document.getElementById('selection-container');
const QUIZ_CONTAINER = document.getElementById('quiz-container');
const SCORE_CONTAINER = document.getElementById('score-container');
const QUESTION_ELEMENT = document.getElementById('question');
const OPTIONS_ELEMENT = document.getElementById('options');
const RESULT_ELEMENT = document.getElementById('result');
const PAGE_INFO_ELEMENT = document.getElementById('page-info');
const PREV_BTN = document.getElementById('prev-btn');
const NEXT_BTN = document.getElementById('next-btn');
const SCORE_ELEMENT = document.getElementById('score');
const RESTART_BTN = document.getElementById('restart-btn');

// Variables
let questions = [];
let currentQuestion = 0;
let score = 0;
let quizType = '';

// Load score and current question from local storage
if (localStorage.getItem('score')) {
    score = parseInt(localStorage.getItem('score'));
    currentQuestion = parseInt(localStorage.getItem('currentQuestion'));
}

// Event listeners for quiz type buttons
QUIZ_TYPES.forEach((type) => {
    document.getElementById(`${type}-btn`).addEventListener('click', () => {
        quizType = type;
        if (type === 'both') {
            loadQuestions(['frontend.json', 'backend.json']);
        } else {
            loadQuestions([`${type}.json`]);
        }
    });
});

// Load questions from JSON file
function loadQuestions(files) {
    Promise.all(files.map(file => fetch(file).then(response => response.json())))
        .then(data => {
            questions = data.flatMap(file => file.questions).sort((a, b) => {
                if (a.difficulty === 'easy' && b.difficulty === 'medium') return -1;
                if (a.difficulty === 'easy' && b.difficulty === 'hard') return -1;
                if (a.difficulty === 'medium' && b.difficulty === 'hard') return -1;
                return 1;
            });
            SELECTION_CONTAINER.style.display = 'none';
            QUIZ_CONTAINER.style.display = 'block';
            loadQuestion();
        })
        .catch((error) => console.error('Error loading questions:', error));
}

// Load current question
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        // Quiz finished, show score
        QUIZ_CONTAINER.style.display = 'none';
        SCORE_CONTAINER.style.display = 'block';
        SCORE_ELEMENT.innerText = `Your score: ${score} / ${questions.length}`;
        return;
    }

    const question = questions[currentQuestion];
    QUESTION_ELEMENT.innerText = question.question;
    OPTIONS_ELEMENT.innerHTML = '';
    question.options.forEach((option, index) => {
        const li = document.createElement('li');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'option';
        radio.value = option;
        radio.id = `option-${index}`;
        const label = document.createElement('label');
        label.htmlFor = `option-${index}`;
        label.innerText = option;
        li.appendChild(radio);
        li.appendChild(label);
        OPTIONS_ELEMENT.appendChild(li);
    });
    RESULT_ELEMENT.innerText = '';
    PAGE_INFO_ELEMENT.innerText = `Page ${currentQuestion + 1} of ${questions.length}`;
    updateButtons();
}

// Update next and previous buttons
function updateButtons() {
    if (currentQuestion > 0) {
        PREV_BTN.style.display = 'block';
    } else {
        PREV_BTN.style.display = 'none';
    }
    if (currentQuestion < questions.length - 1) {
        NEXT_BTN.style.display = 'block';
    } else {
        NEXT_BTN.style.display = 'none';
    }
}

// Event listener for next button
NEXT_BTN.addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const question = questions[currentQuestion];
        if (selectedOption.value === question.answer) {
            score++;
            RESULT_ELEMENT.innerText = 'Correct!';
        } else {
            RESULT_ELEMENT.innerText = `Incorrect! The correct answer is ${question.answer}`;
        }
        localStorage.setItem('score', score);
        localStorage.setItem('currentQuestion', currentQuestion + 1);
        currentQuestion++;
        loadQuestion();
    } else {
        RESULT_ELEMENT.innerText = 'Please select an option';
    }
});

// Event listener for previous button
PREV_BTN.addEventListener('click', () => {
    currentQuestion--;
    loadQuestion();
});

// Event listener for restart button
RESTART_BTN.addEventListener('click', () => {
    score = 0;
    currentQuestion = 0;
    localStorage.setItem('score', score);
    localStorage.setItem('currentQuestion', currentQuestion);
    SCORE_CONTAINER.style.display = 'none';
    SELECTION_CONTAINER.style.display = 'block';
});