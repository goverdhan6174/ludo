import React from "react";
import "./styles.css";

let time = 0;
let rows = 9;
let columns = 9;
let mines = 10;
let isGameOver = false;
let isGameStart = false;
let isFirstClick = true;
let total_tiles = [];
let aux_clicked = false;
let flags_planted = 0;
let timer = null;
let timeValue = 0;

function buildGrid() {
  isGameOver = false;
  flags_planted = 0;
  // Fetch grid and clear out old elements.
  var grid = document.getElementById("minefield");
  grid.innerHTML = "";

  total_tiles = [];
  let minesArray = Array(mines).fill("mine");
  let emptyArray = Array(rows * columns - mines).fill("hidden");
  let totalTiles = emptyArray.concat(minesArray);
  let shuffedTiles = totalTiles.sort(() => Math.random() - 0.5);

  // Build DOM Grid
  var tile;
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      let index = x * columns + y;
      tile = createTile(x, y, index, shuffedTiles[index]);
      grid.appendChild(tile);
      total_tiles.push(tile);
    }
  }

  var style = window.getComputedStyle(tile);

  var width = parseInt(style.width.slice(0, -2));
  var height = parseInt(style.height.slice(0, -2));

  grid.style.width = columns * width + "px";
  grid.style.height = rows * height + "px";

  calcTileData();
  smileyClear();
  checkForWin();
}

function calcTileData() {
  for (let i = 0; i < total_tiles.length; i++) {
    let total = 0;

    let incrTotal = (rCoord = [0, 0]) => {
      let tile = total_tiles[i + columns * rCoord[0] + rCoord[1]];
      if (tile && tile.dataset.mine === "true") total++;
    };

    let tileIsMined = total_tiles[i].dataset.mine === "true";

    if (!tileIsMined) {
      getBoundedTiles(total_tiles[i], incrTotal);
    }

    total_tiles[i].dataset.total = total;
  }
}

function getBoundedTiles(tile, cb) {
  let tileColumn = tile.dataset.col;
  let tileRow = tile.dataset.row;

  const isLeftEdge = tileColumn === "0";
  const isRightEdge = tileColumn === (columns - 1).toString();
  const isTopEdge = tileRow === "0";
  const isBottomEdge = tileRow === (rows - 1).toString();

  if (isTopEdge) {
    cb([1, 0]);
    if (isLeftEdge) {
      cb([0, 1]);
      cb([1, 1]);
    } else if (isRightEdge) {
      cb([0, -1]);
      cb([1, -1]);
    } else if (!isLeftEdge && !isRightEdge) {
      cb([0, -1]);
      cb([0, 1]);
      cb([1, -1]);
      cb([1, 1]);
    }
  }

  if (isBottomEdge) {
    cb([-1, 0]);
    if (isLeftEdge) {
      cb([0, 1]);
      cb([-1, 1]);
    } else if (isRightEdge) {
      cb([0, -1]);
      cb([-1, -1]);
    } else if (!isLeftEdge && !isRightEdge) {
      cb([0, -1]);
      cb([0, 1]);
      cb([-1, -1]);
      cb([-1, 1]);
    }
  }

  if (!isTopEdge && !isBottomEdge) {
    cb([-1, 0]);
    cb([1, 0]);
    if (isLeftEdge) {
      cb([-1, 1]);
      cb([0, 1]);
      cb([1, 1]);
    } else if (isRightEdge) {
      cb([-1, -1]);
      cb([0, -1]);
      cb([1, -1]);
    } else if (!isLeftEdge && !isRightEdge) {
      cb([-1, -1]);
      cb([-1, 1]);
      cb([0, -1]);
      cb([0, 1]);
      cb([1, -1]);
      cb([1, 1]);
    }
  }
}

function createTile(x, y, index, className) {
  var tile = document.createElement("div");

  tile.classList.add("tile");
  tile.classList.add("hidden");
  tile.setAttribute("id", index);
  tile.dataset.row = x;
  tile.dataset.col = y;
  tile.dataset.checked = "false";
  tile.dataset.mine = className === "mine";
  tile.dataset.flag = "false";

  tile.addEventListener("auxclick", function (e) {
    e.preventDefault();
  }); // Middle Click

  tile.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    if (tile.dataset.flag === "false") {
      tile.dataset.flag = "true";
      flags_planted++;
      tile.classList.add("flag");
    } else {
      tile.dataset.flag = "false";
      flags_planted--;
      tile.classList.remove("flag");
    }
    checkForWin();
  }); // Right Click

  tile.addEventListener("mousedown", function (e) {
    e.preventDefault();
    smileyLimbo();
  });

  tile.addEventListener("click", handleTileClick); //Left Clicks

  tile.addEventListener("mouseup", function (e) {
    smileyDown();
  }); // All Clicks
  return tile;
}

