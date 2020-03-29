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

    //set an event listener to start animation loop on each client
    this.sockets.forEach((sock, i) => {
      this.players[i] = new Player();
      sock.emit("startAnimation");
      sock.on("canvasDim", (w, h)=>{
        //this ensures the setup function is only called once
        if(!this.setup){this.__setUp(w, h);}

      });
    });

    //add event listners for each player
    this.sockets.forEach((sock, idx) => {
      sock.on('mousedown', (ex, ey, wo) => {
        this.__mousedown(idx, ex, ey, wo);
      });
      sock.on('mousemove', (ex, ey) => {
        this.__mousemove(idx, ex, ey);
      });
      sock.on('mouseup', (ex, ey, wo) => {
        this.__mouseup(idx, ex, ey, wo);
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

    //we want to constantly update the position of the cards in hand to respond to any changes
    this.__setHandPos();
  }

  //set hand position---------------------------------------------------------------------------------------
  //Everytime a card moves out of a players hand, the positions are readjusted to fill up the space
  __setHandPos(){

    this.players.forEach((player, i) => {
      for(var i = 0; i < player.hand.length; i++){
        var tile = player.hand[i];

        //if the player is currently moving a tile, do not reset that tile's position
        if(player.selectedTile == tile){
          continue;
        }

        //top row
        if(i < player.hand.length/2){
          var posX = this.w/10 + (tile.width + 20)*i;
          var posY = this.h - tile.height - 120;

        }
        //bottom row
        else{
          var posX = this.w/10 + (tile.width + 20)* (i - Math.floor(player.hand.length/2));
          var posY = this.h - tile.height - 30;
        }

        tile.x = posX;
        tile.y = posY;

      }
    });
  }

  //click event handlers------------------------------------------------------------------------------------
  __mousedown(idx, ex, ey, wo){

    //wo is the window offset
    for(var i = 0; i < this.players[idx].hand.length; i++){
      //check if the click event is on a tile in the players hand
      //we need to subtract the window offset to make the card's hitbox line up with where the
      //card is being drawn
      if(ex > this.players[idx].hand[i].x && ex < this.players[idx].hand[i].x + this.players[idx].hand[i].width
        && ey > this.players[idx].hand[i].y - wo && ey < this.players[idx].hand[i].y - wo + this.players[idx].hand[i].height){

          //selected tile is a pointer to a tile that the player has selected.
          //this lets us use that tile in other event handlers
          this.players[idx].selectedTile = this.players[idx].hand[i];

          //we set inital x and y so that the card can move relative to where the user clicked
          //If the user clicks in the middle of a card, the middle of the card follows the cursor
          //If the user clicks near the left of the card, the left follows the cursor
          this.players[idx].initialX = ex - this.players[idx].hand[i].x;
          this.players[idx].initialY = ey - this.players[idx].hand[i].y;

          this.players[idx].dragActive = true;
        }
    }

    //check if the click event is on a tile on the board.
    //Card movment is handled the same as above
    for(var i = 0; i < this.board.length; i ++){
      if(ex > this.board[i].x && ex < this.board[i].x + this.board[i].width
        && ey > this.board[i].y -wo && ey < this.board[i].y - wo + this.board[i].height){

          this.players[idx].selectedTile = this.board[i];
          //when moving a tile on the board, keep track of its initial position
          this.players[idx].selectedTile.prevX = this.players[idx].selectedTile.x;
          this.players[idx].selectedTile.prevY = this.players[idx].selectedTile.y;

          this.players[idx].initialX = ex - this.board[i].x;
          this.players[idx].initialY = ey - this.board[i].y;

          this.players[idx].dragActive = true;
        }
    }
  }

  //The card sprite will follow the cursor based on the initial click
  __mousemove(idx, ex, ey){
    if(this.players[idx].dragActive){
      this.players[idx].selectedTile.x = ex - this.players[idx].initialX;
      this.players[idx].selectedTile.y = ey - this.players[idx].initialY;
    }
  }

  __mouseup(idx, ex, ey, wo){
    if(this.players[idx].dragActive){
      //set the position of the card
      this.players[idx].selectedTile.x = ex - this.players[idx].initialX;
      this.players[idx].selectedTile.y = ey - this.players[idx].initialY; //+ wo;

      this.players[idx].dragActive = false;
      this.players[idx].selectedTile.snapOn(ex, ey + wo);

      //if a tile is played from hand and not in an invalid position
      var topOfHand = this.h - this.players[idx].selectedTile.height*2.2 - 90;
      if(!this.players[idx].selectedTile.inIllegalPosition(this.board, topOfHand)
          && this.players[idx].selectedTile.inHand){
        //if the player moved a tile from their hand, remove it and add it to the board
        //This makes the tile visible to all players
        this.board.push(this.players[idx].playTile(this.players[idx].selectedTile));
        this.players[idx].selectedTile.inHand = false;
      }

      //if a tile was moved from the board to an invalid position
      else if(this.players[idx].selectedTile.inIllegalPosition(this.board, topOfHand)
          && !this.players[idx].selectedTile.inHand){

          //move the tile to its origional position
          this.players[idx].selectedTile.x = this.players[idx].selectedTile.prevX;
          this.players[idx].selectedTile.y = this.players[idx].selectedTile.prevY;
      }

      //this.players[idx].playTile(this.players[idx].selectedTile);
      this.players[idx].selectedTile = null;
    }
  }



}

module.exports = GameView;
