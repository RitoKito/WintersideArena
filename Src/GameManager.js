class GameManager {
    constructor(config){
        this.tileSelector = config.tileSelector;

        this.turn = 0;
        this.activeTeam = config.activeTeam;

        this.gameObjects = [];
        this.playerUnits = [];
        this.aiUnits = [];
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
}