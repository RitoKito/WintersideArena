class MapManager {
    constructor(config){
        this.gameObjects = [];
        this.layout = config.layout;
        this.tileObjs = config.tileObjs;
        this.initTileObjs();
        this.showValidTiles = false;
        this.showValidPath = false;
        this.validTiles = new Set();
        this.pathList = [];

        
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
                    y: i*100,
                    x: j*100,
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
    getValidTiles(y, x , moveLen){
        if(y < 0 || x < 0 || x >= this.tileObjs[0].length || y >= this.tileObjs.length) {
             return; 
        }

        let tile = this.tileObjs[y][x];

        if(tile.traversable == 1 || tile.occupied || moveLen <= 0){
            return;
        }

        this.validTiles.add(this.tileObjs[y][x]);

        this.getValidTiles(y + 1, x, moveLen - 1, this.validTiles);
        this.getValidTiles(y - 1, x, moveLen - 1, this.validTiles);
        this.getValidTiles(y, x + 1, moveLen - 1, this.validTiles);
        this.getValidTiles(y, x - 1, moveLen - 1, this.validTiles);
    }

    findValidPath(y1, x1, y2, x2){
        let origin = this.tileObjs[y1][x1];
        let destination = this.tileObjs[y2][x2];
        let i = 0;
        let processed = new Set();
        let unprocessed = new Set();

        let current = origin;
        current.parent = null;
        unprocessed.add(current);


        while(unprocessed.size > 0){
            if(current == destination){
                console.log("found destinatuion")
                break;
            }

            let up = null;
            let down = null;
            let left = null;
            let right = null;

            current.getFCost(origin, destination)

            if(isInBounds(this, [y1 - 1, x1])){
                up = this.tileObjs[y1 - 1][x1];
                if(isValidTile(this, up.tilePos) && !processed.has(up) && !unprocessed.has(up)){
                    up.getFCost(origin, destination);
                    up.parent = current;
                    unprocessed.add(up);
                }
            }

            if(isInBounds(this, [y1 + 1, x1])){
                down = this.tileObjs[y1 + 1][x1];

                if(isValidTile(this, down.tilePos) && !processed.has(down) && !unprocessed.has(down)){
                    down.getFCost(origin, destination);
                    down.parent = current;
                    unprocessed.add(down);
                }
            }

            if(isInBounds(this, [y1, x1 - 1])){
                left = this.tileObjs[y1][x1 - 1];
                if(isValidTile(this, left.tilePos) && !processed.has(left) && !unprocessed.has(left)){
                    left.getFCost(origin, destination);
                    left.parent = current;
                    unprocessed.add(left);
                }
            }

            if(isInBounds(this, [y1, x1 + 1])){
                right = this.tileObjs[y1][x1 + 1];
                if(isValidTile(this, right.tilePos) && !processed.has(right) && !unprocessed.has(right)){
                    right.getFCost(origin, destination);
                    right.parent = current;
                    unprocessed.add(right);
                }
            }

            processed.add(current);
            unprocessed.delete(current);

            let bestSuccessor = unprocessed.values().next().value;;
            unprocessed.forEach(tile => {
                if(tile.fCost < bestSuccessor.fCost || 
                tile.fCost == bestSuccessor.fCost && tile.hCost <= bestSuccessor.hCost)
                {
                    bestSuccessor = tile;
                }
            })

            current = bestSuccessor;
            y1 = current.tilePos[0];
            x1 = current.tilePos[1];
            i++;
        }

        // console.log(processed)
        // let tile = Array.from(processed).pop();
        // while(tile != null){
        //     console.log(tile);
        //     tile = tile.parent;
        // }
    }

    // retracePath(closedList){
    //     if()
    // }

    drawValidPath(ctx){
        ctx.globalAlpha=0.75;
        this.pathList[0].forEach(tile => {
            // console.log(this.pathList[0])
            tile.drawValid(ctx)
        })
        ctx.globalAlpha=1;
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
        if(isOccupied(this, tile)){
            console.log("Error: tile at " + tile + " already occupied");
            return;
        }

        this.tileObjs[tile[0]][tile[1]].occupant = obj;
        this.tileObjs[tile[0]][tile[1]].occupied = 1;
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