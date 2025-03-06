class Arena {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
        this.tileSelector = null;
        // TODO create game state manager
    }

    startGameLoop() {
        const step = () => {
            console.log("Game is running");

            //Clean canvas per step
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.map.drawTileSheet(this.ctx);

            if(this.map.validTilesEnabled == 1){
                this.map.drawValidTiles(this.ctx);
            }
            
            // Render gameobjects
            Object.values(this.map.gameObjects).forEach(object => {
                object.sprite.draw(this.ctx);
            })

            // Render tileSelector
            if(this.tileSelector.enabled == 1){
                this.tileSelector.draw(this.ctx);
            }

            // Game loop at 60FPS
            requestAnimationFrame(() => {
                step();
            })
        }
    
        step();
    }

    init() {
        console.log("Arena init", this);
        this.canvas.addEventListener("click", function(event){ // TODO refactor into functions

            // Map screen coordinates to tiles
            // x and y are flipped to map array indices to intiuitive 2D axis
            let x = Math.trunc(event.offsetY/100);
            let y = Math.trunc(event.offsetX/100);
            // console.log(this.map.isValidTile([x,y]));

            // Select a tile occupied by playable character or switch to different tile
            if(this.tileSelector.isEmpty() || !this.tileSelector.compare(this.map.tileObjs[x][y].occupant)){
                if(this.map.isOccupied([x, y])){

                    this.tileSelector.tileMove([x, y]);
                    this.tileSelector.enabled = 1;
                    this.tileSelector.selectObj(this.map.tileObjs[x][y].occupant, [x, y]);

                    let char = this.tileSelector.selectedObj;

                    this.map.validTiles = new Set();
                    this.map.getValidTiles(char.tile[1] + 1, char.tile[0], char.stats.moveLen);
                    this.map.getValidTiles(char.tile[1] - 1, char.tile[0], char.stats.moveLen);
                    this.map.getValidTiles(char.tile[1], char.tile[0] + 1, char.stats.moveLen);
                    this.map.getValidTiles(char.tile[1], char.tile[0] - 1, char.stats.moveLen);
                    this.map.validTilesEnabled = 1;

                }
            }
            // Move character or deselect by clicking on non-tranversable tile
            else{
                if(this.map.isTraversable([x,y]) && !this.map.isOccupied([x,y]) && this.map.isValidTile(x, y)){
                        this.map.freeTile(this.tileSelector.selectedTile);
                        this.map.occupyTile([x, y], this.tileSelector.selectedObj);

                        this.tileSelector.selectedObj.tileMove([x,y]);
                }
                this.tileSelector.deselectObj();
                this.tileSelector.enabled = 0;
                this.map.validTilesEnabled = 0;
            }

        }.bind(this));

        // Initialize map
        this.map = new MapManager(window.MapList.Demo);
        this.tileSelector = new TileSelector({x: 0, y: 0});
        this.startGameLoop();


        // instantiate test character
        instPlayableChar(
            "char0", 
            {moveLen: 3}, 
            [0,0], 
            this.map, 
            "img/Paladin_sketch_100.png");

        instPlayableChar(
            "char1", 
            {moveLen: 3}, 
            [0,1], 
            this.map, 
            "img/Paladin_sketch_100.png");

        instPlayableChar(
            "char2", 
            {moveLen: 3}, 
            [0,2], 
            this.map, 
            "img/Paladin_sketch_100.png");
        // instPlayableChar("char1", [0,5], this.map.gameObjects, this.map);
        // instPlayableChar("char5", [0,4], this.map.gameObjects, this.map);
    }
}