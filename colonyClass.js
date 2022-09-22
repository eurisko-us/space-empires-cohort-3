class Colony{
    constructor(playerNum, home=false, entityId) {
        
      this.playerNum = playerNum;
      this.id = entityId;
      this.entityType = "colony";
      if (home == true) {
        if (this.playerNum == 1) {
          this.position = [0,3];} 

        else {
          this.position = [6,3];}
      }
      else {
        //random not filled location?
      }
      }
}      

module.exports = Colony;