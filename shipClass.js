class Ship{
  constructor(playerNum, entityId, shipType) {
      this.movable = true;
      this.playerNum = playerNum;
      this.id = entityId;
      this.entityType = "ship";
      this.shipType = shipType;
      this.chosenMove = null;
      this.chosenAttack = null;
      if (this.playerNum == 1) {
          this.position = [0,3];
      } else {
          this.position = [6,3];
      }

      if (shipType === "scout") {
          this.attack = 3;
          this.defense = 0;
          this.hullSize = 1;
          this.hp = 1;
      } else if (shipType === "dreadnaught") {
          this.attack = 6;
          this.defense = 3;
          this.hullSize = 3;
          this.hp = 3;
      }

  }
}

module.exports = Ship;