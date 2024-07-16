import { Application, Assets, Sprite } from 'pixi.js'
import groundPng from '../assets/ground.png'

export default class Ground {
    groundSprites: Sprite[] = [];
    groundWidth: number = 0;
    groundHeight: number = 500;

    async generateGround(app: Application) {
        const groundAsset = await Assets.load(groundPng);

        // Calculate the number of ground sprites needed to cover the screen width
        const numGroundSprites = Math.ceil(app.screen.width / groundAsset.width) + 3;

        // Create and position ground sprites
        for (let i = 0; i < numGroundSprites; i++) {
            const groundSprite = new Sprite(groundAsset);
            groundSprite.anchor.set(0.5);
            groundSprite.y = window.innerHeight / 1;
            groundSprite.height = this.groundHeight;
            groundSprite.scale = 4

            // Position each ground sprite next to the previous one
            groundSprite.x = (app.screen.width / 2) + i * groundSprite.width - (groundSprite.width / 2);

            this.groundWidth = groundSprite.width;
            this.groundSprites.push(groundSprite);
            app.stage.addChild(groundSprite);
        }

        app.ticker.add((time) => {
            for (let groundSprite of this.groundSprites) {
                groundSprite.x -= 5 * time.deltaTime;

                // Reset the ground position if it moves off screen
                if (groundSprite.x < (app.screen.width / 2) - (numGroundSprites * this.groundWidth) / 2) {
                    groundSprite.x += numGroundSprites * this.groundWidth;
                }
            }
        });
    }
}
