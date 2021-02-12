import React, { useReducer, useContext, createContext } from "react";

const GlobalLudoContext = createContext(null);

const initialState = {
  gameStatus: "LOBBY",
  gameStatusArray: ["LOBBY", "PLAYING", "ENDED"],
  players: [],
  currentPlayerIndex: -1,
  currentWazirIndex: -1,
  hasRolledTheDice: false,
  hasExtraLife: false,
  isWazirMoving: false,
  stepsToTake: 0,
};
const reducer = (state, action) => {
  console.log("REDUCER :: Action Type ", action.type);
  switch (action.type) {
    case "START":
      return {
        ...state,
        gameStatus: "PLAYING",
        currentPlayerIndex: Math.floor(Math.random() * state.players.length),
      };

    case "ADDPLAYER":
      if (!(state.gameStatus === "LOBBY" && state.players.length < 5))
        throw new Error("Board is full");

      return {
        ...state,
        players: state.players.push(action.player),
      };

    case "UPDATEPLAYER":
      if (state.hasExtraLife)
        throw new Error(
          "Can't move to Next Player because current player has Extra Life"
        );

      let currentIndex = (state.currentPlayerIndex + 1) % state.players.length;
      return {
        ...state,
        currentPlayerIndex: currentIndex,
      };

    case "ROLLTHEDICE":
      if (state.stepsToTake !== 0)
        throw new Error("Let's Wait till previous Step are completes");

      return { ...state, hasRolledTheDice: true };

    case "MOVEWAZIR":
      if (!(action.steps > -1 && action.steps < 7))
        throw new Error(`Can't move ${action.steps} steps`);

      let allPlayers = state.players;
      allPlayers[state.currentPlayerIndex].wazirsIndex[
        state.currentWazirIndex
      ] += action.steps;
      return {
        ...state,
        players: allPlayers,
        currentWazirIndex: action.wazirIndex % 4,
        isWazirMoving: true,
        hasExtraLife: action.steps === 6 ? false : true,
        stepsToTake: action.steps,
      };

    case "UPDATESTEP":
      if (!(state.stepsToTake > 0 && state.stepsToTake < 7))
        throw new Error("Select the Wazir");

      return {
        ...state,
        stepsToTake: state.stepsToTake - 1,
        isWazirMoving: state.stepsToTake - 1 === 0 ? false : true,
      };

    case "KILL":
      if (state.currentPlayerIndex === action.parentIndex)
        throw new Error("Nashe kreke aaya kiya Kisko Kat Raha hain");

      let allPlayersArr = state.players;
      allPlayersArr[action.parentIndex].wazirsIndex[state.wazirIndex] = -1;
      return {
        hasExtraLife: true,
      };

    case "END":
      return {
        ...state,
        gameStatus: "ENDED",
      };

    case "RESET":
      let allPlayersArray = state.player.forEach((player) =>
        player.wazirsIndex.map((index) => -1)
      );
      return {
        gameStatus: "LOBBY",
        gameStatusArray: ["LOBBY", "PLAYING", "ENDED"],
        players: allPlayersArray,
        currentPlayerIndex: -1,
        currentWazirIndex: -1,
        hasRolledTheDice: false,
        hasExtraLife: false,
        isWazirMoving: false,
        stepsToTake: 0,
      };

    default:
      throw new Error(`Unhandled type of ${action.type}`);
  }
};

function GlobalLudoProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalLudoContext.Provider value={{ state, dispatch }}>
      {props.children}
    </GlobalLudoContext.Provider>
  );
}

export default GlobalLudoProvider;
export const useGlobalLudoContext = () => useContext(GlobalLudoContext);
