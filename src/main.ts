import Obstacle from "./Obstacle";

const gameContainer = document.getElementById('game-container')!;
const trex = document.getElementById('trex')!;
const ground = document.getElementById('ground')!;

// Initial T-Rex position
trex.style.bottom = '20px';

// Game variables
let isJumping = false;
let jumpVelocity = 0;
const gravity = 0.5;
const jumpPower = 10;
const obstacleSpeed = 5;
const obstacles: Obstacle[] = [];

// Create obstacles every 2 seconds
setInterval(() => {
  const obstacle = new Obstacle;
  gameContainer.appendChild(obstacle.ObstacleHtmlElem);
  obstacles.push(obstacle);
}, 2000);

// Game loop
function gameLoop() {
  // Handle jumping
  if (isJumping) {
    jumpVelocity -= gravity;
    trex.style.bottom = `${parseFloat(trex.style.bottom) + jumpVelocity}px`;

    if (parseFloat(trex.style.bottom) <= 20) {
      trex.style.bottom = '20px';
      isJumping = false;
      jumpVelocity = 0;
    }
  }

  // Move obstacles
  obstacles.forEach(obstacle => {
    obstacle.ObstacleHtmlElem.style.right = `${parseFloat(obstacle.ObstacleHtmlElem.style.right) + obstacleSpeed}px`;

    // Check for collision
    if (hitTestRectangle(trex, obstacle.ObstacleHtmlElem)) {
      alert('Game Over');
      window.location.reload();
    }

    // Remove off-screen obstacles
    if (parseFloat(obstacle.ObstacleHtmlElem.style.right) > gameContainer.clientWidth) {
      obstacle.destroy();
      obstacles.shift();
      console.log(obstacles.length)
    }
  });

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Handle space bar press for jumping
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping) {
    jump();
  }
});

// Jump function
function jump() {
  isJumping = true;
  jumpVelocity = jumpPower;
}

// Collision detection function
function hitTestRectangle(r1: HTMLElement, r2: HTMLElement) {
  const r1Rect = r1.getBoundingClientRect();
  const r2Rect = r2.getBoundingClientRect();

  return r1Rect.left < r2Rect.right &&
         r1Rect.right > r2Rect.left &&
         r1Rect.top < r2Rect.bottom &&
         r1Rect.bottom > r2Rect.top;
}
