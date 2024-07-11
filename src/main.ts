import Obstacle from "./Obstacle";
import * as PIXI from 'pixi.js';
import addStars from "./addStars";
import { addMountains } from "./addMountains";
import Player from "./Player";
import Ground from "./Ground";
import { SpineCharacter } from "./SpineCharacter";
import { Spine } from "@pixi/spine-pixi";

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'
const gameContainer = document.getElementById('game-container')!;
const trex = document.getElementById('trex')!;

const app = new PIXI.Application();

(async () => {
    // Initialize the application.
    await app.init({ background: '#021f4b', width: window.innerWidth, height: window.innerHeight/2});

    document.body.appendChild(app.canvas);

    addStars(app);
    addMountains(app);

    const yani = new Obstacle();
    await yani.generateObstacle(app); // Ensure obstacle is generated

    const was = new Player();
    await was.createPlayer(app); // Ensure player is created

    const doch = new Ground();
    await doch.generateGround(app); // Ensure ground is generated


    app.ticker.add((delta) => {
        yani.update(delta.deltaTime, app);

        if (was.maja && yani.obstacleSprite) {
            if (hitTestRectangle(was.maja, yani.obstacleSprite)) {
                app.ticker.stop();
                alert('You lost!');
            }
        }
    });
})();

function hitTestRectangle(r1: PIXI.AnimatedSprite, r2: PIXI.Sprite): boolean {
    const r1Bounds = r1.getBounds();
    const r2Bounds = r2.getBounds();

    return r1Bounds.x < r2Bounds.x + r2Bounds.width &&
           r1Bounds.x + r1Bounds.width - 40 > r2Bounds.x &&
           r1Bounds.y < r2Bounds.y + r2Bounds.height - 10 &&
           r1Bounds.y + r1Bounds.height -5 > r2Bounds.y;
}
