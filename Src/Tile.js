class Tile extends GameObject{
    constructor(config) {
        super(config);
        this.tilePos = config.tilePos || [0, 0];
        this.traversable = config.traversable;
        this.occupied = config.occupied;
        this.occupant = config.occupant || null;
        this.validImg = new Image();
        this.validImg.src = "./img/valid_tile.png";

        this.gCost = 0;
        this.hCost = 0;
        this.fCost = 0;
        this.parent = null;
    }

    drawValid(ctx){
        ctx.drawImage(this.validImg,
            0, 0,
            this.validImg.width, this.validImg.height,
            this.tilePos[1]*100, this.tilePos[0]*100,
            100, 100
        )

        this.debugDrawCosts(ctx);
    }

    getGCost(origin){
        // let yDist = Math.abs(origin.tilePos[0] - this.tilePos[0]);
        // let xDist = Math.abs(origin.tilePos[1] - this.tilePos[1]);
        // this.gCost = xDist + yDist;

        let yDist = (this.tilePos[0] - origin.tilePos[0])**2
        let xDist = (this.tilePos[1] - origin.tilePos[1])**2
        this.hCost = Math.sqrt(xDist + yDist);
    //     return xDist = yDist;
    //     // console.log("Distance to origin: " + xDist + yDist);
    }
    
    getHCost(destination){
        // console.log(destination);
        // let yDist = Math.abs(destination.tilePos[0] - this.tilePos[0]);
        // let xDist = Math.abs(destination.tilePos[1] - this.tilePos[1]);

        let yDist = (this.tilePos[0] - destination.tilePos[0])**2
        let xDist = (this.tilePos[1] - destination.tilePos[1])**2
        this.hCost = Math.sqrt(xDist + yDist);
        // this.hCost= xDist + yDist;
        // console.log(this.tilePos)
        // console.log(this.hCost);
        return this.hCost;
    }

    getFCost(origin, destination){
        this.getGCost(origin);
        this.getHCost(destination);
        this.fCost = this.gCost + this.hCost;
        return this.fCost;
    //     ctx.fillText(this.getGCost(origin) + this.getHCost(destination), this.tilePos[1]*100, this.tilePos[0]*100);
    //     return this.getGCost(origin) + this.getHCost(destination);
    }

    debugDrawCosts(ctx){
        ctx.fillText("Y: " + this.tilePos[0] + " X: " + this.tilePos[1], this.tilePos[1]*100 + 25, this.tilePos[0]*100 + 75)

        ctx.fillText("G: " + Math.round(this.gCost) + " | " 
        + "H: " +  Math.round(this.hCost) + " | " 
        + "F: " + + Math.round(this.fCost),
        this.tilePos[1]*100 + 15, this.tilePos[0]*100 + 50);
    }
}