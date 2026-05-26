
const http = require('http');
const fs = require('fs');
const path = require('path');

const messagesStorage = [{ login: 'GGG', content: 'Hello' }];

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
    const guestNickname = 'Guest' + Math.floor(Math.random() * 1000);
    console.log(`${guestNickname} connected. id - ${socket.id}`);

    socket.emit('all_messagess', messagesStorage);

    socket.on('new_message', async (message) => {
        const newMessageObj = { login: guestNickname, content: message };
        messagesStorage.push(newMessageObj);

        io.emit('message', newMessageObj.login + ':' + newMessageObj.content);
    });

});
server.listen(3000, () => {
    console.log('Server running on port 3000');
});  