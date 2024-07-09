import { Application, Assets, Sprite } from 'pixi.js'
import groundPng from '../assets/ground.png'

export default class Ground{
    groundSprite = new Sprite

    async generateGround(app: Application){
        const groundAsset = await Assets.load(groundPng);
        this.groundSprite = new Sprite(groundAsset)
        app.stage.addChild(this.groundSprite);

        this.groundSprite.anchor.set(0.5)
        this.groundSprite.x = app.screen.width / 2;
        this.groundSprite.y = (app.screen.height / 2)-30;
        this.groundSprite.width = app.screen.width + 400;
        this.groundSprite.height = 220;

        app.ticker.add((time) => {
            this.groundSprite.x -= 4 * time.deltaTime;

        // Reset the obstacle position if it moves off screen
        if (this.groundSprite.x < (app.screen.width / 2) - 138) {
            this.groundSprite.x = app.screen.width / 2;
        }
        })
    }
}