var rls = require('readline-sync');
/*class Strat{
    constructor(pid){
        this.pid = pid;
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
    constructor(pid){
        this.pid = pid;
    }
    chooseMove(board){
        let moveobj = {}
        for(let i = 0;i<board.length; i++){
            for(let j = 0; j < board[0].length; j++){
                if(board[i][j].length != 0){
                    if(this.pid == 1){
                        moveobj[board[i][j]] = "down";
                    }
                    if(this.pid == 2){
                        moveobj[board[i][j]] = "up";
                    }
                }
            }

        }
        return moveobj;

    }
}

class manualBoat{
    constructor(pid){
        this.pid = pid
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
                if (this.ship_id == Object.keys(this.moves)[Object.keys(this.moves).length-1]){
                    console.log("Error: same player moved consecutively ");
                    break;

                }
                this.ship_move = (rls.question('input move here '))
            }
            else{
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