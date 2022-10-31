let inputButton;
let inputField;



const socket = io();
let resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
    socket.emit('reset');
});


socket.on('manualupdate',(data) => {});
socket.on('gameState', (data) => {
    // alert('gameState received' + JSON.stringify(data.gameState))
    updateUI(data.gameState);
});




socket.on('winner', (data) => {
    alert('Player ' + data.winner + ' won!');
})

function updateElements(){
    inputField = document.getElementById("inputField");
    inputButton = document.getElementById("inputButton");
}


function updateUI(gameState) {
    let state = gameState;
    updateBoard(state);
}

function updateBoard(state) {
    let board = state.board;
    let allEntities = state.allEntities;
    // Delete board table if it already exists because we're just going to recreate it
    let boardTable = document.getElementById('board');
    if (boardTable) {
        document.body.removeChild(boardTable);
    }

    boardTable = document.createElement('table');
    boardTable.id = 'board';
    document.body.appendChild(boardTable);
    
    
    for(let i = 0; i < board.numRows; i++) {
        //for each row in the board 

        let row = boardTable.insertRow();
        for(var j = 0; j < board.numCols; j++) {
            //for each column in the board

            var spaceValue = null;
            let space = board.spaces[i][j];

            if (space.length === 0) {
                spaceValue = 0;
                //if the space is empty

            } else if (space.length > 1){
                spaceValue = 5;
                //if the space has two or more things on it

            } else {
                //if the space has exactly one thing on it
                let entity = state.allEntities[space[0]];
                let type = entity.entityType;
                if (type === "ship"){

                    if (entity.playerNum == 1) {
                        spaceValue = 1;

                    } else if (entity.playerNum== 2) {
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
            
            //once we've determined the spaceValue, we add cosmetics to the board.
            if (spaceValue === 1) {
                cell.style.backgroundColor = 'blue';
                cell.innerText = "Player 1: Ship";

            } else if (spaceValue === 2)  {
                cell.style.backgroundColor = 'red';
                cell.innerText = "Player 2: Ship";

            } else if (spaceValue === 3) {
                cell.style.backgroundColor = 'lightskyblue';
                cell.innerText = "Player 1: Colony";

            } else if (spaceValue === 4) {
                cell.style.backgroundColor = 'crimson';
                cell.innerText = "Player 2: Colony";

            } else if (spaceValue === 5) {
                cell.style.backgroundColor = 'orange';
                var text = "";
                for (i = 0; i < space.length; i++) {
                    id = space[i];
                    let object = allEntities[id];
                    text += `Player ${object.playerNum}: `;
                    if (object.entityType === "ship") {
                        text += `${object.shipType}`;
                    } else {
                        text += `${object.entityType}`;
                    }
                //     if (object.entityType === "ship"){
                //         if (object.playerNum === 1){
                //             let type = object.shipType;
                //             text += "Player 1: " + type;
                //         } else if (object.playerNum === 2){
                //             let type = object.shipType;
                //             text += "Player 2: " + type;
                //         }
                //     } else if (object.entityType === "colony"){
                //         if (object.playerNum === 1){
                //             text += "Player 1: Colony";
                //         } else if (object.playerNum === 2){
                //             text += "Player 2: Colony";
                //         }
                //    }
                cell.innerText = text;
                }
            } else if (spaceValue === 0) {
                cell.style.backgroundColor = 'black';
            } else {
                cell.style.backgroundColor = 'yellow';
            }
        }
    }

}