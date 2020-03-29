
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

  sortHandByValue () {
    this.hand.sort((a, b) => {
      let temp = 4 * (a.value - b.value);
      let colors = {"Red": 0, "Blue": 1, "Yellow": 2, "Green": 3 };
      temp += (colors[a.color] - colors[b.color]);
      return temp;
    });
  }

  sortHandByColor () {
    this.hand.sort((a, b) => {
      let colors = {"Red": 0, "Blue": 1, "Yellow": 2, "Green": 3 };
      let temp = 13 * (colors[a.color] - colors[b.color]);
      temp += (a.value - b.value);
      return temp;
    });
  }

  //sortHand

}
module.exports = Player;
