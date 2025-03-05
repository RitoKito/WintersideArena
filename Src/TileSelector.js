class TileSelector{
    constructor(config){
        this.x = config.x;
        this.y = config.y;
        this.enabled = 1;
        this.selectedObj = null;
        this.selectedTile = [];
    }

    drawSelector(ctx, x, y){
        ctx.lineWidth = "4";
        ctx.strokeStyle = "#C41E3A";
        ctx.rect(this.x, this.y, 100, 100);
        ctx.stroke();
    }

    move(x, y){
        this.x = x;
        this.y = y;
    }

    disableSelector(){
        this.x = -100;
        this.y = -100;
    }

    selectObj(obj, tile){
        this.enabled = 1;
        this.selectedObj = obj;
        this.selectedTile = tile
    }

    disselectObj(){
        this.enabled = 0;
        this.selectedObj = null;
    }
}