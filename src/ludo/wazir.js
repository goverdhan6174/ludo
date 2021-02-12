import LudoController from "./ludoController";

class Wizar {
  constructor(
    parentIndex,
    wazirIndex,
    initialPositionIndex,
    gateCoordinate,
    homePosition,
    canvasUnit,
    wazirImg
  ) {
    this.dpi = window.devicePixelRatio;
    this.wazirStatus = "HOME";
    this.canvasUnit = canvasUnit;
    this.gateCoordinate = gateCoordinate;
    this.parentIndex = parentIndex;
    this.wazirIndex = wazirIndex;
    this.katGayi = false;
    this.controller = null;

    this.coordinate = [initialPositionIndex.x, initialPositionIndex.y];
    this.initialCoordinate = [initialPositionIndex.x, initialPositionIndex.y];

    this.currentPositionIndex = 0;
    this.currentPosition = {
      x: initialPositionIndex.x * canvasUnit,
      y: initialPositionIndex.y * canvasUnit,
    };
    this.nextPosition = {
      x: undefined,
      y: undefined,
    };
    this.homePosition = {
      x: homePosition.x * canvasUnit,
      y: homePosition.y * canvasUnit,
    };

    this.initialVelocity = 40;
    this.velocity = +this.initialVelocity;
    this.stepToTake = 0;
    this.Xconstraint = false;
    this.Yconstraint = false;

    this.img = wazirImg;
    this.initialWazirSize = 1.7;
    this.wazirSize = +this.initialWazirSize;
    this.maxSize = 2;
    this.sizeVelocity = 2.5;
    this.currentSize = 0;
    this.leftOverSize = 0;

    this.imgSize = this.canvasUnit * this.initialWazirSize;
  }

  changeBoardSize = (boardUnit) => {
    // this.coordinate = [initialPositionIndex.x, initialPositionIndex.y];
    this.currentPosition = {
      x: (this.currentPosition.x / this.canvasUnit) * boardUnit,
      y: (this.currentPosition.y / this.canvasUnit) * boardUnit,
    };
    this.nextPosition = {
      x: (this.nextPosition.x / this.canvasUnit) * boardUnit,
      y: (this.nextPosition.y / this.canvasUnit) * boardUnit,
    };
    this.canvasUnit = boardUnit;
    this.resetImg();
  };

  checkVectorConstraints = (vector) => {
    if (vector === 0) this.Xconstraint = true;
    if (vector[0] > 0)
      this.Xconstraint = this.currentPosition.x >= this.nextPosition.x;
    if (vector[0] < 0)
      this.Xconstraint = this.currentPosition.x <= this.nextPosition.x;

    if (vector[1] === 0) this.Yconstraint = true;
    if (vector[1] > 0)
      this.Yconstraint = this.currentPosition.y >= this.nextPosition.y;
    if (vector[1] < 0)
      this.Yconstraint = this.currentPosition.y <= this.nextPosition.y;
  };

  draw = (ctx) => {
    // ctx.fillRect(
    //   this.currentPosition.x,
    //   this.currentPosition.y,
    //   this.canvasUnit,
    //   this.canvasUnit
    // );
    ctx.save();
    let translatedXUnit = this.canvasUnit * (1 - this.wazirSize) * 0.5;
    let translatedYUnit = this.canvasUnit * (1 - this.wazirSize) * 0.9;
    ctx.translate(translatedXUnit, translatedYUnit);
    // ctx.fillRect(
    //   this.currentPosition.x,
    //   this.currentPosition.y,
    //   this.imgSize,
    //   this.imgSize
    // );
    ctx.drawImage(
      this.img,
      this.currentPosition.x,
      this.currentPosition.y,
      this.imgSize,
      this.imgSize
    );
    ctx.restore();
  };

  increaseSize = (deltaTime) => {
    this.currentSize =
      (this.currentSize + this.sizeVelocity / deltaTime) % this.maxSize;
    this.leftOverSize =
      Math.sin((this.currentSize * 2 * Math.PI) / this.maxSize) *
      (this.maxSize - this.initialWazirSize);
    this.wazirSize = this.initialWazirSize + this.leftOverSize;
    if (this.wazirSize < this.initialWazirSize)
      this.wazirSize = this.initialWazirSize;
    if (this.wazirSize > this.maxSize) this.wazirSize = this.maxSize;
    this.imgSize = this.canvasUnit * this.wazirSize;
  };

  move = (deltaTime, vector) => {
    this.currentPosition.x += this.velocity * vector[0] * deltaTime * 0.004;
    this.currentPosition.y += this.velocity * vector[1] * deltaTime * 0.004;
  };

  reset = () => {
    this.stepToTake = 0;
    this.currentPositionIndex = 0;
    this.wazirStatus = "HOME";
    this.katGayi = false;
    this.velocity = this.initialVelocity;
    this.resetImg();
  };

  resetImg = () => {
    this.wazirSize = this.initialWazirSize;
    this.imgSize = this.canvasUnit * this.initialWazirSize;
    this.currentSize = 0;
    this.leftOverSize = 0;
  };

  setCurrentPosition(vector) {
    this.currentPosition = {
      x: vector[0] * this.canvasUnit,
      y: vector[1] * this.canvasUnit,
    };
  }

