class Arena {
    constructor(config) {
        this.element = config.element;

        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");

       

        this.map = null;
        this.tileSelector = null;
        // TODO create game state manager
    }

    startGameLoop() {
        const step = () => {
            // console.log("Game is running");

            //Clean map canvas per step
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();

            this.map.drawTileSheet(this.ctx);

            if(this.map.showValidTiles){
                this.map.drawValidTiles(this.ctx);
            }

            if(this.map.showValidPath){
                this.map.drawValidPath(this.ctx);
            }

            // Render tileSelector
            if(this.tileSelector.enabled){
                this.tileSelector.draw(this.ctx);
            }else{
                // this.uiManager.showPlayerUI(false);
            }

            // Render gameobjects, drawn last to be on top layer
            // Object.values(this.map.gameObjects).forEach(object => {
            //     object.sprite.draw(this.ctx);
            // })

            Object.values(this.gameManager.gameObjects).forEach(object => {
                object.sprite.draw(this.ctx);
            })

            // Game loop at 60FPS
            requestAnimationFrame(() => {
                step();
            })
        }
    
        step();
    }

    init() {
        console.log("Arena init", this);
                // Initialize map
        this.uiManager = new UIManager(this.element);

        this.map = new MapManager(window.MapList.Demo);
        this.tileSelector = new TileSelector({x: 0, y: 0});

        this.gameManager = new GameManager({
            map: this.map,
            uiManager: this.uiManager,
            tileSelector: this.tileSelector,
        })

        this.uiManager.showPlayerUI(false);

        document.addEventListener("onDeath", function(event){
            // this.tileSelector.aiUnit.die(); 
            // this.tileSelector.aiUnit = null;
            // this.selectedUnit = this.tileSelector.playerUnit;
            // this.uiManager.showAiUI(false);
        }.bind(this));

        this.canvas.addEventListener("click", function(event){ // TODO refactor into functions

            // Map screen coordinates to tiles
            // x and y are flipped to map array indices to intiuitive 2D axis
            let y = Math.trunc(event.offsetY/100);
            let x = Math.trunc(event.offsetX/100);
            // let unit = this.map.tileObjs[y][x].occupant;

            this.handlePlayerRound(y, x);

            // console.log(playerRoundState);

        }.bind(this));

        this.startGameLoop();
        
        // instantiate test character
        let char0 = this.gameManager.instPlayableUnit(
            0,
            "char0", 
            {
                maxHp: 12,
                moveLen: 3,
                maxActions: 999,
                weapon: new Weapon({
                    weaponName: "Claymore",
                    sprite: null,
                    attack: 5,
                    attackNumber: 3,
                    distance: 4,
                    hitChance: 65,
                }),
            },
            [1,0], 
            this.map, 
            "img/Paladin_sketch_100.png");

        let char2 = this.gameManager.instPlayableUnit(
            0,
            "char2", 
            {
                maxHp: 12,
                moveLen: 3,
                maxActions: 999,
                weapon: new Weapon({
                    weaponName: "Claymore",
                    sprite: null,
                    attack: 5,
                    attackNumber: 3,
                    distance: 4,
                    hitChance: 65,
                }),
            },
            [0,0], 
            this.map, 
            "img/Paladin_sketch_100.png");

        let char1 =  this.gameManager.instPlayableUnit(
            1,
            "char1", 
            {
                maxHp: 12,
                weapon: new Weapon({
                    weaponName: "Claymore",
                    sprite: null,
                    attack: 5,
                    attackNumber: 3,
                    distance: 4,
                    hitChance: 0.5,
                }),
                moveLen: 3,
                maxActions: 999,
            },
            [5,0], 
            this.map, 
            "img/Paladin_sketch_100.png");

    }

    handlePlayerRound(y, x){
        switch(playerRoundState){
            case playerStates.NONE:
                handleNoneSelectedState(y, x, this.gameManager);
                break;
            case playerStates.SELECTED_UNIT:
                handlePlayerUnitSelectedState(y, x, this.gameManager);
                break;
            case playerStates.SELECTED_TILE:
                handleGridTileSelectedState(y, x, this.gameManager)
                break;
            case playerStates.SELECTED_AI_UNIT:
                handleAIUnitSelectedState(y, x, this.gameManager)
                break;
        }
    }
}