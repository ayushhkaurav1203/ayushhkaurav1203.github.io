window.onload = function () {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 520;

// IMAGES
const birdImg = new Image();
birdImg.src = "bird.png";

const bgImg = new Image();
bgImg.src = "bg.png";

const pipeImg = new Image();
pipeImg.src = "pipe.png";

// GAME STATE
let gameStarted = false;

// BIRD (SMOOTH)
let bird = {
  x: 80,
  y: 200,
  w: 45,
  h: 35,
  vel: 0,
  gravity: 0.5,
  jump: -8
};

// PIPES
let pipes = [];
let gap = 160;
let pipeW = 70;

// SCORE
let score = 0;

// START
document.getElementById("startBtn").onclick = () => {
  gameStarted = true;
  document.getElementById("startBtn").style.display = "none";
};

// TAP
document.addEventListener("click", () => {
  if (gameStarted) bird.vel = bird.jump;
});

// CREATE PIPE
function addPipe() {
  let top = Math.random() * 200 + 50;

  pipes.push({
    x: canvas.width,
    top: top,
    bottom: canvas.height - top - gap,
    passed: false
  });
}

// LOOP
function gameLoop() {

  // BG
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  }

  if (gameStarted) {

    // BIRD PHYSICS (SMOOTH)
    bird.vel += bird.gravity;
    bird.y += bird.vel;

    // PIPES
    pipes.forEach(p => {
      p.x -= 2;

      ctx.drawImage(pipeImg, p.x, 0, pipeW, p.top);
      ctx.drawImage(pipeImg, p.x, canvas.height - p.bottom, pipeW, p.bottom);

      // SCORE
      if (!p.passed && p.x + pipeW < bird.x) {
        score++;
        p.passed = true;
      }
    });

    // NEW PIPE
    if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) {
      addPipe();
    }

    // REMOVE
    pipes = pipes.filter(p => p.x + pipeW > 0);

    // COLLISION (SMOOTH HITBOX)
    for (let p of pipes) {
      if (
        bird.x + 8 < p.x + pipeW &&
        bird.x + bird.w - 8 > p.x
      ) {
        if (
          bird.y + 8 < p.top ||
          bird.y + bird.h - 8 > canvas.height - p.bottom
        ) {
          reset();
        }
      }
    }

    if (bird.y <= 0 || bird.y + bird.h >= canvas.height) reset();
  }

  // DRAW BIRD
  ctx.drawImage(birdImg, bird.x, bird.y, bird.w, bird.h);

  // SCORE UI
  ctx.fillStyle = "white";
  ctx.font = "bold 28px Arial";
  ctx.fillText(score, canvas.width / 2 - 10, 50);

  requestAnimationFrame(gameLoop);
}

// RESET
function reset() {
  bird.y = 200;
  bird.vel = 0;
  pipes = [];
  score = 0;
}

gameLoop();

};
