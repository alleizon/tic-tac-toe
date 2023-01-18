const Gameboard = (() => {
  const gameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const updateBoard = (x, y, symbol) => {
    gameboard[x][y] = symbol;
    console.log(gameboard);
  };

  return { updateBoard };
})();

const displayController = (() => {
  const body = document.querySelector("body");
  const div = document.createElement("div");
  div.classList.add("board-container");
  body.appendChild(div);

  const displayBoard = () => {
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        const btn = document.createElement("button");
        btn.dataset.x = i;
        btn.dataset.y = j;
        btn.addEventListener("click", player1.move);
        btn.setAttribute("type", "button");
        div.appendChild(btn);
      }
    }
  };
  return { displayBoard };
})();

function Player(name, symbol) {
  const move = (e) => {
    const { x } = e.target.dataset;
    const { y } = e.target.dataset;
    Gameboard.updateBoard(+x, +y, symbol);
  };

  return { name, symbol, move };
}

const player1 = Player(1, "X");
const player2 = Player(2, "O");
displayController.displayBoard();
