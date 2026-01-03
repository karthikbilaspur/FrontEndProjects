// Get the elements
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const personalitySelect = document.getElementById('personality-select');

// Define the chatbot responses
const responses = {
    friendly: {
        'hello': ['Hi! How can I help you?', 'Hello! It\'s great to talk to you!'],
        'how are you': ['I\'m doing great, thanks for asking!', 'I\'m good, thanks!'],
        'default': ['Sorry, I didn\'t understand that.', 'I\'m not sure what you mean.']
    },
    sarcastic: {
        'hello': ['Oh great, another person who thinks they can talk to me.', 'Wow, you\'re actually talking to me.'],
        'how are you': ['I\'m living the dream.', 'I\'m just peachy.'],
        'default': ['Wow, you\'re so original.', 'I\'m not sure what you mean, but I\'m sure it\'s not interesting.']
    },
    professional: {
        'hello': ['Hello, welcome to our chatbot. How can I assist you today?', 'Good day, I\'m here to help you with any questions you may have.'],
        'how are you': ['I\'m functioning within normal parameters, thank you for asking.', 'I\'m operating efficiently, thank you.'],
        'default': ['I apologize, but I didn\'t understand your request. Please try again.', 'I\'m not sure what you mean, but I\'ll do my best to help you.']
    }
};

// Function to add a message to the chat log
function addMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(type);
    const timestamp = new Date().toLocaleTimeString();
    messageElement.innerHTML = `<span>${timestamp}</span> ${message}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Function to handle user input
function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage !== '') {
        addMessage(userMessage, 'user-message');
        const personality = personalitySelect.value;
        const response = responses[personality][userMessage.toLowerCase()] || responses[personality]['default'];
        const botResponse = response[Math.floor(Math.random() * response.length)];
        addMessage(botResponse, 'bot-message');
        userInput.value = '';
    }
}

// Add event listener to the send button
sendButton.addEventListener('click', handleUserInput);

// Add event listener to the user input field
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});