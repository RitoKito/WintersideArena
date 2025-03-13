class Tile extends GameObject{
    constructor(config) {
        super(config);
        this.tilePos = config.tilePos || [0, 0];
        this.traversable = config.traversable;
        this.occupied = config.occupied;
        this.occupant = config.occupant || null;
        this.validImg = new Image();
        this.validImg.src = "./img/valid_tile.png";
    }

    drawValid(ctx){
        ctx.drawImage(this.validImg,
            0, 0,
            this.validImg.width, this.validImg.height,
            this.tilePos[1]*100, this.tilePos[0]*100,
            100, 100
        )
    }
}