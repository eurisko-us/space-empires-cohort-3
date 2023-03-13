const { all } = require('express/lib/application');
const Colony = require('./colonyClass');
const Ship = require('./shipClass');


class Game {
    constructor(clientSockets, Player1, Player2) {
        this.clientSockets = clientSockets;

        this.players = [new Player1(1), new Player2(2)];

        this.numRows = 7;
        this.numCols = 7;

        this.playerResponse = null;

        this.state = this.generateInitialGameState();
        console.log("a is ",this.clientSockets)
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
            let winner = this.winner;
            //socket stuff
            if (winner) {
                clearInterval(gameInterval);
                this.broadcastMessage('winner', {
                    winner: winner
                });
                return winner;
            }

            if (this.state.phase == 'movement') {
                this.movementPhase();
            } else if (this.state.phase == 'combat') {
                this.combatPhase();
                this.refreshBoard();
                // this.state.phase = 'movement';
            }


            this.broadcastMessage('gameState', {
                gameState: this.state
            });


            // for (let socketId in this.clientSockets) {
            //     let socket = this.clientSockets[socketId];

            //     socket.emit('gameState', {
            //         gameState: this.state
            //     });
            // }
        }, 200);
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
            if (!ship.position) continue;
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
            numCols: 7,
            spaces: [],
        };

        board.spaces = new Array(board.numRows);
        for (let i = 0; i < board.numRows; i++) {
            board.spaces[i] = new Array(board.numCols);
        }
{

}
        var allEntities = {};

        for (let i = 0; i < board.numRows; i++) {
            for (let j = 0; j < board.numCols; j++) {
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
            allEntities: allEntities,
            phase: 'movement',
            winner: null
        };
        console.log(allEntities);
        return gameState;
    }

    movementPhase() {
        let player = this.players[this.state.playerToMove - 1];
        let move;
        let shipIds = Array.from(Object.keys(this.state.allEntities), string => parseInt(string));
        let shipsToMove = shipIds.filter(id => this.state.allEntities[id].movable && this.state.allEntities[id].playerNum == this.state.playerToMove && !this.state.allEntities[id].chosenMove);
        let shipToMoveId = shipsToMove[0];
        let shipToMove = this.state.allEntities[shipToMoveId]; 

        if (!shipToMoveId) {
            let shipIdsOfCurrentPlayer = shipIds.filter(id => this.state.allEntities[id].playerNum == this.state.playerToMove);
            for (const shipId of shipIdsOfCurrentPlayer) {
                this.state.allEntities[shipId].chosenMove = null;
                // resetting chosen move
            }
            this.state.playerToMove = [2, 1][this.state.playerToMove - 1];
            this.playerResponse = null;

            if (this.state.playerToMove == 1) {
                console.table(this.state.board.spaces);
                this.state.phase = 'combat';
            }

            return
        }

        this.state.shipToMoveId = shipToMoveId;

        console.log('ship to move: ' + shipToMoveId);
        if (player.isManual) {
            this.displayPrompt(`Enter moves for Player ${this.playerToMove}`);
            move = this.playerResponse;
        } else {
            move = player.chooseMove(this.state.board);
            shipToMove.chosenMove = move;
            console.log(move);
        }
        
        if (shipToMove.chosenMove) {
            this.moveShip(move);
            console.log('ships were moved');
            this.refreshBoard();
            this.winner = this.checkWinState();
            this.playerResponse = null;
        }

        console.log(`move was ${move}`);

    }

    makeMove() {
        let move = this.players[this.state.playerToMove - 1].chooseMove(this.state.board);

        this.moveShip(move);

        this.state.playerToMove = [2, 1][this.state.playerToMove - 1];

    }


    moveShip(moveObj) {
        if (!this.state.shipToMoveId in moveObj) return;

        let move = moveObj[this.state.shipToMoveId];
        let ship = this.state.allEntities[this.state.shipToMoveId];

        if (!ship.movable) return;

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

    refreshBoard() {
        var b = [];
        for (let i = 0; i < 7; i++) {
            var a = [[], [], [], [], [], [], []];
            b.push(a);
        }
        this.state.board.spaces = b
        for (var i = 0; i < Object.keys(this.state.allEntities).length; i++) {
            let pos = this.state.allEntities[i + 1].position;
            if (!pos) continue; // it would be dead rn
            this.state.board.spaces[pos[0]][pos[1]].push(i + 1);
        }
        // console.table(this.state.board.spaces);
    }

    combatPhase() {
        let combatSpaces = this.findCombatSpaces();
        if (combatSpaces.length == 0) {
            console.log('no combat spaces foudn! moving on to movement');
            this.state.phase = "movement";
            return;
        }
        let combatCoords = combatSpaces[0];
        let combatOrder = this.createCombatOrder(combatCoords);
        console.log(`combat order: ${combatOrder}`);
        let attackerShipId = combatOrder[0];
        let attackerShipObj = this.state.allEntities[attackerShipId];
        console.log(`ship to attack: ${attackerShipId}`);
        let player = this.state.allEntities[attackerShipId].playerNum;
        let playerObj = this.players[player - 1];
        let shipObjectsOnSpace = this.state.board.spaces[combatCoords[0]][combatCoords[1]].map((id) => this.state.allEntities[id]);

        let shipIdToTarget;

        if (playerObj.isManual) {
            this.displayPrompt(`Player ${player}: Enter ship to attack with Ship ${attackerShipId}`);
            shipIdToTarget = this.playerResponse;
        } else {
            shipIdToTarget = playerObj.chooseShipToAttack(shipObjectsOnSpace);
            attackerShipObj.chosenAttack = shipIdToTarget;
        }

        if (shipIdToTarget) {
            this.attackerVsDefender(attackerShipId, shipIdToTarget);
            this.playerResponse = null;
        }
    }

    resetAttackStates(shipIds) {
        for (const shipId of shipIds) {
            this.state.allEntities[shipId].chosenAttack = null;
            console.log(`reset ship ${shipId}`);
        }
    }

    attackerVsDefender(attackShipId, defenderShipId) {
        console.log(`${attackShipId} attempting to attack ${defenderShipId}`);
        let diceRoll = Math.ceil(Math.random() * 10);
        let attackerStrength = this.state.allEntities[attackShipId].attack; 
        let defenderStrength = this.state.allEntities[defenderShipId].defense; 
        if (attackerStrength - defenderStrength >= diceRoll) {
            console.log('hit');
            this.state.allEntities[defenderShipId].hp--;
            this.checkIfShipIsDead(defenderShipId);
        }
    }

    checkIfShipIsDead(shipId) {
        let shipObj = this.state.allEntities[shipId];
        if (shipObj.hp == 0) {
            shipObj.movable = false;
            shipObj.position = null;
            console.log(`Ship with id ${shipId} died!`);
            this.refreshBoard();
        }
    }

    findCombatSpaces() {

        // clean this up probably

        let combatSpaces = [];

        for (let i = 0; i < this.state.board.numRows; i++) {
            for (let j = 0; j < this.state.board.numCols; j++) {

                let currentBoardSpace = this.state.board.spaces[i][j];
                let shipsOnCurrentBoardSpace = currentBoardSpace.filter((id) => this.state.allEntities[id].entityType == "ship");
                // console.log(`number of ships on current board space: ${shipsOnCurrentBoardSpace.length}`);
                if (shipsOnCurrentBoardSpace.length <= 1) continue;
                let firstShipId = shipsOnCurrentBoardSpace[0];
                let firstShipPlayerNum = this.state.allEntities[firstShipId].playerNum;
                for (let k = 1; k < shipsOnCurrentBoardSpace.length; k++) {

                    let currentShipId = shipsOnCurrentBoardSpace[k];
                    let currentShipPlayerNum = this.state.allEntities[currentShipId].playerNum;
                    if (firstShipPlayerNum != currentShipPlayerNum) {
                        console.log(`Combat space found: ${[i, j]} with ships: ${shipsOnCurrentBoardSpace}`);
                        combatSpaces.push([i, j]);
                        break;
                    }
                }
            }
        }

        return combatSpaces;
    }

    createCombatOrder(combatCoords) {
        let combatOrder = [...this.state.board.spaces[combatCoords[0]][combatCoords[1]]].filter((id) => !this.state.allEntities[id].chosenAttack).sort((a, b) => {this.state.allEntities[a].attack - this.state.allEntities[b].attack});
        while (combatOrder.length == 0) {
            this.resetAttackStates(this.state.board.spaces[combatCoords[0]][combatCoords[1]]);
            combatOrder = [...this.state.board.spaces[combatCoords[0]][combatCoords[1]]].filter((id) => !this.state.allEntities[id].chosenAttack).sort((a, b) => { this.state.allEntities[a].attack - this.state.allEntities[b].attack });
        }
        return combatOrder;
    }
}

module.exports = Game;
