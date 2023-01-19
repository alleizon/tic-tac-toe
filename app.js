function Player(name, symbol) {
  const score = 0;
  return { name, symbol, score };
}

const Game = (() => {
  const gameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const player1 = Player(1, "X");
  const player2 = Player(2, "O");
  let curPlayer = player1;
  let turns = 0;

  const resetBoard = () => {
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        gameboard[row][col] = "";
      }
    }
  };

  const checkWin = (x, y) => {
    let marks = 0;
    for (let col = 0; col < 3; col += 1) {
      if (gameboard[x][col] === curPlayer.name) {
        marks += 1;
        if (marks === 3) return curPlayer;
      } else {
        marks = 0;
        break;
      }
    }
    for (let row = 0; row < 3; row += 1) {
      if (gameboard[row][y] === curPlayer.name) {
        marks += 1;
        if (marks === 3) return curPlayer;
      } else {
        marks = 0;
        break;
      }
    }
    if ((+x === 0 && +y === 0) || (+x === 2 && +y === 2)) {
      for (let diag = 0; diag < 3; diag += 1) {
        if (gameboard[diag][diag] === curPlayer.name) {
          marks += 1;
          if (marks === 3) return curPlayer;
        } else {
          marks = 0;
          break;
        }
      }
    }
    if ((+x === 0 && +y === 2) || (+x === 2 && +y === 0)) {
      for (let diag = 0; diag < 3; diag += 1) {
        if (gameboard[diag][2 - diag] === curPlayer.name) {
          marks += 1;
          if (marks === 3) return curPlayer;
        } else {
          marks = 0;
          break;
        }
      }
    }
    return null;
  };

  const playTurn = (e) => {
    const { x } = e.target.dataset;
    const { y } = e.target.dataset;
    if (gameboard[x][y]) return;
    gameboard[x][y] = curPlayer.name;
    e.target.textContent = curPlayer.symbol;
    const winner = checkWin(x, y);
    turns += 1;
    if (winner) {
      curPlayer.score += 1;
      resetBoard();
      displayController.declareWinner();
    } else if (turns === 9) {
      displayController.declareTie();
      resetBoard();
    }
    curPlayer = curPlayer.name === 1 ? player2 : player1;
  };

  return { playTurn };
})();

const displayController = (() => {
  const body = document.querySelector("body");
  const div = document.createElement("div");
  div.classList.add("board-container");
  body.appendChild(div);

  const createBoard = () => {
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        const btn = document.createElement("button");
        btn.dataset.x = i;
        btn.dataset.y = j;
        btn.addEventListener("click", Game.playTurn);
        btn.setAttribute("type", "button");
        div.appendChild(btn);
      }
    }
  };

  const declareTie = () => {};
  const declareWinner = () => {};
  return { createBoard, declareTie, declareWinner };
})();

displayController.createBoard();
