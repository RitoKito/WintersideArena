class GameManager {
    constructor(config){
        this.turn = 0;
        this.activeTeam = config.activeTeam;

        this.playerUnits = config.playerUnits;
        this.aiUnits = config.aiUnits;
    }
}