const Meld = require('../Meld');
const Card = require('../Card');

describe('Add a card to a meld', () => {
  let cm1 = new Card('red', 2);
  let m1 = new Meld(cm1);
  let cm2 = new Card('black', 3);
  let m2 = new Meld(cm2);
  let cm3 = new Card('yellow', 6);
  let m3 = new Meld(cm3);
  let cm4 = new Card('black', 1);
  let m4 = new Meld(cm4);
  let m5 = new Meld(cm4);
  let c1 = new Card('red', 3);
  let c2 = new Card('black', 9);
  let c3 = new Card('yellow', 3);
  let c4 = new Card('red', 'J');
  m2.x = 0;
  m2.y = 0;
  m3.tiles = [c1, c3];
  m3.width = 104;
  m3.x = 0;
  m3.y = 0;
  m4.x = 0;
  m4.y = 0;
  m5.x = 0;

  test('Check if move is valid', () => {
    let result1 = m1.isValid(c1, 5);
    expect(result1).toEqual(true);
    let result2 = m2.isValid(c2, 5);
    expect(result2).toEqual(false);
    let result3 = m2.isValid(c3, 5);
    expect(result3).toEqual(true);
    let result4 = m2.isValid(c4, 20);
    expect(result4).toEqual(true);
    let result5 = m3.isValid(c4, 5);
    expect(result5).toEqual(true);
    let result6 = m4.isValid(c4, 2);
    expect(result6).toEqual(false);
    let result7 = m4.isValid(c4, 45);
    expect(result7).toEqual(true);
  });

  test('Add a known valid tile', () => {
    m1.addTile(c1, [], 5);
    let result1 = m1.tiles;
    expect(result1).toEqual([cm1, c1]);
    m2.addTile(c3, [], 5);
    let result2 = m2.tiles;
    expect(result2).toEqual([cm2, c3]);
    m2.addTile(c4, [], 60);
    let result3 = m2.tiles;
    expect(result3).toEqual([cm2, c3, c4]);
    let j = new Card ('red', 'J');
    m4.addTile(j, [], 45);
    let result4 = m4.tiles;
    expect(result4).toEqual([cm4, j]);
    let k = new Card ('red', 'J');
    m5.addTile(k, [], 25);
    let result5 = m5.tiles;
    expect(result5[0].suit).not.toEqual(result5[1].suit);

  });
});

describe('Check if an existing melds is valid', () => {
  let c1 = new Card('red', 3);
  let c2 = new Card('red', 4);
  let c3 = new Card('red', 5);
  let c4 = new Card('red', 6);
  let c5 = new Card('blue', 5);

  test('Should be false if tiles are not consecutive', () => {
    let m = new Meld(c1);
    m.tiles = [c1, c2, c3];
    let result1 = m.checkIfMeldValid();
    expect(result1).toEqual(true);
    m.tiles = [c1, c2, c4];
    let result2 = m.checkIfMeldValid();
    expect(result2).toEqual(false);

  });

  test('Should be false if tiles are not same number or suit', () => {
    let m = new Meld(c1);
    m.tiles = [c1, c2, c4];
    let result = m.checkIfMeldValid();
    expect(result).toEqual(false);
  });

});

describe('Remove a start or end tile from a meld', () => {
  test('Check if tile has been removed and returned', () => {
    let c1 = new Card('red', 5);
    c1.x = 0;
    c1.y = 0;
    let c2 = new Card('red', 6);
    let c3 = new Card('red', 7);
    let m = new Meld(c1);
    m.addTile(c2, [], 0);
    m.addTile(c3, [], 0);
    console.log(m.tiles);
    let result1 = m.removeTile(m.tiles[1]);
    let result2 = m.tiles;
    expect(result1).toEqual(null);
    expect(result2).toEqual([c1, c2, c3]);
    result1 = m.removeTile(m.tiles[0]);
    result2 = m.tiles;
    expect(result1).toEqual(c1);
    expect(result2).toEqual([c2, c3]);
  });
});
