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

            if(this.map.showValidPath){
                this.map.drawValidPath(this.ctx);
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
            let y = Math.trunc(event.offsetY/100);
            let x = Math.trunc(event.offsetX/100);
            let unit = this.map.tileObjs[y][x].occupant;

            this.handlePlayerRound(y, x, unit);

            // console.log(playerRoundState);

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

    calculateValidTiles(y, x, unit){
        this.map.showValidTiles = true;

        // Clamp max action to 2 to avoid overload during testing
        let maxAction = 0;
        if(unit.stats.currentActions >= 2) { maxAction = 2; }
        else{ maxAction = unit.stats.currentActions; }

        let moveLen = unit.stats.moveLen * maxAction;
        this.map.validTiles.clear();
        this.map.validTiles.add(this.map.tileObjs[y][x]);
        this.map.getValidTiles(unit.tile[0] + 1, unit.tile[1], moveLen);
        this.map.getValidTiles(unit.tile[0] - 1, unit.tile[1], moveLen);
        this.map.getValidTiles(unit.tile[0], unit.tile[1] + 1, moveLen);
        this.map.getValidTiles(unit.tile[0], unit.tile[1] - 1, moveLen);
    }

    selectUnit(y, x){
        // this.tileSelector.tileMove([x, y]);

        this.tileSelector.selectedUnit = this.map.tileObjs[x][y].occupant;
        let unit = this.tileSelector.selectedUnit;

        if(unit.isPlayerUnit()){
            this.uiManager.updatePlayerUI(unit);
            this.calculateValidTiles(y, x, unit);
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

    async moveUnit(y, x){
        this.map.freeTile(this.tileSelector.playerUnit.tile);
        this.map.occupyTile([y, x], this.tileSelector.playerUnit);
        
        await this.tileSelector.playerUnit.animateMove(y*100, x*100);

        // Calculate movement distance
        let yDist = Math.abs(this.tileSelector.playerUnit.tile[0] - y);
        let xDist = Math.abs(this.tileSelector.playerUnit.tile[1] - x);
        let totalTravelDist = xDist + yDist;
        // Subtract 2 actions if moving double speed stat, otherwise subtract 1 action
        if(totalTravelDist > this.tileSelector.playerUnit.stats.moveLen){
            this.tileSelector.playerUnit.performAction(2);
        }
        else{
            this.tileSelector.playerUnit.performAction(1);
        }

        this.tileSelector.playerUnit.tile = this.tileSelector.confirmationTile;
        this.tileSelector.playerUnit.tileMove([y, x]);
        this.uiManager.updatePlayerUI(this.tileSelector.playerUnit);
        this.calculateValidTiles(y, x, this.tileSelector.playerUnit);
    }

    handlePlayerRound(y, x, unit){
        switch(playerRoundState){
            case playerStates.NONE:
                handleNoneSelectedState(y, x, this, unit, this.tileSelector, this.uiManager);
                break;

            case playerStates.SELECTED_UNIT:
                handlePlayerUnitSelectedState(y, x, this.map, this, unit, this.tileSelector, this.uiManager);
                break;
            case playerStates.SELECTED_TILE:
                handleGridTileSelectedState(y, x, unit, this.map, this, this.tileSelector, this.uiManager)
                break;
            case playerStates.SELECTED_AI_UNIT:
                // console.log(unit);
                // if(unit == null){
                //     if(isValidTile(this.map, [y, x])){
                //         this.tileSelector.confirmationTile = [y, x];
                //         this.tileSelector.tileMove([y, x]);
                //         playerRoundState = playerStates.SELECTED_TILE;
                //     }
                //     else{
                //         this.cancelSelection();
                //         playerRoundState = playerStates.NONE
                //     }
                // }
                // else if(unit.isPlayerUnit() && unit != this.tileSelector.playerUnit){
                //     this.tileSelector.selectUnit(unit);
                //     this.calculateValidTiles(y, x, unit);
                //     playerRoundState = playerStates.SELECTED_UNIT;
                // }
                // else if(unit.isPlayerUnit() && unit == this.tileSelector.playerUnit){
                //     this.cancelSelection();
                //     playerRoundState = playerStates.NONE;
                // }
                // else if(!unit.isPlayerUnit() && unit == this.tileSelector.aiUnit){
                //     console.log("Combat");
                //     this.cancelSelection();
                //     playerRoundState = playerStates.NONE
                // }
                handleAIUnitSelectedState(y, x, unit, this.map, this, this.tileSelector, this.uiManager)
                break;
        }
    }
}