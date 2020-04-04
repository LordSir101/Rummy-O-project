const Player = require('./Player');
const Deck = require('./Deck');
const Meld = require('./Meld');

class GameView {
  constructor(sockets, gameId) {
    this.sockets = sockets;
    this.players = [];
    this.w;
    this.h;
    this.setup = false;
    this.deck = new Deck();
    this.board = [];
    this.melds = [];
    this.loop;
    this.id = gameId;
    this.gameOver = false;
    //this.gameId = gameId;
    //set an event listener to start animation loop on each client
    this.sockets.forEach((sock, i) => {
      this.players[i] = new Player(gameId);
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
      sock.on('endTurn', () => {
        this.__endTurn(idx);
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
    //console.log("updateVariables");
      this.__update();
      if(this.gameOver){
        clearTimeout(this.loop);
      }
      else{
        this.loop = setTimeout(this.__updateVariables.bind(this), 16.6);
      }
  }

  //Game setup------------------------------------------------------------------------------------------------
  __setUp(w, h){
    this.deck.createDeck();
    this.deck.shuffle();
    this.players[0].isTurn = true;
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

    //check if a player won
    this.players.forEach((player, i) => {
      if(player.won){
        this.gameOver = true;
        //this.sockets[i].emit("removeGame", this.gameId); //we only want to send this once
        this.sockets.forEach((sock, i) => {
          sock.emit("endGame", this.players[i].won, this.gameId);
        });
      }
    });

    this.sockets.forEach((sock, i) => {
      //send the players' hand and game board positions
      sock.emit("tilePos", this.players[i].hand, this.board, this.melds);
      sock.emit("playerInfo", this.players[i].isTurn);
    });


    //we want to constantly update the position of the cards in hand to respond to any changes
    this.__setHandPos();
    /*
    this.melds.forEach((meld) => {
      meld.drawMeld();
    });*/

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
    let player = this.players[idx]
    //wo is the window offset
    for(var i = 0; i < player.hand.length; i++){
      //check if the click event is on a tile in the players hand
      //we need to subtract the window offset to make the card's hitbox line up with where the
      //card is being drawn
      if(ex > player.hand[i].x && ex < player.hand[i].x + player.hand[i].width
        && ey > player.hand[i].y - wo && ey < player.hand[i].y - wo + player.hand[i].height){

          //selected tile is a pointer to a tile that the player has selected.
          //this lets us use that tile in other event handlers
          player.selectedTile = player.hand[i];

          //we set inital x and y so that the card can move relative to where the user clicked
          //If the user clicks in the middle of a card, the middle of the card follows the cursor
          //If the user clicks near the left of the card, the left follows the cursor
          player.initialX = ex - player.hand[i].x;
          player.initialY = ey - player.hand[i].y;

          player.dragActive = true;
        }
    }

    //check if the click event is on a tile on the board.
    //Card movment is handled the same as above
    for(var i = 0; i < this.board.length; i ++){
      if(ex > this.board[i].x && ex < this.board[i].x + this.board[i].width
        && ey > this.board[i].y -wo && ey < this.board[i].y - wo + this.board[i].height){

          player.selectedTile = this.board[i];
          //when moving a tile on the board, keep track of its initial position
          player.selectedTile.prevX = player.selectedTile.x;
          player.selectedTile.prevY = player.selectedTile.y;

          player.initialX = ex - this.board[i].x;
          player.initialY = ey - this.board[i].y;

          player.dragActive = true;
        }
    }

    //check if the click event is on a tile in a meld.
    for(var i = 0; i < this.melds.length; i ++){
      for(var j = 0; j < this.melds[i].tiles.length; j++){
        if(ex > this.melds[i].tiles[j].x && ex < this.melds[i].tiles[j].x + this.melds[i].tiles[j].width
          && ey > this.melds[i].tiles[j].y -wo && ey < this.melds[i].tiles[j].y - wo + this.melds[i].tiles[j].height){

            //remove tile from meld if not in the middle
            player.selectedTile = this.melds[i].removeTile(this.melds[i].tiles[j]);

            if(player.selectedTile != null){
              //player.selectedTile.inMeld = true;
              //when moving a tile on the board, keep track of its initial position
              player.selectedTile.prevX = player.selectedTile.x;
              player.selectedTile.prevY = player.selectedTile.y;

              player.initialX = ex - player.selectedTile.x;
              player.initialY = ey - player.selectedTile.y;

            //this.board.push(player.selectedTile);
              //this.melds[i].drawMeld();

              player.dragActive = true;
            }
            else{
              player.dragActive = false;
            }

          }
      }

    }
  }

  //The card sprite will follow the cursor based on the initial click
  __mousemove(idx, ex, ey){
    let player = this.players[idx];
    if(player.dragActive){
      player.selectedTile.x = ex - player.initialX;
      player.selectedTile.y = ey - player.initialY;
    }
  }

  __mouseup(idx, ex, ey, wo){
    let player = this.players[idx];
    if(player.dragActive){
      //set the position of the card
      player.selectedTile.x = ex - player.initialX;
      player.selectedTile.y = ey - player.initialY; //+ wo;

      player.dragActive = false;
      player.selectedTile.snapOn(ex, ey + wo);

      // Check if card is in illegal position
      var topOfHand = this.h - player.selectedTile.height*2.2 - 90;
      if(player.selectedTile.inIllegalPosition(this.board, topOfHand)){

          //move the tile to its origional position
          player.selectedTile.x = player.selectedTile.prevX;
          player.selectedTile.y = player.selectedTile.prevY;
          player.selectedTile = null;
          return;
      }

      //if the player moved a tile from their hand, remove it and add it to the board
      //This makes the tile visible to all players

      // Check if the player is overlapping a meld
      for (let i = 0; i < this.melds.length; i++) {
        //if overlap and valid
        if (this.melds[i].onMeld(ex, ey + wo) && this.melds[i].isValid(player.selectedTile, ex)) {
          this.melds[i].addTile(player.selectedTile, this.board, ex);
          player.selectedTile.inMeld = true;
          player.playTile(player.selectedTile);

          if(player.selectedTile.inHand){
            player.selectedTile.inHand = false;
          }
          player.selectedTile = null;
          return;
        }
        //if overlap and not valid
        if (this.melds[i].onMeld(ex, ey + wo) && !this.melds[i].isValid(player.selectedTile, ex)) {

          if(!player.selectedTile.inHand){
            player.selectedTile.x = player.selectedTile.prevX;
            player.selectedTile.y = player.selectedTile.prevY;
          }

          player.selectedTile = null;
          //we return here because all meld tiles are now board tiles as well
          return;
        }

      }

      // Check if the player is overlapping a board tile
      var overlap = player.selectedTile.overlapsTile(this.board);
      if (overlap != null) {
        //overlap becomes the first tile in the meld
        let meld = new Meld(overlap);
        if (meld.isValid(player.selectedTile, ex)) {
          meld.addTile(player.selectedTile, this.board, ex);
          player.selectedTile.inMeld = true;
          this.melds.push(meld);
          if(player.selectedTile.inHand){
            player.playTile(player.selectedTile);
            player.selectedTile.inHand = false;
          }
        }
        //if there is an overlap but the meld is not is not valid
        else{
          overlap.inMeld = false;
          player.selectedTile.x = player.selectedTile.prevX;
          player.selectedTile.y = player.selectedTile.prevY;
        }
      }
      //Tile is played by itself
      else if (player.selectedTile.inHand){
        //console.log(player.selectedTile.value);
        if(player.selectedTile.value != "J"){
          this.board.push(player.playTile(player.selectedTile));
          player.selectedTile.inHand = false;
        }

      }
      player.selectedTile = null;

      //player.playTile(player.selectedTile);
    }
  }

  __endTurn (idx) {
    let player = this.players[idx];
    if (player.isTurn == false) {
      console.log("NOT TURN FOR PLAYER: " + idx);
      return;
    }
    let canEndTurn = false;
    let maxValue = 0;

    //check if all melds are valid
    for (let i = 0; i < this.melds.length; i++) {

      //only check points of melds that were modified this turn
      if(this.melds[i].createdThisTurn && this.melds[i].checkIfMeldValid()){
        maxValue += this.melds[i].value;
      }

      //not valid and created this turn
      if (!this.melds[i].checkIfMeldValid() && this.melds[i].createdThisTurn) {
        let midx = this.melds.indexOf(this.melds[i])
        this.__returnMeldToHand(midx, idx);
      }
      //not valid and not created this turn
      else if (!this.melds[i].createdThisTurn && !this.melds[i].checkIfMeldValid()){
        console.log("fix meld");
        //the player needs to fix the meld if it was another player's
        return;
      }

    }

    //check if any tiles are unmelded
    for (var i = this.board.length -1; i >= 0 ; i--) {
      if(!this.board[i].inMeld){
        //return any single tiles to the player's hand
        this.players[idx].addTile(this.board[i]);
        this.board[i].inHand = true;
        this.board.splice(i, 1);

      }
    }

    if (player.isFirstTurn && maxValue > 20) {
      player.isFirstTurn = false;
      canEndTurn = true;

    }
    else if(!player.isFirstTurn && maxValue > 0){
      canEndTurn = true;
    }

    if (!canEndTurn) {
      player.addTile(this.deck.deal());

      //if maxValue was not enough, return the melds to player's hand
      let length = this.melds.length;
      for (let i = length -1; i >= 0; i--) {
        //let valid = this.melds[i].checkIfMeldValid();
        //only check points of melds that were modified this turn
        if(this.melds[i].createdThisTurn){
          let midx = this.melds.indexOf(this.melds[i]);
          this.__returnMeldToHand(midx, idx)
        }
      }

    }
    console.log("ENDING TURN FOR PLAYER: " + idx);
    player.isTurn = false;
    let nextIdx = (idx + 1) % this.players.length;
    this.players[nextIdx].isTurn = true;

    for (let i = 0; i < this.melds.length; i++) {
      if(this.melds[i].createdThisTurn){
        this.melds[i].createdThisTurn = false;
      }
    }
    if(player.hand.length == 0){
      player.won = true;
    }

  }

  __returnMeldToHand(midx, idx){
    console.log("midx "+ midx);
    let length = this.melds[midx].tiles.length;
    for (let j = length -1; j >= 0; j--) {
        console.log(this.melds[midx].tiles[j]);
        if (this.melds[midx].tiles[j].wasJoker) {
          this.melds[midx].tiles[j].value = 'J';
        }
        let bidx = this.board.indexOf(this.melds[midx].tiles[j]);
        this.players[idx].addTile(this.melds[midx].tiles[j]);
        this.melds[midx].tiles[j].inHand = true;
        this.board.splice(bidx, 1);
        this.melds[midx].removeTile(this.melds[midx].tiles[j]);
        //canEndTurn = false;

    }
    let idx2 = this.melds.indexOf(this.melds[midx]);
    this.melds.splice(idx2, 1);
  }


}



module.exports = GameView;
