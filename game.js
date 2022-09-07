const Colony = require('./colony_class');

class Game {
    constructor(clientSockets, Player1, Player2) {
        this.clientSockets = clientSockets;

        this.players = [Player1(1), Player2(2)];

        this.numRows = 7;
        this.numCols = 7;
        this.state = this.generateInitialGameState();

        for (let socketId in this.clientSockets) {
            let socket = this.clientSockets[socketId];

            socket.emit('gameState', {
                gameState: this.state
            });
        }
    }

    start() {
        setInterval(() => {
            
            this.makeMove();

            for(let socketId in this.clientSockets) {
                let socket = this.clientSockets[socketId];

                socket.emit('gameState', { 
                    gameState: this.state
                });
            }
        }, 500);
    }

    generateInitialGameState() {
        let board = {
            numRows: 7,
            numCols: 7,
            spaces: [],
            playerToMove: 1
        };

        board.spaces = new Array(board.numRows);
        for(let i = 0; i < board.numRows; i++) {
            board.spaces[i] = new Array(board.numCols);
        }

        for(let i = 0; i < board.numRows; i++) {
            for(let j = 0; j < board.numCols; j++) {   
                board.spaces[i][j] = [];
                if (i === 0 && j === 3) {
                    board.spaces[i][j].push(Colony(1));
                }
                else if(i === 6 && j === 3) {
                    board.spaces[i][j].push(Colony(2));
                }
            }
        }    

        let gameState = {
            board
        };

        return gameState;
    }

    makeMove(moves) {
        ships = Object.keys(moves);
        for (i = 0; i < len(ships); i++) {
            ship = ships[i];
            move = moves[ship];
            pos = ship.position();
            if (move === "left") {
                if (pos[0] != 0) {
                    pos[0] -= 1;
                } else {
                    console.log("You can't move left!");
                }
            } else if (move === "right") {
                if (pos[0] != 6) {
                    pos[0] += 1;
                } else {
                    console.log("You can't move right!");
                }
            } else if (move === "up") {
                if (pos[1] != 0) {
                    pos[1] -= 1;
                } else {
                    console.log("You can't move up!");
                }
            } else if (move === "down") {
                if (pos[0] != 6) {
                    pos[0] += 1;
                } else {
                    console.log("You can't move down!");
                }
            }
            ship.position = pos;
        }

        let move = this.players[playerToMove - 1].choose_move();

        this.state.playerToMove = [2, 1][this.state.playerToMove - 1];
        
    }

}

module.exports = Game;