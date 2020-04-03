const Deck = require('../Deck');


describe ('Deal a tile', () => {
  test('Should return and remove a tile', () => {
    let d = new Deck();
    d.createDeck();
    let output1 = [...d.deck];
    let output2 = d.deck[d.deck.length - 1];
    expect(output2).toEqual(d.deal());
    expect(output1).not.toEqual(d.deck);

  });

});
describe('Shuffle Function', () => {
  test('Deck after shuffle should be different', ()=> {
    let d = new Deck();
    d.createDeck();
    let input = [...d.deck];
    d.shuffle();
    expect(input).not.toEqual(d.deck);
  });
});
