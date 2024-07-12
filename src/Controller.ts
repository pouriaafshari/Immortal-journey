// Map keyboard key codes to controller's state keys
const keyMap: { [key: string]: keyof Controller['keys'] } = {
    Space: 'space',
    KeyW: 'up',
    ArrowUp: 'up',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyS: 'down',
    ArrowDown: 'down',
    KeyD: 'right',
    ArrowRight: 'right',
};

// Define the key state interface
interface KeyState {
    pressed: boolean;
    doubleTap: boolean;
    timestamp: number;
}

// Class for handling keyboard inputs.
export class Controller {
    keys: {
        up: KeyState;
        left: KeyState;
        down: KeyState;
        right: KeyState;
        space: KeyState;
    };

    constructor() {
        // Initialize the controller's state.
        this.keys = {
            up: { pressed: false, doubleTap: false, timestamp: 0 },
            left: { pressed: false, doubleTap: false, timestamp: 0 },
            down: { pressed: false, doubleTap: false, timestamp: 0 },
            right: { pressed: false, doubleTap: false, timestamp: 0 },
            space: { pressed: false, doubleTap: false, timestamp: 0 },
        };

        // Register event listeners for keydown and keyup events.
        window.addEventListener('keydown', (event) => this.keydownHandler(event));
        window.addEventListener('keyup', (event) => this.keyupHandler(event));
    }

    keydownHandler(event: KeyboardEvent): void {
        const key = keyMap[event.code];
        if (!key) return;

        const now = Date.now();

        // If not already in the double-tap state, toggle the double tap state if the key was pressed twice within 300ms.
        this.keys[key].doubleTap = this.keys[key].doubleTap || now - this.keys[key].timestamp < 300;

        // Toggle on the key pressed state.
        this.keys[key].pressed = true;
    }

    keyupHandler(event: KeyboardEvent): void {
        const key = keyMap[event.code];
        if (!key) return;

        const now = Date.now();

        // Reset the key pressed state.
        this.keys[key].pressed = false;

        // Reset double tap only if the key is in the double-tap state.
        if (this.keys[key].doubleTap) {
            this.keys[key].doubleTap = false;
        } else {
            // Otherwise, update the timestamp to track the time difference till the next potential key down.
            this.keys[key].timestamp = now;
        }
    }
}
