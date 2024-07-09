import { Application, Assets, Sprite } from 'pixi.js';
import obsPng from '../assets/obs.png';

export default class Obstacle {
    obstacleSprite: Sprite = new Sprite;
    obstacleType: number;
    obstaclePosition: number;

    constructor() {
        this.obstacleType = 1;
        this.obstaclePosition = 0;
    }

    async generateObstacle(app: Application) {
        const obs = await Assets.load(obsPng);
        this.obstacleSprite = new Sprite(obs);

        this.obstacleSprite.anchor.set(0.5);
        this.obstacleSprite.x = app.screen.width;
        this.obstacleSprite.y = (app.screen.height / 2)+5;
        this.obstacleSprite.width = 50;
        this.obstacleSprite.height = 50;

        app.stage.addChild(this.obstacleSprite);
    }

    update(delta: number, app: Application) {
        this.obstacleSprite.x -= 4 * delta;

        // Reset the obstacle position if it moves off screen
        if (this.obstacleSprite.x < -this.obstacleSprite.width) {
            this.obstacleSprite.x = app.screen.width + this.obstacleSprite.width;
        }
    }
}
