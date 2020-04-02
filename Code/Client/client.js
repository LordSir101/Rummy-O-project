var socket = io();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var w = canvas.width;
var h = canvas.height;
var animation;

var background = document.createElement('img');
background.src = "images/background.jpg";
//game pieces
var board = [];
var hand = [];
var melds = [];
var isTurn = false;



//setup-----------------------------------------------------------------------------------------------------
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
//recieves the cards in the player's hand as well as the board
socket.on('tilePos', (playerHand, gameBoard, gameMelds)=>{
  hand = playerHand;
  board = gameBoard;
  melds = gameMelds;
});
socket.on('playerInfo', (turn)=>{
  isTurn = turn;
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
const button = document.getElementById("startButton");
button.addEventListener('click', startGame);

function startGame(){
  socket.emit('startGame');
  button.removeEventListener('click', startGame);
  button.style.display = "none";
}

socket.on("endGame", (didWin, id)=>{
  cancelAnimationFrame(animation);
  animation = null;
  displayEndScreen(didWin);
  //sleep(5000);
  //socket.emit("disconnect");
  if(didWin){
    socket.emit("removeGame", id)
  }

  button.addEventListener('click', startGame);
  button.style.display = "block";
});


const endTurn = document.getElementById("endTurn");
endTurn.addEventListener('click', () => {
  socket.emit('endTurn');
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
  drawHand();
  drawBoard();
  drawMelds();
  animation = requestAnimationFrame(animationLoop);
}

//draw functions---------------------------------------------------------------------------------------
// Draw canvas background
function drawBackground() {
  //ctx.fillStyle = "blue";
  //ctx.fillRect(0, 0, w, h);
  ctx.drawImage(background, 0,  0, w, h);

  //draw the border of the hand area
  var topOfHand = h - 70*2.2 - 90;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, topOfHand);
  ctx.lineTo(w, topOfHand);
  ctx.stroke();
}

//draw the tiles in hand.  These are not visible to other players
function drawHand(){
  for(i = 0; i < hand.length; i++){
    var tile = hand[i];
    ctx.fillStyle = "#ffe6cc";
    if(isTurn){
      ctx.strokeStyle = "blue";
    }
    else{
      ctx.strokeStyle = "red";
    }
    ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);
    ctx.fillRect(tile.x, tile.y, tile.width, tile.height);

    drawNumber(tile.x, tile.y, tile.width, tile.height, tile.suit, tile.value);
  }
}

//draw the board.  These are visible to all players
function drawBoard(){
  for(i = 0; i < board.length; i++){
    ctx.fillStyle = "#ffe6cc";
    var tile = board[i];
    ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
    drawNumber(tile.x, tile.y, tile.width, tile.height, tile.suit, tile.value);
  }

}

function drawMelds() {
  for (i = 0; i < melds.length; i++) {
    for (let j = 0; j < melds[i].tiles.length; j++) {
      ctx.fillStyle = "#ffe6cc";
      let tile = melds[i].tiles[j];
      ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
      drawNumber(tile.x, tile.y, tile.width, tile.height, tile.suit, tile.value);
    }
  }
}

//draw the values and color of the cards
function drawNumber(x, y, width, height, suit, value){
  ctx.fillStyle = suit;
  ctx.font = "30px Verdana";
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


//Drag tiles around---------------------------------------------------------------------------------
const canWrap = document.getElementById("canvasWrap");
canWrap.addEventListener('mousedown', (e)=>{
  if(!isTurn){return;}
  //offeset is the amount of pixels the user scrolled down.
  //scrolling down changes where the cards are drawn, but not thier hitboxes
  var offset = window.pageYOffset;
  console.log(e.clientY)
  socket.emit("mousedown", e.clientX, e.clientY, offset);
});
canWrap.addEventListener('mousemove', (e)=>{
  if(!isTurn){return;}
  socket.emit("mousemove", e.clientX, e.clientY);
});
canWrap.addEventListener('mouseup', (e)=>{
  if(!isTurn){return;}
  var offset = window.pageYOffset;
  socket.emit("mouseup", e.clientX, e.clientY, offset);
});

//display the game end screen
function displayEndScreen(didWin){
  ctx.drawImage(background, 0,  0, w, h);

  ctx.fillStyle = "white";
  ctx.font = "50px Verdana";
  ctx.textAlign = 'left'; //bases the poition of the text from the top left corner
  ctx.textBaseline = 'top';
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  var text = didWin ? "You Win!" : "You Lose";
  var length = ctx.measureText(text).width;

  var xpos = w/2 - length/2
  var ypos = h/2;

  ctx.strokeText(text, xpos, ypos);
  ctx.fillText(text, xpos, ypos);
}
