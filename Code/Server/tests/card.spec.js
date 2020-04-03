const Card = require('../Card');

describe('Position testing', () => {
  let c1 = new Card('red', 1);
  let c2 = new Card('blue', 5);
  let c3 = new Card('red', 2);
  let h = 200;

  c1.snapOn(10, 11);
  c2.snapOn(11, 23);
  c3.snapOn(45, 293);
  let board = [c1, c2, c3];

  test('Tiles overlapping another should return the other tile', () => {
    let result1 = c2.overlapsTile(board);
    expect(result1).toEqual(c1);

    let result2 = c3.overlapsTile(board);
    expect(result2).toEqual(null);
  });

  test('Tiles below the set height should return invalid', () => {
    let result1 = c1.inIllegalPosition([], h);
    c3.y = h;
    let result2 = c3.inIllegalPosition([], h);
    expect(result1).toEqual(false);
    expect(result2).toEqual(true);
  });

});
