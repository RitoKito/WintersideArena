class Weapon{
    constructor(config){
        this.weaponName = config.weaponName;
        this.sprite = config.sprite;
        this.attack = config.attack;
        this.attackNumber = config.attackNumber;
        this.distance = config.distance;
        this.hitChance = config.hitChance;
    }
}