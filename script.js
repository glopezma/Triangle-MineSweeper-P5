document.addEventListener('contextmenu', event => event.preventDefault());
var newGameBtn;
var modeButtons;
var board;
var mouse;

function setup() {
  var canvas = createCanvas(640, 640);
  canvas.parent('p5Div');
  newGameBtn = document.querySelector("#newGame");
  modeButtons = document.querySelectorAll(".mode");
  board = new Board();
  board.newGame();
  mouse = new p5.Vector(mouseX, mouseY);

  for (var i = 0; i < modeButtons.length; i++) {
    modeButtons[i].addEventListener("click", function() {
      modeButtons[0].classList.remove("selected");
      modeButtons[1].classList.remove("selected");
      this.classList.add("selected");
      if(this.textContent === "Easy") {
        board.numMines = 40;
        board.resetGame();
      } else if (this.textContent === "Hard") {
        board.numMines = 50;
        board.resetGame();
      } else if (this.textContent === "Crazy") {
        board.numMines = 65;
        board.resetGame();
      }
    });
  }

  newGameBtn.addEventListener("click", function() {
    board.resetGame();
  });

}

function draw() {
  background(51);
  mouse.set(mouseX, mouseY);
  board.show();
}

function mousePressed() {
  board.action();
}
