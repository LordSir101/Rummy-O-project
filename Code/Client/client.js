var socket = io();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var w = canvas.width;
var h = canvas.height;
var animation;

window.onload = function () {
  console.log("client.js successfully loaded!");
};
/*
socket.on("gameId", (id)=>{
  var d = new Date();
  d.setTime(d.getTime() + (1*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = "gameid = "+ id + ";" + expires;
});*/
/*
socket.on("getCookie", ()=>{
  var id = getCookie("gameId");
  socket.emit("sendCookie", id, socket);
});*/

socket.on("startAnimation", ()=>{
  animationLoop();
});
/*
function getCookie(cname) {
  var id = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}*/

// Button listener to start the game
//const addButtonListeners = () => {
const button = document.getElementById("startButton");
button.addEventListener('click', () => {
  console.log("pressed");
  socket.emit('startGame');
});

// Main animation loop
function animationLoop() {
  drawBackground();
  displayPlayers();
  animation = requestAnimationFrame(animationLoop);
}

// Draw canvas background
function drawBackground() {
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, w, h);
}

// Displays the connected players
function displayPlayers() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("The game has started!", 10, 50);
}
