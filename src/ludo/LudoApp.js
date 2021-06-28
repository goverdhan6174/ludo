import React from "react";

import useCanvas from "./helper/useCanvas";
import LudoController from "./ludoController";
import LudoBoard from "./ludoBoard";
import svgToImg64 from "./helper/svgToImg64";

import useWindowSize from "./helper/useWindowSize";

function LudoApp({ btnHandler, ludoController, users, roomId, socket }) {
  const canvasRef = React.useRef();
  const context2DRef = React.useRef();

  const gameWazir = React.useRef();
  // const players = React.useRef();
  const players = ludoController;
  const currentPlayerIndex = React.useRef();

  const wazirImgArray = React.useRef();
  const wazirYellowSVGRef = React.useRef();
  const wazirBlueSVGRef = React.useRef();
  const wazirRedSVGRef = React.useRef();
  const wazirGreenSVGRef = React.useRef();

  let windowSize = useWindowSize();
  let context2D = useCanvas(canvasRef);

  let [canvasSize, setCanvasSize] = React.useState(680);
  let [canvasUnit, setCanvasUnit] = React.useState(40);

  React.useEffect(() => {
    let requestAnimFrameId = undefined;

    if (context2D) {
      context2DRef.current = context2D;
      context2DRef.current.save();
      context2DRef.current.clearRect(0, 0, canvasSize, canvasSize);
      players.current = new LudoController(
        roomId,
        socket.id,
        canvasUnit,
        context2DRef.current
      );
      currentPlayerIndex.current = players.current.currentPlayerIndex;

      let lastTime = 0;

      function FrameReqCallback(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        players.current.draw();
        players.current.update(deltaTime);
        if (deltaTime < 60 * 1000) {
          window.requestAnimationFrame(FrameReqCallback);
        }
      }

      requestAnimFrameId = window.requestAnimationFrame(FrameReqCallback);
    }

    return () => {
      if (requestAnimFrameId !== undefined)
        window.cancelAnimationFrame(requestAnimFrameId);
    };
  }, [context2D, socket, canvasSize, canvasUnit, players, roomId]);

  React.useEffect(() => {
    setCanvasSize(Math.floor(canvasRef.current.clientWidth));
    setCanvasUnit(canvasRef.current.clientWidth / 17);

    if (players.current && context2DRef.current) {
      players.current.changeBoardSize(canvasUnit, context2DRef.current);
      LudoController.setStaticControllerToWazir(
        players.current,
        context2DRef.current
      );
    }
  }, [windowSize, context2D, canvasUnit, players]);

  React.useEffect(() => {
    //SvgImg : [ yellowSVG =>>blueSVG =>>redSVG =>>greenSVG ]
    wazirImgArray.current = [
      svgToImg64(wazirYellowSVGRef.current),
      svgToImg64(wazirBlueSVGRef.current),
      svgToImg64(wazirRedSVGRef.current),
      svgToImg64(wazirGreenSVGRef.current),
    ];
  }, [socket.id]);

  React.useEffect(() => {
    if (users && players.current && users.length > 0) {
      users.forEach((user, index) => {
        if (user) {
          players.current.addPlayer(index, wazirImgArray.current[index]);
        }
      });
      LudoController.setStaticControllerToWazir(
        players.current,
        context2DRef.current
      );
    }
  }, [users, socket.id, players]);

  return (
    <>
      <LudoBoard
        canvasRef={canvasRef}
        canvasUnit={canvasUnit}
        gameWazir={gameWazir}
        players={players}
        currentPlayerIndex={currentPlayerIndex}
        btnHandler={btnHandler}
        socket={socket}
      />

      {/* <svg ref={wazirSVGRef} width="1.5em" height="1.5em" style={{ display: "none"}} viewBox="0 0 16 16" fill="#FF3366">
        <path fillRule="evenodd" d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      </svg> */}
      {/* <a href="https://iconscout.com/icons/location" target="_blank">Location Icon</a> by <a href="https://iconscout.com/contributors/jemismali">Jemis Mali</a> on <a href="https://iconscout.com">Iconscout</a> */}

      <svg
        ref={wazirYellowSVGRef}
        style={{ display: "none" }}
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 64 64"
      >
        <g transform="translate(0 -988.362)">
          <path
            fill="whitesmoke"
            d="m 46.500013,1014.19 c 0,6.6054 -9.536352,21.1142 -13.401562,26.7235 -0.871672,1.265 -2.325278,1.2649 -3.196988,-2e-4 -3.865285,-5.6094 -13.401449,-20.118 -13.401449,-26.7233 0,-8.2843 6.715729,-15.0001 15,-15.0001 8.28427,0 14.999999,6.7158 14.999999,15.0001 z"
          />
          <path
            fill="#FFE013"
            d="m 39.499946,1014.19 a 7.999999,7.999999 0 0 1 -7.999999,8 7.999999,7.999999 0 0 1 -7.999999,-8 7.999999,7.999999 0 0 1 7.999999,-8 7.999999,7.999999 0 0 1 7.999999,8 z"
          />
          <path
            d="m 31.5,1005.6895 c -4.688498,0 -8.500001,3.8115 -8.5,8.5 -1e-6,4.6885 3.811502,8.5 8.5,8.5 4.688498,0 8.500001,-3.8115 8.5,-8.5 10e-7,-4.6885 -3.811502,-8.5 -8.5,-8.5 z m 0,1 c 4.148058,0 7.500001,3.3519 7.5,7.5 10e-7,4.148 -3.351942,7.5 -7.5,7.5 -4.148058,0 -7.500001,-3.352 -7.5,-7.5 -1e-6,-4.1481 3.351942,-7.5 7.5,-7.5 z"
            color="#000"
          />
          <path
            d="m 31.5,998.68945 c -8.554494,0 -15.5,6.94545 -15.5,15.50005 0,3.5432 2.433988,8.8006 5.314453,13.9785 2.880466,5.1778 6.237866,10.2169 8.175781,13.0293 0.509528,0.7394 1.247096,1.164 2.009766,1.164 0.76267,10e-5 1.500244,-0.4246 2.009766,-1.164 1.937877,-2.8123 5.295278,-7.8515 8.175781,-13.0293 C 44.56605,1022.9901 47,1017.7328 47,1014.1895 c 0,-8.5546 -6.945507,-15.50005 -15.5,-15.50005 z m 0,1 c 8.014047,0 14.5,6.48595 14.5,14.50005 0,3.062 -2.333525,8.3619 -5.1875,13.4921 -2.853975,5.1302 -6.197668,10.1503 -8.125,12.9473 -0.362151,0.5256 -0.787522,0.7325 -1.1875,0.7324 -0.399978,0 -0.825317,-0.2068 -1.1875,-0.7324 -1.927369,-2.797 -5.271062,-7.8171 -8.125,-12.9473 C 19.333562,1022.5515 17,1017.2515 17,1014.1895 c 0,-8.0141 6.485952,-14.50005 14.5,-14.50005 z"
            color="#000"
          />
        </g>
      </svg>
      <svg
        ref={wazirBlueSVGRef}
        style={{ display: "none" }}
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 64 64"
      >
        <g transform="translate(0 -988.362)">
          <path
            fill="whitesmoke"
            d="m 46.500013,1014.19 c 0,6.6054 -9.536352,21.1142 -13.401562,26.7235 -0.871672,1.265 -2.325278,1.2649 -3.196988,-2e-4 -3.865285,-5.6094 -13.401449,-20.118 -13.401449,-26.7233 0,-8.2843 6.715729,-15.0001 15,-15.0001 8.28427,0 14.999999,6.7158 14.999999,15.0001 z"
          />
          <path
            fill="#22409A"
            d="m 39.499946,1014.19 a 7.999999,7.999999 0 0 1 -7.999999,8 7.999999,7.999999 0 0 1 -7.999999,-8 7.999999,7.999999 0 0 1 7.999999,-8 7.999999,7.999999 0 0 1 7.999999,8 z"
          />
          <path
            d="m 31.5,1005.6895 c -4.688498,0 -8.500001,3.8115 -8.5,8.5 -1e-6,4.6885 3.811502,8.5 8.5,8.5 4.688498,0 8.500001,-3.8115 8.5,-8.5 10e-7,-4.6885 -3.811502,-8.5 -8.5,-8.5 z m 0,1 c 4.148058,0 7.500001,3.3519 7.5,7.5 10e-7,4.148 -3.351942,7.5 -7.5,7.5 -4.148058,0 -7.500001,-3.352 -7.5,-7.5 -1e-6,-4.1481 3.351942,-7.5 7.5,-7.5 z"
            color="#000"
          />
          <path
            d="m 31.5,998.68945 c -8.554494,0 -15.5,6.94545 -15.5,15.50005 0,3.5432 2.433988,8.8006 5.314453,13.9785 2.880466,5.1778 6.237866,10.2169 8.175781,13.0293 0.509528,0.7394 1.247096,1.164 2.009766,1.164 0.76267,10e-5 1.500244,-0.4246 2.009766,-1.164 1.937877,-2.8123 5.295278,-7.8515 8.175781,-13.0293 C 44.56605,1022.9901 47,1017.7328 47,1014.1895 c 0,-8.5546 -6.945507,-15.50005 -15.5,-15.50005 z m 0,1 c 8.014047,0 14.5,6.48595 14.5,14.50005 0,3.062 -2.333525,8.3619 -5.1875,13.4921 -2.853975,5.1302 -6.197668,10.1503 -8.125,12.9473 -0.362151,0.5256 -0.787522,0.7325 -1.1875,0.7324 -0.399978,0 -0.825317,-0.2068 -1.1875,-0.7324 -1.927369,-2.797 -5.271062,-7.8171 -8.125,-12.9473 C 19.333562,1022.5515 17,1017.2515 17,1014.1895 c 0,-8.0141 6.485952,-14.50005 14.5,-14.50005 z"
            color="#000"
          />
        </g>
      </svg>
      <svg
        ref={wazirRedSVGRef}
        style={{ display: "none" }}
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 64 64"
      >
        <g transform="translate(0 -988.362)">
          <path
            fill="whitesmoke"
            d="m 46.500013,1014.19 c 0,6.6054 -9.536352,21.1142 -13.401562,26.7235 -0.871672,1.265 -2.325278,1.2649 -3.196988,-2e-4 -3.865285,-5.6094 -13.401449,-20.118 -13.401449,-26.7233 0,-8.2843 6.715729,-15.0001 15,-15.0001 8.28427,0 14.999999,6.7158 14.999999,15.0001 z"
          />
          <path
            fill="#EB1C24"
            d="m 39.499946,1014.19 a 7.999999,7.999999 0 0 1 -7.999999,8 7.999999,7.999999 0 0 1 -7.999999,-8 7.999999,7.999999 0 0 1 7.999999,-8 7.999999,7.999999 0 0 1 7.999999,8 z"
          />
          <path
            d="m 31.5,1005.6895 c -4.688498,0 -8.500001,3.8115 -8.5,8.5 -1e-6,4.6885 3.811502,8.5 8.5,8.5 4.688498,0 8.500001,-3.8115 8.5,-8.5 10e-7,-4.6885 -3.811502,-8.5 -8.5,-8.5 z m 0,1 c 4.148058,0 7.500001,3.3519 7.5,7.5 10e-7,4.148 -3.351942,7.5 -7.5,7.5 -4.148058,0 -7.500001,-3.352 -7.5,-7.5 -1e-6,-4.1481 3.351942,-7.5 7.5,-7.5 z"
            color="#000"
          />
          <path
            d="m 31.5,998.68945 c -8.554494,0 -15.5,6.94545 -15.5,15.50005 0,3.5432 2.433988,8.8006 5.314453,13.9785 2.880466,5.1778 6.237866,10.2169 8.175781,13.0293 0.509528,0.7394 1.247096,1.164 2.009766,1.164 0.76267,10e-5 1.500244,-0.4246 2.009766,-1.164 1.937877,-2.8123 5.295278,-7.8515 8.175781,-13.0293 C 44.56605,1022.9901 47,1017.7328 47,1014.1895 c 0,-8.5546 -6.945507,-15.50005 -15.5,-15.50005 z m 0,1 c 8.014047,0 14.5,6.48595 14.5,14.50005 0,3.062 -2.333525,8.3619 -5.1875,13.4921 -2.853975,5.1302 -6.197668,10.1503 -8.125,12.9473 -0.362151,0.5256 -0.787522,0.7325 -1.1875,0.7324 -0.399978,0 -0.825317,-0.2068 -1.1875,-0.7324 -1.927369,-2.797 -5.271062,-7.8171 -8.125,-12.9473 C 19.333562,1022.5515 17,1017.2515 17,1014.1895 c 0,-8.0141 6.485952,-14.50005 14.5,-14.50005 z"
            color="#000"
          />
        </g>
      </svg>
      <svg
        ref={wazirGreenSVGRef}
        style={{ display: "none" }}
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 64 64"
      >
        <g transform="translate(0 -988.362)">
          <path
            fill="whitesmoke"
            d="m 46.500013,1014.19 c 0,6.6054 -9.536352,21.1142 -13.401562,26.7235 -0.871672,1.265 -2.325278,1.2649 -3.196988,-2e-4 -3.865285,-5.6094 -13.401449,-20.118 -13.401449,-26.7233 0,-8.2843 6.715729,-15.0001 15,-15.0001 8.28427,0 14.999999,6.7158 14.999999,15.0001 z"
          />
          <path
            // fill="#54c972"
            fill="#02A04B"
            d="m 39.499946,1014.19 a 7.999999,7.999999 0 0 1 -7.999999,8 7.999999,7.999999 0 0 1 -7.999999,-8 7.999999,7.999999 0 0 1 7.999999,-8 7.999999,7.999999 0 0 1 7.999999,8 z"
          />
          <path
            d="m 31.5,1005.6895 c -4.688498,0 -8.500001,3.8115 -8.5,8.5 -1e-6,4.6885 3.811502,8.5 8.5,8.5 4.688498,0 8.500001,-3.8115 8.5,-8.5 10e-7,-4.6885 -3.811502,-8.5 -8.5,-8.5 z m 0,1 c 4.148058,0 7.500001,3.3519 7.5,7.5 10e-7,4.148 -3.351942,7.5 -7.5,7.5 -4.148058,0 -7.500001,-3.352 -7.5,-7.5 -1e-6,-4.1481 3.351942,-7.5 7.5,-7.5 z"
            color="#000"
          />
          <path
            d="m 31.5,998.68945 c -8.554494,0 -15.5,6.94545 -15.5,15.50005 0,3.5432 2.433988,8.8006 5.314453,13.9785 2.880466,5.1778 6.237866,10.2169 8.175781,13.0293 0.509528,0.7394 1.247096,1.164 2.009766,1.164 0.76267,10e-5 1.500244,-0.4246 2.009766,-1.164 1.937877,-2.8123 5.295278,-7.8515 8.175781,-13.0293 C 44.56605,1022.9901 47,1017.7328 47,1014.1895 c 0,-8.5546 -6.945507,-15.50005 -15.5,-15.50005 z m 0,1 c 8.014047,0 14.5,6.48595 14.5,14.50005 0,3.062 -2.333525,8.3619 -5.1875,13.4921 -2.853975,5.1302 -6.197668,10.1503 -8.125,12.9473 -0.362151,0.5256 -0.787522,0.7325 -1.1875,0.7324 -0.399978,0 -0.825317,-0.2068 -1.1875,-0.7324 -1.927369,-2.797 -5.271062,-7.8171 -8.125,-12.9473 C 19.333562,1022.5515 17,1017.2515 17,1014.1895 c 0,-8.0141 6.485952,-14.50005 14.5,-14.50005 z"
            color="#000"
          />
        </g>
      </svg>
    </>
  );
}

export default LudoApp;
