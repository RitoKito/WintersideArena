class Sprite{
    constructor(config){

        //Set up sprite

        //Configure animation and initial state
        this.animations = config.animations || {
            idle: [
                [0, 0]
            ]
        }
        this.currentAnimation = config.currentAnimation || "idle";
        this.currentAnimationFrame = 0;

        this.gameObject = config.gameObject;
    }

    draw(ctx) {
        // Char placeholder
        const x = this.gameObject.x;
        const y = this.gameObject.y;
        ctx.fillStyle = "#a6a8f7";
        ctx.fillRect(y, x, 40, 80);
        ctx.stroke();

        /*
        const image = new Image();
        image.onload = () => {
            this.isLoaded = true;
            this.ctx.drawImage(image, 0, 0)
        };
        image.src = "";
        */
    }
}