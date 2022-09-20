const socket = io();

socket.on('gameState', (data) => {
    updateUI(data.gameState);
});

function updateUI(gameState) {
    let board = gameState.board;
    updateBoard(board);
}

function updateBoard(board) {
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

        for(let j = 0; j < board.numCols; j++) {
            let space = board.spaces[i][j]
            if (space.length === 0){
                spaceValue = board.spaces[i][j]
            } else{
                for (let k = 0; k < space.length; k++){
                    typeof(space[k])
                }
            }
            if (spaceValue.length > 0) {
                alert(JSON.stringify(spaceValue));
            }

            let cell = row.insertCell();
            cell.className = 'boardSpace';

            if (spaceValue === 1) {
                cell.style.backgroundColor = 'orange';
            } else if (spaceValue === 2)  {
                cell.style.backgroundColor = 'purple';
            } else if (spaceValue == 3) {
                cell.style.backgroundColor = 'green';
            } else if (spaceValue == 4) {
                cell.style.backgroundColor = 'yellow';
            } else if (spaceValue == 0) {
                cell.style.backgroundColor = 'black'
            } else {
                cell.style.backgroundColor = 'yellow';
            }
        }
    }
}