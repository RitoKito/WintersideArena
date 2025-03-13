class UIManager {
    constructor(element){
        this.playerUnitIcon = element.querySelector(".player-unit-portrait");
        this.playerUnitStats = element.querySelector(".player-unit-stats");
        this.playerUnitHP = element.querySelector(".player-unit-hp");
        this.playerUnitAttack = element.querySelector(".player-unit-attack");
        this.playerUnitSpeed= element.querySelector(".player-unit-speed");
        this.playerUnitActions = element.querySelector(".player-unit-actions");
    }


    togglePlayerIcon(state, unit){
        if(state == true){
            this.playerUnitIcon.src = "./img/portrait_placeholder.png";
            this.playerUnitIcon.style.visibility="visible";
        }
        else{
            this.playerUnitIcon.style.visibility="hidden";
        }
    }

    togglePlayerUnitStats(state){
        if(state == true){
            this.playerUnitStats.style.visibility="visible";
        }
        else{
            this.playerUnitStats.style.visibility="hidden";
        }
    }

    showPlayerUI(state){
        if(state == true){
            this.togglePlayerIcon(true);
            this.togglePlayerUnitStats(true);
        }
        else{
            this.togglePlayerIcon(false);
            this.togglePlayerUnitStats(false);
        }
    }

    updateUnitStats(char){
        this.playerUnitHP.textContent="HP: " + char.stats.currentHp + "/" + char.stats.maxHp;
        this.playerUnitAttack.textContent="Attack: " + char.stats.attack;
        this.playerUnitSpeed.textContent="Speed: " + char.stats.moveLen;
        this.playerUnitActions.textContent="Actions: " + char.stats.currentActions + "/" + char.stats.maxActions;
    }
}