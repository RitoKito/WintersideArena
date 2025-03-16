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
        this.confirmSelection= false;
        this.selectedImg = new Image();
        this.selectedImg.src = "./img/selected_tile.png";
        this.state = 0;
    }

    //TODO give sprite
    draw(ctx){
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

    selectUnit(unit){
        this.enabled = 1;
        this.tileMove(unit.tile);
        this.selectedTile = unit.tile;
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
        this.selectedUnit = null;
        this.aiUnit = null;
    }

    selectTile(tile){
        this.selectTile = tile;
        this.selectedUnit = null;
    }

    hasUnit(){
        if(this.selectedUnit == null) { return false; }
        return true;
    }

    disable(){
        this.enabled = 0;
        this.selectedTile = [];
        this.confirmationTile = [];
    }
}