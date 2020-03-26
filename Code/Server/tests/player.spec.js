const Player = require('../Player');

describe('Add Tile Function', () => {
  test('Should add a tile after the last', () => {
    const input = [1, 2, 3];
    var p = new Player();

    for (var i = 0; i < input.length; i++) {
      p.addTile(input[i]);
    }
    console.log(p.hand);
    expect(p.hand).toEqual(input);
  });
});
