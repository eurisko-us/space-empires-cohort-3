// const { type } = require("express/lib/response");

const socket = io();

socket.on('gameState', (data) => {
    // alert('gameState received' + JSON.stringify(data.gameState))
    updateUI(data.gameState);
});


socket.on('winner', (data) => {
    alert('Player ' + data.winner + ' won!');
})

function updateUI(gameState) {
    let state = gameState;
    updateBoard(state);
}

function updateBoard(state) {
    let board = state.board;
    let boardWrapper = document.getElementById("grid1");
    // Delete board table if it already exists because we're just going to recreate it
    let boardTable = document.getElementById('board');
    if (boardTable) {
        boardWrapper.removeChild(boardTable);
    }

    boardTable = document.createElement('table');
    boardTable.id = 'board';
    boardWrapper.appendChild(boardTable);
    
    
    for(let i = 0; i < board.numRows; i++) {
    //loops through rows

        let row = boardTable.insertRow();

        for(var j = 0; j < board.numCols; j++) {
        //loops through columns

            var spaceValue = null;
            let space = board.spaces[i][j];

            if (space.length === 0) {
                spaceValue = 0;
                //if space is empty
            } else if (space.length > 1){
                spaceValue = 5;

            } else {

                    let entity = state.allEntities[space[0]];
                    let type = entity.entityType;
                    

                    if (type === "ship"){

                        if (entity.playerNum == 1) {
                            spaceValue = 1;

                        } else if (entity.playerNum == 2) {
                            spaceValue = 2;
                        }

                    } else if (type === "colony"){

                        if (entity.playerNum == 1) {
                            spaceValue = 3;

                        } else if (entity.playerNum == 2) {
                            spaceValue = 4;
                        }
                    }
            }

            let cell = row.insertCell();
            cell.className = 'boardSpace';
            
                    
            if (spaceValue === 1) {
                cell.style.backgroundColor = 'green';
                cell.innerText = "Player 1: " + state.allEntities[space[0]].shipType + " (" + space[0] + ")";

            } else if (spaceValue === 2)  {
                cell.style.backgroundColor = 'red';
                cell.innerText = "Player 2: " + state.allEntities[space[0]].shipType + " (" + space[0] + ")";

            } else if (spaceValue == 3) {
                cell.style.backgroundColor = 'lightgreen';
                cell.innerText = "Player 1: Colony (1)";
                
            } else if (spaceValue == 4) {
                cell.style.backgroundColor = 'crimson';
                cell.innerText = "Player 2: Colony (2)";

            } else if (spaceValue === 5) {
                cell.style.backgroundColor = 'orange';
                var text = "";
                for (let i = 0; i < space.length; i++){
                    text = text + "Player " + state.allEntities[space[i]].playerNum + ": " + state.allEntities[space[i]].shipType + " (" + space[i] + ") \n";
                }
                cell.innerText = text;

            } else if (spaceValue == 0) {
                cell.style.backgroundColor = 'black';
            }
        }
    }

}