  setNextPosition(vector) {
    if (!this.katGayi) {
      LudoController.updateWazirPosition(this.controller, this);
    }
    this.wazirSize = this.initialWazirSize;
    this.imgSize = this.canvasUnit * this.initialWazirSize;
    this.nextPosition.x = this.currentPosition.x + vector[0] * this.canvasUnit;
    this.nextPosition.y = this.currentPosition.y + vector[1] * this.canvasUnit;

    if (this.wazirStatus === "HOME") {
      this.coordinate[0] = this.initialCoordinate[0];
      this.coordinate[1] = this.initialCoordinate[1];
    } else {
      this.coordinate = [
        Math.floor((this.currentPosition.x + 5) / this.canvasUnit),
        Math.floor(this.currentPosition.y / this.canvasUnit),
      ];
    }
    if (this.currentPositionIndex === 56) this.wazirStatus = "DESTINY";
  }

  update = (deltaTime, forceVectors, negForceVectors) => {
    if (!deltaTime || this.currentPositionIndex === 56) return;

    if (this.wazirStatus === "HOME" && this.katGayi) {
      this.reset();
      return;
    }

    if (this.wazirStatus === "JOURNEY" && this.stepToTake !== 0) {
      let vector = [];
      if (this.stepToTake > 0) {
        vector = forceVectors[this.currentPositionIndex];
      } else {
        vector = negForceVectors[this.currentPositionIndex];
      }

      this.checkVectorConstraints(vector);
      this.stepToTake > 0 && this.increaseSize(deltaTime);
      this.move(deltaTime, vector);
      this.updateToNextPosition(forceVectors, negForceVectors);
      return;
    }

    if (this.wazirStatus === "HOME" && this.stepToTake === 6) {
      // console.log("MOVE TO GATE");
      let vector = [
        this.gateCoordinate[0] - this.initialCoordinate[0],
        this.gateCoordinate[1] - this.initialCoordinate[1],
      ];
      this.nextPosition.x =
        (vector[0] + this.initialCoordinate[0]) * this.canvasUnit;
      this.nextPosition.y =
        (vector[1] + this.initialCoordinate[1]) * this.canvasUnit;

      this.checkVectorConstraints(vector);
      this.move(deltaTime, vector);

      if (this.Xconstraint && this.Yconstraint) {
        let forceVector = forceVectors[this.currentPositionIndex];
        this.stepToTake = 0;
        this.currentPositionIndex = 0;
        this.wazirStatus = "JOURNEY";
        this.setCurrentPosition(this.gateCoordinate);
        this.setNextPosition(forceVector);
      }
      return;
    }

    if (
      this.wazirStatus === "JOURNEY" &&
      this.stepToTake === 0 &&
      this.katGayi
    ) {
      console.log(this.katGayi, "MOVE FROM GATE TO HOME ");
      let vector = [
        this.initialCoordinate[0] - this.gateCoordinate[0],
        this.initialCoordinate[1] - this.gateCoordinate[1],
      ];
      this.nextPosition.x =
        (vector[0] + this.gateCoordinate[0]) * this.canvasUnit;
      this.nextPosition.y =
        (vector[1] + this.gateCoordinate[1]) * this.canvasUnit;

      this.checkVectorConstraints(vector);
      this.move(deltaTime, vector);

      if (this.Xconstraint && this.Yconstraint) {
        let forceVector = forceVectors[this.currentPositionIndex];
        this.reset();
        this.setCurrentPosition(this.initialCoordinate);
        this.setNextPosition(forceVector);
      }
      return;
    }

    if (
      this.wazirStatus === "HOME" &&
      !this.katGayi &&
      this.stepToTake > 0 &&
      this.stepToTake < 6
    ) {
      this.reset();
      return;
    }
  };

  updateToNextPosition = (forceVectors, negForceVectors) => {
    if (this.Xconstraint && this.Yconstraint) {
      let vector = [];
      if (this.stepToTake > 0) {
        ++this.currentPositionIndex;
        --this.stepToTake;
        vector = forceVectors[this.currentPositionIndex];
      } else {
        --this.currentPositionIndex;
        ++this.stepToTake;
        vector = negForceVectors[this.currentPositionIndex];
      }

      this.currentPosition.x = this.nextPosition.x;
      this.currentPosition.y = this.nextPosition.y;
      this.wazirSize = this.initialWazirSize;
      this.setNextPosition(vector);
      // console.log(
      //   ` STEPS LEFT ${this.stepToTake} : CURRENT INDEX ${this.currentPositionIndex} KATIGODI : ${this.katGayi}`
      // );
    }
  };

  updateSteps = (step, forceVectors, negForceVectors) => {
    if (this.stepToTake !== 0) return;
    let steps = step < 0 ? -this.currentPositionIndex : step;

    let vector = [];
    if (steps >= 0) {
      vector = forceVectors[this.currentPositionIndex];
    } else {
      this.katGayi = true;
      this.velocity = this.velocity * 10;
      vector = negForceVectors[this.currentPositionIndex];
    }
    this.stepToTake = steps;

    if (steps < 0) this.setNextPosition(vector);
    // console.log(
    //   ` STEPS : ${steps} , STATUS : ${this.wazirStatus} , kati : ${this.katGayi} `
    // );
  };
}

export default Wizar;
