class Arena {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
        this.tileSelector = new TileSelector({x: 0, y: 0});
    }

    startGameLoop() {
        const step = () => {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clean canvas
            this.ctx.beginPath();
            console.log("game is running");
            this.map.drawTileSheet(this.ctx);
            
            Object.values(this.map.gameObjects).forEach(objects => {
                objects.sprite.draw(this.ctx);
            })    

            if(this.tileSelector.enabled == 1){
                this.tileSelector.drawSelector(this.ctx);
            }

            requestAnimationFrame(() => {
                step();
            })
        }
    
        step();
    }

    init() {
        console.log("Arena init", this);
        this.canvas.addEventListener("click", function(event){

            let x = Math.trunc(event.offsetY/100);
            let y = Math.trunc(event.offsetX/100);
            console.log("Click on: " + x + ":" + y);
            console.log(this.map.tileObjs[x][y].occupied);

            if(this.tileSelector.selectedObj == null){
                if(this.map.tileObjs[x][y].occupied == 1 && this.tileSelector.selectedObject == null){
                    this.tileSelector.move(y*100, x*100);
                    this.tileSelector.selectObj(this.map.tileObjs[x][y].occupant, [x, y]);
                }
            }
            else{
                if(this.tileSelector.enabled == 1 && this.tileSelector.selectedObj != null){
                    if(this.map.tileObjs[x][y].traversable == 0 && this.map.tileObjs[x][y].occupied == 0){
                        this.freeTile(this.tileSelector.selectedTile);
                        this.occupyTile([x, y], this.tileSelector.selectedObj);

                        this.tileSelector.selectedObj.move([x,y]);
                        this.tileSelector.disselectObj();
                    }
                    else{
                        this.tileSelector.disselectObj();
                    }
                }
            }

        }.bind(this));

        this.map = new ArenaMap(window.MapList.Demo);
        this.startGameLoop();

        // this.map.gameObjects = Object.assign({char: 
        //     new GameObject({
        //         tile: [0, 0]
        //     })
        // }, this.map.gameObjects);

        // this.instantiateObject(0, 0);

        Object.values(this.map.gameObjects).forEach(obj => {
            this.occupyTile(obj.tile, obj);
        })

    
    }

    // instantiateObject(tilePosX, tilePosY, name){
    //     let newObj = new GameObject({
    //         tile: [tilePosX, tilePosY]
    //     })

    //     this.map.gameObjects = {...this.map.gameObjects, char: new GameObject({name: [tilePosX, tilePosY]})};
        

    //     this.map.tileObjs[tilePosX][tilePosY].occupied = 1;
    //     this.map.tileObjs[tilePosX][tilePosY].occupant = newObj
    //     console.log(this.map.tileObjs);
    // }

    freeTile(tile){
        this.map.tileObjs[tile[0]][tile[1]].occupant = null;
        this.map.tileObjs[tile[0]][tile[1]].occupied = 0;
    }
    
    occupyTile(tile, obj){
        console.log(tile);
        this.map.tileObjs[tile[0]][tile[1]].occupant = obj;
        this.map.tileObjs[tile[0]][tile[1]].occupied = 1;
    }
}






        /*
        const image = new Image();
        image.onload = () => {
            this.ctx.drawImage(image, 0, 0)
        };
        image.src = "";
        */

        // Background placeholder
        // this.ctx.fillStyle = "#DAF7A6";
        // this.ctx.fillRect(0, 0, 600, 800);
        // this.ctx.stroke();


        // this.ctx.fillStyle = "#fff";
        // let arenaTiles = [
        //     [0, 0, 0, 1, 0, 0],
        //     [0, 0, 0, 0, 0, 0],
        //     [0, 1, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 1, 0],
        //     [0, 0, 0, 0, 0, 0],
        //     [0, 0, 1, 0, 1, 0],
        //     [0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 0, 0, 0]
        // ];


        // const char = new GameObject({
        //     // x: convertTileToScreenPos([0,5])[0],
        //     // y: convertTileToScreenPos([0,5])[1],
        //     tile: [0, 0]
        // })

        // char.sprite.draw(this.ctx);