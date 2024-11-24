// DOM Elements
const homepage = document.getElementById("homepage");
const startButton = document.getElementById("startButton");
const quitButton = document.getElementById("quitButton");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

// Benchmark DOM Elements
const benchmarkTimeDisplay = document.getElementById("benchmarkTime");
const benchmarkScoreDisplay = document.getElementById("benchmarkScore");

// Variables
let isRunning = false;
let obstacles = [];
let benchmarkTime = 5;
let benchmarkScore = 0;
let score = 0;
let startTime = null;
let obstacleSpeed = 5;
let spawnRate = 1000;

// Player Settings
const player = {
  x: 50,
  y: gameCanvas.height - 18,
  width: 8,
  height: 8,
};

// Key Controls
let isJumping = false;
let jumpY = 0;
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && !isJumping) {
    isJumping = true;
    jumpY = -20;
    setTimeout(() => {
      isJumping = false;
      jumpY = 0;
    }, 300);
  }
});

// Start Game
startButton.addEventListener("click", () => {
  homepage.style.display = "none";
  gameCanvas.style.display = "block";
  quitButton.style.display = "block";
  startGame();
});

// Quit Game
quitButton.addEventListener("click", () => {
  isRunning = false;
  updateBenchmarkStats();
  homepage.style.display = "block";
  gameCanvas.style.display = "none";
  quitButton.style.display = "none";
});

// Game Logic
function startGame() {
  isRunning = true;
  obstacles = [];
  score = 0;
  startTime = Date.now();
  let lastObstacleTime = 0;

  function gameLoop() {
    if (!isRunning) return;

    const elapsedTime = (Date.now() - startTime) / 1000;
    const currentTime = Date.now();

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y + jumpY, player.width, player.height);

    ctx.fillStyle = "green";
    ctx.fillRect(0, gameCanvas.height - 10, gameCanvas.width, 10);

    if (currentTime - lastObstacleTime > spawnRate) {
      if (Math.random() < 0.02) {
        obstacles.push({
          x: gameCanvas.width,
          y: gameCanvas.height - 10 - 8,
          width: 8,
          height: 8,
        });
        lastObstacleTime = currentTime;
      }
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obstacle = obstacles[i];
      obstacle.x -= obstacleSpeed;

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(obstacle.x, obstacle.y);
      ctx.lineTo(obstacle.x + obstacle.width, obstacle.y);
      ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y - obstacle.height);
      ctx.closePath();
      ctx.fill();

      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y + jumpY < obstacle.y + obstacle.height &&
        player.y + player.height + jumpY > obstacle.y
      ) {
        isRunning = false;
        alert(`Game Over! Your score: ${score}`);
        quitButton.click();
        return;
      }

      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(i, 1);
      }
    }

    if (elapsedTime > benchmarkTime) {
      score = Math.floor(elapsedTime - benchmarkTime);
    }

    ctx.fillStyle = "black";
    ctx.font = "12px monospace";
    ctx.fillText(`Time: ${Math.floor(elapsedTime)}s`, 10, 20);
    ctx.fillText(`Score: ${score}`, 10, 40);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

// Update Benchmark Stats
function updateBenchmarkStats() {
  const elapsedTime = (Date.now() - startTime) / 1000;

  if (elapsedTime > benchmarkTime) {
    benchmarkTime = Math.floor(elapsedTime);
  }
  if (score > benchmarkScore) {
    benchmarkScore = score;
  }

  benchmarkTimeDisplay.textContent = `${benchmarkTime}s`;
  benchmarkScoreDisplay.textContent = `${benchmarkScore}`;
}

