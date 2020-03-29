var socket = io();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var w = canvas.width;
var h = canvas.height;
var animation;

var dragActive = false;

//game pieces
var board = [];
var hand = [];

//for dragging
var intialX;
var intialY;

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
  socket.emit("canvasDim", w, h);
  animationLoop();
});

socket.on('tilePos', (playerHand, gameBoard)=>{
  hand = playerHand;
  board = gameBoard;
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
const sortValue = document.getElementById("sortValue");
sortValue.addEventListener("click", () => {
  socket.emit('sortValue');
});
const sortColor = document.getElementById("sortColor");
sortColor.addEventListener("click", () => {
  socket.emit('sortColor');
});
// Main animation loop
function animationLoop() {
  drawBackground();
  //displayPlayers();
  drawHand();
  drawBoard();
  animation = requestAnimationFrame(animationLoop);
}

// Draw canvas background
function drawBackground() {
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, w, h);
}

function drawHand(){

  for(i = 0; i < hand.length; i++){
    var tile = hand[i];
    ctx.fillStyle = "white";
    ctx.fillRect(tile.x, tile.y, tile.width, tile.height);

    drawNumber(tile.x, tile.y, tile.width, tile.height, tile.suit, tile.value);
  }
}

function drawBoard(){

  for(i = 0; i < board.length; i++){
    ctx.fillStyle = "white";
    var tile = board[i];
    ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
    drawNumber(tile.x, tile.y, tile.width, tile.height, tile.suit, tile.value);
  }
}

function drawNumber(x, y, width, height, suit, value){
  //draw number
  ctx.fillStyle = suit;
  ctx.font = "30px Verdana"
  ctx.textAlign = 'left'; //bases the poition of the text from the top left corner
  ctx.textBaseline = 'top';
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  var text = value + "";
  var length = ctx.measureText(text).width;

  var xpos = x + width/2 - length/2
  var ypos = y + height/2 - 10

  ctx.strokeText(text, xpos, ypos);
  ctx.fillText(text, xpos, ypos);
}

// Displays the connected players
function displayPlayers() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("The game has started!", 10, 50);
}

//Drag tiles around---------------------------------------------------------------------------------
const canWrap = document.getElementById("canvasWrap");
canWrap.addEventListener('mousedown', (e)=>{
    var offset = window.pageYOffset;
    socket.emit("mousedown", e.clientX, e.clientY, offset);
});
canWrap.addEventListener('mousemove', (e)=>{
  socket.emit("mousemove", e.clientX, e.clientY);
});
canWrap.addEventListener('mouseup', (e)=>{
  var offset = window.pageYOffset;
  socket.emit("mouseup", e.clientX, e.clientY, offset);
});
