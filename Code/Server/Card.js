class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    this.x;
    this.y;
    this.prevX;
    this.prevY;
    this.width = 50;
    this.height = 70;
    this.inHand = true;
    this.inMeld = false;
    this.wasJoker = value == 'J' ? true : false;
  }

  snapOn(ex, ey, w) {
    this.x = ex - (ex % (this.width + 20));
    this.y = ey - (ey % (this.height + 10));
  }

  // returns the tile which is being overlapped
  overlapsTile (board) {
    for(var i = 0; i < board.length; i ++) {
      //dont ckeck tile against itself
      if(board[i] == this){
        continue;
      }
      if(this.x == board[i].x && this.y == board[i].y){
      return board[i];
      }
    }
    return null;
  }

  inIllegalPosition(board, h){
    //check if it is placed in the hand area
    if(this.y >= h){
      return true;
    }
    return false;
  }
}

module.exports = Card;
