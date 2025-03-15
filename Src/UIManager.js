class UIManager {
    constructor(element){
        this.playerUnitIcon = element.querySelector(".player-unit-portrait");
        this.playerUnitStats = element.querySelector(".player-unit-stats");
        this.playerUnitHP = element.querySelector(".player-unit-hp");
        this.playerUnitAttack = element.querySelector(".player-unit-attack");
        this.playerUnitSpeed= element.querySelector(".player-unit-speed");
        this.playerUnitActions = element.querySelector(".player-unit-actions");

        this.aiUnitIcon = element.querySelector(".ai-unit-portrait");
        this.aiUnitStats = element.querySelector(".ai-unit-stats");
        this.aiUnitHP = element.querySelector(".ai-unit-hp");
        this.aiUnitAttack = element.querySelector(".ai-unit-attack");
        this.aiUnitSpeed= element.querySelector(".ai-unit-speed");
        this.aiUnitActions = element.querySelector(".ai-unit-actions");
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

    updatePlayerUI(char){
        this.playerUnitHP.textContent="HP: " + char.stats.currentHp + "/" + char.stats.maxHp;
        this.playerUnitAttack.textContent="Attack: " + char.stats.attack;
        this.playerUnitSpeed.textContent="Speed: " + char.stats.moveLen;
        this.playerUnitActions.textContent="Actions: " + char.stats.currentActions + "/" + char.stats.maxActions;
    }

    toggleAiIcon(state, unit){
        if(state == true){
            this.aiUnitIcon.src = "./img/portrait_placeholder.png";
            this.aiUnitIcon.style.visibility="visible";
        }
        else{
            this.aiUnitIcon.style.visibility="hidden";
        }
    }

    toggleAiUnitStats(state){
        if(state == true){
            this.aiUnitStats.style.visibility="visible";
        }
        else{
            this.aiUnitStats.style.visibility="hidden";
        }
    }

    showAiUI(state){
        if(state == true){
            this.toggleAiIcon(true);
            this.toggleAiUnitStats(true);
        }
        else{
            this.toggleAiIcon(false);
            this.toggleAiUnitStats(false);
        }
    }

    updateAiUI(unit){
        this.aiUnitHP.textContent="HP: " + unit.stats.currentHp + "/" + unit.stats.maxHp;
        this.aiUnitAttack.textContent="Attack: " + unit.stats.attack;
        this.aiUnitSpeed.textContent="Speed: " + unit.stats.moveLen;
        this.aiUnitActions.textContent="Actions: " + unit.stats.currentActions + "/" + unit.stats.maxActions;
    }
}