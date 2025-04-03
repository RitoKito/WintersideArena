// Handle state when no units are selected
function handleNoneSelectedState(y, x, gameManager){
    let unit = gameManager.map.tileObjs[y][x].occupant;

    // If selected tile is occupied by a unit
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
    // Cancel selection if invalid tile selected
    else{
        // gameManager.cancelSelection(function(){
        //     playerRoundState = playerStates.NONE;
        //     gameManager.playerControlAllowed = true;
        // });
    }
}

// Handle state when player has already selected one of their units
function handlePlayerUnitSelectedState(y, x, gameManager){
    let unit = gameManager.map.tileObjs[y][x].occupant;

    // If selected tile is occupied by a unit
    if(unit != null){
        // Cancel selection if selecting the same unit selected previously
        if(unit == gameManager.tileSelector.selectedUnit){
            gameManager.cancelSelection();
            playerRoundState = playerStates.NONE;
        }
        else{
            // Calcualte valid tiles for move
            gameManager.tileSelector.selectUnit(unit);
            if(unit.isPlayerUnit()){
                gameManager.map.calculateValidTiles(y, x);
            }
            // Show AI unit details on UI upon selection
            else{
                gameManager.uiManager.showAiUI(true, unit);
                playerRoundState = playerStates.SELECTED_AI_UNIT;
            }
        }
    }
    else{
        // Calculate path from unit to selected VALID tile
        if(isValidTile(gameManager.map, [y, x])){
            gameManager.tileSelector.confirmationTile = [y, x];
            gameManager.tileSelector.tileMove([y, x]);
            
            let y1 = gameManager.tileSelector.playerUnit.renderY/100;
            let x1 = gameManager.tileSelector.playerUnit.renderX/100;
            let x2 = x;
            let y2 = y;
            gameManager.map.findValidPath(y1, x1, y2, x2);

            // gameManager.tileSelector.playerUnit.animateMove(y*100, x*100);
            gameManager.tileSelector.playerUnit.animateMove(gameManager.map.aStarPath);

            playerRoundState = playerStates.SELECTED_TILE;
        }
        // Cancel unit selection if tile is invalid
        else{
            gameManager.playerControlAllowed = false;

            gameManager.cancelSelection(function(){
                playerRoundState = playerStates.NONE;
                gameManager.playerControlAllowed = true;
            });
        }
    }
}

// Case: Player selected valid tile
function handleGridTileSelectedState(y, x, gameManager){
    let unit = gameManager.map.tileObjs[y][x].occupant;

    // If selected tile is occupied by a unit
    if(unit != null){
        // If selected the same unit second time, cancel selection
        // Otherwise, re-select a unit
        if(unit.isPlayerUnit()){
            if(unit == gameManager.tileSelector.playerUnit){
                // playerRoundState = playerStates.NONE;
            gameManager.cancelSelection(function(){
                playerRoundState = playerStates.NONE;
                gameManager.playerControlAllowed = true;
            });
            }
            else{
                gameManager.tileSelector.selectUnit(unit);
                gameManager.map.calculateValidTiles(y, x, unit);
                playerRoundState = playerStates.SELECTED_UNIT;
            }
        }
        // Handle AI unit selection
        else{
            gameManager.tileSelector.selectUnit(unit);
            // gameManager.map.hideValidTiles();
            gameManager.uiManager.showAiUI(true, unit);
            playerRoundState = playerStates.SELECTED_AI_UNIT;
        }
    }
    // If the valid tile selected twice, move selected player unit
    // Else if it is a different tile, then reselect the tile and re-calculate the path to the tile
    // Else cancel the selection if the tile is invalid
    else if(isSameTile([y, x], gameManager.tileSelector.confirmationTile)){
        gameManager.moveUnit(y, x);
        gameManager.map.showValidPath = false;
        gameManager.cancelSelection();
        playerRoundState = playerStates.NONE;
    }
    else if(isValidTile(gameManager.map, [y, x])){
        gameManager.tileSelector.confirmationTile = [y, x];
        gameManager.tileSelector.tileMove([y, x]);

        // let y1 = gameManager.tileSelector.playerUnit.tile[0];
        // let x1 = gameManager.tileSelector.playerUnit.tile[1];
        let y1 = gameManager.tileSelector.playerUnit.renderY/100;
        let x1 = gameManager.tileSelector.playerUnit.renderX/100;
        let x2 = x;
        let y2 = y;
        gameManager.map.findValidPath(y1, x1, y2, x2);
        
        gameManager.tileSelector.playerUnit.animateMove(gameManager.map.aStarPath);
    }
    else{
        gameManager.cancelSelection(function(){
            playerRoundState = playerStates.NONE;
            gameManager.playerControlAllowed = true;
        });
    }
}

// Handle state when player already selected an AI unit
function handleAIUnitSelectedState(y, x, gameManager){
    let unit = gameManager.map.tileObjs[y][x].occupant;

    // If selected tile is NOT occupied by a unit
    if(unit == null){
        // If it is a valid tile, select the tile
        // Othwerise cancel the selection
        if(isValidTile(gameManager.map, [y, x])){
            gameManager.tileSelector.confirmationTile = [y, x];
            gameManager.tileSelector.tileMove([y, x]);
            gameManager.tileSelector.playerUnit.animateMove(gameManager.map.aStarPath);

            playerRoundState = playerStates.SELECTED_TILE;
        }
        else{
            gameManager.cancelSelection(function(){
                playerRoundState = playerStates.NONE;
                gameManager.playerControlAllowed = true;
            });

            playerRoundState = playerStates.NONE
        }
    }
    // If the tile contains a player unit that is not the selected unit, select the unit
    // Else if already selected player unit, cancel the selection
    // Else if already selected AI unit, enter combat phase
    else if(unit.isPlayerUnit() && unit != gameManager.tileSelector.playerUnit){
        gameManager.tileSelector.selectUnit(unit);
        gameManager.map.calculateValidTiles(y, x, unit);

        playerRoundState = playerStates.SELECTED_UNIT;
    }

    else if(unit.isPlayerUnit() && unit == gameManager.tileSelector.playerUnit){
        gameManager.cancelSelection(function(){
            playerRoundState = playerStates.NONE;
            gameManager.playerControlAllowed = true;
        });

        playerRoundState = playerStates.NONE;
    }

    else if(!unit.isPlayerUnit() && unit == gameManager.tileSelector.aiUnit){
        console.log("Combat");
        gameManager.tileSelector.playerUnit.dealDamage(gameManager.tileSelector.aiUnit);

        gameManager.cancelSelection(function(){
            playerRoundState = playerStates.NONE;
            gameManager.playerControlAllowed = true;
        });

        playerRoundState = playerStates.NONE
    }
}