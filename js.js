function moveShips(moves){
    let ships = Object.keys(moves);
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        let move = moves[ship];
        let pos = ship.position;
        if (move === "left") {
            if (pos[0] != 0) {
                pos[0] -= 1;
            } else {
                console.log("You can't move left!");
            }
        } else if (move === "right") {
            if (pos[0] != 6) {
                pos[0] += 1;
            } else {
                console.log("You can't move right!");
            }
        } else if (move === "up") {
            if (pos[1] != 0) {
                pos[1] -= 1;
            } else {
                console.log("You can't move up!");
            }
        } else if (move === "down") {
            if (pos[0] != 6) {
                pos[0] += 1;
            } else {
                console.log("You can't move down!");
            }
        }
        ship.position = pos;
    }
}