function startGame() {
  if (timer) clearInterval(timer);
  startTimer();
  buildGrid();
}

function restartGame() {
  startGame();
}

function smileyDown() {
  if (isGameOver) return;
  var smiley = document.getElementById("smiley");
  smileyClear();
  smiley.classList.add("face_down");
}

function smileyLimbo() {
  if (isGameOver) return;
  var smiley = document.getElementById("smiley");
  smileyClear();
  smiley.classList.add("face_limbo");
}

function smileyUp() {
  if (isGameOver) return;
  var smiley = document.getElementById("smiley");
  smileyClear();
  smiley.classList.add("face_up");
}

function smileyWin() {
  if (!isGameOver) return;
  var smiley = document.getElementById("smiley");
  smileyClear();
  smiley.classList.add("face_win");
}

function smileyLose() {
  if (!isGameOver) return;
  var smiley = document.getElementById("smiley");
  smileyClear();
  smiley.classList.add("face_lose");
}

function smileyClear() {
  var smiley = document.getElementById("smiley");
  smiley.classList.remove("face_down");
  smiley.classList.remove("face_up");
  smiley.classList.remove("face_limbo");
  smiley.classList.remove("face_win");
  smiley.classList.remove("face_lose");
}

function handleTileClick(event) {
  event.preventDefault();
  if (isGameOver) return;
  let tile = event.target;

  if (isFirstClick === true) {
    isFirstClick = false;
    if (tile.dataset.mine === "true") {
      let adjacentTiles = getAdjacentTiles(tile);
      let adjacentIndexes = [];

      adjacentTiles.forEach((tile) => {
        adjacentIndexes.push(parseInt(tile.id));
      });
      adjacentIndexes.forEach((index) => {
        if (total_tiles[index].dataset.mine === "true") {
          total_tiles[index].dataset.mine = "false";
          let randomIndex = Math.floor(Math.random() * rows * columns);
          if (
            adjacentIndexes.includes(randomIndex) ||
            total_tiles[randomIndex].dataset.mine === "true"
          ) {
            let notFoundIndex = true;
            let counter = 0;
            while (
              notFoundIndex &&
              total_tiles[randomIndex].dataset.mine === "false"
            ) {
              ++counter;
              ++randomIndex;
              if (notFoundIndex > rows * columns) randomIndex = 0;
              if (counter > rows * columns) restartGame();
              notFoundIndex = adjacentIndexes.includes(randomIndex);
            }
          }
          total_tiles[randomIndex].dataset.mine = "true";
        }
      });
      calcTileData();
    }
  }

  if (tile.dataset.mine === "true") {
    total_tiles.forEach((tile) => restartTileLook(tile));
    tile.classList.add("mine_hit");
    gameLose();
    return;
  }

  if (tile.dataset.checked === "true" || tile.dataset.flag === "true") {
    return;
  }

  smileyDown();

  // Left Click
  if (event.which === 1) {
    //TODO reveal the tile
    revealTile(tile);
    return;
  }
  // Middle Click
  else if (event.which === 2) {
    //TODO try to reveal adjacent tiles
    console.log("reveal adjacent Tile");
    let adjacentTiles = getAdjacentTiles(tile);
    adjacentTiles.forEach((tile) => {
      let total = tile.dataset.total;
      tile.classList.remove("hidden");
      if (total !== 0) tile.classList.add(`tile_${total}`);
      if (tile.dataset.mine === "true") tile.classList.add("mine");
    });
  }
  // // Right Click
  // else if (event.which === 3) {
  //   tile.dataset.flag = true;
  //   console.log("added FLAG");
  //   restartTileLook(tile);
  // }

  tile.dataset.checked = "true";
}

function getAdjacentTiles(tile) {
  let currentTileIndex = parseInt(tile.id);

  let adjacentTiles = [tile];

  let revealCB = (rCoord = [0, 0]) => {
    adjacentTiles.push(
      document.getElementById(
        currentTileIndex + columns * rCoord[0] + rCoord[1]
      )
    );
  };

  getBoundedTiles(tile, revealCB);
  return adjacentTiles;
}

function revealTile(tile) {
  let total = tile.dataset.total;
  tile.classList.remove("hidden");
  if (total !== 0) tile.classList.add(`tile_${total}`);
  if (
    (total === "0" && tile.dataset.checked === "false") ||
    (!tile.dataset.checked && tile.dataset.mine === "false")
  ) {
    tile.dataset.checked = "true";
    let currentId = parseInt(tile.id);

    let revealCB = (rCoord = [0, 0]) => {
      let tile = document.getElementById(
        currentId + columns * rCoord[0] + rCoord[1]
      );
      if (tile.dataset.total !== 0) {
        revealTile(tile);
      }
    };

    if (tile.dataset.total === "0") getBoundedTiles(tile, revealCB);
  }
}

