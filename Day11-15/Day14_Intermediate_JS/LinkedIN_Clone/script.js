// Get the elements
const usernameElement = document.getElementById('username');
const headlineElement = document.getElementById('headline');
const newsFeedContainer = document.querySelector('.news-feed-container');
const connectionsContainer = document.querySelector('.connections-container');
const messagesContainer = document.querySelector('.messages-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Sample data
const userData = {
    name: 'John Doe',
    headline: 'Software Engineer at ABC Corporation',
    newsFeed: [
        { id: 1, text: 'Just finished a project!' },
        { id: 2, text: 'Looking for a new job opportunity.' }
    ],
    connections: [
        { id: 1, name: 'Jane Doe' },
        { id: 2, name: 'Bob Smith' }
    ],
    messages: [
        { id: 1, text: 'Hello, how are you?' },
        { id: 2, text: 'I\'m good, thanks!' }
    ]
};

// Function to render the user profile
function renderProfile() {
    usernameElement.textContent = userData.name;
    headlineElement.textContent = userData.headline;
}

// Function to render the news feed
function renderNewsFeed() {
    newsFeedContainer.innerHTML = '';
    userData.newsFeed.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.textContent = post.text;
        newsFeedContainer.appendChild(postElement);
    });
}

// Function to render the connections
function renderConnections() {
    connectionsContainer.innerHTML = '';
    userData.connections.forEach((connection) => {
        const connectionElement = document.createElement('div');
        connectionElement.textContent = connection.name;
        connectionsContainer.appendChild(connectionElement);
    });
}

// Function to render the messages
function renderMessages() {
    messagesContainer.innerHTML = '';
    userData.messages.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = message.text;
        messagesContainer.appendChild(messageElement);
    });
}

// Function to handle sending a message
function handleSendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText !== '') {
        const newMessage = { id: userData.messages.length + 1, text: messageText };
        userData.messages.push(newMessage);
        renderMessages();
        messageInput.value = '';
    }
}

// Render the user profile, news feed, connections, and messages
renderProfile();
renderNewsFeed();
renderConnections();
renderMessages();

// Add event listener to the send button
sendButton.addEventListener('click', handleSendMessage);

// Add event listener to the message input field
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});