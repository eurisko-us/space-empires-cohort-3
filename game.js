const Colony = require('./colonyClass');
const Ship = require('./shipClass');


class Game {
    constructor(clientSockets, Player1, Player2) {
        this.clientSockets = clientSockets;

        this.players = [new Player1(1), new Player2(2)];

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

            this.refreshBoard();

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
        };

        board.spaces = new Array(board.numRows);
        for(let i = 0; i < board.numRows; i++) {
            board.spaces[i] = new Array(board.numCols);
        }

        for(let i = 0; i < board.numRows; i++) {
            for(let j = 0; j < board.numCols; j++) {   
                board.spaces[i][j] = [];
                if (i === 0 && j === 3) {
                    p1Colony = new Colony(1, entityId = 1);
                    board.spaces[i][j].push(p1Colony);
                    p1Ship = new Ship(1, entityId = 3);
                    board.spaces[i][j].push(p1Ship);
                }
                else if(i === 6 && j === 3) {
                    p2Colony = new Colony(2, entityId = 2);
                    board.spaces[i][j].push(p2Colony);
                    p2Ship = new Ship(2, entityId = 2)
                    board.spaces[i][j].push(p2Ship);
                }
            }
        }

        let gameState = {
            board,
            playerToMove: 1,
            allEntities: {1: p1Colony,
                          2: p2Colony,
                          3: p1Ship,
                          4: p2Ship}
        };

        return gameState;
    }

    makeMove() {

        let move = this.players[this.state.playerToMove - 1].chooseMove(this.state.board);

        this.moveShips(move);

        this.state.playerToMove = [2, 1][this.state.playerToMove - 1];

        console.log(this.state);
        console.table(this.state["board"]["spaces"])
        //DEBUGGING
        console.log(this.state["board"]["spaces"].length)
        for(let j = 0;  j < this.state["board"]["spaces"].length;j++){
            console.log(this.state["board"]["spaces"][j])
        }

        
    }

    moveShips(moves) {
        let shipIds = Object.keys(moves);
        //for(let i = 0; i < ships.length; i++){
        for (let i = 0; i < moves.length; i++) {
            let ship = this.state.allEntities[shipIds[i]];
            let move = moves[shipIds[i]];
            let pos = ship.position;

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
    }
}

module.exports = Game;