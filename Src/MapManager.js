class MapManager {
    constructor(config){
        this.gameObjects = [];
        this.layout = config.layout;
        this.tileObjs = config.tileObjs;
        this.initTileObjs();
        this.showValidTiles = false;
        this.validTiles = new Set();
        // this.image = new Image();
        // this.image.src = "./img/SS1_Sketch.png"
        
        // this.lowerImage = new Image();
        // this.lowerImage.src = config.lowerSrc;

        // this.upperImage = new Image();
        // this.upperImageImage.src = config.upperSrc;
    }

    initTileObjs() {
        for(let i = 0; i < this.layout.length; i++){
            for(let j = 0; j < this.layout[i].length; j++){

                //TODO automated tile img 
                let tileImg = "./img/tileset/";

                switch(window.MapList.Demo.tileSprite[i][j]){
                    case 0:
                        tileImg += "NN_MM.png";
                        break;
                    case 1:
                        tileImg += "NN_TL.png";
                        break;
                    case 2:
                        tileImg += "NN_TR.png";
                        break;
                    case 3:
                        tileImg += "NN_BL.png";
                        break;    
                    case 4:
                        tileImg += "NN_BR.png";
                        break;    
                    case 5:
                        tileImg += "NN_ML.png";
                        break;
                    case 6:
                        tileImg += "NN_MR.png";
                        break;
                    case 7:
                        tileImg += "NN_TM.png";
                        break;    
                    case 8:
                        tileImg += "NN_BM.png";
                        break;    
                    case 9:
                        tileImg += "NN_wall.png";
                        break;
                };
                
                let traversable = 1;
                if(this.layout[i][j] == 0) { traversable = 0; }

                this.tileObjs[i][j] = new Tile({
                    name: "tile_"+i+"_"+j,
                    x: j*100,
                    y: i*100,
                    tilePos: [i,j],
                    traversable: traversable,
                    occupied: 0,
                    occupant: null,
                    src: tileImg
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
                tile.sprite.draw(ctx)
            })
        });

        // const x = this.gameObject.x;
        // const y = this.gameObject.y;
        // ctx.drawImage(this.image,
        //     0, 0,
        //     this.image.width, this.image.height,
        //     0, 0,
        //     700, 800
        // )
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
    
    isValidTile(tile){
        if(this.validTiles.has(this.tileObjs[tile[0]][tile[1]])){
            return true;
        }

        return false;
    }

    drawValidTiles(ctx){
        ctx.globalAlpha=0.75;
        this.validTiles.forEach(tile => {
            tile.drawValid(ctx)
        })
        ctx.globalAlpha=1;
    }

    //TODO cache valid tiles
    hideValidTiles(){
        this.showValidTiles = false;
        this.validTiles.clear();
    }

    freeTile(tile){
        this.tileObjs[tile[0]][tile[1]].occupant = null;
        this.tileObjs[tile[0]][tile[1]].occupied = 0;
    }
    
    occupyTile(tile, obj){
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

    isSameTile(tile1, tile2){
        if(tile1[0] == tile2[0] && tile1[1] == tile2[1]){
            return true;
        }

        return false;
    }
}

window.MapList = {
    Demo: {
        layout: [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ],
        tileSprite: [
            [1, 7, 7, 7, 7, 2],
            [5, 0, 0, 0, 9, 6],
            [5, 0, 0, 0, 0, 6],
            [5, 9, 9, 0, 0, 6],
            [5, 0, 0, 0, 0, 6],
            [5, 9, 0, 0, 9, 6],
            [5, 0, 9, 0, 0, 6],
            [3, 8, 8, 8, 8, 4],
        ],
        tileObjs: [
            [0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0, 0],
        ],
    }
}