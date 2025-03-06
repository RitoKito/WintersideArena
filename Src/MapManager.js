class MapManager {
    constructor(config){
        this.gameObjects = [];
        this.layout = config.layout;
        this.tileObjs = config.tileObjs;
        this.initTileObjs();
        this.validTilesEnabled = 0;
        this.validTiles = new Set();
        
        // this.lowerImage = new Image();
        // this.lowerImage.src = config.lowerSrc;

        // this.upperImage = new Image();
        // this.upperImageImage.src = config.upperSrc;
    }

    initTileObjs() {
        for(let i = 0; i < this.layout.length; i++){
            for(let j = 0; j < this.layout[i].length; j++){
                
                let traversable = 1;
                if(this.layout[i][j] == 0) { traversable = 0; }

                this.tileObjs[i][j] = new Tile({
                    name: "tile_"+i+"_"+j,
                    x: j*100,
                    y: i*100,
                    tilePos: [i,j],
                    traversable: traversable,
                    occupied: 0,
                    occupant: null
                });
            }
        }
    }

    // drawLowerImage(ctx) {
    //     ctx.drawImage(this.lowerImage, 0, 0);
    // }

    // drawUpperImage(ctx) {
    //     ctx.drawImage(this.upperImage, 0, 0);
    // }



    drawTileSheet(ctx){ // for testing purposes TODO: proper tilesheet
        this.tileObjs.forEach(row => {
            row.forEach(tile =>{
                if(tile.traversable == 0) { ctx.fillStyle = "#a6a8f7"; }
                else if(tile.traversable == 1) { ctx.fillStyle = "black"; }

                ctx.fillRect(tile.x, tile.y, 100, 100);
                ctx.stroke();
            })

        });
    }

    //Recursive function to calculate possible tiles for movement
    //Based on char moveLen stat
    getValidTiles(x, y , moveLen){
        if(x < 0 || y < 0 || x >= this.tileObjs[0].length || y >= this.tileObjs.length) {
             return; 
        }

        let tile = this.tileObjs[y][x];

        if(tile.traversable == 1 || tile.occupied || moveLen <= 0){
            return;
        }

        this.validTiles.add(this.tileObjs[y][x]);

        this.getValidTiles(x + 1, y, moveLen - 1, this.validTiles);
        this.getValidTiles(x - 1, y, moveLen - 1, this.validTiles);
        this.getValidTiles(x, y + 1, moveLen - 1, this.validTiles);
        this.getValidTiles(x, y - 1, moveLen - 1, this.validTiles);
    }
    
    isValidTile(x, y){
        if(this.validTiles.has(this.tileObjs[x][y])){
            return true;
        }

        return false;
    }

    //TODO give sprite
    drawValidTiles(ctx){
        this.validTiles.forEach(tile => {
            ctx.lineWidth = "4";
            // ctx.strokeStyle = "#C41E3A"
            ctx.rect(tile.tilePos[1]*100, tile.tilePos[0]*100, 100, 100);
            ctx.stroke();
        })
    }

    freeTile(tile){
        this.tileObjs[tile[0]][tile[1]].occupant = null;
        this.tileObjs[tile[0]][tile[1]].occupied = 0;
    }
    
    occupyTile(tile, obj){
        // console.log(tile);
        if(this.isOccupied(tile)){
            console.log("Error: tile at " + tile + " already occupied");
            return;
        }

        this.tileObjs[tile[0]][tile[1]].occupant = obj;
        this.tileObjs[tile[0]][tile[1]].occupied = 1;
    }

    isOccupied(tile){
        if(this.tileObjs[tile[0]][tile[1]].occupied == 1){
            return true;
        }

        return false;
    }

    isTraversable(tile){
        if(this.tileObjs[tile[0]][tile[1]].traversable == 0){
            return true;
        }

        return false;
    }
}

window.MapList = {
    Demo: {
        layout: [
            [0, 0, 0, 1, 1, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0],
            [1, 0, 0, 0, 1, 0],
            [1, 0, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 1, 0, 0, 0, 1],
            [0, 0, 0, 0, 1, 1]
        ],
        tileObjs: [
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0]
        ],
    }
}