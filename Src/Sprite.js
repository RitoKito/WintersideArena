// TODO: Resolve accessing image before its loaded

class Sprite{
    constructor(config){

        //Set up sprite
        //Configure animation and initial state
        // this.animations = config.animations || {
        //     idle: [
        //         [0, 0]
        //     ]
        // }
        // this.currentAnimation = config.currentAnimation || "idle";
        // this.currentAnimationFrame = 0;

        this.image = new Image();
        this.image.src = config.src
        this.image.onload = () => {
            this.isLoaded = true;
        }

        this.gameObject = config.gameObject;
    }

    draw(ctx) {
        const x = this.gameObject.renderX;
        const y = this.gameObject.renderY;
        ctx.drawImage(this.image,
            0, 0,
            this.image.width, this.image.height,
            x, y,
            100, 100
        )
    }
}