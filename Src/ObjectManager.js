function instPlayableChar(name, stats, tile, mapManager, imgPath){
    if(mapManager.isOccupied(tile) || !mapManager.isTraversable(tile)){
        console.log("Failed to instantiate " + name + " at " + tile + "; Aborting");
        return;
    }

    let character = new PlayableChar({
        name: name,
        moveLen: stats.moveLen,
        x: tile[1]*100,
        y: tile[0]*100,
        tile: tile,
        src: imgPath
    });

    mapManager.gameObjects.push(character);
    mapManager.occupyTile(character.tile, character);
}