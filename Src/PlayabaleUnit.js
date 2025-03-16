class PlayableUnit extends GameObject {
    constructor(config){
        super(config);
        this.team = config.team;
        this.tile = config.tile;
        this.stats = new UnitStats({
            maxHp: config.maxHp,
            moveLen: config.moveLen,
            maxActions: config.maxActions
        });
        this.weapon = config.weapon;
        this.portrait = new Image();
        this.portrait.src = "./img/portrait_placeholder.png";
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
                    console.log("cancel");
                    clearInterval(moveAnimation);
                }
        }, 1);
    }

    takeDamage(damage){
        this.stats.currentHp -= damage;

        if(this.stats.currentHp <= 0){
            emitEvent(this.name, "onDeath");
        }
    }

    dealDamage(unit){
        let successfulAttacks = 0;
        let min = Math.ceil(0);
        let max = Math.floor(this.weapon.hitChance);
        for(let i = this.weapon.attackNumber; i > 0; i--){
            let chance =  Math.floor(Math.random() * (max - min + 1) + min);
            console.log(chance);
            if(chance){
                successfulAttacks++;
            }
        }

        unit.takeDamage(this.weapon.attack * successfulAttacks);
    }
}