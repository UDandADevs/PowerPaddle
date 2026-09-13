// Get the canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ball
const ball = {
  x: 200,
  y: 550,
  size: 5,
  speedX: 3, // changeg from 3
  speedY: -3 // changed from -3
};

// Paddle
const paddle = {
  x: 160,
  y: 580,
  width: 80,
  height: 10
};

let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let level = 1;

// Blocks
const blocks = [];

function createBlocks() {
  blocks.length = 0; // Clear old blocks
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      blocks.push({
        x: col * 75 + 10,
        y: row * 25 + 20,
        width: 70,
        height: 20,
        active: true
      });
    }
  }
}

createBlocks();

// Game loop - runs repeatedly
function draw() {
  // Clear canvas (black background)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw ball
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fill();

  // Draw paddle
  ctx.fillStyle = 'blue';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

// Draw blocks
ctx.fillStyle = 'red';
blocks.forEach(block => {
  if (block.active) {
    ctx.fillRect(block.x, block.y, block.width, block.height);
  }
});

// Check if all blocks destroyed
const allBlocksGone = blocks.every(block => !block.active);
if (allBlocksGone) {
  level++;
  ball.speedX *= 1.05; // Ball gets slightly faster
  ball.speedY *= 1.05;
  createBlocks(); // New blocks appear
}

// Draw score and level
ctx.fillStyle = 'white';
ctx.font = '16px Arial';
ctx.fillText('Score: ' + score, 10, 20);
ctx.fillText('Level: ' + level, 10, 45);
ctx.fillText('Best: ' + bestScore, 10, 70);

// Move paddle based on keys pressed
if (leftPressed && paddle.x > 0) {
  paddle.x -= 7;
}
if (rightPressed && paddle.x < canvas.width - paddle.width) {
  paddle.x += 7;
}

  // Move ball
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Ball bounces off left/right walls
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.speedX = -ball.speedX;
  }

  // Ball bounces off top
  if (ball.y < 0) {
    ball.speedY = -ball.speedY;
  }

  // Ball hits paddle
  if (ball.y > paddle.y &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width) {
    ball.speedY = -ball.speedY;
  }

// Ball hits blocks
blocks.forEach(block => {
  if (block.active &&
      ball.x > block.x &&
      ball.x < block.x + block.width &&
      ball.y > block.y &&
      ball.y < block.y + block.height) {
    ball.speedY = -ball.speedY;
    block.active = false;
    score += 10;  // ADD THIS LINE
  }
});

  // Game over if ball goes down
if (ball.y > canvas.height) {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
    alert('New Best Score: ' + score);
  } else {
    alert('Game Over! Score: ' + score);
  }
  
  // Reset game
  score = 0;
  level = 1;
  ball.x = 200;
  ball.y = 550;
  ball.speedX = 3;
  ball.speedY = -3;
  createBlocks();
}

  // Keep drawing
  requestAnimationFrame(draw);
}

// Paddle controls - FIXED
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    leftPressed = true;
  }
  if (event.key === 'ArrowRight') {
    rightPressed = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') {
    leftPressed = false;
  }
  if (event.key === 'ArrowRight') {
    rightPressed = false;
  }
});
// Start the game
draw();