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
            let spaceValue = board.spaces[i][j];
            if(i === 0 || i === 1){
                if(j === 0 || j === 1){
                    spaceValue = -1;
                }
                else if (j === board.numCols - 1 || j === board.numCols - 2){
                    spaceValue = -1;
                }
            }
            if (i === board.numRows - 2 || i === board.numRows - 1){
                if (j === 0 || j === 1){
                    spaceValue = -1;
                }
                else if (j === board.numCols - 1 || j === board.numCols - 2){
                    spaceValue = -1;
                }
            }

            let cell = row.insertCell();
            cell.className = 'boardSpace';
            if (spaceValue === -1){
                cell.style.backgroundColor = 'black';
            }
            else if (spaceValue === 1) {
                cell.style.backgroundColor = 'orange';
            } else if (spaceValue === 2)  {
                cell.style.backgroundColor = 'purple';
            }
            else if (spaceValue == 3) {
                cell.style.backgroundColor = 'yellow';
            }
            else if (spaceValue == 4){
                cell.style.backgroundColor = 'green';
            } else {
                cell.style.backgroundColor = 'grey';
            }
        }
    }

}