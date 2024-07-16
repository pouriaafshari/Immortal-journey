import { Application, Assets, Sprite } from 'pixi.js';
import enemy1 from '../assets/enemy0.png';
import enemy2 from '../assets/enemy1.png';
import enemy3 from '../assets/enemy2.png';

export default class Obstacle {
    obstacleSprite: Sprite;
    obstacleType: number;
    obstaclePosition: number;

    constructor() {
        this.obstacleType = 1;
        this.obstaclePosition = 0;
        this.obstacleSprite = new Sprite();
    }

    async generateObstacle(app: Application) {
        // Load enemy assets
        const enemyAssets = [enemy1, enemy2, enemy3];
        const selectedEnemy = enemyAssets[Math.floor(Math.random() * enemyAssets.length)];

        // Load the selected enemy asset
        const obs = await Assets.load(selectedEnemy);
        this.obstacleSprite.texture = obs;

        this.obstacleSprite.anchor.set(0.5);
        this.obstacleSprite.x = app.screen.width;
        this.obstacleSprite.y = window.innerHeight / 1 - 86;
        this.obstacleSprite.scale = 4

        app.stage.addChild(this.obstacleSprite);
    }

    update(delta: number, app: Application) {
        this.obstacleSprite.x -= 5 * delta;
        console.log("was????")
        // Reset the obstacle position if it moves off screen
        if (this.obstacleSprite.x < -this.obstacleSprite.width) {
            this.obstacleSprite.x = app.screen.width + this.obstacleSprite.width;
            this.setRandomEnemy();
        }
    }

    async setRandomEnemy() {
        // Load enemy assets
        const enemyAssets = [enemy1, enemy2, enemy3];
        const selectedEnemy = enemyAssets[Math.floor(Math.random() * enemyAssets.length)];

        // Load the selected enemy asset
        const obs = await Assets.load(selectedEnemy);
        this.obstacleSprite.texture = obs;
    }
}
