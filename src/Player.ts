import { Application, Assets, Sprite } from 'pixi.js';
import poro from '../assets/poro.png';

export default class Player {
    public poroSprite: Sprite = new Sprite();
    private isJumping: boolean;
    private jumpSpeed: number;
    private gravity: number;

    constructor() {
        this.isJumping = false;
        this.jumpSpeed = -10; // Initial jump speed (negative to move up)
        this.gravity = 0.5; // Gravity to bring the player back down
    }

    async createPlayer(app: Application) {
        const playerPng = await Assets.load(poro);
        this.poroSprite = new Sprite(playerPng);

        this.poroSprite.anchor.set(0.5);
        this.poroSprite.x = (app.screen.width / 2) - 100;
        this.poroSprite.y = app.screen.height / 2;
        this.poroSprite.width = 50;
        this.poroSprite.height = 50;

        app.stage.addChild(this.poroSprite);

        // Add event listener for keydown
        window.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Add a ticker to update the player's position
        app.ticker.add(() => {
            if (this.isJumping) {
                this.poroSprite.y += this.jumpSpeed;
                this.jumpSpeed += this.gravity;
    
                // Check if the player has landed (pseudo ground level check)
                if (this.poroSprite.y >= window.innerHeight / 2) {
                    this.poroSprite.y = window.innerHeight / 2;
                    this.isJumping = false;
                    this.jumpSpeed = 0;
                }
            }
        })
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.code === 'Space' && !this.isJumping) {
            this.isJumping = true;
            this.jumpSpeed = -10; // Reset the jump speed
        }
    }
}
