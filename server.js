
const http = require('http');
const fs = require('fs');
const path = require('path');

const messagesStorage = [{ id: 1, text: 'Hello, world!' }];
const pathToIndex = path.join(__dirname, 'static', 'index.html');
const pathToCss = path.join(__dirname, 'static', 'style.css');
const pathToJs = path.join(__dirname, 'static', 'script.js');

const indexHtmlFile = fs.readFileSync(pathToIndex, 'utf-8');
const cssFile = fs.readFileSync(pathToCss, 'utf-8');
const jsFile = fs.readFileSync(pathToJs, 'utf-8');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(indexHtmlFile);
    } else if (req.url === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        return res.end(cssFile);
    } else if (req.url === '/script.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        return res.end(jsFile);
    } else if (req.url === '/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const message = JSON.parse(body).message;
            const response = `Bot: ${message}`;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response }));
        });
    } else {
        res.statusCode = 404;
        return res.end('error 404');
    }
});

const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', async (socket) => {
    const guestNickname = 'Guest' + Math.floor(Math.random() * 1000);
    console.log(`${guestNickname} connected. id - ${socket.id}`);

    socket.emit('all_messagess', Mass   );
});
    try {
        const messages = await db.getAllMessages();
        socket.emit('all_messages', messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
    socket.on('new_message', async (message) => {
        try {
            await db.addMessage(message,null);
       io.emit('message', guestNickname + ': ' + message);
        } catch (error) {
            console.error('Error adding message:', error);
        }         
    });
server.listen(3000, () => {
    console.log('Server running on port 3000');
});  