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

            this.map.drawTileSheet(this.ctx);

            if(this.map.validTilesEnabled == 1){
                this.map.drawValidTiles(this.ctx);
            }

            // Render tileSelector
            if(this.tileSelector.enabled == 1){
                this.tileSelector.draw(this.ctx);
                this.uiManager.showPlayerUI(true);
            }else{
                // this.uiManager.showPlayerUI(false);
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

            // Select a tile occupied by playable character or switch to different character
            if(this.tileSelector.isEmpty() || !this.tileSelector.compare(this.map.tileObjs[x][y].occupant)){
                if(this.map.isOccupied([x, y])){

                    this.tileSelector.tileMove([x, y]);
                    this.tileSelector.enabled = 1;
                    this.tileSelector.selectObj(this.map.tileObjs[x][y].occupant, [x, y]);

                    let unit = this.tileSelector.selectedObj;

                    this.calculateValidTiles(x, y, unit);
                    this.uiManager.updateUnitStats(unit);
                }
            }
            // When character selected for an action
            // TODO move character to selected cell
            else{
                // If tile has been selected, clicking on it again will commit to action
                if(this.tileSelector.confirmationTile[0] == x && this.tileSelector.confirmationTile[1] == y
                    && !this.map.isSameTile(this.tileSelector.confirmationTile, this.tileSelector.selectedObj.tile)
                ){

                    this.map.freeTile(this.tileSelector.selectedTile);
                    this.map.occupyTile([x, y], this.tileSelector.selectedObj);

                    // Calculate movement distance
                    let yDist = Math.abs(this.tileSelector.selectedTile[0] - x);
                    let xDist = Math.abs(this.tileSelector.selectedTile[1] - y);
                    let totalTravelDist = xDist + yDist;
                    // Subtract 2 actions if moving double speed stat, otherwise subtract 1 action
                    if(totalTravelDist > this.tileSelector.selectedObj.stats.moveLen){
                        this.tileSelector.selectedObj.performAction(2);
                    }
                    else{
                        this.tileSelector.selectedObj.performAction(1);
                    }

                    this.tileSelector.selectedTile = this.tileSelector.confirmationTile;
                    this.tileSelector.selectedObj.tileMove([x,y]);
                    this.uiManager.updateUnitStats(this.tileSelector.selectedObj);
                    this.calculateValidTiles(x, y, this.tileSelector.selectedObj);

                    // this.tileSelector.deselectObj();
                    // this.tileSelector.enabled = 0;
                    // this.map.validTilesEnabled = 0;
                }
                // Select tile to move to and hightlight it
                else if(this.map.isTraversable([x,y]) && !this.map.isOccupied([x,y]) && this.map.isValidTile(x, y)){
                    this.tileSelector.confirmationTile = [x, y];
                    this.tileSelector.tileMove([x, y]);
                }
                // Deselect tile
                else{
                    this.tileSelector.deselectObj();
                    this.tileSelector.disable()
                    this.map.validTilesEnabled = 0;
                }
            }

        }.bind(this));

        // Initialize map
        this.map = new MapManager(window.MapList.Demo);
        this.tileSelector = new TileSelector({x: 0, y: 0});
        this.startGameLoop();


        // instantiate test character
        instPlayableUnit(
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

        instPlayableUnit(
            "char1", 
            {
                maxHp: 12,
                attack: 5,
                moveLen: 3,
                maxActions: 2,
            },
            [0,0], 
            this.map, 
            "img/Paladin_sketch_100.png");
    }

    calculateValidTiles(x, y, unit){
        this.map.validTilesEnabled = 1;
        let moveLen = unit.stats.moveLen * unit.stats.currentActions;
        this.map.validTiles.clear();
        this.map.validTiles.add(this.map.tileObjs[x][y]);
        this.map.getValidTiles(unit.tile[1] + 1, unit.tile[0], moveLen);
        this.map.getValidTiles(unit.tile[1] - 1, unit.tile[0], moveLen);
        this.map.getValidTiles(unit.tile[1], unit.tile[0] + 1, moveLen);
        this.map.getValidTiles(unit.tile[1], unit.tile[0] - 1, moveLen);
    }
}