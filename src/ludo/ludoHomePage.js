import React, { useState } from "react";
import "./index.css";
import { useEffect } from "react";

export default function LudoHomePage({ socket }) {
  const [state, setState] = useState({ username: "", roomId: "" });
  const [failure, setFailure] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("fail", (reason) => {
      setFailure(reason);
    });

  }, [socket]);

  let handleButtonClick = (event) => {
    event.preventDefault();
    if (socket === undefined || !(state.username && state.roomId)) return;

    socket.emit(event.target.name, { ...state });
  };

  let handleInputChange = (event) => {
    event.preventDefault();
    setFailure("");
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  return (
    <div className="form-container">
      <h1>Let's Play</h1>
      <form className="register-form">
        {/* Uncomment the next line to show the success message */}
        {/* <div class="success-message">Success! Thank you for registering</div> */}
        <input
          id="user-name"
          className="form-field"
          type="text"
          placeholder="Your Name"
          name="username"
          value={state.value}
          onChange={handleInputChange}
        />
        {/* <span id="first-name-error">Please enter a first name</span> */}
        <input
          id="room-id"
          className="form-field"
          type="text"
          placeholder="RoomId"
          name="roomId"
          value={state.value}
          onChange={handleInputChange}
        />
        {failure && (
          <span id="room-has-error" className="error">
            {failure}
          </span>
        )}
        <div className="form-field button-field">
          <button type="button" name="create" onClick={handleButtonClick}>
            Create
          </button>
          <button type="button" name="join" onClick={handleButtonClick}>
            Join
          </button>
        </div>
      </form>
    </div>
  );
}
