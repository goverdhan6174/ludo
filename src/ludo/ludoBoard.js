import React, { useEffect } from "react";
import useMousePosition from "./helper/useMousePosition";
import ludoImg from "../assets/ludoimages/ludoBoard.png";

function LudoBoard({ canvasRef, canvasUnit, players, btnHandler, socket }) {
  let mouseCoor = useMousePosition(canvasRef);
  // let [diceInput, setDiceInput] = useState(0);

  useEffect(() => {
    let keypressHandler = () => {
      if (players.current) players.current.rollDice();
    };

    document.addEventListener("keypress", keypressHandler);
    return () => document.removeEventListener("keypress", keypressHandler);
  }, [players]);

  useEffect(() => {
    if (!socket) return;
    if (players.current) {
      let clickedWazir = players.current.moveWazir(mouseCoor);
      //emit "moveWazir" with arg clickedWazir
      if (socket === undefined) return;
      if (typeof clickedWazir !== "number") return;
      socket.emit("moveWazir", players.current.boardId, clickedWazir);
      // players.current.moveClickedWazir(clickedWazir);
    }
  }, [mouseCoor, socket, players]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        // backgroundColor: "#EDEAE0",
        backgroundColor: "whitesmoke",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <div
        style={{
          zIndex: 999,
          display: "flex",
          width: `${canvasUnit * 3}px`,
        }}
      >
        <input
          type="text"
          style={{ padding: "1rem", width: "50%" }}
          onChange={(e) => setDiceInput(e.target.value)}
          value={diceInput}
        />
        <button
          type="button"
          name="roll"
          style={{ padding: "1rem" }}
          onClick={btnHandler}
          // onClick={() => {
          //   if (players.current) {
          //     players.current.rollDice(diceInput);
          //     setDiceInput(0);
          //   }
          // }}
        >
          {["ROLL", "YELLOW", "BLUE", "RED", "GREEN"][0]}
        </button>
      </div> */}

      <div
        style={{
          position: "absolute",
          opacity: "0.9",
          display: "flex",
          width: "95vmin",
          height: "95vmin",
          padding: `${canvasUnit}px`,
          // backgroundColor: "red",
        }}
      >
        <img
          src={ludoImg}
          alt="LUDO IMGAGES"
          style={{
            width: "100%",
            height: "100%",
            margin: "auto",
            userSelect: "none",
          }}
        />
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          opacity: "0.9",
          backgroundColor: "transparent",
          position: "absolute",
          width: "95vmin",
          height: "95vmin",
          zIndex: 1,
        }}
      ></canvas>
    </div>
  );
}

export default LudoBoard;
