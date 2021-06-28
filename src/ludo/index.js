import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

import LudoApp from "./LudoApp";
import LudoHomePage from "./ludoHomePage";

function Ludo() {
  // const ENDPOINT = "http://127.0.0.1:4000";
  const ENDPOINT = "https://my-ludo-api.herokuapp.com/";

  const [isBoardLoaded, setBoardState] = useState(false);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomInfo, setRoomInfo] = useState({ users: [] });
  const [failure, setFailure] = useState("");

  const socket = useRef();
  const gameController = useRef();
  const failureTimer = useRef();

  const rollBtnRef = useRef(null);

  let handleButtonClick = (event) => {
    event.preventDefault();
    if (socket.current === undefined) return;
    // console.log("emit ", event.target.name, roomId);
    console.log(event.target.name, " is Clicked");
    if (event.target.name === "roll") {
      event.target.disabled = true;
      event.target.style.backgroundColor = "grey";
    }
    socket.current.emit(event.target.name, roomId);
  };

  // let getRoomInfo = useCallback(() => {
  //   console.log(roomInfo);
  //   return roomInfo;
  // }, [roomInfo]);

  useEffect(() => {
    socket.current = socketIOClient(ENDPOINT, {});
    let currentSocket = socket.current;

    currentSocket.on("connect", () => {
      console.log("webSocket :: ", currentSocket.id);
      setUserId(currentSocket.id);
    });

    currentSocket.on("boardCreated", (userId, roomId, room) => {
      setUserId(userId);
      setRoomId(roomId);
      setRoomInfo((prev) => {
        let roomInfo = JSON.parse(room);
        return roomInfo;
      });
      setBoardState(true);
    });

    currentSocket.on("newPlayer", (users) => {
      setRoomInfo((prevInfo) => {
        prevInfo.noOfPlayers++;
        return {
          ...prevInfo,
          users,
        };
      });
    });

    currentSocket.on("playerLeft", (username, id) => {
      console.log(`${username} left the game`);
      // arr.indexOf(1) !== -1
      setRoomInfo((prevInfo) => {
        let updatedUsers = prevInfo.users.map((user) => {
          if (user === undefined || user.id === id) {
            return undefined;
          } else {
            return user;
          }
        });
        return {
          ...prevInfo,
          users: updatedUsers,
        };
      });
    });

    currentSocket.on("ready", (id, state) => {
      setRoomInfo((prevInfo) => {
        let userIndex = prevInfo.users.findIndex((user) =>
          user === undefined || user === null ? false : user.id === id
        );
        if (userIndex !== -1) {
          prevInfo.users[userIndex].isReady = state;
        }
        return { ...prevInfo };
      });
    });

    currentSocket.on("start", (data) => {
      let { users, gameStatus } = JSON.parse(data);
      setRoomInfo((prevInfo) => {
        return { ...prevInfo, users, gameStatus };
      });
    });

    currentSocket.on("steps", (socketId, steps) => {
      console.log(`${socketId} :: steps are ${steps}`);
      if (rollBtnRef.current) {
        rollBtnRef.current.innerText = steps;
      }
      setRoomInfo((prevInfo) => {
        let userIndex = prevInfo.users.findIndex((user) => {
          if (!user) return false;
          if (user.id === socketId) return true;
        });
        if (userIndex !== -1) {
          gameController.current.rollDice(steps);
        } else {
          console.log("*****SORRY SOMETHING WENT WRONG*****");
        }
        return prevInfo;
      });
    });

    currentSocket.on("move", (wazirIndex, id) =>
      gameController.current.moveClickedWazir(wazirIndex, id)
    );

    currentSocket.on("turn", (id) => {
      setRoomInfo((prevInfo) => {
        let userIndex = prevInfo.users.findIndex((user) =>
          user === undefined || user === null ? false : user.id === id
        );
        if (userIndex !== -1) {
          gameController.current.currentPlayerId = id;
          prevInfo.currentPlayerIndex = userIndex;
          gameController.current.currentPlayerIndex = userIndex;
          if (rollBtnRef.current) {
            rollBtnRef.current.disabled = false;
            rollBtnRef.current.style.backgroundColor = [
              "yellow",
              "blue",
              "red",
              "green",
            ][userIndex];
            rollBtnRef.current.innerText = "ROLL";
          }
          console.log("TURN", id, userIndex);
        }
        return prevInfo;
      });
    });

    currentSocket.on("restart", () => {
      console.log(`restarted the game`);
    });

    currentSocket.on("log", (msg) => {
      console.log("LOG ::", msg);
    });

    currentSocket.on("gameFail", (reason) => {
      clearTimeout(failureTimer.current);
      setFailure(reason);
      failureTimer.current = setTimeout(() => {
        setFailure("");
      }, 3000);
    });
  }, []);

  return (
    // <LudoApp />
    <>
      {!isBoardLoaded && <LudoHomePage socket={socket.current} />}
      {isBoardLoaded && (
        <>
          <LudoApp
            roomId={roomId}
            socket={socket.current}
            btnHandler={handleButtonClick}
            ludoController={gameController}
            users={roomInfo.users}
          />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,  -50%)",
              backgroundColor: "whitesmoke",
              zIndex: 999,
            }}
          >
            {roomInfo.gameStatus === "LOBBY" &&
              (roomInfo.admin === userId ? (
                <button
                  type="button"
                  name="start"
                  onClick={handleButtonClick}
                  style={{ width: "100%", position: "relative" }}
                >
                  Start
                </button>
              ) : (
                <button
                  type="button"
                  name="ready"
                  onClick={handleButtonClick}
                  style={{ width: "100%" }}
                >
                  Ready
                </button>
              ))}
            {roomInfo.gameStatus === "PLAYING" && (
              // <button
              //   type="button"
              //   name="roll"
              //   onClick={handleButtonClick}
              //   style={{ width: "100%" }}
              // >
              //   Roll
              // </button>
              <button
                type="button"
                name="roll"
                ref={rollBtnRef}
                style={{ padding: "1rem", minWidth: "100px", zIndex: 999 }}
                onClick={handleButtonClick}
              >
                ROLL
              </button>
            )}

            {failure && (
              <span id="game-has-error" className="error">
                {failure}
              </span>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Ludo;
