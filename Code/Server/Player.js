
class Player {
  constructor(){
    this.hand = [];
    this.score = 0;

    //for drag events
    this.selectedTile = null;
    this.selectedIdx;
    this.initialX;
    this.initialY;
    this.dragActive = false;
  }


  addTile (tile) {
    this.hand.push(tile);
  }

  // Takes a tile as a parameter and removes then returns it
  playTile (tile) {
    const index = this.hand.indexOf(tile);
    if (index > -1) {
      this.hand.splice(index, 1);
    }
    return tile;
  }

  // For testing only
  removeTile (tile) {
    const index = this.hand.indexOf(tile);
    if (index > -1) {
      this.hand.splice(index, 1);
    }
  }

  sortHandByValue () {
    this.hand.sort((a, b) => {
      let temp = 4 * (a.value - b.value);
      let colors = {"black": 0, "red": 1, "blue": 2, "yellow": 3 };
      temp += (colors[a.suit] - colors[b.suit]);
      return temp;
    });
  }

  sortHandByColor () {
    this.hand.sort((a, b) => {
      let colors = {"black": 0, "red": 1, "blue": 2, "yellow": 3 };
      let temp = 13 * (colors[a.suit] - colors[b.suit]);
      temp += (a.value - b.value);
      return temp;
    });
  }

  // sortHand

}
module.exports = Player;
