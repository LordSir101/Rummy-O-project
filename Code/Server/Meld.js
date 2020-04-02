
class Meld {
  constructor (firstTile) {
    this.tiles = [];
    this.tiles.push(firstTile);
    firstTile.inMeld = true;
    this.value = firstTile.value;
    this.x = firstTile.x;
    this.y = firstTile.y;
    this.width = 52;
    this.createdThisTurn = true;
  }

  addTile (tile, board) {
    var first = this.tiles[0];
    var last = this.tiles[this.tiles.length - 1];

    // Condition 1 for a run
    if (tile.suit == last.suit && tile.value == last.value + 1
      && tile.suit == first.suit) {
      this.tiles.push(tile);
      this.width += (tile.width + 2);

      // Condition 2 for a run
    } else if (tile.suit == first.suit && tile.value == first.value - 1
      && tile.suit == last.suit) {
      this.tiles.unshift(tile);
      this.x -= tile.width;
      this.width += (tile.width + 2);

      // Condition for a ?match?
    } else if (tile.value == first.value && tile.value == last.value) {
      let temp = true;
      for (let i = 0; i < this.tiles.length; i++) {
        console.log(tile.suit + ", " + this.tiles[i].suit);
        if (tile.suit == this.tiles[i].suit) {
          temp = false;
        }
      }
      if (temp = true) {
        this.tiles.push(tile);
        this.width += (tile.width + 2);
      }

    }
    this.value += tile.value;
    tile.inMeld = true;
    this.createdThisTurn = true;
    board.push(tile); //push to board so it is drawn when being dragged
    this.drawMeld();
  }

  drawMeld(){
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].x = this.x + (this.tiles[i].width + 2) * i;
    }
  }

  removeTile(tile){

    if(tile != this.tiles[0] && tile != this.tiles[this.tiles.length - 1]){
      return null;
    }
    /*

    if(!this.checkIfMeldValid(idx)){
      return null;
    }
    else{*/
    var idx = this.tiles.indexOf(tile);
      if(idx == 0 && this.tiles[1] != null){
        this.x = this.tiles[1].x;
        this.y = this.tiles[1].y;
      }
      this.value -= tile.value;
      this.tiles.splice(idx, 1);
      this.width -= (tile.width + 2);
      tile.inMeld = false;
      this.drawMeld();
    //}

    return tile;
  }

  isValid (tile) {
    var first = this.tiles[0];
    var last = this.tiles[this.tiles.length - 1];


    if ((tile.suit == last.suit && tile.value == last.value + 1 && tile.suit == first.suit)
       || (tile.suit == first.suit && tile.value == first.value - 1 && tile.suit == last.suit)) {
      return true;
    } else if (tile.value == first.value && tile.value == last.value) {
      var temp = true;
      for (let i = 0; i < this.tiles.length; i++) {
        console.log(tile.suit + ", " + this.tiles[i].suit);
        if (tile.suit == this.tiles[i].suit) {
          temp = false;
        }
      }
      console.log(temp);
      return temp;
    }
    return false;
  }

  checkIfMeldValid(){
    /*
    var test = [];
    this.tiles.forEach((tile) => {
      test.push(tile);
    });

    test.splice(idx, 1);*/
    //console.log(test);
    var test = [];
    this.tiles.forEach((tile) => {
      test.push(tile);
    });
    if(test.length == 0){
      return;
    }
    var median;
    var mean;
    var value = 0;
    var suit = test[0].suit;
    var val = test[0].value;
    var sameSuit = true;
    var sameVal = true;

    //get the sum of values and checks if the set is the same suit or same number
    for(var i = 0; i < test.length; i++){
      value += test[i].value;
      if(test[i].suit != suit){
        sameSuit = false;
      }
      if(test[i].value != val){
        sameVal = false;
      }
    }
    mean = value / test.length;

    if(test.length % 2 ==0){
      var num1 = test[(test.length)/2].value;
      var num2 = test[(test.length)/2 -1].value;
      median = (num1 + num2) /2;

    }
    else{
      median = test[(test.length-1)/2].value;

    }

    //a set of consecutive numbers will have the same mean and median
    console.log(mean);
    console.log(median);
    console.log(sameSuit);
    console.log(test.length);
    if(mean == median && sameSuit && test.length >= 3){
      console.log("valid")
      return true;
    }
    //check for a three of a kind of different suit
    else if(!sameSuit && sameVal && test.length >= 3){
      console.log("valid")
      return true;
    }
    return false;
  }

  // return true if mouse is within its bounds
  onMeld (ex, ey) {
    if ((ex < this.x + this.width && ex > this.x)
      && (ey < this.y + this.tiles[0].height && ey > this.y)) {
        return true;
    }
    return false;
  }
}

module.exports = Meld;