function setDifficulty() {
  var difficultySelector = document.getElementById("difficulty");
  var difficulty = difficultySelector.selectedIndex;

  let customInputField = document.getElementById("difficulty-input");
  customInputField.style.display = "none";

  if (difficulty === 0) {
    rows = 9;
    columns = 9;
  }

  if (difficulty === 1) {
    rows = 16;
    columns = 16;
  }

  if (difficulty === 2) {
    rows = 30;
    columns = 16;
  }

  if (difficulty === 3) {
    customInputField.style.display = "inline-flex";
  }

  buildGrid();
}

function startTimer() {
  timeValue = 0;
  updateTimer();
  timer = window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
  timeValue++;
  updateTimer();
}

function updateTimer() {
  document.getElementById("timer").innerHTML = timeValue;
}

function setGrids(target) {
  let inputRows = document.getElementById("rows");
  let inputCols = document.getElementById("cols");
  let inputMines = document.getElementById("mines");
  if (target === "rows") {
    if (!inputCols.value) inputCols.value = parseInt(inputRows.value);
  } else {
    if (!inputRows.value) inputRows.value = parseInt(inputCols.value);
  }

  rows = +inputRows.value;
  columns = +inputCols.value;

  if (!inputMines.value) {
    inputMines.value = parseInt(rows * columns * 0.2) || 1;
  }

  mines = +inputMines.value;
  buildGrid();
}

function restartTileLook(tile) {
  let { total } = tile.dataset;

  tile.classList.remove("hidden");
  tile.classList.remove("mine");
  tile.classList.remove("mine_marked");
  tile.classList.remove("mine_hit");
  tile.classList.remove("flag");

  for (let index = 1; index < 9; index++) {
    tile.classList.remove(`tile_${index}`);
  }

  if (tile.dataset.mine === "true") tile.classList.add("mine");
  if (tile.dataset.mine === "false" && tile.dataset.total !== "0") {
    if (total !== 0) tile.classList.add(`tile_${total}`);
  }
  if (tile.dataset.flag === "true") tile.classList.add("flag");
}

function checkForWin() {
  let span = document.getElementById("flagCount");
  let remainingFlag = mines - flags_planted;
  if (remainingFlag < 0) remainingFlag = 0;
  span.innerText = remainingFlag;
  console.log({ mines, remainingFlag, flags_planted });
  if (flags_planted >= mines) {
    let flaggedAndMine = 0;
    total_tiles.forEach((tile) => {
      if (tile.dataset.mine === "true" && tile.dataset.flag === "true") {
        flaggedAndMine++;
      }
    });
    console.log(flaggedAndMine === mines, { flaggedAndMine, mines });
    if (flaggedAndMine === mines) {
      gameWin();
    } else {
      gameLose();
    }
  }
}

function gameWin() {
  isGameOver = true;
  if (timer) clearInterval(timer);
  smileyWin();
}

function gameLose() {
  isGameOver = true;
  if (timer) clearInterval(timer);
  smileyLose();
}

function Minesweeper() {
  return (
    <div className="minesweeper">
      <h1>Minesweeper</h1>
      <div>
        <select id="difficulty" onChange={setDifficulty}>
          <option value="0">Easy</option>
          <option value="1">Medium</option>
          <option value="2">Hard</option>
          <option value="3">Custom</option>
        </select>

        <div id="difficulty-input">
          <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <input
            type="number"
            placeholder="Rows : 10"
            id="rows"
            onChange={() => setGrids("rows")}
            min="1"
          />
          <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <input
            type="number"
            placeholder="Cols : 10"
            id="cols"
            onChange={() => setGrids("cols")}
            min="1"
          />
          <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <input
            type="number"
            placeholder="Mines : 10"
            id="mines"
            min="1"
            onChange={() => setGrids("mines")}
          />
        </div>

        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <span>Remaining Mines:</span>
        <span id="flagCount"> </span>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <span>Time:</span>
        <span id="timer"> </span>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      </div>

      <div
        id="smiley"
        className="smiley face_up"
        onMouseDown={smileyDown}
        onMouseUp={smileyUp}
        onClick={startGame}
      ></div>

      <div id="minefield"></div>

      <footer>
        <p>
          <em>It don't include any external libraries or dependencies.</em>
          <br /> All JavaScript code should be located in the minesweeper.js
          file. If you are unfamiliar with the game read up on it here:{" "}
          <a
            href="https://en.wikipedia.org/wiki/Minesweeper_(video_game)"
            target="_blank"
            rel="noopener noreferrer"
          >
            wikipedia minesweeper
          </a>
          <br />
        </p>
      </footer>
    </div>
  );
}

export default Minesweeper;
