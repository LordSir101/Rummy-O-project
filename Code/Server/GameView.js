const Player = require('./Player');
const Deck = require('./Deck');

class GameView {
  constructor(sockets) {
    this.sockets = sockets;
    this.players = [];
    this.w;
    this.h;
    this.setup = false;

    this.deck = new Deck();
    this.board = [];

    this.sockets.forEach((sock, i) => {
      this.players[i] = new Player();
      sock.emit("startAnimation");
      sock.on("canvasDim", (w, h)=>{
        if(!this.setup){this.__setUp(w, h);}

      });
    });

    //add event listner for each player
    //we only need mouseup event because the other players will not see other players dragging tiles around
    this.sockets.forEach((sock, idx) => {
      sock.on('mousedown', (ex, ey, wo) => {
        this.__mousedown(idx, ex, ey, wo);
      });
      sock.on('mousemove', (ex, ey) => {
        this.__mousemove(idx, ex, ey);
      });
      sock.on('mouseup', (ex, ey) => {
        this.__mouseup(idx, ex, ey);
      });
      sock.on('sortValue', () => {
        this.players[idx].sortHandByValue();
      });
      sock.on('sortColor', () => {
        this.players[idx].sortHandByColor();

      });
    });


    this.__updateVariables();

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

  //main game loop---------------------------------------------------------------------------------------------
  __updateVariables(){
      this.__update();

      this.loop = setTimeout(this.__updateVariables.bind(this), 16.6);
  }

  //Game setup------------------------------------------------------------------------------------------------
  __setUp(w, h){
    this.deck.createDeck();
    this.deck.shuffle();
    //console.log(h);
    this.players.forEach((player, i) => {
      for(var i = 0; i < 14; i++){
        player.addTile(this.deck.deal());
      }

    });
    this.w = w;
    this.h = h;
    this.setup = true;
  }

  //update game info--------------------------------------------------------------------------------------------
  __update(){
    this.sockets.forEach((sock, i) => {
      //send the players' hand and game board positions
      sock.emit("tilePos", this.players[i].hand, this.board);
    });

    //re draw the hand so it looks nice
    this.__setHandPos();
  }

  //set hand position
  //when a tile gets moved out of a player's hand, the rest of teh tiles will move
  __setHandPos(){

    this.players.forEach((player, i) => {
      for(var i = 0; i < player.hand.length; i++){
        var tile = player.hand[i];

        //if the player is currently moving a tile, do not reset its position
        if(player.selectedTile == tile){
          continue;
        }

        if(i < player.hand.length/2){
          var posX = this.w/10 + (tile.width + 20)*i;

          var posY = this.h - tile.height - 90;

        }
        else{
          var posX = this.w/10 + (tile.width + 20)* (i - Math.floor(player.hand.length/2));
          var posY = this.h - tile.height - 10;
        }

        tile.x = posX;
        tile.y = posY;

        //console.log(this.h);
      }
    });
  }
  //click event handlers------------------------------------------------------------------------------------
  __mousedown(idx, ex, ey, wo){

    for(var i = 0; i < this.players[idx].hand.length; i++){

      //check if the click event is on a tile in the players hand
      if(ex > this.players[idx].hand[i].x && ex < this.players[idx].hand[i].x + this.players[idx].hand[i].width
        && ey > this.players[idx].hand[i].y - wo && ey < this.players[idx].hand[i].y - wo + this.players[idx].hand[i].height){
          this.players[idx].selectedTile = this.players[idx].hand[i];
          this.players[idx].selectedIdx = i;

          this.players[idx].initialX = ex - this.players[idx].hand[i].x;
          this.players[idx].initialY = ey - this.players[idx].hand[i].y;

          this.players[idx].dragActive = true;
        }
    }

    for(var i = 0; i < this.board.length; i ++){
      //check if the click event is on a tile on the board
      if(ex > this.board[i].x && ex < this.board[i].x + this.board[i].width
        && ey > this.board[i].y -wo && ey < this.board[i].y - wo + this.board[i].height){
          this.players[idx].selectedTile = this.board[i];
          this.players[idx].selectedIdx = i;

          this.players[idx].initialX = ex - this.board[i].x;
          this.players[idx].initialY = ey - this.board[i].y;

          this.players[idx].dragActive = true;
        }
    }
  }

  __mousemove(idx, ex, ey){
    if(this.players[idx].dragActive){
      this.players[idx].selectedTile.x = ex - this.players[idx].initialX;
      this.players[idx].selectedTile.y = ey - this.players[idx].initialY;
    }
  }

  __mouseup(idx, ex, ey){
    if(this.players[idx].dragActive){
      this.players[idx].selectedTile.x = ex - this.players[idx].initialX;
      this.players[idx].selectedTile.y = ey - this.players[idx].initialY; //+ wo;

      //if the player moved a tile fro thier hand, remove it and add it to the board
      if(this.players[idx].selectedTile.inHand){
        this.board.push(this.players[idx].selectedTile);
        this.players[idx].selectedTile.inHand = false;
        this.players[idx].hand.splice(this.players[idx].selectedIdx, 1);
      }

      this.players[idx].dragActive = false;
      this.players[idx].selectedTile.snapOn(ex, ey);

      //this.players[idx].playTile(this.players[idx].selectedTile);
      this.players[idx].selectedTile = null;
    }
  }



}

module.exports = GameView;
