class Quiz {
    constructor() {
        this.questions = [];
        this.filteredQuestions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = 60;
        this.hintUsed = false;
        this.answeredQuestions = [];
        this.unansweredQuestions = [];
        this.attemptedQuestions = [];
        this.questionsPerPage = 1;
        this.currentPage = 1;

        this.loadQuestions();

        document.querySelector('.next-btn').onclick = () => this.nextQuestion();
        document.querySelector('.skip-btn').onclick = () => this.skipQuestion();
        document.querySelector('.hint-btn').onclick = () => this.showHint();
        document.getElementById('category-select').onchange = () => this.filterQuestions();
        document.querySelector('.start-btn').onclick = () => this.startQuiz();
        document.querySelector('.prev-btn').onclick = () => this.prevPage();
        document.querySelector('.next-btn').onclick = () => this.nextPage();
    }

    loadQuestions() {
        const files = ['easy.json', 'difficult.json', 'hard.json', 'mcq.json', 'fill-ups.json'];
        let loadedFiles = 0;

        files.forEach(file => {
            fetch(file)
                .then(response => response.json())
                .then(data => {
                    this.questions = this.questions.concat(data.map(question => ({...question, category: file.replace('.json', '')})));
                    loadedFiles++;

                    if (loadedFiles === files.length) {
                        this.filteredQuestions = [...this.questions];
                    }
                })
                .catch(error => console.error(error));
        });
    }

    startQuiz() {
        document.querySelector('.rules-container').style.display = 'none';
        document.querySelector('.quiz-container').style.display = 'block';
        this.displayQuestion();
        this.startTimer();
    }

    displayQuestion() {
        const questionContainer = document.querySelector('.question-container');
        const optionsContainer = document.querySelector('.options-container');
        const fillUpContainer = document.querySelector('.fill-up-container');
        const resultContainer = document.querySelector('.result-container');
        const hintContainer = document.querySelector('.hint-container');
        const scoreContainer = document.querySelector('.score-container');

        const startIndex = (this.currentPage - 1) * this.questionsPerPage;
        const endIndex = startIndex + this.questionsPerPage;
        const currentQuestions = this.filteredQuestions.slice(startIndex, endIndex);

        questionContainer.innerText = currentQuestions[0].question;

        if (currentQuestions[0].options) {
            // MCQ question
            optionsContainer.style.display = 'block';
            fillUpContainer.style.display = 'none';
            optionsContainer.innerHTML = '';

            currentQuestions[0].options.forEach((option, index) => {
                const button = document.createElement('button');
                button.innerText = option;
                button.onclick = () => this.checkAnswer(index);
                optionsContainer.appendChild(button);
            });
        } else if (currentQuestions[0].answer) {
            // Fill-up question
            optionsContainer.style.display = 'none';
            fillUpContainer.style.display = 'block';
            document.getElementById('fill-up-submit').onclick = () => this.checkFillUpAnswer();
        } else {
            // Simple question
            optionsContainer.style.display = 'none';
            fillUpContainer.style.display = 'block';
            document.getElementById('fill-up-submit').onclick = () => this.checkSimpleAnswer();
        }

        hintContainer.style.display = 'none';
        hintContainer.innerText = '';
        this.hintUsed = false;

        scoreContainer.innerText = `Score: ${this.score}`;
        resultContainer.innerText = '';
        this.updateQuestionStatus();
        this.updatePagination();
    }

    checkAnswer(index) {
        if (index === this.filteredQuestions[this.currentQuestion].correct) {
            this.score += this.filteredQuestions[this.currentQuestion].marks;
            if (this.hintUsed) {
                this.score -= 1;
            }
            document.querySelector('.result-container').innerText = 'Correct!';
        } else {
            document.querySelector('.result-container').innerText = 'Incorrect!';
        }

        this.answeredQuestions.push(this.currentQuestion);
        this.nextQuestion();
    }

