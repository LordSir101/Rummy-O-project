var socket = io();

var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');

var w = canvas.width;
var h = canvas.height;
var animation;

window.onload = function () {
  console.log("client.js successfully loaded!");
};

// Button listener to start the game
const addButtonListeners = () => {
  const button = getElementById(id);
  button.addEventListener('click', () => {
    socket.emit('startGame');
  });
}

// Main animation loop 
function animationLoop() {
  drawBackground();
  displayPlayers();
  animation = requestAnimationFrame(animationLoop);
}

// Draw canvas background
function drawBackground() {
  ctx.fillStyle = "powderblue";
  ctx.fillRect(0, 0, w, h);
}

// Displays the connected players
function displayPlayers() {
  ctx.font = "30px Arial";
  ctx.fillText("The game has started!", 10, 50);
}