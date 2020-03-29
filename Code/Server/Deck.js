class Card {
  constructor(suits, values) {
    this.suit = suits;
    this.value = values;
    this.x;
    this.y;
    this.width = 50;
    this.height = 70;
    this.inHand = true;

  }
}

class Deck {
  constructor() {
    this.deck = [];
    this.suits = ['black', 'red', 'blue', 'yellow'];
    this.values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

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
