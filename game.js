class Game {
    constructor(clientSockets) {
        this.clientSockets = clientSockets;

        this.state = null;
    }

    start() {
        setInterval(() => {
            this.state = this.generateRandomGameState();

            for(let socketId in this.clientSockets) {
                let socket = this.clientSockets[socketId];

                socket.emit('gameState', { 
                    gameState: this.state
                });        
            }
        }, 1000);  
    }

    generateRandomGameState() {
        let board = {
            numRows: 10,
            numCols: 15,
            spaces: []
        };

        board.spaces = new Array(board.numRows);
        for(let i = 0; i < board.numRows; i++) {
            board.spaces[i] = new Array(board.numCols);
        }

        for(let i = 0; i < board.numRows; i++) {
            for(let j = 0; j < board.numCols; j++) {        
                let r = this.getRandomInteger(1, 20);
                if ((i == 0|| i == 1 || i == 8 || i == 9) && (j == 0 || j == 1 || j == 13 || j == 14)){
                    r = 0 }
                board.spaces[i][j] = r;
            }
        }    

        let gameState = {
            board
        };

        return gameState;
    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

module.exports = Game;

