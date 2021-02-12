import React, { useEffect } from "react";
import useMousePosition from "./helper/useMousePosition";
import ludoImg from "../assets/ludoimages/ludoBoard.png";
import { useState } from "react";

function LudoBoard({ canvasRef, canvasUnit, players }) {
  let mouseCoor = useMousePosition(canvasRef);
  let [diceInput, setDiceInput] = useState(0);

  useEffect(() => {
    let keypressHandler = () => {
      if (players.current) players.current.rollDice();
    };

    document.addEventListener("keypress", keypressHandler);
    return () => document.removeEventListener("keypress", keypressHandler);
  }, []);

  useEffect(() => {
    if (players.current) players.current.moveWazir(mouseCoor);
  }, [mouseCoor]);

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
      <div
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
          type="submit"
          style={{ padding: "1rem" }}
          onClick={() => {
            if (players.current) {
              players.current.rollDice(diceInput);
              setDiceInput(0);
            }
          }}
        >
          {["ROLL", "YELLOW", "BLUE", "RED", "GREEN"][0]}
        </button>
      </div>

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
