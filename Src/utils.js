function emitEvent(who, eventName){
    const event = new CustomEvent(eventName, {
        detail: {
            object: who,
        }
    });
    
    document.dispatchEvent(event);
}

function compareUnits(u1, u2){
    if(u1 != u2){
        return false;
    }

    return true;
}

function isSameTile(tile1, tile2){
    if(tile1[0] == tile2[0] && tile1[1] == tile2[1]){
        return true;
    }

    return false;
}

const playerStates = {
    NONE: 0,
    SELECTED_UNIT: 1,
    SELECTED_TILE: 2,
    SELECTED_AI_UNIT: 3,
}

var playerRoundState = playerStates.NONE;