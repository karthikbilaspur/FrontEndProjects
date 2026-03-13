const chatBtn = document.getElementById('chat-btn');
const chatContainer = document.getElementById('chat-container');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.createElement('div');
typingIndicator.className = 'typing-indicator';
typingIndicator.innerHTML = 'Typing<span>.</span><span>.</span><span>.</span>';

chatBtn.addEventListener('click', () => {
    chatContainer.style.display = 'block';
});

closeChatBtn.addEventListener('click', () => {
    chatContainer.style.display = 'none';
});

sendBtn.addEventListener('click', () => {
    const message = chatInput.value;
    if (message !== '') {
        chatLog.innerHTML += `<p>You: ${message}</p>`;
        chatInput.value = '';
        chatLog.appendChild(typingIndicator);
        typingIndicator.style.display = 'block';

        // Send message to ChatGPT-3 API
        fetch('https://api.openai.com/v1/engines/davinci-003/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({
                'prompt': message,
                'max_tokens': 2048,
                'temperature': 0.5
            })
        })
        .then(response => response.json())
        .then(data => {
            const response = data.choices[0].text;
            chatLog.innerHTML += `<p>ChatGPT-3: ${response}</p>`;
            typingIndicator.style.display = 'none';
        })
        .catch(error => console.error(error));
    }
});