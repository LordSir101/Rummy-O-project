
class Player {
  constructor(){
    this.hand = [];
    this.score = 0;
    this.isFirstTurn = true;
    this.isTurn = false;
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
      let temp;
      let aX;
      let bX;
      aX = a.value == 'J' ? 14 : a.value;
      bX = b.value == 'J' ? 14 : b.value;
      temp = 4 * (aX - bX);
      let colors = {"black": 0, "red": 1, "blue": 2, "yellow": 3 };
      temp += (colors[a.suit] - colors[b.suit]);
      return temp;
    });
  }

  sortHandByColor () {
    this.hand.sort((a, b) => {
      let colors = {"black": 0, "red": 1, "blue": 2, "yellow": 3 };
      let temp = 14 * (colors[a.suit] - colors[b.suit]);
      let aX;
      let bX;
      aX = a.value == 'J' ? 14 : a.value;
      bX = b.value == 'J' ? 14 : b.value;
      temp += (aX - bX);
      return temp;
    });
  }

  // sortHand

}
module.exports = Player;
