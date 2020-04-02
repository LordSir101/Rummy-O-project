/*
  SERVER COMMANDS: Navigate Command Prompt to Rummy-O/server to use these commands
    npm run dev (This will run the developer version - server will restart when changes are made)
    npm start (This will run the release version - server will not restart when changes are made)
    CTRL+C to stop the server
*/

// Dependencies
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const port = 3000;

const GameView = require('./GameView');
const Tile = require('./Tile.js');

var players = [];
var waitingPlayers = [];
var games = [];

// Assign the working directory
const clientPath = `${__dirname}/../client`; //Note you have to use these quotes ``
console.log(`Serving from ${clientPath}`);
app.use(express.static(clientPath));

// Create the server
const server = http.createServer(app);
const io = socketio(server);


io.on('connection', (sock) => {
  players.push(sock);

  //called when player presses start button
  sock.on('startGame', ()=>{

    waitingPlayers.push(sock);

    //If there are 4 waiting players, start the game
    if(waitingPlayers.length == 2){
      var gameId = games.size; //this will be the index of the game
      var game = new GameView(waitingPlayers, gameId);
      games.push(game);
      /*
      var gameId = games.indexOf(game);

      games.forEach((sock) => {
        sock.emit("gameId", gameId);
      });*/
      console.log("players " + players.length);
      console.log("games " + games.length);
      waitingPlayers = [];
    }
  });

  sock.on('disconnect', (sock)=>{
    let idx = players.indexOf(sock);
    players.splice(idx, 1);
    //console.log("players " + players.length)
  });

  sock.on("removeGame", (id)=>{

    for(var i = games.length-1; i >= 0; i--) {
      if(games[i].gameId == id){
        let idx = games.indexOf(games[i])
        games.splice(idx, 1);
      }
    }
  //  console.log("players " + players.length);
    console.log("games " + games.length);
  })
});



  /*
  sock.emit("getCookie");
  sock.on("sendCookie", addToGame);

});

const addToGame = (id, sock) =>{
  if(id != ""){
    games[id].reconnectPlayer(sock);
  }
}
*/


// Run the server
server.on('error', (err) =>{
  console.error('server error:' + err);
});

server.listen(port, 'localhost');
console.log(`Rummy-O started on port: ${port}`);
