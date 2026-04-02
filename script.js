const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 520;

// IMAGES (PNG FIXED)
const birdImg = new Image();
birdImg.src = "bird.png";

const bgImg = new Image();
bgImg.src = "bg.png";

const pipeImg = new Image();
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
let gameRunning = false;
let score = 0;

// START BUTTON
document.getElementById("startBtn").onclick = startGame;

// CLICK / TAP
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

// DRAW BIRD (ROTATION 🔥)
function drawBird() {
  ctx.save();

  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);

  let angle = bird.velocity * 0.05;
  ctx.rotate(angle);

  ctx.drawImage(
    birdImg,
    -bird.width / 2,
    -bird.height / 2,
    bird.width,
    bird.height
  );

  ctx.restore();
}

// DRAW PIPES
function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.top);

    ctx.drawImage(
      pipeImg,
      pipe.x,
      canvas.height - pipe.bottom,
      pipeWidth,
      pipe.bottom
    );
  });
}

// UPDATE PIPES
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 1.8;

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

// COLLISION FIXED
function checkCollision() {
  if (bird.y <= 0 || bird.y + bird.height >= canvas.height) return true;

  for (let pipe of pipes) {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x
    ) {
      if (bird.y < pipe.top) return true;
      if (bird.y + bird.height > canvas.height - pipe.bottom) return true;
    }
  }

  return false;
}

// SCORE
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "bold 30px Arial";
  ctx.fillText(score, canvas.width / 2 - 10, 60);
}

// LOOP
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

// GAME OVER
function gameOver() {
  gameRunning = false;
  alert("Game Over! Score: " + score);
  document.getElementById("startBtn").style.display = "block";
}

// MENU
function openMenu() {
  window.location.href = "menu.html";
}
