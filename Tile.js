class Tile {
    constructor(config) {
        this.tilePos = config.tilePos || [0, 0]
        this.traversable = config.traversable
        this.occupied = config.occupied
        this.occupant = config.occupant || null;
    }
}