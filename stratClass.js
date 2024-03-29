var rls = require('readline-sync');
/*class Strat{
    constructor(playerNum){
        this.playerNum = playerNum;
    }
    chooseMove(board){
        //move_obj = {ship_id : [0, 1], movement : [["w","d","w"],["w","d","w"]]}
        //move_obj = {ship_id:movement, ship_id:movement}
        moveObj = {shipId:[]};

        //for each ship you want to move
            //move_obj[ship_id].push(id)
            movements = [];
            //for each movement you want
                //algorithm to choose your move
                //movement.push(mv)
            //moveObj[movement].push(movements)


        return moveObj;
    }

}
*/

class dumbBoat{
    constructor(playerNum){
        this.playerNum = playerNum;
        this.isManual = false;
    }
    chooseMove(board){
        if (this.playerNum == 1) {
            return {3: 'down', 5:'down'};
        }
        else if (this.playerNum == 2) {
            return {4: 'up', 6: 'up'};
        }
    }

    chooseShipToAttack(shipObjectsOnSpace) {
        let randomShip = shipObjectsOnSpace[Math.floor(Math.random() * shipObjectsOnSpace.length)];
        while (randomShip.playerNum == this.playerNum) {
            randomShip = shipObjectsOnSpace[Math.floor(Math.random() * shipObjectsOnSpace.length)];
        }
        return randomShip.id;
    }

}

class randomBoat {
    constructor(playerNum) {
        this.playerNum = playerNum;
        this.isManual = false;
    }

    chooseMove(board) {
        const moves = ['up', 'down', 'right', 'left']
        var randomMoveOne = moves[Math.floor(Math.random() * moves.length)]
        var randomMoveTwo = moves[Math.floor(Math.random() * moves.length)]
        
        if (this.playerNum == 1) {
            return {3 : randomMoveOne, 5: randomMoveTwo}
        }
        else if (this.playerNum == 2) {
            return {4 : randomMoveOne, 6: randomMoveTwo}
        }
    }

    chooseShipToAttack(shipObjectsOnSpace) {
        let randomShip = shipObjectsOnSpace[Math.floor(Math.random() * shipObjectsOnSpace.length)];
        while (randomShip.playerNum != this.playerNum) {
            randomShip = shipObjectsOnSpace[Math.floor(Math.random() * shipObjectsOnSpace.length)];
        }
        return randomShip.id;
    }

}

class manualBoat{
    constructor(playerNum){
        this.playerNum = playerNum
        this.isManual = true;
    }
    chooseMove(board){
        //board is useless here, it's just so you don't get a "too many inputs" error
        //stores the moves
        this.moves = {}
        //stores last ship_id
        this.ship_id = null 
        //stores last ship_move
        this.ship_move = null
        //asks for input
        while(true){
            this.ship_id = (rls.question('input id here '))
            //breaks if no input

            if(this.ship_id != ''){
                //converts to int and asks for move
                this.ship_id = parseInt(this.ship_id)
            
                    //makes sure same player doesn't move twice
                /* if (this.ship_id == Object.keys(this.moves)[Object.keys(this.moves).length-1]){
                    console.log("Error: same player moved consecutively ");
                    break;

                } */
                this.ship_move = (rls.question('input move here '))
            }
            else{
                console.log('returning moves:')
                console.log(this.moves);
                return this.moves
            }
            //adds move and id to bank
            this.moves[this.ship_id] = this.ship_move
        }
    }
}

//let a = new manualBoat(1)
//console.log(a.chooseMove([]))
module.exports.dumbBoat = dumbBoat;
module.exports.manualBoat = manualBoat;
module.exports.randomBoat = randomBoat;