    checkFillUpAnswer() {
        const answer = document.getElementById('fill-up-input').value;
        if (answer.toLowerCase() === this.filteredQuestions[this.currentQuestion].answer.toLowerCase()) {
            this.score += this.filteredQuestions[this.currentQuestion].marks;
            if (this.hintUsed) {
                this.score -= 1;
            }
            document.querySelector('.result-container').innerText = 'Correct!';
        } else {
            document.querySelector('.result-container').innerText = 'Incorrect!';
        }

        this.answeredQuestions.push(this.currentQuestion);
        this.nextQuestion();
    }

    checkSimpleAnswer() {
        const answer = document.getElementById('fill-up-input').value;
        const correctAnswer = eval(this.filteredQuestions[this.currentQuestion].question);
        if (parseFloat(answer) === correctAnswer) {
            this.score += this.filteredQuestions[this.currentQuestion].marks;
            if (this.hintUsed) {
                this.score -= 1;
            }
            document.querySelector('.result-container').innerText = 'Correct!';
        } else {
            document.querySelector('.result-container').innerText = 'Incorrect!';
        }

        this.answeredQuestions.push(this.currentQuestion);
        this.nextQuestion();
    }

    nextQuestion() {
        this.currentQuestion++;
        document.getElementById('fill-up-input').value = '';

        if (this.currentQuestion >= this.filteredQuestions.length) {
            document.querySelector('.quiz-container').innerHTML = `
                <h2>Quiz Finished!</h2>
                <p>Your final score is ${this.score}</p>
            `;
            return;
        }

        this.displayQuestion();
        this.timer = 60;
        document.getElementById('timer').innerText = this.timer;
    }

    skipQuestion() {
        this.currentQuestion++;
        document.getElementById('fill-up-input').value = '';

        if (this.currentQuestion >= this.filteredQuestions.length) {
            document.querySelector('.quiz-container').innerHTML = `
                <h2>Quiz Finished!</h2>
                <p>Your final score is ${this.score}</p>
            `;
            return;
        }

        this.displayQuestion();
        this.timer = 60;
        document.getElementById('timer').innerText = this.timer;
    }

    showHint() {
        const hintContainer = document.querySelector('.hint-container');
        hintContainer.style.display = 'block';
        hintContainer.innerText = 'Hint: Think carefully!';
        this.hintUsed = true;
    }

    startTimer() {
        setInterval(() => {
            if (this.timer > 0) {
                this.timer--;
                document.getElementById('timer').innerText = this.timer;
            } else {
                this.nextQuestion();
            }
        }, 1000);
    }

    filterQuestions() {
        const category = document.getElementById('category-select').value;
        if (category === 'all') {
            this.filteredQuestions = [...this.questions];
        } else {
            this.filteredQuestions = this.questions.filter(q => q.category === category);
        }
        this.currentQuestion = 0;
        this.displayQuestion();
        this.timer = 60;
        document.getElementById('timer').innerText = this.timer;
    }

    updateQuestionStatus() {
        this.answeredQuestions = this.filteredQuestions.filter((q, index) => this.answeredQuestions.includes(index));
        this.unansweredQuestions = this.filteredQuestions.filter((q, index) => !this.answeredQuestions.includes(index) && !this.attemptedQuestions.includes(index));
        this.attemptedQuestions = this.filteredQuestions.filter((q, index) => this.attemptedQuestions.includes(index));

        document.getElementById('answered-count').innerText = this.answeredQuestions.length;
        document.getElementById('unanswered-count').innerText = this.unansweredQuestions.length;
        document.getElementById('attempted-count').innerText = this.attemptedQuestions.length;
    }

    updatePagination() {
        const questionNumbers = document.getElementById('question-numbers');
        questionNumbers.innerHTML = '';

        for (let i = 1; i <= Math.ceil(this.filteredQuestions.length / this.questionsPerPage); i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.onclick = () => this.goToPage(i);
            questionNumbers.appendChild(button);
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.displayQuestion();
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayQuestion();
        }
    }

    nextPage() {
        if (this.currentPage < Math.ceil(this.filteredQuestions.length / this.questionsPerPage)) {
            this.currentPage++;
            this.displayQuestion();
        }
    }
}

const quiz = new Quiz();