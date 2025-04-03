class GameManager {
    constructor(config){
        this.tileSelector = config.tileSelector;

        // Turn counter
        this.turn = 0;
        // Phase 0 -> Player Phase; Phase 1 -> AI Phase
        this.phase = 0;
        // this.activeTeam = config.activeTeam;

        this.map = config.map;
        this.uiManager = config.uiManager;
        this.tileSelector = config.tileSelector;

        // Array of all game objects
        this.gameObjects = [];

        // Array of player units
        this.playerUnits = [];
        // Array of eliminated player units
        this.elimPlayerUnits = [];

        // Array of ai units
        this.aiUnits = [];
        // Array of elimited ai units
        this.elimAiUnits = [];

        this.playerControlAllowed = true;
    }

    instPlayableUnit(team, name, stats, tile, mapManager, imgPath){
        if(isOccupied(mapManager, tile) || !isTraversable(mapManager, tile)){
            console.log("Failed to instantiate " + name + " at " + tile + "; Aborting");
            return;
        }
    
        let unit = new PlayableUnit({
            team: team,
            name: name,
            maxHp: stats.maxHp,
            maxActions: stats.maxActions,
            weapon: stats.weapon,
            moveLen: stats.moveLen,
            x: tile[1]*100,
            y: tile[0]*100,
            tile: tile,
            src: imgPath
        });
    
        // mapManager.gameObjects.push(character);
        this.gameObjects.push(unit);
        mapManager.occupyTile(unit.tile, unit);
    
        if(team == 0){
            this.playerUnits.push(unit);
        }
        else{
            this.aiUnits.push(unit);
        }

        console.log(this.gameObjects);
    
        return unit;
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

    cancelSelection(_callback){
        // this.playerControlAllowed = false;

        this.map.hideValidTiles();
        this.uiManager.showAiUI(false);
        this.tileSelector.deselectUnit();
        this.tileSelector.disable();

        // _callback to prevents state change before the animation is completed
        this.tileSelector.playerUnit.animateRevertToOrigin(function() {
            if(_callback){
                _callback();
            }
        });
    }

    moveUnit(y, x){
        this.map.freeTile(this.tileSelector.playerUnit.tile);
        this.map.occupyTile([y, x], this.tileSelector.playerUnit);
        
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
        this.map.calculateValidTiles(y, x, this.tileSelector.playerUnit);
    }
}