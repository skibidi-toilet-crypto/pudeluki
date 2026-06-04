
const http = require('http');
const fs = require('fs');
const path = require('path');

//const messagesStorage = [{ login: 'GGG', content: 'Hello' }];

const pathToIndex = path.join(__dirname, 'static', 'index.html');
const pathToCss = path.join(__dirname, 'static', 'style.css');
const pathToJs = path.join(__dirname, 'static', 'script.js');

const indexHtmlFile = fs.readFileSync(pathToIndex, 'utf-8');
const cssFile = fs.readFileSync(pathToCss, 'utf-8');
const jsFile = fs.readFileSync(pathToJs, 'utf-8');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        switch (req.url) {
            case '/': return res.end(indexHtmlFile);
            case '/style.css': return res.end(cssFile);
            case '/script.js': return res.end(jsFile);
            default:
                res.writeHead(404);
                return res.end('Not found');
        }
    }
});

const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', async (socket) => {
    const currentNickname = 'Guest' + Math.floor(Math.random() * 1000);
    const guestPassword = 'password' + Math.floor(Math.random() * 1000);

    let currentUser = null;

    console.log('A user connected: ' + currentNickname);

    try {
        await db.addUser({
            login: currentNickname,
            password: guestPassword
        })
        console.log(`BD user ${currentNickname} made`);

        const token = await db.getAuthToken({
            login: currentNickname,
            password: guestPassword
        });
        if (token) {
            currentUserId = parseInt(token.split('-')[0]);
            console.log(`BD ID from base: ${currentUserId}`);
        }

    } catch (error) {
        console.error('Error BD creation or token retrieval:', error);
        currentUserId = null;
    }
    try {
        const messages = await db.getMessages();
        socket.emit('all_messages', messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
    socket.on('new_message', async (message) => {
        if (!currentUserId) {
            console.error('User not authenticated, cannot send message');
            return;
        }
        try {
            await db.addMessage({ message, currentUserId });
            console.log(`BD sawed masseges ID ${currentUserId} (${currentNickname})`)

            io.emit('message', currentNickName + ': ' + message);
        } catch (e) {
            console.error('Error saving message:', e);
        }
    })
})

server.listen(3000, () => {
    console.log('Server running on port 3000');
});  