class GameObject{
    constructor(config) {
        this.name = config.name;
        this.x = config.x;
        this.y = config.y;
        this.renderX = this.x;
        this.renderY = this.y;
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,
        });
    }

    pixelMove(x, y){
        this.x = x;
        this.y = y;
    }

    tileMove(tile){
        this.tile = tile;
        this.x = tile[1]*100;
        this.y = tile[0]*100;
    }
}

