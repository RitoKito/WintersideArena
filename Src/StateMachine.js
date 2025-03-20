function handleNoneSelectedState(y, x, arena, unit, tileSelector, uiManager){
    if(unit != null){
        tileSelector.selectUnit(unit);
        if(unit.isPlayerUnit()){
            playerRoundState = playerStates.SELECTED_UNIT;
            arena.calculateValidTiles(y, x, unit);
            uiManager.showPlayerUI(true, unit);
        }
        else{
            uiManager.showAiUI(true, unit);
        }
    }
    else{
        arena.cancelSelection();
    }
}

function handlePlayerUnitSelectedState(y, x, map, arena, unit, tileSelector, uiManager){
    if(unit != null){
        if(unit == tileSelector.selectedUnit){
            arena.cancelSelection();
            playerRoundState = playerStates.NONE;
        }
        else{
            tileSelector.selectUnit(unit);
            if(unit.isPlayerUnit()){
                arena.calculateValidTiles(y, x, unit);
            }
            else{
                uiManager.showAiUI(true, unit);
                playerRoundState = playerStates.SELECTED_AI_UNIT;
            }
        }
    }
    else{
        if(isValidTile(map, [y, x])){
            tileSelector.confirmationTile = [y, x];
            tileSelector.tileMove([y, x]);
            
            let y1 = tileSelector.playerUnit.tile[0];
            let x1 = tileSelector.playerUnit.tile[1];
            let x2 = x;
            let y2 = y;
            map.findValidPath(y1, x1, y2, x2);

            playerRoundState = playerStates.SELECTED_TILE;
        }
        else{
            arena.cancelSelection();
            playerRoundState = playerStates.NONE;
        }
    }
}

function handleGridTileSelectedState(y, x, unit, map, arena, tileSelector, uiManager){
    if(unit != null){
        if(unit.isPlayerUnit()){
            if(unit == tileSelector.playerUnit){
                arena.cancelSelection();
                playerRoundState = playerStates.NONE;
            }
            else{
                tileSelector.selectUnit(unit);
                arena.calculateValidTiles(y, x, unit);
                playerRoundState = playerStates.SELECTED_UNIT;
            }
        }
        else{
            tileSelector.selectUnit(unit);
            map.hideValidTiles();
            uiManager.showAiUI(true, unit);
            playerRoundState = playerStates.SELECTED_AI_UNIT;
        }
    }
    else if(isSameTile([y, x], tileSelector.confirmationTile)){
        arena.moveUnit(y, x);
        map.showValidPath = false;
    }
    else if(isValidTile(map, [y, x])){
        tileSelector.confirmationTile = [y, x];
        tileSelector.tileMove([y, x]);

        let y1 = tileSelector.playerUnit.tile[0];
        let x1 = tileSelector.playerUnit.tile[1];
        let x2 = x;
        let y2 = y;
        map.findValidPath(y1, x1, y2, x2);
    }
    else{
        arena.cancelSelection();
        playerRoundState = playerStates.NONE;
    }
}

function handleAIUnitSelectedState(y, x, unit, map, arena, tileSelector, uiManager){
    if(unit == null){
        if(isValidTile(map, [y, x])){
            tileSelector.confirmationTile = [y, x];
            tileSelector.tileMove([y, x]);

            playerRoundState = playerStates.SELECTED_TILE;
        }
        else{
            arena.cancelSelection();

            playerRoundState = playerStates.NONE
        }
    }
    else if(unit.isPlayerUnit() && unit != tileSelector.playerUnit){
        tileSelector.selectUnit(unit);
        arena.calculateValidTiles(y, x, unit);

        playerRoundState = playerStates.SELECTED_UNIT;
    }
    else if(unit.isPlayerUnit() && unit == tileSelector.playerUnit){
        arena.cancelSelection();

        playerRoundState = playerStates.NONE;
    }
    else if(!unit.isPlayerUnit() && unit == tileSelector.aiUnit){
        console.log("Combat");
        arena.cancelSelection();

        playerRoundState = playerStates.NONE
    }
}