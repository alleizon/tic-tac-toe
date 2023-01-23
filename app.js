function Player(name, symbol, type) {
  return { name, symbol, type };
}

const Game = (() => {
  const gameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const player = Player(1, "X", "human");
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

  const checkGameEnd = (x, y, isMin, isMiniMaxCall = false) => {
    let winner;
    if (isMiniMaxCall) {
      const tmpPlayer = curPlayer;
      curPlayer = isMin ? opponent : player;
      winner = checkWin(x, y);
      curPlayer = tmpPlayer;
    } else winner = checkWin(x, y);

    if (winner) {
      if (!isMiniMaxCall) {
        displayController.declareWinner(winner);
        resetBoard();
      }
      return winner.name === 1 ? 1 : 2;
    }
    if (turns === 9) {
      if (!isMiniMaxCall) {
        displayController.declareTie();
        resetBoard();
      }
      return -1;
    }
    return 0;
  };

  const playComputerTurn = () => {
    const coords = computerAI.makeMove(gameboard, turns);
    gameboard[coords[0]][coords[1]] = 2;
    turns += 1;
    if (checkGameEnd(coords[0], coords[1])) {
      resetBoard();
    } else {
      curPlayer = player;
    }
    displayController.displayComputerMove(coords[0], coords[1], "O");
    displayController.displayPlayer(curPlayer);
  };

  const playTurn = (e) => {
    if (!curPlayer) curPlayer = player;
    if (curPlayer.name === 2 && curPlayer.type === "computer") return;
    const { x } = e.target.dataset;
    const { y } = e.target.dataset;
    if (gameboard[x][y]) return;
    gameboard[x][y] = curPlayer.name;
    e.target.textContent = curPlayer.symbol;
    e.target.classList.add("text-transition");
    turns += 1;
    if (checkGameEnd(x, y)) return;
    curPlayer = curPlayer.name === 1 ? opponent : player;
    displayController.displayPlayer(curPlayer);
    if (opponent.type === "computer" && curPlayer.name === opponent.name)
      setTimeout(playComputerTurn, 300);
  };

  const getCurrentPlayer = () => curPlayer;

  const createOpponent = (e) => {
    opponent = Player(2, "O", e.target.id);
    displayController.removePreGame();
  };

  return {
    playTurn,
    resetBoard,
    getCurrentPlayer,
    createOpponent,
    checkGameEnd,
  };
})();

