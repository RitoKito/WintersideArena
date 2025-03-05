class GameObject{
    constructor(config) {
        this.tile = config.tile || [0, 0]
        this.x = convertTileToScreenPos(config.tile)[0] || 0;
        this.y = convertTileToScreenPos(config.tile)[1] || 0;
        this.sprite = new Sprite({
            gameObject: this,
            src: "" //config.src,
        });
    }

    move(newTile){
        this.tile = newTile;
        this.x = convertTileToScreenPos(this.tile)[0]
        this.y = convertTileToScreenPos(this.tile)[1]
    }
}

function convertTileToScreenPos(tile){
    return [tile[0]*100 + 10, tile[1]*100 + 30]; // + object offset
}