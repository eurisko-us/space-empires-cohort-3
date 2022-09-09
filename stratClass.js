var rls = require('readline-sync');
class Strat{
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

class Dumbboat{
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
        this.i = 0
    }
    chooseMove(board){
        this.moves = {}
        this.qed = null 
        this.ans = null
        while(this.qed != ''){
            this.qed = (rls.question('input id here '))
            if(this.qed != ''){
                this.qed = parseInt(this.qed)
                this.ans = (rls.question('input move here '))
            }
            else{
                return this.moves
            }
            this.moves[this.qed] = this.ans
        }
        return this.moves
    }
}
let a = new manualBoat(1)
console.log(a.chooseMove([]))
module.exports = Dumbboat;
module.exports = manualBoat;