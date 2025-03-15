class UnitStats {
    constructor(config){
        // this.shield = config.shield;
        this.maxHp = config.maxHp;
        this.currentHp = this.maxHp;
        this.attack = config.attack;
        this.moveLen = config.moveLen;
        this.maxActions = config.maxActions;
        this.currentActions = this.maxActions;
        // this.grenade = config.grenade;
        // this.ability = config.ability;
    }
}