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

class Deck {
  constructor() {
    this.deck = [];
    this.values = [];
    this.suits = ['black', 'red', 'blue', 'yellow'];
    for (var i = 1; i <= 13; i++) {
      let j = 1;
      while (j % 5 != 0) {
        this.values.push(i);
        j++;
      }
    }
  }

  createDeck(suits, values) {
    for (let suit of this.suits) {
      for (let value of this.values) {
        this.deck.push(new Card(suit, value));
      }
    }
    this.deck.push(new Card('red', 'J'))
    this.deck.push(new Card('black', 'J'))
    return this.deck;
  }

  deal () {
    return this.deck.pop();
    /*let give = [];
    while (give.length < 1) {
      give.push(this.deck.pop());
    }
    return give;*/
  }

  //testing
  dealJoker () {
    return new Card ('red', 'J');
  }

  shuffle() {

    let c = this.deck.length, t, i;
    while(c) {
      i = Math.floor(Math.random() * c--);
      t = this.deck[c];
      this.deck[c] = this.deck[i];
      this.deck[i] = t;
    }
    return this.deck;
  }
}

/*
let deck = new Deck();
deck.createDeck(suits, values)
console.log(deck.shuffle());
console.log(deck.deal());*/
module.exports = Deck;
