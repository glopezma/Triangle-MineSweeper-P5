function Tile(a, b, c, dir) {
  this.p1 = new p5.Vector;
  this.p2 = new p5.Vector;
  this.p3 = new p5.Vector;

  this.p1 = a.copy();
  this.p2 = b.copy();
  this.p3 = c.copy();

  this.counter = 0;

  this.red = false;
  this.visited = false;
  this.space = false;
  this.check = false;
  this.mine = false;
  this.up = dir;
}

Tile.prototype.resetTile = function() {
  this.counter = 0;
  this.red = false;
  this.visited = false;
  this.space = false;
  this.check = false;
  this.mine = false;
}

Tile.prototype.show = function() {
  var tileSize = int(this.p3.x - this.p1.x);
  stroke(0);
  strokeWeight(1);
  if (this.red) {
    fill(255, 0, 0);
    triangle(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
  } else if (this.check) {
    fill(255);
    triangle(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
    if (this.mine) {
      fill(51);
      ellipse(this.p2.x - 2, (this.p1.y + this.p2.y + this.p3.y) / 3, tileSize / 4, tileSize / 4);
    } else {
      strokeWeight(2);
      if (this.counter == 0) {
        fill(255);
        stroke(255);
      } else if (this.counter == 1) {
        fill(0, 0, 255);
        stroke(0, 0, 255);
      } else if (this.counter == 2) {
        fill(0, 255, 0);
        stroke(56, 169, 58);
      } else if (this.counter == 3) {
        fill(211, 222, 39);
        stroke(167, 173, 62);
      } else if (this.counter == 4) {
        fill(255, 75, 0);
        stroke(255, 75, 0);
      } else if (this.counter > 4) {
        fill(255, 0, 0);
        stroke(255, 0, 0);
      }
      text(this.counter, this.p2.x - 2, (this.p1.y + this.p2.y + this.p3.y) / 3);
    }
  } else {
    fill(175);
    triangle(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
  }
}

Tile.prototype.cover = function() {
  if (PointInTriangle(mouse, this.p1, this.p2, this.p3) && !this.check) {
    this.red = !this.red;
  }
}

Tile.prototype.click = function() {
  if (!this.red && !this.check && PointInTriangle(mouse, this.p1, this.p2, this.p3)) {
    this.check = true;
    return (this.mine || this.counter == 0);
  }
  return false;
}

function PointInTriangle(p, p1, p2, p3) {
  var alpha = ((p2.y - p3.y) * (p.x - p3.x) + (p3.x - p2.x) * (p.y - p3.y)) / ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
  var beta = ((p3.y - p1.y) * (p.x - p3.x) + (p1.x - p3.x) * (p.y - p3.y)) / ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
  var gamma = 1.0 - alpha - beta;

  return (alpha > 0 && beta > 0 && gamma > 0);
}