const displayController = (() => {
  const container = document.querySelector(".container");
  const returnBtn = document.querySelector("#return");

  const addBtnListeners = (e) => {
    const player = Game.getCurrentPlayer();
    if (!player) resetDisplay();
    const btns = Array.from(document.querySelectorAll(".game-btn"));
    btns.forEach((element) => {
      element.addEventListener("click", Game.playTurn);
    });
    const displayName = document.querySelector(".display-name");
    if (e.target.id === "start-btn") {
      displayName.textContent = player
        ? `Player ${player.name}'s turn`
        : "Player 1's turn";
    } else displayName.textContent = `Player 1's turn`;
  };

  const removeListeners = () => {
    const btns = Array.from(document.querySelectorAll(".game-btn"));
    btns.forEach((element) => {
      element.removeEventListener("click", Game.playTurn);
    });
  };

  const createBoard = (div) => {
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
        div.appendChild(btn);
      }
    }
  };

  const declareTie = () => {
    const displayName = document.querySelector(".display-name");
    displayName.textContent = "Game is a tie!";
    displayName.classList.add("end");
    removeListeners();
  };
  const declareWinner = (winner) => {
    const displayName = document.querySelector(".display-name");
    displayName.textContent = `Player ${winner.name} wins!`;
    displayName.classList.add("end");
    removeListeners();
  };

  const resetDisplay = () => {
    const btns = Array.from(document.querySelectorAll(".game-btn"));
    btns.forEach((element) => {
      element.textContent = "";
      element.classList.remove("text-transition");
    });
    document.querySelector(".display-name").classList.remove("end");
  };

  const resetBoard = (e) => {
    const btns = Array.from(document.querySelectorAll(".game-btn"));
    btns.forEach((element) => {
      element.textContent = "";
      element.classList.remove("text-transition");
    });
    document.querySelector(".display-name").classList.remove("end");
    Game.resetBoard();
    addBtnListeners(e);
  };

  const displayPlayer = (currentPlayer) => {
    const displayName = document.querySelector(".display-name");
    displayName.textContent = `Player ${currentPlayer.name}'s turn`;
  };

  const displayComputerMove = (x, y, symbol) => {
    const btn = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    btn.textContent = symbol;
    btn.classList.add("text-transition");
  };

  const selectOpponent = () => {
    const humanBtn = document.querySelector("#human");
    humanBtn.addEventListener("click", Game.createOpponent);
    const computerBtn = document.querySelector("#computer");
    computerBtn.addEventListener("click", Game.createOpponent);
  };
  selectOpponent();

  const removePreGame = () => {
    container.classList.remove("pre-game");
    document.querySelector("h2").remove();
    const btns = Array.from(document.querySelectorAll("button"));
    btns.forEach((btn) => btn.remove());

    const displayDiv = document.createElement("div");
    displayDiv.classList.add("display-name");
    displayDiv.textContent = "Press 'Start'";
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("board-container");
    const startBtn = document.createElement("button");
    startBtn.id = "start-btn";
    startBtn.textContent = "Start";
    startBtn.addEventListener("click", addBtnListeners);
    const resetBtn = document.createElement("button");
    resetBtn.id = "reset-btn";
    resetBtn.textContent = "Reset";
    resetBtn.addEventListener("click", resetBoard);
    container.appendChild(displayDiv);
    container.appendChild(containerDiv);
    container.appendChild(startBtn);
    container.appendChild(resetBtn);
    createBoard(containerDiv);

    returnBtn.style.display = "block";
  };

  const removeGame = () => {
    const elements = container.children;
    for (let i = 3; elements.length > 3; i = 3) {
      elements.item(i).remove();
    }

    container.classList.add("pre-game");
    const h2 = document.createElement("h2");
    h2.textContent = "choose oppononent";
    container.appendChild(h2);
    const humanBtn = document.createElement("button");
    humanBtn.id = "human";
    humanBtn.textContent = "Human";
    const computerBtn = document.createElement("button");
    computerBtn.id = "computer";
    computerBtn.textContent = "Computer";
    container.appendChild(humanBtn);
    container.appendChild(computerBtn);
    selectOpponent();
    Game.resetBoard();

    returnBtn.style.display = "none";
  };

  returnBtn.addEventListener("click", removeGame);

  return {
    declareTie,
    declareWinner,
    displayPlayer,
    displayComputerMove,
    removePreGame,
  };
})();

const computerAI = (() => {
  const miniMax = (gameboard, depth, isMin, x, y, turns) => {
    const result = Game.checkGameEnd(x, y, !isMin, true);
    if (result === 2) return -10;
    if (result === 1) return 10;
    if (turns === 9) return 0;

    if (!isMin) {
      let bestScore = -100;
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          if (!gameboard[i][j]) {
            gameboard[i][j] = 1;
            bestScore = Math.max(
              bestScore,
              miniMax(gameboard, depth + 1, !isMin, i, j, turns + 1)
            );
            gameboard[i][j] = "";
          }
        }
      }
      return bestScore;
    }
    let bestScore = 100;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (!gameboard[i][j]) {
          gameboard[i][j] = 2;
          bestScore = Math.min(
            bestScore,
            miniMax(gameboard, depth + 1, !isMin, i, j, turns + 1)
          );
          gameboard[i][j] = "";
        }
      }
    }
    return bestScore;
  };

  const makeMove = (gameboard, turns) => {
    let bestScore = 100;
    let coords;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (!gameboard[i][j]) {
          gameboard[i][j] = 2;
          const score = miniMax(gameboard, 0, false, i, j, turns + 1);
          gameboard[i][j] = "";
          if (score < bestScore) {
            bestScore = score;
            coords = [i, j];
          }
        }
      }
    }
    return coords;
  };

  return { makeMove };
})();

//
