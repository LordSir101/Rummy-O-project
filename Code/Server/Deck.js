class Card {
  constructor(suits, values) {
    this.suit = suits;
    this.value = values;

  }
}

class Deck {
  constructor() {
    this.deck = [];
  }

  createDeck(suits, values) {
    for (let suit of suits) {
      for (let value of values) {
        this.deck.push(new Card(suit, value));
      }
    }
    this.deck.push(new Card('Red', 'Joker'))
    this.deck.push(new Card('Black', 'Joker'))
    return this.deck;
  }
  deal () {
    let give = [];
    while (give.length < 1) {
      give.push(this.deck.pop());
    }
    return give;
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

const suits = ['Black', 'Red', 'Blue', 'Yellow'];
const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

let deck = new Deck();
deck.createDeck(suits, values)
console.log(deck.shuffle());
console.log(deck.deal());