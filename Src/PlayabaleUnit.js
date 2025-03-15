class PlayableUnit extends GameObject {
    constructor(config){
        super(config);
        this.team = config.team;
        this.tile = config.tile;
        this.stats = new UnitStats({
            maxHp: config.maxHp,
            attack: config.attack,
            moveLen: config.moveLen,
            maxActions: config.maxActions
        });
        this.portrait = new Image();
        this.portrait.src = "./img/portrait_placeholder.png";
        this.team = config.team;
        this.animationQueue = new Set();
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

    isPlayerUnit(){
        if(this.team == 0) {
            return true;
        }

        return false;
    }

    animateMove(x, y){
        const moveAnimation = setInterval(() => {

            let increment = 10;

            if(x > this.renderY){
                this.renderY += increment;
            }
            else if(x < this.renderY){
                this.renderY -= increment;
            }

            if(y > this.renderX){
                this.renderX += increment;
            }
            else if(y < this.renderX){
                this.renderX -= increment;
            }
            if(x == this.renderY
                && y == this.renderX){
                    clearInterval(moveAnimation);
                }
        }, 1);

        this.animationQueue.add(moveAnimation);
    }
}