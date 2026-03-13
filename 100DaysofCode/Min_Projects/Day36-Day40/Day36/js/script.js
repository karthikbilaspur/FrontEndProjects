// Constants
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const selectors = {
    loginModal: '#loginModal',
    signupModal: '#signupModal',
    answerModal: '#answerModal',
    loginForm: '#loginForm',
    signupForm: '#signupForm',
    answerForm: '#answerForm',
    voteButtons: '.vote-buttons button',
    logoutLink: '.nav-item.logout a'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Get elements
const elements = {
    loginModal: document.querySelector(selectors.loginModal),
    signupModal: document.querySelector(selectors.signupModal),
    answerModal: document.querySelector(selectors.answerModal),
    loginForm: document.querySelector(selectors.loginForm),
    signupForm: document.querySelector(selectors.signupForm),
    answerForm: document.querySelector(selectors.answerForm),
    voteButtons: document.querySelectorAll(selectors.voteButtons),
    logoutLink: document.querySelector(selectors.logoutLink)
};

// Load JSON files
const spaceQuestions = fetch('space.json')
  .then(response => response.json())
  .then(data => data.questions);

const quoraQuestions = fetch('quora.json')
  .then(response => response.json())
  .then(data => data.questions);

const environmentQuestions = fetch('environment.json')
  .then(response => response.json())
  .then(data => data.questions);

// Display questions
spaceQuestions.then(questions => {
    questions.forEach(question => {
        const questionHtml = `
            <div class="question" data-question-id="${question.id}">
                <h2>${question.question}</h2>
                <div class="answers">
                    ${question.answers.map(answer => `
                        <div class="answer">
                            <p>${answer.answer}</p>
                            <button class="vote-button" data-answer-id="${answer.id}">Upvote (${answer.votes})</button>
                        </div>
                    `).join('')}
                </div>
                <button class="answer-button" data-question-id="${question.id}">Answer</button>
            </div>
        `;
        document.getElementById('questions').innerHTML += questionHtml;
    });
});

// Add event listeners
elements.loginForm.addEventListener('submit', handleLogin);
elements.signupForm.addEventListener('submit', handleSignup);
elements.answerForm.addEventListener('submit', handleAnswer);
elements.logoutLink.addEventListener('click', handleLogout);

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = elements.loginForm.querySelector('#email').value;
    const password = elements.loginForm.querySelector('#password').value;

    // Validate input
    if (!email || !password) {
        displayError(elements.loginModal, 'Please enter email and password');
        return;
    }

    // Show loading state
    elements.loginForm.querySelector('button[type="submit"]').disabled = true;
    elements.loginForm.querySelector('button[type="submit"]').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';

    auth.signInWithEmailAndPassword(email, password)
        .then(user => {
            console.log('Login successful:', user);
            elements.loginModal.querySelector('button.close').click();
        })
        .catch(error => {
            console.error('Login error:', error);
            displayError(elements.loginModal, error.message);
        })
        .finally(() => {
            elements.loginForm.querySelector('button[type="submit"]').disabled = false;
            elements.loginForm.querySelector('button[type="submit"]').innerHTML = 'Login';
        });
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    const name = elements.signupForm.querySelector('#name').value;
    const email = elements.signupForm.querySelector('#email').value;
    const password = elements.signupForm.querySelector('#password').value;

    // Validate input
    if (!name || !email || !password) {
        displayError(elements.signupModal, 'Please enter name, email, and password');
        return;
    }

    // Show loading state
    elements.signupForm.querySelector('button[type="submit"]').disabled = true;
    elements.signupForm.querySelector('button[type="submit"]').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing up...';

    auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
            console.log('Signup successful:', user);
            db.collection('users').doc(user.user.uid).set({
                name: name,
                email: email
            });
            elements.signupModal.querySelector('button.close').click();
        })
        .catch(error => {
            console.error('Signup error:', error);
            displayError(elements.signupModal, error.message);
        })
        .finally(() => {
            elements.signupForm.querySelector('button[type="submit"]').disabled = false;
            elements.signupForm.querySelector('button[type="submit"]').innerHTML = 'Signup';
        });
}

// Handle answer
function handleAnswer(e) {
    e.preventDefault();
    const answer = elements.answerForm.querySelector('#answer').value;
    const questionId = elements.answerForm.querySelector('#question-id').value;
    const user = auth.currentUser;

    // Validate input
    if (!answer) {
        displayError(elements.answerModal, 'Please enter an answer');
        return;
    }

    // Show loading state
    elements.answerForm.querySelector('button[type="submit"]').disabled = true;
    elements.answerForm.querySelector('button[type="submit"]').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';

    spaceQuestions.then(questions => {
        const question = questions.find(q => q.id === parseInt(questionId));
        if (question) {
            question.answers.push({
                id: question.answers.length + 1,
                answer: answer,
                votes: 0
            });
            updateQuestionUI(question);
        }
    });

    elements.answerModal.querySelector('button.close').click();
}

// Handle logout
function handleLogout() {
    auth.signOut()
        .then(() => {
            console.log('User logged out');
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
}

// Handle vote
document.addEventListener('click', handleVote);

function handleVote(e) {
    if (e.target.classList.contains('vote-button')) {
        const button = e.target;
        const answerId = button.dataset.answerId;
        const questionId = button.parentNode.parentNode.dataset.questionId;

        spaceQuestions.then(questions => {
            const question = questions.find(q => q.id === parseInt(questionId));
            if (question) {
                const answer = question.answers.find(a => a.id === parseInt(answerId));
                if (answer) {
                    answer.votes++;
                    button.textContent = `Upvote (${answer.votes})`;
                }
            }
        });
    }
}

// Display error
function displayError(modal, message) {
    const errorElement = modal.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message', 'text-danger', 'mt-2');
        errorElement.textContent = message;
        modal.querySelector('form').appendChild(errorElement);
    }
}

// Check login status
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User logged in:', user);
        // Update UI
        document.querySelector('.nav-item.login').style.display = 'none';
        document.querySelector('.nav-item.signup').style.display = 'none';
        document.querySelector('.nav-item.logout').style.display = 'block';
    } else {
        console.log('User not logged in');
        // Update UI
        document.querySelector('.nav-item.login').style.display = 'block';
        document.querySelector('.nav-item.signup').style.display = 'block';
        document.querySelector('.nav-item.logout').style.display = 'none';
    }
});

// Update the UI with the new question
function updateQuestionUI(question) {
    const questionHtml = `
        <div class="question" data-question-id="${question.id}">
            <h2>${question.question}</h2>
            <div class="answers">
                ${question.answers.map(answer => `
                    <div class="answer">
                        <p>${answer.answer}</p>
                        <button class="vote-button" data-answer-id="${answer.id}">Upvote (${answer.votes})</button>
                    </div>
                `).join('')}
            </div>
            <button class="answer-button" data-question-id="${question.id}">Answer</button>
        </div>
    `;
    document.getElementById('questions').innerHTML += questionHtml;
}