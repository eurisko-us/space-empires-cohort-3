class Game {
    constructor(clientSockets, players) {
        this.clientSockets = clientSockets;

        this.players = players;

        this.numRows = 7;
        this.numCols = 7;
        this.state = this.generateInitialGameState();
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
                if ((i === 0 || i === 6) && j === 3) {
                    board.spaces[i][j].push(); // colony class goes in here
                }
            }
        }    

        let gameState = {
            board
        };

        return gameState;
    }

    makeMove() {

        let move = this.players[playerToMove - 1].choose_move();

        this.state.playerToMove = [2, 1][this.state.playerToMove - 1];
    }

}

module.exports = Game;

