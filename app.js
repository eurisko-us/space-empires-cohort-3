const { generatePrimeSync } = require('crypto');
const { TIMEOUT } = require('dns');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var rls = require('readline-sync');
const Game = require('./game');
const manualBoat = require('./stratClass').manualBoat;
const dumbBoat = require('./stratClass').dumbBoat;
const randomBoat = require('./stratClass').randomBoat;

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

let clientSockets = {};

io.on('connection', (socket) => {
    let socketId = socket.id;
    clientSockets[socketId] = socket;

    console.log('Client socket connected:' + socket.id);

    if (Object.keys(clientSockets).length == 1) {
        game.start();
    }
/*     game.broadcastMessage('gameState', {
        gameState: game.state
    }); */

    socket.on('disconnect', () => {
        console.log('Client socket disconnected: ' + socketId);
        delete clientSockets[socketId];
    });
});

http.listen(3003, () => {
    console.log('Listening on *:3003');
});

// while (Object.keys(clientSockets).length == 0) {
//     return
// }

const game = new Game(clientSockets, manualBoat, randomBoat);
// if (Object.keys(clientSockets).length == 0) {
// setTimeout(() => {
//     console.log("didn't connect")
// }, 200);
// }
// else {
//     game.start();
// }
