
function compareUnits(u1, u2){
    if(u1 != u2){
        return false;
    }

    return true;
}

// State machine utils

function emitEvent(who, eventName){
    const event = new CustomEvent(eventName, {
        detail: {
            object: who,
        }
    });
    
    document.dispatchEvent(event);
}

const playerStates = {
    NONE: 0,
    SELECTED_UNIT: 1,
    SELECTED_TILE: 2,
    SELECTED_AI_UNIT: 3,
}

var playerRoundState = playerStates.NONE;


// Map Utils

function isInBounds(map, tile){
    if(tile[1] < 0 || tile[0] < 0 || tile[1] >= map.tileObjs[0].length || tile[0] >= map.tileObjs.length){
        return false;
    }

    return true;
}

function isValidTile(map, tile){
    let tileObj = map.tileObjs[tile[0]][tile[1]];
    if(map.validTiles.has(tileObj)){
        return true;
    }

    return false;
}

function isOccupied(map, tile){
    if(map.tileObjs[tile[0]][tile[1]].occupied == 1){
        return true;
    }

    return false;
}

function isTraversable(map, tile){
    if(map.tileObjs[tile[0]][tile[1]].traversable == 0){
        return true;
    }

    return false;
}

function isSameTile(tile1, tile2){
    if(tile1[0] == tile2[0] && tile1[1] == tile2[1]){
        return true;
    }

    return false;
}