class Arena {
    constructor(config) {
        this.element = config.element;

        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.uiManager = new UIManager(this.element);

        this.gameManager = new GameManager({})

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
            // console.log("Game is running");

            //Clean map canvas per step
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();

            this.map.drawTileSheet(this.ctx);

            if(this.map.showValidTiles){
                this.map.drawValidTiles(this.ctx);
            }

            // Render tileSelector
            if(this.tileSelector.enabled){
                this.tileSelector.draw(this.ctx);
            }else{
                // this.uiManager.showPlayerUI(false);
            }

            // Render gameobjects, drawn last to be on top layer
            // Object.values(this.map.gameObjects).forEach(object => {
            //     object.sprite.draw(this.ctx);
            // })

            Object.values(this.gameManager.gameObjects).forEach(object => {
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

        this.uiManager.showPlayerUI(false);

        document.addEventListener("onDeath", function(event){
            // this.tileSelector.aiUnit.die(); 
            // this.tileSelector.aiUnit = null;
            // this.selectedUnit = this.tileSelector.playerUnit;
            // this.uiManager.showAiUI(false);
        }.bind(this));

        this.canvas.addEventListener("click", function(event){ // TODO refactor into functions

            // Map screen coordinates to tiles
            // x and y are flipped to map array indices to intiuitive 2D axis
            let x = Math.trunc(event.offsetY/100);
            let y = Math.trunc(event.offsetX/100);
            let unit = this.map.tileObjs[x][y].occupant;

            // // Select a unit if none are selected or switch to different unit
            // if(!this.tileSelector.hasUnit() || !this.tileSelector.compareUnits(this.map.tileObjs[x][y].occupant)){
            //     this.selectUnit(x, y);
            // }
            // // If unit is selected
            // else{
            //     //If selected tile is free and clicked twice then move to that tile
            //     if(this.tileSelector.confirmationTile[0] == x && this.tileSelector.confirmationTile[1] == y
            //         && !this.map.isSameTile(this.tileSelector.confirmationTile, this.tileSelector.selectedUnit.tile)){
            //         this.moveUnit(x, y);
            //     }
            //     // Select tile to move to and hightlight it
            //     else if(this.map.isTraversable([x,y]) && !this.map.isOccupied([x,y]) && this.map.isValidTile(x, y)){
            //         this.tileSelector.confirmationTile = [x, y];
            //         this.tileSelector.tileMove([x, y]);
            //     }
            //     // Deselect tile
            //     else{
            //         this.tileSelector.deselectUnit();
            //         this.tileSelector.disable()
            //         this.map.hideValidTiles();
            //         this.uiManager.showAiUI(false);
            //     }
            // }

            this.handlePlayerRound(x, y, unit);

            console.log(playerRoundState);

1

        }.bind(this));

        // Initialize map
        this.map = new MapManager(window.MapList.Demo);
        this.tileSelector = new TileSelector({x: 0, y: 0});
        this.startGameLoop();


        // instantiate test character
        let char0 = this.gameManager.instPlayableUnit(
            0,
            "char0", 
            {
                maxHp: 12,
                moveLen: 3,
                maxActions: 999,
                weapon: new Weapon({
                    weaponName: "Claymore",
                    sprite: null,
                    attack: 5,
                    attackNumber: 3,
                    distance: 4,
                    hitChance: 65,
                }),
            },
            [1,0], 
            this.map, 
            "img/Paladin_sketch_100.png");

        let char2 = this.gameManager.instPlayableUnit(
            0,
            "char2", 
            {
                maxHp: 12,
                moveLen: 3,
                maxActions: 999,
                weapon: new Weapon({
                    weaponName: "Claymore",
                    sprite: null,
                    attack: 5,
                    attackNumber: 3,
                    distance: 4,
                    hitChance: 65,
                }),
            },
            [0,0], 
            this.map, 
            "img/Paladin_sketch_100.png");

        let char1 =  this.gameManager.instPlayableUnit(
            1,
            "char1", 
            {
                maxHp: 12,
                weapon: new Weapon({
                    weaponName: "Claymore",
                    sprite: null,
                    attack: 5,
                    attackNumber: 3,
                    distance: 4,
                    hitChance: 0.5,
                }),
                moveLen: 3,
                maxActions: 999,
            },
            [5,0], 
            this.map, 
            "img/Paladin_sketch_100.png");

        // this.tileSelector.selectUnit(this.gameManager.playerUnits[0]);
    }

    calculateValidTiles(x, y, unit){
        this.map.showValidTiles = true;

        // Clamp max action to 2 to avoid overload during testing
        let maxAction = 0;
        if(unit.stats.currentActions >= 2) { maxAction = 2; }
        else{ maxAction = unit.stats.currentActions; }

        let moveLen = unit.stats.moveLen * maxAction;
        this.map.validTiles.clear();
        this.map.validTiles.add(this.map.tileObjs[x][y]);
        this.map.getValidTiles(unit.tile[1] + 1, unit.tile[0], moveLen);
        this.map.getValidTiles(unit.tile[1] - 1, unit.tile[0], moveLen);
        this.map.getValidTiles(unit.tile[1], unit.tile[0] + 1, moveLen);
        this.map.getValidTiles(unit.tile[1], unit.tile[0] - 1, moveLen);
    }

    selectUnit(x, y){
        // this.tileSelector.tileMove([x, y]);

        this.tileSelector.selectedUnit = this.map.tileObjs[x][y].occupant;
        let unit = this.tileSelector.selectedUnit;

        if(unit.isPlayerUnit()){
            this.uiManager.updatePlayerUI(unit);
            this.calculateValidTiles(x, y, unit);
        }
        else{
            this.uiManager.updateAiUI(unit);
            this.uiManager.showAiUI(true, unit);
            this.map.hideValidTiles();
        }

        this.tileSelector.selectUnit(this.tileSelector.selectedUnit, this.tileSelector.selectedUnit.tile);
    }

    cancelSelection(){
        this.tileSelector.deselectUnit();
        this.tileSelector.disable()
        this.map.hideValidTiles();
        this.uiManager.showAiUI(false);
    }

    async moveUnit(x, y){
        this.map.freeTile(this.tileSelector.playerUnit.tile);
        this.map.occupyTile([x, y], this.tileSelector.playerUnit);
        
        await this.tileSelector.playerUnit.animateMove(x*100, y*100);

        // Calculate movement distance
        let yDist = Math.abs(this.tileSelector.playerUnit.tile[0] - x);
        let xDist = Math.abs(this.tileSelector.playerUnit.tile[1] - y);
        let totalTravelDist = xDist + yDist;
        // Subtract 2 actions if moving double speed stat, otherwise subtract 1 action
        if(totalTravelDist > this.tileSelector.playerUnit.stats.moveLen){
            this.tileSelector.playerUnit.performAction(2);
        }
        else{
            this.tileSelector.playerUnit.performAction(1);
        }

        this.tileSelector.playerUnit.tile = this.tileSelector.confirmationTile;
        this.tileSelector.playerUnit.tileMove([x,y]);
        this.uiManager.updatePlayerUI(this.tileSelector.playerUnit);
        this.calculateValidTiles(x, y, this.tileSelector.playerUnit);
    }

    handlePlayerRound(x, y, unit){
        switch(playerRoundState){
            case playerStates.NONE:
                if(unit != null){
                    this.tileSelector.selectUnit(unit);
                    if(unit.isPlayerUnit()){
                        playerRoundState = playerStates.SELECTED_UNIT;
                        this.calculateValidTiles(x, y, unit);
                        this.uiManager.showPlayerUI(true, unit);
                    }
                    else{
                        this.uiManager.showAiUI(true, unit);
                    }
                }
                else{
                    this.cancelSelection();
                }
                break;
            case playerStates.SELECTED_UNIT:
                if(unit != null){
                    if(unit == this.tileSelector.selectedUnit){
                        this.cancelSelection();
                        playerRoundState = playerStates.NONE;
                    }
                    else{
                        this.tileSelector.selectUnit(unit);
                        if(unit.isPlayerUnit()){
                            this.calculateValidTiles(x, y, unit);
                        }
                        else{
                            // this.map.hideValidTiles();
                            this.uiManager.showAiUI(true, unit);
                            playerRoundState = playerStates.SELECTED_AI_UNIT;
                        }
                    }
                }
                else{
                    if(this.map.isValidTile([x, y])){
                        this.tileSelector.confirmationTile = [x, y];
                        this.tileSelector.tileMove([x, y]);
                        playerRoundState = playerStates.SELECTED_TILE;
                    }
                    else{
                        this.cancelSelection();
                        playerRoundState = playerStates.NONE;
                    }
                }
                break;
            case playerStates.SELECTED_TILE:
                if(unit != null){
                    // this.tileSelector.selectUnit(unit);
                    // playerRoundState = playerStates.SELECTED_AI_UNIT;
                    if(unit.isPlayerUnit()){
                        if(unit == this.tileSelector.playerUnit){
                            this.cancelSelection();
                            playerRoundState = playerStates.NONE;
                        }
                        else{
                            this.tileSelector.selectUnit(unit);
                            this.calculateValidTiles(x, y, unit);
                            playerRoundState = playerStates.SELECTED_UNIT;
                        }
                    }
                    else{
                        this.tileSelector.selectUnit(unit);
                        // this.map.hideValidTiles();
                        this.uiManager.showAiUI(true, unit);
                        playerRoundState = playerStates.SELECTED_AI_UNIT;
                    }
                }
                else if(isSameTile([x, y], this.tileSelector.confirmationTile)){
                    this.moveUnit(x, y);
                    console.log("move");
                }
                else if(this.map.isValidTile([x, y])){
                    this.tileSelector.confirmationTile = [x, y];
                    this.tileSelector.tileMove([x, y]);
                }
                else{
                    this.cancelSelection();
                    playerRoundState = playerStates.NONE;
                }
                break;
            case playerStates.SELECTED_AI_UNIT:
                console.log(unit);
                if(unit == null){
                    if(this.map.isValidTile([x, y])){
                        this.tileSelector.confirmationTile = [x, y];
                        this.tileSelector.tileMove([x, y]);
                        playerRoundState = playerStates.SELECTED_TILE;
                    }
                    else{
                        this.cancelSelection();
                        playerRoundState = playerStates.NONE
                    }
                }
                else if(unit.isPlayerUnit() && unit != this.tileSelector.playerUnit){
                    this.tileSelector.selectUnit(unit);
                    this.calculateValidTiles(x, y, unit);
                    playerRoundState = playerStates.SELECTED_UNIT;
                }
                else if(unit.isPlayerUnit() && unit == this.tileSelector.playerUnit){
                    this.cancelSelection();
                    playerRoundState = playerStates.NONE;
                }
                else if(!unit.isPlayerUnit() && unit == this.tileSelector.aiUnit){
                    console.log("Combat");
                    this.cancelSelection();
                    playerRoundState = playerStates.NONE
                }

                break;
        }
    }
}