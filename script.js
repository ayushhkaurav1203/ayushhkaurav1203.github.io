const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 520;

// Images
const birdImg = new Image();
birdImg.src = "bird.png";

const bgImg = new Image();
bgImg.src = "bg.jpg";

const pipeImg = new Image();
pipeImg.src = "pipe.png";

// Bird
let bird = {
  x: 60,
  y: 200,
  width: 40,
  height: 30,
  gravity: 0.4,
  velocity: 0,
  lift: -7
};

// Pipes
let pipes = [];
let pipeWidth = 70;
let gap = 160;

// Game
let gameRunning = false;
let score = 0;

// Start
document.getElementById("startBtn").onclick = startGame;

// Jump
document.addEventListener("click", () => {
  if (gameRunning) bird.velocity = bird.lift;
});

function startGame() {
  gameRunning = true;
  score = 0;
  pipes = [];
  bird.y = 200;
  bird.velocity = 0;

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";

  loop();
}

function createPipe() {
  let top = Math.random() * 200 + 50;

  pipes.push({
    x: canvas.width,
    top: top,
    bottom: canvas.height - top - gap,
    passed: false
  });
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.top);

    ctx.save();
    ctx.translate(pipe.x + pipeWidth, canvas.height - pipe.bottom);
    ctx.scale(-1, 1);
    ctx.drawImage(pipeImg, 0, 0, pipeWidth, pipe.bottom);
    ctx.restore();
  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  if (pipes.length === 0 || pipes[pipes.length - 1].x < 220) {
    createPipe();
  }
}

function checkCollision() {
  if (bird.y <= 0 || bird.y + bird.height >= canvas.height) return true;

  for (let pipe of pipes) {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top ||
        bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      return true;
    }
  }

  return false;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText(score, canvas.width / 2 - 10, 50);
}

function loop() {
  if (!gameRunning) return;

  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  updatePipes();
  drawPipes();
  drawBird();
  drawScore();

  if (checkCollision()) {
    gameOver();
    return;
  }

  requestAnimationFrame(loop);
}

function gameOver() {
  gameRunning = false;
  alert("Game Over! Score: " + score);
  document.getElementById("startBtn").style.display = "block";
}

function openMenu() {
  window.location.href = "menu.html";
    }
