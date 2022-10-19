class Ship{
    constructor(playerNum, entityId, shipType) {
        this.moveable = true;
        this.playerNum = playerNum;
        this.id = entityId;
        this.entityType = "ship";
        this.shipType = shipType;
        if (this.playerNum == 1) {
            this.position = [0,3];
        } else {
            this.position = [6,3];
        }

        if (shipType === "scout") {
            this.attack = 3;
            this.defense = 0;
            this.hullSize = 1;
        } else if (shipType === "dreadnaught") {
            this.attack = 6;
            this.defense = 3;
            this.hullSize = 3;
        }

    }
}

module.exports = Ship;