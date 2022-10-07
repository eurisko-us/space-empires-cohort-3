const socket = io();

socket.on('gameState', (data) => {
    // alert('gameState received' + JSON.stringify(data.gameState))
    updateUI(data.gameState);
});

function updateUI(gameState) {
    let state = gameState;
    updateBoard(state);
}

function updateBoard(state) {
    let board = state.board;
    // Delete board table if it already exists because we're just going to recreate it
    let boardTable = document.getElementById('board');
    if (boardTable) {
        document.body.removeChild(boardTable);
    }

    boardTable = document.createElement('table');
    boardTable.id = 'board';
    document.body.appendChild(boardTable);
    
    
    for(let i = 0; i < board.numRows; i++) {
        let row = boardTable.insertRow();
        for(var j = 0; j < board.numCols; j++) {
            var spaceValue = null;
            let space = board.spaces[i][j];
            if (space.length === 0) {
                spaceValue = 0;
            } else {
                for (let i = 0; i < space.length; i++){
                    let entity = state.allEntities[space[i]];
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
            }

            let cell = row.insertCell();
            cell.className = 'boardSpace';
            
                    
            if (spaceValue === 1) {
                cell.style.backgroundColor = 'blue';
                cell.innerText = "Player 1: Ship"
            } else if (spaceValue === 2)  {
                cell.style.backgroundColor = 'red';
                cell.innerText = "Player 2: Ship"
            } else if (spaceValue == 3) {
                cell.style.backgroundColor = 'lightskyblue';
                cell.innerText = "Player 1: Colony"
            } else if (spaceValue == 4) {
                cell.style.backgroundColor = 'crimson';
                cell.innerText = "Player 2: Colony"
            } else if (spaceValue == 0) {
                cell.style.backgroundColor = 'black'
            } else {
                cell.style.backgroundColor = 'yellow';
            }
        }
    }

}