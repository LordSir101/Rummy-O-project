const Player = require('./Player');

class GameView{
  constructor(sockets){
    this.sockets = sockets;
    this.players = [];

    this.sockets.forEach((sock, i) => {
      this.players[i] = new Player();
      sock.emit("startAnimation");
    });
    /*
    this.sockets.forEach((sock, i) => {
      socket.on('disconnect', function() {
        var index = this.sockets.indexOf(sock);
        this.sockets.splice(index, 1);

        //add player to end of player array
        var player = this.players.splice(index, 1);
        this.players.push(player);

      });
    });*/

  }
  /*
  __recconectPlayer(sock){
    this.sockets.push(sock);
    sock.emit("startAnimation");
  }*/

}

module.exports = GameView;
