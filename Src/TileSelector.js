class TileSelector extends GameObject{
    constructor(config){
        super(config);
        this.enabled = false;
        this.selectedUnit = null;
        this.playerUnit = null;
        this.aiUnit = null;
        // Currently selected tile position
        this.selectedTile = [];
        this.confirmationTile = [];
        this.selectedImg = new Image();
        this.selectedImg.src = "./img/selected_tile.png";
    }

    //TODO give sprite
    draw(ctx){
        // ctx.lineWidth = "4";
        // ctx.strokeStyle = "#C41E3A";
        // ctx.rect(this.x, this.y, 100, 100);
        // ctx.stroke();

        ctx.globalAlpha=0.75;
        ctx.drawImage(this.selectedImg,
            0, 0,
            this.selectedImg.width, this.selectedImg.height,
            this.x, this.y,
            100, 100
        );
        ctx.globalAlpha=1;
    }

    disableSelector(){
        this.x = -100;
        this.y = -100;
    }

    selectUnit(unit, tile){
        this.enabled = 1;
        this.selectedTile = tile
        this.selectedUnit = unit;

        if(unit.team == 0){
            this.playerUnit = unit;
        }
        else{
            this.aiUnit = unit;
        }
    }

    deselectUnit(){
        this.enabled = 0;
        this.selectedUnit = 0;
        this.aiUnit = null;
    }

    hasObject(){
        if(this.selectedUnit == null) { return true; }
        return false;
    }

    compareUnits(unit){
        if(this.selectedUnit != unit && unit != null){
            console.log("false");
            return false;
        }

        return true;
    }

    disable(){
        this.enabled = 0;
        this.selectedTile = [];
        this.confirmationTile = [];
    }
}