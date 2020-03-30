
class Meld {
  constructor (firstTile) {
    this.tiles = [];
    this.tiles.push(firstTile);
    this.value = 0;
    this.x = firstTile.x;
    this.y = firstTile.y;
    this.width = 52;
  }

  addTile (tile) {
    var first = this.tiles[0];
    var last = this.tiles[this.tiles.length - 1];
    if (tile.suit == last.suit && tile.value == last.value + 1) {
      this.tiles.push(tile);
      this.width += (tile.width + 2);
    } else if (tile.suit == first.suit && tile.value == first.value + 1) {
      this.tiles.unshift(tile);
      this.x -= tile.width;
      this.width += (tile.width + 2);
    } else if (tile.value == first.value && tile.value == last.value) {
      this.tiles.push(tile);
      this.width += (tile.width + 2);
    }
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].x = this.x + (tile.width + 2) * i;
    }
  }

  isValid (tile) {
    var first = this.tiles[0];
    var last = this.tiles[this.tiles.length - 1];
    if ((tile.suit == last.suit && tile.value == last.value + 1)
       || (tile.suit == first.suit && tile.value == first.value + 1)
       || (tile.value == first.value && tile.value == last.value)) {
      return true
    }
    return false;
  }

  // return true if mouse is within its bounds
  onMeld (ex, ey) {
    if ((ex < this.x + this.width && ex > this.x)
      && (ey < this.y + this.tiles[0].height && ey > this.y)) {
        return true;
    }
    return flase;
  }
}

module.exports = Meld;
