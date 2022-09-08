class Strat{
    constructor(pid){
        this.pid = pid
    }
    chooseMove(board){
        //move_obj = {ship_id : [0, 1], movement : [["w","d","w"],["w","d","w"]]}
        //move_obj = {ship_id:movement, ship_id:movement}
        moveObj = {shipId:[]}

        //for each ship you want to move
            //move_obj[ship_id].push(id)
            movements = []
            //for each movement you want
                //algorithm to choose your move
                //movement.push(mv)
            //moveObj[movement].push(movements)


        return moveObj
    }

}

class Dumbboat{
    constructor(pid){
        this.pid = pid
    }
    chooseMove(board){
        moveobj = {}
        for(i = 0;i<board.length; i++){
            for(j = 0; j < board[0].length; j++){
                if(board[i][j].length != 0){
                    if(this.pid == 1){
                        moveobj[board[i][j]] = "down"
                    }
                    if(this.pid == 2){
                        moveobj[board[i][j]] = "up"
                    }
                }
            }
        }
        return moveobj

    }
}

module.exports = Dumbboat;