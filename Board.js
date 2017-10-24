function Board() {
  this.boardSize = 640;
  this.numMines = 40;
  this.tileSize = 40;
  this.boardWidth = 2 * (this.boardSize / this.tileSize) - 1;
  this.boardHeight = (this.boardSize / this.tileSize);
  this.lose = false;

  this.tiles = new Array(this.boardHeight);
  for (var i = 0; i < this.boardHeight; i++) {
    this.tiles[i] = new Array(this.boardWidth);
  }

  var a = new p5.Vector(0, 0);
  var b = new p5.Vector(this.tileSize / 2, this.tileSize);
  var c = new p5.Vector(this.tileSize, 0);
  var flag = false;

  for (var i = 0; i < this.boardHeight; i++) {
    for (var j = 0; j < this.boardWidth; j++) {
      this.tiles[i][j] = new Tile(a, b, c, flag);
      a = b.copy();
      b = c.copy();
      c = a.copy();
      c.x += this.tileSize;
      flag = !flag;
    }
    if (i % 2 == 0) {
      a.set(0, a.y + this.tileSize);
      c.set(a.x + this.tileSize, a.y);
      b.set(a.x + this.tileSize / 2, a.y - this.tileSize);
    } else {
      a.set(0, a.y + this.tileSize);
      c.set(this.tileSize, a.y);
      b.set(this.tileSize / 2, b.y + this.tileSize);
    }
  }
}

Board.prototype.show = function() {
  if (!this.win()) {
    this.showPlay();
  } else {
    this.showEnd();
  }
}

Board.prototype.showPlay = function() {
  for (var i = 0; i < this.boardHeight; i++) {
    for (var j = 0; j < this.boardWidth; j++) {
      this.tiles[i][j].show();
    }
  }
}

Board.prototype.showEnd = function() {
  fill(0, 0, 255);
  text("Congradulations!", this.boardSize / 3 + 50, this.boardSize / 2)
}

Board.prototype.action = function() {
  if (!this.lose) {
    for (var i = 0; i < this.boardHeight; i++) {
      for (var j = 0; j < this.boardWidth; j++) {
        if (mouseButton == LEFT) {
          if (this.tiles[i][j].click()) {
            if (this.tiles[i][j].mine) {
              this.lose = true;
              return;
            } else {
              this.lookAround(i, j);
            }
          }
        } else if (mouseButton == RIGHT) {
          this.tiles[i][j].cover();
        }
      }
    }
  }
}

Board.prototype.win = function() {
  var flag = true;
  for (var i = 0; i < this.boardHeight; i++) {
    for (var j = 0; j < this.boardWidth; j++) {
      if (!this.tiles[i][j].visited && !this.tiles[i][j].check && !this.tiles[i][j].mine) {
        flag = false;
      }
    }
  }
  return flag;
}

Board.prototype.newGame = function() {
  var count = 0;
  var ran;

  while (count < this.numMines) {
    ran = parseInt(random(this.boardHeight * this.boardWidth));
    var i = int(ran / this.boardWidth);
    var j = (ran % this.boardWidth);
    // console.log(i + " " + j);
    if (ran < (this.boardWidth * this.boardHeight) && !this.tiles[i][j].space) {
      this.tiles[i][j].space = true;
      this.tiles[i][j].mine = true;
      if (j - 1 >= 0) { //left
        if (i - 1 >= 0) { //left top
          this.tiles[i - 1][j - 1].counter++;
          if (!this.tiles[i][j].up && j - 2 >= 0) { //far left top
            this.tiles[i - 1][j - 2].counter++;
          }
        }
        if (i + 1 < this.boardHeight) { //left bottom
          this.tiles[i + 1][j - 1].counter++;
          if (this.tiles[i][j].up && j - 2 >= 0) { //far left bottom
            this.tiles[i + 1][j - 2].counter++;
          }
        }
        this.tiles[i][j - 1].counter++; //left middle
        if (j - 2 >= 0) {
          this.tiles[i][j - 2].counter++; //far left middle
        }
      }

      if (i - 1 >= 0) {
        this.tiles[i - 1][j].counter++; //top middle
      }
      if (i + 1 < this.boardHeight) {
        this.tiles[i + 1][j].counter++; //bottom middle
      }

      if (j + 1 < this.boardWidth) {
        if (i - 1 >= 0) {
          this.tiles[i - 1][j + 1].counter++; //top right
          if (!this.tiles[i][j].up && j + 2 < this.boardWidth) { //far top right
            this.tiles[i - 1][j + 2].counter++;
          }
        }
        if (i + 1 < this.boardHeight) {
          this.tiles[i + 1][j + 1].counter++; //bottom right
          if (this.tiles[i][j].up && j + 2 < this.boardWidth) { //far bottom right
            this.tiles[i + 1][j + 2].counter++;
          }
        }
        this.tiles[i][j + 1].counter++; // middle right
        if (j + 2 < this.boardWidth) {
          this.tiles[i][j + 2].counter++; //far middle right
        }
      }
      count++;
    }
  }
}

Board.prototype.resetGame = function() {
  for (var i = 0; i < this.boardHeight; i++) {
    for (var j = 0; j < this.boardWidth; j++) {
      this.tiles[i][j].resetTile();
    }
  }
  this.lose = false;
  this.newGame();
}

Board.prototype.lookAround = function(i, j) {
  if (!this.tiles[i][j].visited) {
    this.tiles[i][j].visited = true;
    this.tiles[i][j].check = true;
    if (this.tiles[i][j].counter == 0) {
      if (j - 1 >= 0) { //left
        if (i - 1 >= 0) { //left top
          this.lookAround(i - 1, j - 1);
          if (!this.tiles[i][j].up && j - 2 >= 0) { //far left top
            this.lookAround(i - 1, j - 2);
          }
        }
        if (i + 1 < this.boardHeight) { //left bottom
          this.lookAround(i + 1, j - 1);
          if (this.tiles[i][j].up && j - 2 >= 0) { //far left bottom
            this.lookAround(i + 1, j - 2);
          }
        }
        this.lookAround(i, j - 1); //left middle
        if (j - 2 >= 0) {
          this.lookAround(i, j - 2); //far left middle
        }
      }

      if (i - 1 >= 0) {
        this.lookAround(i - 1, j); //top middle
      }
      if (i + 1 < this.boardHeight) {
        this.lookAround(i + 1, j); //bottom middle
      }

      if (j + 1 < this.boardWidth) {
        if (i - 1 >= 0) {
          this.lookAround(i - 1, j + 1); //top right
          if (!this.tiles[i][j].up && j + 2 < this.boardWidth) { //far top right
            this.lookAround(i - 1, j + 2);
          }
        }
        if (i + 1 < this.boardHeight) {
          this.lookAround(i + 1, j + 1); //bottom right
          if (this.tiles[i][j].up && j + 2 < this.boardWidth) { //far bottom right
            this.lookAround(i + 1, j + 2);
          }
        }
        this.lookAround(i, j + 1); // middle right
        if (j + 2 < this.boardWidth) {
          this.lookAround(i, j + 2); //far middle right
        }
      }
    }
  }
}
