const Player = require('./Player');

class GameView{
  constructor(sockets){
    this.sockets = sockets;
    this.players = [];
  }
}

module.exports = GameView;
