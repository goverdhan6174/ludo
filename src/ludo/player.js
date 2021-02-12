import Wazir from "./wazir";

class Player {
  constructor(canvasUnit, wazirRef, gamePath) {
    this.playerStatus = "";
    this.hasPlayerLeftTheGame = false;
    this.wazirs = [];
    this.playerIndex = gamePath.playerIndex;
    this.gateCoordinate = gamePath.gateCoordinate;
    this.forceVectors = gamePath.forceVectors;
    this.negForceVectors = gamePath.negForceVectors;
    this.addWazirToSquareFormation(
      this.playerIndex,
      gamePath.playerCoordinate,
      this.gateCoordinate,
      canvasUnit,
      wazirRef
    );
  }

  addWazirToSquareFormation = (
    playerIndex,
    position,
    gateCoordinate,
    canvasUnit,
    wazirRef
  ) => {
    let index = 0;
    let translateX = -1.5;
    let translateY = -1.5;
    for (let i = 0; i < 3; i = i + 2) {
      for (let j = 0; j < 3; j = j + 2) {
        let wazir = new Wazir(
          playerIndex,
          index,
          { x: position.x + translateX + i, y: position.y + translateY + j },
          gateCoordinate,
          position,
          canvasUnit,
          wazirRef
        );
        this.wazirs.push(wazir);
        index++;
      }
    }
  };

  addWazirToLineFormation = (
    playerIndex,
    position,
    gateCoordinate,
    canvasUnit,
    wazirRef
  ) => {
    let index = 0;
    let translateX = -2;
    let translateY = 1.5;
    for (let i = 0; i < 4; ++i) {
      let wazir = new Wazir(
        playerIndex,
        index,
        { x: position.x + translateX + i, y: position.y + translateY },
        gateCoordinate,
        position,
        canvasUnit,
        wazirRef
      );
      this.wazirs.push(wazir);
      index++;
    }
  };

  backToHome = (wazirIndex) => {
    this.updateWazirPosition(wazirIndex, -1);
  };

  changeBoardSize = (boardUnit) => {
    this.wazirs.forEach((wazir) => wazir.changeBoardSize(boardUnit));
  };

  checkCoordinate = (mouseCoordArr, wazirArray) => {
    let x = mouseCoordArr[0];
    let y;
    let wazirIndex = undefined;

    for (let i = 0; i < 2 * Math.PI; i = i + Math.PI / 2) {
      wazirIndex = wazirArray.find((waz) => {
        y = mouseCoordArr[1] + Math.sin(i);
        // console.log(this.wazirs[waz].coordinate, [x, y], waz, wazirArray);
        if (
          x === this.wazirs[waz].coordinate[0] &&
          y === this.wazirs[waz].coordinate[1]
        ) {
          return true;
        }
      });
      if (wazirIndex !== undefined) break;
      // y = mouseCoordArr[1] + Math.sin(i);
    }

    return wazirIndex !== "undefined" ? wazirIndex : -1;
  };

  checkCoordinateWithTranslate = (
    wazirCoord,
    mouseCoordArr,
    translateVector
  ) => {
    for (let i = -1; i < 2; i = i + 2) {
      for (let j = -1; j < 2; j = j + 2) {
        let x = mouseCoordArr[0] + i * translateVector[0];
        let y = mouseCoordArr[1] + j * translateVector[1];
        if (x === wazirCoord[0] && y === wazirCoord[1]) return true;
      }
    }
    return false;
  };

  drawWazirRestingAtHome(ctx) {
    if (this.hasPlayerLeftTheGame) return;

    let wazirRestingAtHome = this.wazirs.filter(
      (waz) => waz.wazirStatus === "HOME"
    );

    let katiHtiGotiya = this.wazirs.filter((waz) => waz.katGayi === true);

    wazirRestingAtHome.forEach((wazir) => wazir.draw(ctx));
    katiHtiGotiya.forEach((wazir) => wazir.draw(ctx));
  }

  drawWazirAreOnSafePath(ctx) {
    if (this.hasPlayerLeftTheGame) return;

    let wazirAreOnSafePath = this.wazirs.filter(
      (waz) => waz.currentPositionIndex > 50
    );

    wazirAreOnSafePath.forEach((wazir) => wazir.draw(ctx));
  }

  playerLeft = () => {
    this.hasPlayerLeftTheGame = true;
  };

  update(deltaTime) {
    if (this.playerStatus === "WIN" || this.hasPlayerLeftTheGame) return;

    this.wazirs.forEach((wazir) =>
      wazir.update(deltaTime, this.forceVectors, this.negForceVectors)
    );
  }

  getWazirs = (steps) => {
    let noneBoundedWazirIndexes = [];
    let noneBoundedWazir = [];
    this.wazirs.forEach((waz, wazIndex) => {
      if (waz.currentPositionIndex + steps < this.forceVectors.length) {
        if (waz.wazirStatus === "HOME" && steps === 6) {
          noneBoundedWazir.push(waz);
          noneBoundedWazirIndexes.push(wazIndex);
        } else if (waz.wazirStatus === "JOURNEY") {
          noneBoundedWazir.push(waz);
          noneBoundedWazirIndexes.push(wazIndex);
        }
      }
    });
    return [noneBoundedWazirIndexes, noneBoundedWazir];
  };

  getWazir = (noneBoundedWazir, mouseCoord) => {
    let findMatch = false;
    let clickedWazirIndex = -1;
    noneBoundedWazir.forEach((wazIndex) => {
      if (this.wazirs[wazIndex].wazirStatus === "HOME") {
        let isMatched = this.checkCoordinateWithTranslate(
          this.wazirs[wazIndex].coordinate,
          mouseCoord,
          [0.5, 0.5]
        );
        if (isMatched) {
          findMatch = isMatched;
          clickedWazirIndex = wazIndex;
        }
      }
    });

    if (findMatch) return clickedWazirIndex;

    clickedWazirIndex = this.checkCoordinate(
      mouseCoord,
      noneBoundedWazir.filter(
        (waz) => this.wazirs[waz].wazirStatus === "JOURNEY"
      )
    );

    return clickedWazirIndex;
  };

  updateWazirPosition = (wazirIndex, steps) => {
    if (typeof wazirIndex !== "undefined") {
      this.wazirs[wazirIndex].updateSteps(
        steps,
        this.forceVectors,
        this.negForceVectors
      );
    }
  };
}

export default Player;
