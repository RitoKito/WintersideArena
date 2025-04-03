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
        this.currentAnimation = null;
        this.animationSpeed = 6;
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

    animateMove(tileArray, _callback){
        // console.log(tileArray[0].y);
        this.cancelCurrentAnimation();

        let tileCounter = 1;
        let increment = this.animationSpeed;

        const moveAnimation = setInterval(() => {
            let targetY = tileArray[tileCounter].y;
            let targetX = tileArray[tileCounter].x;

            if(targetY > this.renderY){
                if(this.renderY + increment > targetY){
                    this.renderY = targetY;
                }
                else{
                    this.renderY += increment;
                }
            }
            else if(targetY < this.renderY){
                if(this.renderY - increment < targetY){
                    this.renderY = targetY;
                }
                else{
                    this.renderY -= increment;
                }
            }

            if(targetX > this.renderX){
                if(this.renderX + increment > targetX){
                    this.renderX = targetX;
                }
                else{
                    this.renderX += increment;
                }
            }
            else if(targetX < this.renderX){
                if(this.renderX - increment < targetX){
                    this.renderX = targetX;
                }
                else{
                    this.renderX -= increment;
                }
            }

            if(targetY == this.renderY
                && targetX == this.renderX){
                    tileCounter += 1;

                    if(tileCounter >= tileArray.length){
                        clearInterval(moveAnimation);
                        if(_callback){
                            _callback();
                        }        
                    }
                }
        }, 1);

        this.currentAnimation = moveAnimation;
    }

    animateRevertToOrigin(_callback){
        // console.log(tileArray[0].y);
        this.cancelCurrentAnimation();

        let increment = this.animationSpeed;

        const moveAnimation = setInterval(() => {
            let targetY = this.y;
            let targetX = this.x;

            if(targetY > this.renderY){
                if(this.renderY + increment > targetY){
                    this.renderY = targetY;
                }
                else{
                    this.renderY += increment;
                }
            }
            else if(targetY < this.renderY){
                if(this.renderY - increment < targetY){
                    this.renderY = targetY;
                }
                else{
                    this.renderY -= increment;
                }
            }

            if(targetX > this.renderX){
                if(this.renderX + increment > targetX){
                    this.renderX = targetX;
                }
                else{
                    this.renderX += increment;
                }
            }
            else if(targetX < this.renderX){
                if(this.renderX - increment < targetX){
                    this.renderX = targetX;
                }
                else{
                    this.renderX -= increment;
                }
            }

            if(targetY == this.renderY
                && targetX == this.renderX){
                    clearInterval(moveAnimation);
                    if(_callback){
                        _callback();
                    }        
                }
        }, 1);

        this.currentAnimation = moveAnimation;
    }

    cancelCurrentAnimation(){
        clearInterval(this.currentAnimation);
    }

    takeDamage(damage){
        this.stats.currentHp -= damage;

        if(this.stats.currentHp <= 0){
            emitEvent(this, "onDeath");
        }
    }

    unitDeath(){
        console.log("Unit " + this.name + " has fallen")
    }

    dealDamage(unit){
        console.log(unit);
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