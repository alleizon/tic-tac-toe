function Player(name, symbol, type) {
  const score = 0;
  return { name, symbol, score, type };
}

const Game = (() => {
  const gameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const player1 = Player(1, "X", "human");
  let curPlayer = null;
  let turns = 0;
  let opponent;

  const resetBoard = () => {
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        gameboard[row][col] = "";
      }
    }
    turns = 0;
    curPlayer = null;
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
    if (
      (+x === 0 && +y === 0) ||
      (+x === 1 && +y === 1) ||
      (+x === 2 && +y === 2)
    ) {
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
    if (
      (+x === 0 && +y === 2) ||
      (+x === 1 && +y === 1) ||
      (+x === 2 && +y === 0)
    ) {
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

  const checkGameEnd = (x, y) => {
    const winner = checkWin(x, y);
    turns += 1;
    if (winner) {
      curPlayer.score += 1;
      displayController.declareWinner(winner);
      resetBoard();
      return 1;
    }
    if (turns === 9) {
      displayController.declareTie();
      resetBoard();
      return 1;
    }
    return 0;
  };

  const playComputerTurn = () => {
    const x = Math.floor(Math.random() * 3);
    const y = Math.floor(Math.random() * 3);
    if (!gameboard[x][y]) {
      gameboard[x][y] = opponent.name;
      displayController.displayComputerMove(x, y, opponent.symbol);
      if (checkGameEnd(x, y)) return;
      curPlayer = player1;
      displayController.displayPlayer(curPlayer);
    } else playComputerTurn();
  };

  const playTurn = (e) => {
    if (!curPlayer) curPlayer = player1;
    const { x } = e.target.dataset;
    const { y } = e.target.dataset;
    if (gameboard[x][y]) return;
    gameboard[x][y] = curPlayer.name;
    e.target.textContent = curPlayer.symbol;
    if (checkGameEnd(x, y)) return;
    curPlayer = curPlayer.name === 1 ? opponent : player1;
    displayController.displayPlayer(curPlayer);
    if (opponent.type === "computer" && curPlayer.name === opponent.name)
      playComputerTurn();
  };

  const getCurrentPlayer = () => curPlayer;

  const changeOpponent = () => {
    //
  };
  const createOpponent = (() => {
    const player2 = Player(2, "O", "computer");
    opponent = player2;
  })();

  return {
    playTurn,
    resetBoard,
    getCurrentPlayer,
    changeOpponent,
  };
})();

const displayController = (() => {
  const containerDiv = document.querySelector(".board-container");
  const displayName = document.querySelector(".display-name");
  const startBtn = document.querySelector("#start-btn");
  const resetBtn = document.querySelector("#reset-btn");

  const addBtnListeners = (e) => {
    const player = Game.getCurrentPlayer();
    if (!player) resetDisplay();
    const btns = Array.from(document.querySelectorAll(".game-btn"));
    btns.forEach((element) => {
      element.addEventListener("click", Game.playTurn);
    });

    if (e.target.id === "start-btn") {
      displayName.textContent = `Player 1's turn`;
    } else displayName.textContent = `Player 1's turn`;
  };

  const removeListeners = () => {
    const btns = Array.from(document.querySelectorAll(".game-btn"));
    btns.forEach((element) => {
      element.removeEventListener("click", Game.playTurn);
    });
  };

  const createBoard = () => {
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        const btn = document.createElement("button");
        btn.classList.add("game-btn");
        if (i === 0) btn.classList.add("top-row");
        if (i === 2) btn.classList.add("bottom-row");
        if (j === 0) btn.classList.add("left-col");
        if (j === 2) btn.classList.add("right-col");
        btn.dataset.x = i;
        btn.dataset.y = j;
        btn.setAttribute("type", "button");
        containerDiv.appendChild(btn);
      }
    }
  };

  const declareTie = () => {
    displayName.textContent = "Game is a tie!";
    removeListeners();
  };
  const declareWinner = (winner) => {
    displayName.textContent = `Player ${winner.name} wins!`;
    removeListeners();
  };

  const resetDisplay = () => {
    const btns = Array.from(document.querySelectorAll(".game-btn"));
    btns.forEach((element) => {
      element.textContent = "";
    });
  };

  const resetBoard = (e) => {
    const btns = Array.from(document.querySelectorAll(".game-btn"));
    btns.forEach((element) => {
      element.textContent = "";
    });
    Game.resetBoard();
    addBtnListeners(e);
  };

  const displayPlayer = (currentPlayer) => {
    displayName.textContent = `Player ${currentPlayer.name}'s turn`;
  };

  const displayComputerMove = (x, y, symbol) => {
    const btn = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    btn.textContent = symbol;
  };

  startBtn.addEventListener("click", addBtnListeners);
  resetBtn.addEventListener("click", resetBoard);

  return {
    createBoard,
    declareTie,
    declareWinner,
    displayPlayer,
    displayComputerMove,
  };
})();

displayController.createBoard();
