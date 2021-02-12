import Player from "./player";

class LudoController {
  constructor(boardUnit, context) {
    this.boardUnit = boardUnit;
    this.currentPlayerIndex = 0;
    this.players = [];
    this.hasExtraLife = false;
    this.gamePath = generatedNextPath();
    this.context = context;

    this.allWazirPosition = this.array52X2();
    this.noOfPlayers = 0;
    this.winners = [];
    this.noOfDestinedWazirs = [0, 0, 0, 0];
    this.selectedWazirs = [];
    this.player0SafeWazirs = [[], [], [], [], [], [], []];
    this.player1SafeWazirs = [[], [], [], [], [], [], []];
    this.player2SafeWazirs = [[], [], [], [], [], [], []];
    this.player3SafeWazirs = [[], [], [], [], [], [], []];

    this.isDiceRolled = false;
    this.isCurrentPlayerMoving = false;
    this.rollSteps = 0;
    this.currentPlayerNonBoundedWazir = [];
    this.clickedWazir = -1;
    this.safeIndexes = [3, 11, 16, 24, 29, 37, 42, 50];
  }

  addPlayer = (img) => {
    if (this.players.length > 4) {
      console.log(`Sorry Board Is Full`);
      return;
    }
    let playerPath = this.gamePath.next().value;
    this.players.push(new Player(this.boardUnit, img, playerPath));
  };

  removePlayer = (playerIndex) => {
    this.players[playerIndex].playerLeft();
    if (this.players[playerIndex].playerStatus === "WIN") return;
    this.noOfPlayers--;
  };

  changeBoardSize = (boardUnit, context) => {
    this.boardUnit = boardUnit;
    this.context = context;
    this.players.forEach((player) => player.changeBoardSize(boardUnit));
  };

  draw = () => {
    this.context.clearRect(0, 0, this.boardUnit * 17, this.boardUnit * 17);

    // this.context.beginPath();
    // this.context.lineWidth = "6";
    // this.context.strokeStyle = "red";
    // this.context.rect(5, 5, this.boardUnit * 17 - 10, this.boardUnit * 8);
    // this.context.stroke();

    for (let i = 0; i < 16; i++) {
      this.allWazirPosition[i].forEach((waz) => waz.draw(this.context));
    }

    for (let i = 0; i < 7; i++) {
      this.player0SafeWazirs[i].forEach((waz) => waz.draw(this.context));
      this.player1SafeWazirs[i].forEach((waz) => waz.draw(this.context));
    }

    for (let i = 16; i < 27; i++) {
      this.allWazirPosition[i].forEach((waz) => waz.draw(this.context));
    }

    for (let i = 6; i >= 0; i--) {
      this.player2SafeWazirs[i].forEach((waz) => waz.draw(this.context));
    }

    for (let i = 51; i > 39; i--) {
      this.allWazirPosition[i].forEach((waz) => waz.draw(this.context));
    }

    for (let i = 6; i >= 0; i--) {
      this.player3SafeWazirs[i].forEach((waz) => waz.draw(this.context));
    }

    for (let i = 39; i > 26; i--) {
      this.allWazirPosition[i].forEach((waz) => waz.draw(this.context));
    }
    // drawWazirAreOnSafePath
    this.players.forEach((player) =>
      player.drawWazirRestingAtHome(this.context)
    );
  };

  array52X2() {
    let arr = [];

    for (let i = 0; i < 52; i++) {
      let newArr = [];
      arr.push(newArr);
    }

    return arr;
  }

  static setStaticControllerToWazir = (controller) => {
    controller.players.forEach((player) =>
      player.wazirs.forEach((wazir) => (wazir.controller = controller))
    );
  };

  update = (deltaTime) => {
    this.players.forEach((player) => player.update(deltaTime));

    if (!this.isCurrentPlayerMoving)
      this.selectedWazirs.forEach((waz) => waz.increaseSize(deltaTime));
  };

