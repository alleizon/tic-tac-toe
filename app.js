const Gameboard = (() => {
  const gameboard = [
    ["X", "X", "O"],
    ["O", "X", "O"],
    ["O", "O", "X"],
  ];

  const displayBoard = () => {
    const boardWrapper = document.createElement("div");
    boardWrapper.classList.add("board-container");
    gameboard.forEach((row) => {
      row.forEach((col) => {
        const div = document.createElement("div");
        div.textContent = col;
        boardWrapper.appendChild(div);
      });
    });
    const body = document.querySelector("body");
    body.appendChild(boardWrapper);
  };

  return { displayBoard };
})();

Gameboard.displayBoard();
