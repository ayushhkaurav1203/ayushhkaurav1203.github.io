const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 500;

let birdY = 200;
let gravity = 0.5;
let velocity = 0;
let gameRunning = false;

document.getElementById("startBtn").addEventListener("click", () => {
  gameRunning = true;
  document.getElementById("startBtn").style.display = "none";
  loop();
});

document.addEventListener("click", () => {
  velocity = -8;
});

function loop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  velocity += gravity;
  birdY += velocity;

  // bird
  ctx.fillStyle = "yellow";
  ctx.fillRect(50, birdY, 30, 30);

  requestAnimationFrame(loop);
}

function openMenu() {
  window.location.href = "menu.html";
}