  static updateWazirPosition(controller, currentWazir) {
    let offsetIndex = (3 + 13 * currentWazir.parentIndex) % 52;
    let currentIndex = (currentWazir.currentPositionIndex + offsetIndex) % 52;

    let GATEINDEXES = [3, 16, 29, 42];

    GATEINDEXES.forEach((i) => {
      let filterArray = controller.allWazirPosition[i].filter(
        (waz) => waz.wazirStatus !== "HOME"
      );
      if (filterArray === undefined) filterArray = [];
      controller.allWazirPosition[i] = filterArray;
    });

    let applyFilterAtIndex = (index) => {
      let filterArray = controller.allWazirPosition[index].filter(
        (waz) =>
          waz.wazirIndex !== currentWazir.wazirIndex ||
          waz.parentIndex !== currentWazir.parentIndex
      );
      if (filterArray === undefined) {
        filterArray = [];
      }
      controller.allWazirPosition[index] = filterArray;
    };

    let removeAndAdd = (arrOfWazirsArr, currentIndex) => {
      let wazirArrayOnPreviousIndex = arrOfWazirsArr[currentIndex - 1];
      let wazirArrayOnCurrentIndex = arrOfWazirsArr[currentIndex];

      if (
        wazirArrayOnPreviousIndex === undefined ||
        wazirArrayOnPreviousIndex.length === 0
      ) {
        if (currentIndex === 0) applyFilterAtIndex(arrOfWazirsArr.length - 1);
      } else {
        applyFilterAtIndex(currentIndex - 1);
      }

      if (
        wazirArrayOnCurrentIndex === undefined ||
        wazirArrayOnCurrentIndex.length === 0
      ) {
        arrOfWazirsArr[currentIndex] = [currentWazir];
      } else if (wazirArrayOnCurrentIndex.length > 1) {
        arrOfWazirsArr[currentIndex].push(currentWazir);
      } else if (wazirArrayOnCurrentIndex.length === 1) {
        let prevWazirArr = arrOfWazirsArr[currentIndex];
        let prevWazir = prevWazirArr[0];
        if (currentWazir.stepToTake !== 0) {
          arrOfWazirsArr[currentIndex].push(currentWazir);
        } else {
          if (
            prevWazir.parentIndex !== currentWazir.parentIndex &&
            !controller.safeIndexes.includes(currentIndex)
          ) {
            controller.hasExtraLife = true;
            controller.players[prevWazir.parentIndex].updateWazirPosition(
              prevWazir.wazirIndex,
              -2
            );
            arrOfWazirsArr[currentIndex] = [currentWazir];
          } else {
            arrOfWazirsArr[currentIndex].push(currentWazir);
          }
        }
      }
    };

    if (currentWazir.currentPositionIndex < 51) {
      removeAndAdd(controller.allWazirPosition, currentIndex);
    }
    if (currentWazir.currentPositionIndex === 51) {
      applyFilterAtIndex(currentIndex - 1);
    }
    if (currentWazir.currentPositionIndex > 50) {
      let curIndex = currentWazir.currentPositionIndex - 51;
      switch (currentWazir.parentIndex) {
        case 0:
          removeAndAdd(controller.player0SafeWazirs, curIndex);
          break;
        case 1:
          removeAndAdd(controller.player1SafeWazirs, curIndex);
          break;
        case 2:
          removeAndAdd(controller.player2SafeWazirs, curIndex);
          break;
        case 3:
          removeAndAdd(controller.player3SafeWazirs, curIndex);
          break;
      }
    }

    if (currentWazir.currentPositionIndex === 56) {
      controller.hasExtraLife = true;
      controller.noOfDestinedWazirs[currentWazir.parentIndex] =
        controller.noOfDestinedWazirs[currentWazir.parentIndex] + 1;
      if (controller.noOfDestinedWazirs[currentWazir.parentIndex] === 4) {
        controller.players[currentWazir.parentIndex].playerStatus = "WIN";
        controller.winners.push(currentWazir.parentIndex);
        console.log(
          `Player ${currentWazir.parentIndex} has WIN at ${controller.winners.length}`
        );
        if (controller.winners.length === controller.noOfPlayers - 1) {
          console.log(
            "EXIT THE WE HAVE ",
            controller.winners.length,
            " WiNNERS"
          );
        }
      }
    }

    if (
      currentWazir.stepToTake === 0 &&
      currentWazir.parentIndex === controller.currentPlayerIndex
    ) {
      controller.isCurrentPlayerMoving = false;
      controller.nextPlayer();
    }
  }

  reset = () => {
    this.hasExtraLife = false;
    this.isDiceRolled = false;
    this.isCurrentPlayerMoving = false;
    this.rollSteps = 0;
    this.selectedWazirs.forEach((waz) => waz.resetImg());
    this.selectedWazirs = [];
    this.currentPlayerNonBoundedWazir = [];
    this.clickedWazir = -1;
    if (
      this.players[this.currentPlayerIndex].hasPlayerLeftTheGame ||
      this.players[this.currentPlayerIndex].playerStatus === "WIN"
    )
      this.nextPlayer();
  };

