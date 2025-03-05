class ArenaMap {
    constructor(config){
        this.gameObjects = config.gameObjects;
        this.layout = config.layout;
        this.tileObjs = config.tileObjs;
        this.initTileObjs();
        
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



    drawTileSheet(ctx){ // for testing purposes
        let posX = 0;
        let posY = 0;

        for(let i = 0; i < this.tileObjs.length; i++){
            for(let j = 0; j < this.tileObjs[i].length; j++){
                if(this.tileObjs[i][j].traversable == 0){
                    ctx.fillStyle = "#fff";
                }
                else if(this.tileObjs[i][j].traversable == 1){
                    ctx.fillStyle = "black";
                }

                ctx.fillRect(posX, posY, 100, 100);
                ctx.stroke();
                posX += 100;
            }
            posX = 0
            posY += 100;
        }
    }
}

window.MapList = {
    Demo: {
        layout: [
            [0, 0, 0, 1, 1, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0],
            [1, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 1, 0, 0, 0, 1],
            [0, 0, 0, 0, 1, 1]
        ],
        gameObjects: {
            testChar0: new GameObject({
                tile: [0,0]
            }),
            testChar1: new GameObject({
                tile: [0,1]
            }),
            testChar2: new GameObject({
                tile: [0,2]
            })
        },
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