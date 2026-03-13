let calculator = {
    currentInput: '',
    currentOperation: '',
    previousInput: '',
    display: document.getElementById('display'),
    history: [],
    memory: 0,

    appendNumber: function(number) {
        if (this.currentInput.includes('.') && number === '.') return;
        if (!this.validateInput(number)) return;
        this.currentInput += number;
        this.updateDisplay();
    },

    appendOperation: function(operation) {
        if (this.currentInput === '') return;
        if (this.previousInput !== '') {
            this.calculate();
        }
        this.currentOperation = operation;
        this.previousInput = this.currentInput;
        this.currentInput = '';
        this.updateDisplay();
    },

    calculate: function() {
        if (this.previousInput === '' || this.currentInput === '') return;
        let result;
        let prev = parseFloat(this.previousInput);
        let current = parseFloat(this.currentInput);

        switch (this.currentOperation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.displayError('Cannot divide by zero');
                    return;
                }
                result = prev / current;
                break;
            case 'sin':
                result = Math.sin(current);
                break;
            case 'cos':
                result = Math.cos(current);
                break;
            case 'tan':
                result = Math.sin(current) / Math.cos(current);
                break;
            case 'exp':
                result = Math.exp(current);
                break;
            case 'log':
                if (current <= 0) {
                    this.displayError('Log is not defined for non-positive numbers');
                    return;
                }
                result = Math.log(current);
                break;
            case '^':
                result = Math.pow(prev, current);
                break;
            case 'sqrt':
                if (current < 0) {
                    this.displayError('Square root is not defined for negative numbers');
                    return;
                }
                result = Math.sqrt(current);
                break;
            default:
                return;
        }

        this.history.push(`${this.previousInput} ${this.currentOperation} ${this.currentInput} = ${result}`);
        this.updateHistory();
        this.currentInput = result.toString();
        this.currentOperation = '';
        this.previousInput = '';
        this.updateDisplay();
    },

    clearDisplay: function() {
        this.currentInput = '';
        this.previousInput = '';
        this.currentOperation = '';
        this.updateDisplay();
    },

    clearHistory: function() {
        this.history = [];
        this.updateHistory();
    },

    updateDisplay: function() {
        this.display.value = `${this.previousInput} ${this.currentOperation} ${this.currentInput}`;
    },

    updateHistory: function() {
        const historyDisplay = document.getElementById('history');
        historyDisplay.value = this.history.join('\n');
    },

    displayError: function(message) {
        this.display.value = message;
        setTimeout(() => {
            this.clearDisplay();
        }, 2000);
    },

    validateInput: function(input) {
        return !isNaN(input) || input === '.' || input === 'e' || input === 'E';
    },

    memoryAdd: function() {
        this.memory += parseFloat(this.currentInput);
    },

    memorySubtract: function() {
        this.memory -= parseFloat(this.currentInput);
    },

    memoryRecall: function() {
        this.currentInput = this.memory.toString();
        this.updateDisplay();
    },

    memoryClear: function() {
        this.memory = 0;
    }
};

document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        calculator.appendNumber(event.key);
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        calculator.appendOperation(event.key);
    } else if (event.key === 'Enter') {
        calculator.calculate();
    } else if (event.key === 'Escape') {
        calculator.clearDisplay();
    } else if (event.key === '.') {
        calculator.appendNumber(event.key);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        // Navigate through history
        const history = calculator.history;
        if (history.length === 0) return;
        let currentIndex = history.length - 1;
        if (event.key === 'ArrowUp') {
            currentIndex--;
            if (currentIndex < 0) currentIndex = 0;
        } else if (event.key === 'ArrowDown') {
            currentIndex++;
            if (currentIndex >= history.length) currentIndex = history.length - 1;
        }
        calculator.display.value = history[currentIndex];
    }
});

// Add event listeners for buttons
document.querySelectorAll('.btn-number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
    });
});

document.querySelectorAll('.btn-operator').forEach(button => {
    button.addEventListener('click', () => {
        const operation = button.textContent.trim();
        if (operation === '÷') {
            calculator.appendOperation('/');
        } else if (operation === '×') {
            calculator.appendOperation('*');
        } else if (operation === '+') {
            calculator.appendOperation('+');
        } else if (operation === '-') {
            calculator.appendOperation('-');
        } else if (operation === 'sin') {
            calculator.appendOperation('sin');
        } else if (operation === 'cos') {
            calculator.appendOperation('cos');
        } else if (operation === 'tan') {
            calculator.appendOperation('tan');
        } else if (operation === 'exp') {
            calculator.appendOperation('exp');
        } else if (operation === 'log') {
            calculator.appendOperation('log');
        } else if (operation === '^') {
            calculator.appendOperation('^');
        } else if (operation === '√') {
            calculator.appendOperation('sqrt');
        }
    });
});

document.querySelector('.btn-equal').addEventListener('click', () => {
    calculator.calculate();
});

document.querySelector('.btn-clear').addEventListener('click', () => {
    calculator.clearDisplay();
});

document.querySelector('.btn-memory-add').addEventListener('click', () => {
    calculator.memoryAdd();
});

document.querySelector('.btn-memory-subtract').addEventListener('click', () => {
    calculator.memorySubtract();
});

document.querySelector('.btn-memory-recall').addEventListener('click', () => {
    calculator.memoryRecall();
});

document.querySelector('.btn-memory-clear').addEventListener('click', () => {
    calculator.memoryClear();
});