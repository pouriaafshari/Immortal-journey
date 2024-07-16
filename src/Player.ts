import { Application, Assets, AnimatedSprite, Sprite, Texture } from 'pixi.js';

export default class Player {
    private isJumping: boolean;
    private jumpSpeed: number;
    private gravity: number;
    public maja!: AnimatedSprite; // Store the player sprite
    private runTextures: Texture[] = []; // Store run animation textures
    private upTexture!: Texture; // Store jump animation texture
    private downTexture!: Texture;

    constructor() {
        this.isJumping = false;
        this.jumpSpeed = -10; // Initial jump speed (negative to move up)
        this.gravity = 0.4; // Gravity to bring the player back down
    }

    async createPlayer(app: Application) {
        await Assets.load('../assets/Maja.json');
        
        const m0 = await Assets.load('../assets/Maja/m0.png');
        const m1 = await Assets.load('../assets/Maja/m1.png');
        const m2 = await Assets.load('../assets/Maja/m2.png');
        const m3 = await Assets.load('../assets/Maja/m3.png');
        const m4 = await Assets.load('../assets/Maja/m5.png');
        const m5 = await Assets.load('../assets/Maja/m6.png');

        // Store the textures in the class properties
        this.runTextures = [m0, m1, m2, m3].map(texture => new Sprite(texture).texture);
        this.upTexture = new Sprite(m4).texture;
        this.downTexture = new Sprite(m5).texture;

        // Configure and start animation:
        this.maja = new AnimatedSprite(this.runTextures);
        this.maja.scale.set(5);
        this.maja.animationSpeed = 1 / 6; // 6 fps
        this.maja.position.set((app.screen.width / 2) - 200, window.innerHeight / 1 - 152);
        this.maja.play();
        app.stage.addChild(this.maja);

        // Add event listener for keydown
        window.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Add a ticker to update the player's position
        app.ticker.add(this.update.bind(this));
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.code === 'Space' && !this.isJumping) {
            this.isJumping = true;
            this.jumpSpeed = -10; // Reset the jump speed
            this.switchAnimation([this.upTexture]);
        }
    }

    switchAnimation(textures: Texture[]) {
        this.maja.textures = textures;
        this.maja.play();
    }

    update() {
        if (this.isJumping) {
            this.maja.y += this.jumpSpeed;
            this.jumpSpeed += this.gravity;

            // Check if the player has landed (pseudo ground level check)
            if (this.maja.y >= window.innerHeight / 1 - 152) {
                this.maja.y = window.innerHeight / 1 - 152;
                this.isJumping = false;
                this.jumpSpeed = 0;
                this.switchAnimation(this.runTextures);
            }
            else {
                if (this.jumpSpeed > 0) this.switchAnimation([this.downTexture]);
            }
        }
    }
}
