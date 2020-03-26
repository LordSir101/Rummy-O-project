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

const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace'];
let deck = new Deck();
deck.createDeck(suits, values)
console.log(deck.shuffle());
console.log(deck.deal());