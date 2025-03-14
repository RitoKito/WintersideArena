class PlayableChar extends GameObject {
    constructor(config){
        super(config);
        this.tile = config.tile;
        this.stats = new CharStats({
            maxHp: config.maxHp,
            attack: config.attack,
            moveLen: config.moveLen,
            maxActions: config.maxActions
        });
        this.portrait = new Image();
        this.portrait.src = "./img/portrait_placeholder.png";
        console.log(config);
    }

    drawPortrait(uiCtx){
        uiCtx.drawImage(this.portrait,
            0, 0,
            this.portrait.width, this.portrait.height,
            5, 5,
            90, 90
        )
    }
    
    performAction(actions){
        this.stats.currentActions -= actions;
    }
}