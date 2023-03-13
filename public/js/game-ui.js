// const { type } = require("express/lib/response");

const socket = io();

socket.on('gameState', (data) => {
    // alert('gameState received' + JSON.stringify(data.gameState))
    updateUI(data.gameState);
});

socket.on('winner', (data) => {
    alert('Player ' + data.winner + ' won!');
})
socket.on("getID", ()=>{
    parseId()
})

function updateUI(gameState) {
    let state = gameState;
    updateBoard(state);
}

function updateBoard(state) {
    let board = state.board;
    let boardWrapper = document.getElementById("boardWrapper");
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

document.getElementsByClassName("two")[0].addEventListener("click",addAlert,false);
document.getElementsByClassName("two")[0].myParam = "up"
document.getElementsByClassName("four")[0].addEventListener("click",addAlert,false)
document.getElementsByClassName("four")[0].myParam = "left"
document.getElementsByClassName("five")[0].addEventListener("click",addAlert,false);
document.getElementsByClassName("five")[0].myParam = "enter"
document.getElementsByClassName("six")[0].addEventListener("click",addAlert,false);
document.getElementsByClassName("six")[0].myParam = "right"
document.getElementsByClassName("eight")[0].addEventListener("click",addAlert,false);
document.getElementsByClassName("eight")[0].myParam = "down"


function addAlert(evt){
    var button = evt.currentTarget.myParam
    if(button == "up"){
        socket.emit("moveMade", "up");
        alert("moving up")
    } else if (button == "left"){
        socket.emit("moveMade", "left");
        alert("moving left")
    } else if (button == "enter"){
        socket.emit("moveMade", "enter");
        alert("HIT HIT")
    } else if (button == "right"){
        socket.emit("moveMade", "right");
        alert("moving right")
    } else if (button == "down"){
        socket.emit("moveMade", "down");
        alert("moving down")
    }
}   

