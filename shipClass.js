class Ship{
    constructor(playerNum, entityId) {
        this.moveable = true;
        this.playerNum = playerNum;
        this.id = entityId;
        this.entityType = "ship";
        if (this.playerNum == 1) {
          this.position = [0,3];}

        else {
          this.position = [6,3];}
      }
}

module.exports = Ship;