const Card = require('./Card');

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
