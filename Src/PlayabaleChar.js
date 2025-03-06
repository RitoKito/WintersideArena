class PlayableChar extends GameObject {
    constructor(config){
        super(config);
        this.tile = config.tile;
        this.stats = new CharStats({
            moveLen: config.moveLen,
        });
    }
}