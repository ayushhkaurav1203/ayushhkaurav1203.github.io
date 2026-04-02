window.onload = function () {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 520;

// IMAGES
const birdImg = new Image();
const bgImg = new Image();
const pipeImg = new Image();

birdImg.src = "bird.png";
bgImg.src = "bg.png";
pipeImg.src = "pipe.png";

// BIRD
let bird = {
  x: 80,
  y: 200,
  width: 40,
  height: 30,
  gravity: 0.4,
  velocity: 0,
  lift: -7
};

// PIPES
let pipes = [];
let pipeWidth = 60;
let gap = 150;

// GAME
let score = 0;

// CLICK / TAP
document.addEventListener("click", () => {
  bird.velocity = bird.lift;
});

// CREATE PIPE
function createPipe() {
  let top = Math.random() * 200 + 50;

  pipes.push({
    x: canvas.width,
    top: top,
    bottom: canvas.height - top - gap,
    passed: false
  });
}

// DRAW
function draw() {

  // Background fallback
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  }

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Pipes update
  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Draw pipes
    ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.top);
    ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);

    // Score
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

  // Remove pipes
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  // New pipe
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 220) {
    createPipe();
  }

  // Draw bird
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // Score
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText(score, canvas.width / 2 - 10, 50);

  // Collision
  if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
    resetGame();
  }

  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x
    ) {
      if (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom) {
        resetGame();
      }
    }
  });

  requestAnimationFrame(draw);
}

// RESET
function resetGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
}

// START GAME AUTOMATICALLY
draw();

};
