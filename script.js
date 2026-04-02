const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 500;

// Bird
let bird = {
  x: 50,
  y: 200,
  width: 30,
  height: 30,
  gravity: 0.5,
  velocity: 0,
  lift: -8
};

// Pipes
let pipes = [];
let pipeWidth = 50;
let gap = 120;

// Game state
let gameRunning = false;
let score = 0;

// START BUTTON
document.getElementById("startBtn").addEventListener("click", startGame);

// Tap / Click = Jump
document.addEventListener("click", () => {
  if (gameRunning) {
    bird.velocity = bird.lift;
  }
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
  let topHeight = Math.random() * 200 + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - gap
  });
}

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";

  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);

    ctx.fillRect(
      pipe.x,
      canvas.height - pipe.bottom,
      pipeWidth,
      pipe.bottom
    );
  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) {
    createPipe();
  }
}

function checkCollision() {
  if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
    return true;
  }

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
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function loop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  updatePipes();
  drawPipes();
  drawBird();

  pipes.forEach(pipe => {
    if (pipe.x === bird.x) {
      score++;
    }
  });

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
