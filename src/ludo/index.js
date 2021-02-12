import React, { useState, useEffect, useRef, useCallback } from "react";
import socketIOClient from "socket.io-client";

import LudoApp from "./LudoApp";
import LudoHomePage from "./ludoHomePage";

function Ludo() {
  const ENDPOINT = "http://127.0.0.1:4000";

  const [isBoardLoaded, setBoardState] = useState(false);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomInfo, setRoomInfo] = useState({});

  const socket = useRef();

  let handleButtonClick = (event) => {
    event.preventDefault();
    if (socket.current === undefined) return;
    console.log("emit ", event.target.name, roomId);
    console.log(userId, roomId, roomInfo);
    socket.current.emit(event.target.name, roomId);
  };

  let getRoomInfo = useCallback(() => {
    console.log(roomInfo);
    return roomInfo;
  }, [roomInfo]);

  useEffect(() => {
    socket.current = socketIOClient(ENDPOINT, {});
    let currentSocket = socket.current;

    currentSocket.on("connect", () => {
      console.log("webSocket");
      setUserId();
    });

    currentSocket.on("boardCreated", (userId, roomId, room) => {
      setUserId(userId);
      setRoomId(roomId);
      setRoomInfo(JSON.parse(room));
      setBoardState(true);
      console.log(userId);
    });

    currentSocket.on("newPlayer", (username, id) => {
      setRoomInfo((prevInfo) => {
        return {
          ...prevInfo,
          users: [...prevInfo.users, { username, id, isReady: true }],
        };
      });
    });

    currentSocket.on("playerLeft", (username) => {
      console.log(`${username} left the game`);
      // arr.indexOf(1) !== -1
      setRoomInfo((prevInfo) => {
        return {
          ...prevInfo,
        };
      });
    });

    currentSocket.on("ready", (id, state) => {
      setRoomInfo((prevInfo) => {
        let userIndex = prevInfo.users.findIndex((user) =>
          user === undefined ? false : user.id === id
        );
        if (userIndex !== -1) {
          prevInfo.users[userIndex].isReady = state;
        }
        return { ...prevInfo };
      });
    });

    currentSocket.on("restart", () => {
      console.log(`restarted the game`);
    });

    currentSocket.on("log", (msg) => {
      console.log("LOG ::", msg);
    });
  }, []);

  return (
    <>
      {!isBoardLoaded && <LudoHomePage socket={socket.current} />}
      {isBoardLoaded && <LudoApp />}
      {isBoardLoaded && (
        <div style={{ position: "absolute", top: "50%" }}>
          {roomInfo.admin === userId ? (
            <button
              type="button"
              name="start"
              onClick={handleButtonClick}
              style={{ position: "relative" }}
            >
              Start
            </button>
          ) : (
            <button
              type="button"
              name="ready"
              onClick={handleButtonClick}
              style={{ position: "relative" }}
            >
              Ready
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Ludo;
