class Arena {
    constructor(config) {
        this.element = config.element;

        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.uiManager = new UIManager(this.element);

        // this.port = this.element.querySelector(".player-unit-portrait");
        // this.stats = this.element.querySelector(".player-unit-stats");

        // this.uiCanvas = this.element.querySelector(".ui-canvas");
        // this.uiCtx = this.uiCanvas.getContext("2d");

        this.map = null;
        this.tileSelector = null;
        // TODO create game state manager
    }

    startGameLoop() {
        const step = () => {
            console.log("Game is running");

            //Clean map canvas per step
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();


            //Clean UI canvas
            // this.uiCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // this.uiCtx.beginPath();

            this.map.drawTileSheet(this.ctx);

            if(this.map.validTilesEnabled == 1){
                this.map.drawValidTiles(this.ctx);
            }

            // Render tileSelector
            if(this.tileSelector.enabled == 1){
                this.tileSelector.draw(this.ctx);
                // this.tileSelector.selectedObj.drawPortrait(this.uiCtx);
                // this.tileSelector.selectedObj.drawStats(this.uiCtx);
                // console.log(this.port)

                // this.port.style.visibility="visible";
                // this.port.src = "./img/portrait_placeholder.png";
                // this.stats.style.visibility="visible";

                this.uiManager.showPlayerUI(true);
            }else{
                this.uiManager.showPlayerUI(false);
                // this.port.style.visibility="hidden";
                // this.stats.style.visibility="hidden";
            }

            // Render gameobjects, drawn last to be on top layer
            Object.values(this.map.gameObjects).forEach(object => {
                object.sprite.draw(this.ctx);
            })

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

                    let unit = this.tileSelector.selectedObj;
                    let moveLen = unit.stats.moveLen * unit.stats.currentActions;

                    this.map.validTiles.clear();
                    this.map.getValidTiles(unit.tile[1] + 1, unit.tile[0], moveLen);
                    this.map.getValidTiles(unit.tile[1] - 1, unit.tile[0], moveLen);
                    this.map.getValidTiles(unit.tile[1], unit.tile[0] + 1, moveLen);
                    this.map.getValidTiles(unit.tile[1], unit.tile[0] - 1, moveLen);
                    this.map.validTilesEnabled = 1;

                    this.uiManager.updateUnitStats(unit);
                }
            }
            // Move character or deselect by clicking on non-tranversable tile
            else{
                if(this.map.isTraversable([x,y]) && !this.map.isOccupied([x,y]) && this.map.isValidTile(x, y)){

                    this.map.freeTile(this.tileSelector.selectedTile);
                    this.map.occupyTile([x, y], this.tileSelector.selectedObj);

                    // Calculate movement distance
                    let yDist = Math.abs(this.tileSelector.selectedTile[0] - x);
                    let xDist = Math.abs(this.tileSelector.selectedTile[1] - y);
                    let totalTravelDist = xDist + yDist;
                    // Subtract 2 actions if making double move, otherwise subtract 1 action
                    if(totalTravelDist > this.tileSelector.selectedObj.stats.moveLen){
                        this.tileSelector.selectedObj.performAction(2);
                    }
                    else{
                        this.tileSelector.selectedObj.performAction(1);
                    }

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
            {
                maxHp: 12,
                attack: 5,
                moveLen: 3,
                maxActions: 2,
            },
            [1,0], 
            this.map, 
            "img/Paladin_sketch_100.png");

        // instPlayableChar(
        //     "char1", 
        //     {moveLen: 3,
        //      hp: 12,
        //     }, 
        //     [1,4],
        //     this.map, 
        //     "img/Paladin_sketch_100.png");

        // instPlayableChar(
        //     "char2", 
        //     {moveLen: 3}, 
        //     [1,2], 
        //     this.map, 
        //     "img/Paladin_sketch_100.png");
        // instPlayableChar("char1", [0,5], this.map.gameObjects, this.map);
        // instPlayableChar("char5", [0,4], this.map.gameObjects, this.map);
    }
}