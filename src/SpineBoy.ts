import { Spine } from '@pixi/spine-pixi';
import { Container } from 'pixi.js';

// Define the Spine animation map for the character.
// name: animation track key.
// loop: do the animation once or infinitely.
const animationMap: Record<string, { name: string; loop?: boolean; timeScale?: number }> = {
    idle: {
        name: 'idle',
        loop: true,
    },
    walk: {
        name: 'walk',
        loop: true,
    },
    run: {
        name: 'run',
        loop: true,
    },
    jump: {
        name: 'jump',
        timeScale: 1.5,
    },
    hover: {
        name: 'hoverboard',
        loop: true,
    },
    spawn: {
        name: 'portal',
    },
};

// Interface for character state
interface CharacterState {
    walk: boolean;
    run: boolean;
    hover: boolean;
    jump: boolean;
}

// Interface for animation parameters
interface AnimationParams {
    name: string;
    loop?: boolean;
    timeScale?: number;
}

// Class for handling the character Spine and its animations.
export class SpineBoy {
    state: CharacterState;
    view: Container;
    directionalView: Container;
    spine: Spine;

    constructor() {
        // The character's state.
        this.state = {
            walk: false,
            run: true,
            hover: false,
            jump: false,
        };

        // Create the main view and a nested view for directional scaling.
        this.view = new Container();
        this.directionalView = new Container();

        // Create the Spine instance using the preloaded Spine asset aliases.
        this.spine = Spine.from({
            skeleton: 'spineSkeleton',
            atlas: 'spineAtlas',
        });

        // Add the Spine instance to the directional view.
        this.directionalView.addChild(this.spine);

        // Scale down the directional view to 0.2 of its original size.
        this.directionalView.scale.set(0.2, 0.2);

        // Adjust the position of the directional view to move the character up and to the left.
        this.directionalView.position.set(-160, -11);

        // Add the directional view to the main view.
        this.view.addChild(this.directionalView);

        // Set the default mix duration for all animations.
        // This is the duration to blend from the previous animation to the next.
        this.spine.state.data.defaultMix = 0.2;
    }

    // Play the portal-in spawn animation.
    spawn(): void {
        this.spine.state.setAnimation(0, animationMap.spawn.name);
    }

    // Play the spine animation.
    playAnimation({ name, loop = false, timeScale = 1 }: AnimationParams): void {
        // Skip if the animation is already playing.
        if (this.currentAnimationName === name) return;

        // Play the animation on main track instantly.
        const trackEntry = this.spine.state.setAnimation(0, name, loop);

        // Apply the animation's time scale (speed).
        trackEntry.timeScale = timeScale;
    }

    update(): void {
        // Play the jump animation if not already playing.
        if (this.state.jump) this.playAnimation(animationMap.jump);

        // Skip the rest of the animation updates during the jump animation.
        if (this.isAnimationPlaying(animationMap.jump)) return;

        // Handle the character animation based on the latest state and in the priority order.
        if (this.state.hover) this.playAnimation(animationMap.hover);
        else if (this.state.run) this.playAnimation(animationMap.run);
        else if (this.state.walk) this.playAnimation(animationMap.walk);
        else this.playAnimation(animationMap.idle);
    }

    isSpawning(): boolean {
        return this.isAnimationPlaying(animationMap.spawn);
    }

    isAnimationPlaying({ name }: { name: string }): boolean {
        // Check if the current animation on main track equals to the queried.
        // Also check if the animation is still ongoing.
        const current = this.spine.state.getCurrent(0);
        return current?.animation?.name === name && !current.isComplete();
    }

    // Return the name of the current animation on main track.
    get currentAnimationName(): string | undefined {
        return this.spine.state.getCurrent(0)?.animation?.name;
    }

    // Return character's facing direction.
    get direction(): number {
        return this.directionalView.scale.x > 0 ? 1 : -1;
    }

    // Set character's facing direction.
    set direction(value: number) {
        this.directionalView.scale.x = value;
    }
}
