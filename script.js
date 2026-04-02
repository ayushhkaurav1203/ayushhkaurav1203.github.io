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

// 🐦 BIRD (SIZE FIX)
let bird = {
  x: 80,
  y: 200,
  width: 50,
  height: 40,
  gravity: 0.5,
  velocity: 0,
  lift: -8
};

// 🟩 PIPES (SIZE FIX)
let pipes = [];
let pipeWidth = 80;
let gap = 170;

// GAME
let score = 0;

// CLICK
document.addEventListener("click", () => {
  bird.velocity = bird.lift;
});

// CREATE PIPE
function createPipe() {
  let top = Math.random() * 180 + 60;

  pipes.push({
    x: canvas.width,
    top: top,
    bottom: canvas.height - top - gap,
    passed: false
  });
}

// DRAW LOOP
function draw() {

  // Background
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  }

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Pipes
  pipes.forEach(pipe => {
    pipe.x -= 2;

    // DRAW
    ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.top);
    ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);

    // SCORE
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

  // REMOVE
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  // NEW PIPE
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) {
    createPipe();
  }

  // 🐦 DRAW BIRD
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // SCORE
  ctx.fillStyle = "white";
  ctx.font = "bold 30px Arial";
  ctx.fillText(score, canvas.width / 2 - 10, 50);

  // 🔥 PERFECT COLLISION (NO GLITCH)
  if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
    resetGame();
  }

  pipes.forEach(pipe => {
    if (
      bird.x + 5 < pipe.x + pipeWidth &&
      bird.x + bird.width - 5 > pipe.x
    ) {
      if (
        bird.y + 5 < pipe.top ||
        bird.y + bird.height - 5 > canvas.height - pipe.bottom
      ) {
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

// START
draw();

};