  rollDice = (diceInput) => {
    if (this.isDiceRolled) {
      console.log(
        "YOU CAN'T ROLL THE DICE, PLAYER :",
        ["YELLOW", "BLUE", "RED", "GREEN"][this.currentPlayerIndex]
      );
      return;
    }

    if (this.isCurrentPlayerMoving) {
      console.log(`Can't Roll : current player is already moving`);
    }
    if (this.players[this.currentPlayerIndex].playerStatus === "WIN")
      this.nextPlayer();

    this.rollSteps = Math.ceil(Math.random() * 6);
    if (diceInput > 0) this.rollSteps = +diceInput;

    let NonBoundedWazir = this.players[this.currentPlayerIndex].getWazirs(
      this.rollSteps
    );

    this.currentPlayerNonBoundedWazir = NonBoundedWazir[0];
    this.selectedWazirs = NonBoundedWazir[1];

    this.isDiceRolled = true;

    if (this.rollSteps === 6) this.hasExtraLife = true;

    console.log(
      "Dice Rolled By ",
      ["YELLOW", "BLUE", "RED", "GREEN"][this.currentPlayerIndex],
      " :: ",
      this.rollSteps
    );

    if (this.currentPlayerNonBoundedWazir.length === 0) this.nextPlayer();
    // if (
    //   this.currentPlayerNonBoundedWazir.length === 1 &&
    //   this.rollSteps === 6
    // ) {
    //   this.players[this.currentPlayerIndex].updateWazirPosition(
    //     this.currentPlayerNonBoundedWazir[0],
    //     this.rollSteps
    //   );
    // }
    // if (
    //   this.currentPlayerNonBoundedWazir.length === 1 &&
    //   this.rollSteps !== 6
    // ) {
    //   this.players[this.currentPlayerIndex].updateWazirPosition(
    //     this.currentPlayerNonBoundedWazir[0],
    //     this.rollSteps
    //   );
    // }
    if (this.currentPlayerNonBoundedWazir.length === 1) {
      this.isCurrentPlayerMoving = true;
      this.players[this.currentPlayerIndex].updateWazirPosition(
        this.currentPlayerNonBoundedWazir[0],
        this.rollSteps
      );
    }
  };

  moveWazir = (mouseCoor) => {
    let clickedCoordinates = [
      Math.floor(mouseCoor.x / this.boardUnit),
      Math.floor(mouseCoor.y / this.boardUnit),
    ];

    if (!this.isDiceRolled) {
      console.log("FIRST ROLL THE DICE");
      return;
    }

    if (this.isCurrentPlayerMoving) {
      console.log("CURRENT IS ALREADY MOVING");
      return;
    }

    this.clickedWazir = this.players[this.currentPlayerIndex].getWazir(
      this.currentPlayerNonBoundedWazir,
      clickedCoordinates
    );

    if (this.currentPlayerNonBoundedWazir.includes(this.clickedWazir)) {
      this.selectedWazirs.forEach((waz) => waz.resetImg());
      this.selectedWazirs = [];
      this.players[this.currentPlayerIndex].updateWazirPosition(
        this.clickedWazir,
        this.rollSteps
      );
      // this.nextPlayer();
    } else {
      console.log(
        "CLICK AGAIN :: ",
        this.clickedWazir,
        this.currentPlayerNonBoundedWazir
      );
    }
  };

  nextPlayer = () => {
    if (this.hasExtraLife) {
      this.reset();
      console.log("HAS EXTRA LIFE");
      return;
    }

    this.reset();
    console.log("NEXT PLAYER UPDATE ");

    this.currentPlayerIndex++;
    this.currentPlayerIndex = this.currentPlayerIndex % this.players.length;

    if (
      this.players[this.currentPlayerIndex].hasPlayerLeftTheGame ||
      this.players[this.currentPlayerIndex].playerStatus === "WIN"
    )
      this.nextPlayer();
  };
}

function* generatedNextPath(start = 0, end = 4) {
  //return path : [ yellowGamePath =>>blueGamePath =>>redGamePath =>>greenGamePath ]
  let iterationCount = 0;

  const playerCoordinates = [
    { x: 13, y: 4 },
    { x: 13, y: 13 },
    { x: 4, y: 13 },
    { x: 4, y: 4 },
  ];

  const gateCoordinates = [
    [9, 2],
    [14, 9],
    [7, 14],
    [2, 7],
  ];

  //Current position vector pointed towards Force To Be Applied and Starts from Top to Green Home
  const vectors = [
    [1, 0],
    [1, 0],
    [0, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 0],
    [0, 1],
    [0, 1],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [-1, 0],
    [-1, 0],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [0, -1],
    [0, -1],
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 0],
    [1, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
  ];

  //current position vector pointed towards negative force to be applied
  let negForceVectors;
  let forceVectors;

  for (let i = start; i < end; i += 1) {
    iterationCount++;

    let oldForceVectors = [...vectors];

    let wrappingNumber = (28 + 13 * i) % 52;
    negForceVectors = oldForceVectors.slice(wrappingNumber);
    negForceVectors.push(...oldForceVectors.slice(0, wrappingNumber));

    forceVectors = oldForceVectors.splice(3 + 13 * i);
    oldForceVectors.splice(-2, 1);
    forceVectors.push(...oldForceVectors);
    let lastarray = forceVectors.pop();

    for (let i = 0; i < 7; i++) {
      forceVectors.push(lastarray);
    }

    yield {
      playerIndex: i,
      forceVectors,
      negForceVectors,
      playerCoordinate: playerCoordinates[i],
      gateCoordinate: gateCoordinates[i],
    };
  }
  return iterationCount;
}

export default LudoController;
