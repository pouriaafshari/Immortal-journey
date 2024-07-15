import * as PIXI from 'pixi.js';
import addStars from './addStars';
import { addMountains } from './addMountains';
import Player from './Player';
import Ground from './Ground';
import { SpineBoy } from './SpineBoy';
import { Controller } from './Controller';
import Obstacle from './Obstacle';

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest';

const app = new PIXI.Application();

(async () => {
    // Initialize the application.
    await app.init({ background: '#021f4b', width: window.innerWidth, height: window.innerHeight / 2 });

    document.body.appendChild(app.view);

    await PIXI.Assets.load([
        {
            alias: 'spineSkeleton',
            src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel',
        },
        {
            alias: 'spineAtlas',
            src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas',
        },
        {
            alias: 'sky',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/sky.png',
        },
        {
            alias: 'background',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/background.png',
        },
        {
            alias: 'midground',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/midground.png',
        },
        {
            alias: 'platform',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/platform.png',
        },
    ]);

    // Display the character selection menu
    displayMenu();

    function displayMenu() {
        const menuContainer = new PIXI.Container();
        const style = new PIXI.TextStyle({
            fill: '#ffffff',
            fontSize: 36,
            fontWeight: 'bold',
        });

        const spineBoyText = new PIXI.Text({text: 'Spine Boy', style});
        spineBoyText.x = app.screen.width / 2 - spineBoyText.width / 2;
        spineBoyText.y = app.screen.height / 2 - 20;
        spineBoyText.interactive = true;
        spineBoyText.on('pointerdown', () => {
            startGame('spineboy');
        });

        const majaText = new PIXI.Text({text: 'Maja', style});
        majaText.x = app.screen.width / 2 - majaText.width / 2;
        majaText.y = app.screen.height / 2 + 50;
        majaText.interactive = true;
        majaText.on('pointerdown', () => {
            startGame('maja');
        });

        menuContainer.addChild(spineBoyText);
        menuContainer.addChild(majaText);

        app.stage.addChild(menuContainer);
    }

    async function startGame(character: 'spineboy' | 'maja') {
        app.stage.removeChildren();

        addStars(app);
        addMountains(app);

        // Create a controller that handles keyboard inputs.
        const controller = new Controller();

        let characterInstance: SpineBoy | Player;

        // Initialize the selected character
        if (character === 'spineboy') {
            characterInstance = new SpineBoy();
            characterInstance.view.x = app.screen.width / 2;
            characterInstance.view.y = app.screen.height - 150;
            characterInstance.spine.scale.set(0.5);
            app.stage.addChild(characterInstance.view);
        } else {
            characterInstance = new Player();
            await characterInstance.createPlayer(app);
        }

        const obstacle = new Obstacle();
        await obstacle.generateObstacle(app); // Ensure obstacle is generated

        const ground = new Ground();
        await ground.generateGround(app); // Ensure ground is generated

        // Animate the character based on the controller's input.
        app.ticker.add((time) => {
            if (characterInstance instanceof SpineBoy) {
                characterInstance.state.run = true;
                characterInstance.state.jump = controller.keys.space.pressed;

                // Update character's animation based on the latest state.
                characterInstance.update();

                if (hitTestSpineBoy(characterInstance, obstacle.obstacleSprite)) {
                    app.ticker.stop();
                    alert('You lost!');
                }
            } else if (characterInstance instanceof Player) {

                if (hitTestRectangle(characterInstance.maja, obstacle.obstacleSprite)) {
                    app.ticker.stop();
                    alert('You lost!');
                }
            }

            // Update obstacles
            obstacle.update(time.deltaTime, app);
        });
    }

    function hitTestSpineBoy(spineBoy: SpineBoy, obstacle: PIXI.Sprite): boolean {
        const spineBounds = spineBoy.view.getBounds();
        const obstacleBounds = obstacle.getBounds();

        return spineBounds.x < obstacleBounds.x + obstacleBounds.width &&
               spineBounds.x + spineBounds.width - 40 > obstacleBounds.x &&
               spineBounds.y < obstacleBounds.y + obstacleBounds.height - 10 &&
               spineBounds.y + spineBounds.height - 5 > obstacleBounds.y;
    }

    function hitTestRectangle(r1: PIXI.AnimatedSprite | PIXI.Sprite, r2: PIXI.Sprite): boolean {
        const r1Bounds = r1.getBounds();
        const r2Bounds = r2.getBounds();

        return r1Bounds.x < r2Bounds.x + r2Bounds.width &&
               r1Bounds.x + r1Bounds.width - 5 > r2Bounds.x &&
               r1Bounds.y < r2Bounds.y + r2Bounds.height - 10 &&
               r1Bounds.y + r1Bounds.height - 5 > r2Bounds.y;
    }
})();
