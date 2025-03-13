class TileSelector extends GameObject{
    constructor(config){
        super(config);
        this.enabled = 0;
        this.selectedObj = null;
        this.selectedTile = [];
        this.selectedImg = new Image();
        this.selectedImg.src = "./img/selected_tile.png";
    }

    //TODO give sprite
    draw(ctx, x, y){
        // ctx.lineWidth = "4";
        // ctx.strokeStyle = "#C41E3A";
        // ctx.rect(this.x, this.y, 100, 100);
        // ctx.stroke();

        ctx.drawImage(this.selectedImg,
            0, 0,
            this.selectedImg.width, this.selectedImg.height,
            this.x, this.y,
            100, 100
        );
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

    deselectObj(){
        this.enabled = 0;
        this.selectedObj = null;
    }

    isEmpty(){
        if(this.selectedObj == null) { return true; }
        return false;
    }

    compare(obj){
        if(this.selectedObj != obj && obj != null){
            return false;
        }
        return true;
    }
}