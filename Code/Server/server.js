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

const GameView = require('GameView.js');
const Tile = reaquire('Tile.js');

// Assign the working directory
const clientPath = `${__dirname}/../client`; //Note you have to use these quotes ``
console.log(`Serving from ${clientPath}`);
app.use(express.static(clientPath));

// Create the server
const server = http.createServer(app);
const io = socketio(server);




// Run the server
server.on('error', (err) =>{
  console.error('server error:' + err);
});

server.listen(port, 'localhost');
console.log(`Rummy-O started on port: ${port}`);
