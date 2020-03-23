const Player = require('GameView.js');

class GameView{
  constructor(p1, p2, p3, p4){
    this.sockets = [p1, p2, p3, p4];
    this.players = [];
  }
}

module.exports = Events;
