document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const messages = document.getElementById('messages');
    const fort = document.getElementById('fort');
    const input = document.getElementById('input'); 
    const db = require('./database');
    const path = require('path');
socket.on ('all_messages', function (msgArray) {
    messages.innerHTML = '';
    msgArray.forEach(msg => {
        let item = document.createElement('li');
        let autor = msg.author || 'unknown';
        item.textContent = autor + ':' + msg.message;
        messages.appendChild(item);
    });
    window.scrollTo(0, document.body.scrollHeight);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('new_message', input.value );
        input.value = '';
    }
});

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        userInput.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            addMessage(data.response, 'bot');
        } catch (error) {
            addMessage('Error: Could not connect to server', 'bot');
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
