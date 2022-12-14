const { all } = require('express/lib/application');
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
        this.broadcastMessage('gameState', {
            gameState: this.state
        });


        let gameInterval = setInterval(() => {
            let winner = this.checkWinState();

            if (winner != 0) {
                clearInterval(gameInterval);
                this.broadcastMessage('winner', {
                    winner: winner
                });
                return winner;
            }

            
            
            //this.refreshBoard();
            this.makeMove();
            this.refreshBoard();
            this.broadcastMessage('gameState', {
                gameState: this.state
            });

            this.combatPhase();

            // for (let socketId in this.clientSockets) {
            //     let socket = this.clientSockets[socketId];

            //     socket.emit('gameState', {
            //         gameState: this.state
            //     });
            // }
        }, 100);
    }

    broadcastMessage(msgName, msgJSON) {
        for (let socketId in this.clientSockets) {
            let socket = this.clientSockets[socketId];

            socket.emit(msgName, msgJSON);
        }
    }

    checkWinState() {
        console.log('Checking win state');
        for (var i = 0; i < Object.keys(this.state.allEntities).length; i++) {
            let ship = this.state.allEntities[i + 1];
            if (ship.playerNum == 1 && (ship.position[0] == 6) && (ship.position[1] == 3)) {
                console.log("Player 1 won!");
                return 1;
            }

            else if (ship.playerNum == 2 && (ship.position[0] == 0) && (ship.position[1] == 3)) {
                console.log('Player 2 won!');
                return 2;
          }
        }
        return 0;
    }
    generateInitialGameState() {
        let board = {
            numRows: 7,
            numCols: 7, 
            spaces: [],
        };

        board.spaces = new Array(board.numRows);
        for (let i = 0; i < board.numRows; i++) {
            board.spaces[i] = new Array(board.numCols);
        }

        var allEntities = {};

        for(let i = 0; i < board.numRows; i++) {
            for(let j = 0; j < board.numCols; j++) {
                board.spaces[i][j] = [];
                if (i === 0 && j === 3) {
                    var p1Colony = new Colony(1, true, 1);
                    allEntities[p1Colony.id] = p1Colony;
                    board.spaces[i][j].push(p1Colony.id);

                    var p1Ship = new Ship(1, 3, "scout");
                    allEntities[p1Ship.id] = p1Ship;
                    board.spaces[i][j].push(p1Ship.id);

                    var p1Dreadnaught = new Ship(1, 5, "dreadnaught");
                    allEntities[p1Dreadnaught.id] = p1Dreadnaught;
                    board.spaces[i][j].push(p1Dreadnaught.id);
                }

                else if (i === 6 && j === 3) {
                    var p2Colony = new Colony(2, true, 2);
                    allEntities[p2Colony.id] = p2Colony;
                    board.spaces[i][j].push(p2Colony.id);

                    var p2Ship = new Ship(2, 4, "scout")
                    allEntities[p2Ship.id] = p2Ship;
                    board.spaces[i][j].push(p2Ship.id);

                    var p2Dreadnaught = new Ship(2, 6, "dreadnaught");
                    allEntities[p2Dreadnaught.id] = p2Dreadnaught;
                    board.spaces[i][j].push(p2Dreadnaught.id);
                }
            }
        }

        let gameState = {
            board,
            playerToMove: 1,
            allEntities: allEntities
        }
        console.log(allEntities)
        return gameState;
    }

    makeMove() {

        let move = this.players[this.state.playerToMove - 1].chooseMove(this.state.board);

        this.moveShips(move);
        //Making sure that colonies dont move`
        // let board = this.state["board"]["spaces"]
        // if (board[0][3][0] instanceof Colony != True) {
        //     console.log("Error : Colony moved")
        // }
        // //making sure that ships don't duplicate
        // let numentity = 0
        // for (let i = 0; i < board.length; i++) {
        //     for (let j = 0; j < board[0].length; j++) {
        //         for (let k = 0; k < board[0][0]; k++) {
        //             if (board[i][j][k] != null) {
        //                 numentity += 1
        //             }
        //         }
        //     }
        // }
        // if (numentity != this.allEntities.length) {
        //     console.log("Error: Duplicating ships occurred")
        // }
        //making sure that ships don't teleport


        this.state.playerToMove = [2, 1][this.state.playerToMove - 1];

        //REBUGING
        // console.log(this.state["board"])



    }

    moveShips(moves) {
        let shipIds = Object.keys(moves);
        for (let i = 0; i < shipIds.length; i++) {
            let ship = this.state.allEntities[shipIds[i]];
            let move = moves[shipIds[i]];

            if (!ship.moveable) return;
            if (ship.playerNum != this.state.playerToMove) return;

            if (move === "left") {
                if (ship.position[1] != 0) {
                    ship.position[1] -= 1;
                } else {
                    console.log("You can't move left!");
                }
            } else if (move === "right") {
                if (ship.position[1] != 6) {
                    ship.position[1] += 1;
                } else {
                    console.log("You can't move right!");
                }
            } else if (move === "up") {
                if (ship.position[0] != 0) {
                    ship.position[0] -= 1;
                } else {
                    console.log("You can't move up!");
                }
            } else if (move === "down") {
                if (ship.position[0] != 6) {
                    ship.position[0] += 1;
                } else {
                    console.log("You can't move down!");
                }
            }
        }
    }

    refreshBoard() {
        var b = [];
        for (let i = 0; i < 7; i++){
            var a = [[], [], [], [], [], [], []];
            b.push(a);
        }
        this.state.board.spaces = b
        for (var i = 0; i < Object.keys(this.state.allEntities).length; i++){
            let pos = this.state.allEntities[i + 1].position;
            this.state.board.spaces[pos[0]][pos[1]].push(i + 1);
        }
        console.table(this.state.board.spaces)
    }

    combatPhase() {
        for (let i = 0; i < this.state.board.numRows; i++) {
            for (let j = 0; j < this.state.board.numCols; j++) {
                let currentBoardSpace = this.board[i][j];
                if (currentBoardSpace.length > 1) {
                    let firstShipId = currentBoardSpace[0];
                    let firstShipPlayerNum = this.state.allEntities[firstShipId]
                    for (let k = 1; k < currentBoardSpace.length; k++) {
                        
                        let currentShipId = currentBoardSpace[k];
                        let currentShipPlayerNum = this.state.allEntities[currentShipId];
                        if (firstShipPlayerNum != currentShipPlayerNum) {
                            // do sth
                        }
                    
                        


                    }
                }
            }
        }
    }
}

module.exports = Game;