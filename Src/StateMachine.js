function handleNoneSelectedState(y, x, gameManager){
    let unit = gameManager.map.tileObjs[y][x].occupant;

    if(unit != null){
        gameManager.tileSelector.selectUnit(unit);
        if(unit.isPlayerUnit()){
            playerRoundState = playerStates.SELECTED_UNIT;
            gameManager.map.calculateValidTiles(y, x);
            gameManager.uiManager.showPlayerUI(true, gameManager.tileSelector.playerUnit);
        }
        else{
            gameManager.uiManager.showAiUI(true, unit);
        }
    }
    else{
        gameManager.cancelSelection();
    }
}

function handlePlayerUnitSelectedState(y, x, gameManager){
    let unit = gameManager.map.tileObjs[y][x].occupant;

    if(unit != null){
        if(unit == gameManager.tileSelector.selectedUnit){
            gameManager.cancelSelection();
            playerRoundState = playerStates.NONE;
        }
        else{
            gameManager.tileSelector.selectUnit(unit);
            if(unit.isPlayerUnit()){
                gameManager.calculateValidTiles(y, x);
            }
            else{
                gameManager.uiManager.showAiUI(true, unit);
                playerRoundState = playerStates.SELECTED_AI_UNIT;
            }
        }
    }
    else{
        if(isValidTile(gameManager.map, [y, x])){
            gameManager.tileSelector.confirmationTile = [y, x];
            gameManager.tileSelector.tileMove([y, x]);
            
            let y1 = gameManager.tileSelector.playerUnit.tile[0];
            let x1 = gameManager.tileSelector.playerUnit.tile[1];
            let x2 = x;
            let y2 = y;
            gameManager.map.findValidPath(y1, x1, y2, x2);

            playerRoundState = playerStates.SELECTED_TILE;
        }
        else{
            arena.cancelSelection();
            playerRoundState = playerStates.NONE;
        }
    }
}

function handleGridTileSelectedState(y, x, gameManager){
    let unit = gameManager.map.tileObjs[y][x].occupant;

    if(unit != null){
        if(unit.isPlayerUnit()){
            if(unit == gameManager.tileSelector.playerUnit){
                arena.cancelSelection();
                playerRoundState = playerStates.NONE;
            }
            else{
                gameManager.tileSelector.selectUnit(unit);
                gameManager.calculateValidTiles(y, x, unit);
                playerRoundState = playerStates.SELECTED_UNIT;
            }
        }
        else{
            gameManager.tileSelector.selectUnit(unit);
            gameManager.map.hideValidTiles();
            gameManager.uiManager.showAiUI(true, unit);
            playerRoundState = playerStates.SELECTED_AI_UNIT;
        }
    }
    else if(isSameTile([y, x], gameManager.tileSelector.confirmationTile)){
        gameManager.moveUnit(y, x);
        gameManager.map.showValidPath = false;
    }
    else if(isValidTile(gameManager.map, [y, x])){
        gameManager.tileSelector.confirmationTile = [y, x];
        gameManager.tileSelector.tileMove([y, x]);

        let y1 = gameManager.tileSelector.playerUnit.tile[0];
        let x1 = gameManager.tileSelector.playerUnit.tile[1];
        let x2 = x;
        let y2 = y;
        gameManager.map.findValidPath(y1, x1, y2, x2);
    }
    else{
        gameManager.cancelSelection();
        playerRoundState = playerStates.NONE;
    }
}

function handleAIUnitSelectedState(y, x, gameManager){
    let unit = gameManager.map.tileObjs[y][x].occupant;

    if(unit == null){
        if(isValidTile(gameManager.map, [y, x])){
            gameManager.tileSelector.confirmationTile = [y, x];
            gameManager.tileSelector.tileMove([y, x]);

            playerRoundState = playerStates.SELECTED_TILE;
        }
        else{
            arena.cancelSelection();

            playerRoundState = playerStates.NONE
        }
    }
    else if(unit.isPlayerUnit() && unit != gameManager.tileSelector.playerUnit){
        gameManager.tileSelector.selectUnit(unit);
        gameManager.map.calculateValidTiles(y, x, unit);

        playerRoundState = playerStates.SELECTED_UNIT;
    }
    else if(unit.isPlayerUnit() && unit == gameManager.tileSelector.playerUnit){
        gameManager.cancelSelection();

        playerRoundState = playerStates.NONE;
    }
    else if(!unit.isPlayerUnit() && unit == gameManager.tileSelector.aiUnit){
        console.log("Combat");
        gameManager.cancelSelection();

        playerRoundState = playerStates.NONE
    }
}