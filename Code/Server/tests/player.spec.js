const Player = require('../Player');
const Card = require('../Card');

describe('Add Tile Function', () => {
  test('Should add a tile after the last', () => {
    const input = [1, 2, 3];
    let p = new Player();

    for (let i = 0; i < input.length; i++) {
      p.addTile(input[i]);
    }
    expect(p.hand).toEqual(input);
  });
});

describe('Play a tile from hand', () => {
  test('Should return the tile and remove it from hand', () => {
    let p = new Player();
    const input = [1, 2, 3];
    for (let i = 0; i < input.length; i++) {
      p.addTile(input[i]);
    }
    let output1 = p.playTile(p.hand[1]);
    let output2 = p.hand;
    expect(output1).toEqual(2);
    expect(output2).toEqual([1, 3]);
  });
});

describe('Sort Hand', () => {
  let p = new Player ();
  const input1 = [6, 1, 3, 9, 7];
  const input2 = ['red', 'blue', 'red', 'black', 'yellow'];
  for (let i = 0; i < input1.length; i++) {
    p.addTile(new Card(input2[i], input1[i]));
  }
  test('Card values should always be less than the next', () => {
    let output =[];
    p.sortHandByValue();
    for (let i = 0; i < p.hand.length; i++) {
      output[i] = p.hand[i].value;
    }
    expect(output).toEqual([1,3,6,7,9]);
  });

  test('Cards should be grouped by suit', () => {
    let output =[];
    p.sortHandByColor();
    for (let i = 0; i < p.hand.length; i++) {
      output[i] = p.hand[i].suit;
    }
    expect(output).toEqual(['black', 'red', 'red', 'blue', 'yellow']);
  });
});
