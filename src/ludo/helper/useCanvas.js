import React from "react";
import useWindowSize from "./useWindowSize";

function useCanvas(canvasRef) {
  //it returns canvas's context with perfect aspectratio or with decivePixelRatio
  const [context, setContext] = React.useState(null);

  let windowSize = useWindowSize();

  React.useEffect(() => {
    if (canvasRef.current) {
      //get DPI
      // let dpi = window.devicePixelRatio;
      let dpi = 1;
      // Scale the inner drawling surface to the same
      // get CSS height
      //the + prefix casts it to an integer
      //the slice method gets rid of "px"
      let style_height = +getComputedStyle(canvasRef.current)
        .getPropertyValue("height")
        .slice(0, -2);
      //get CSS width
      let style_width = +getComputedStyle(canvasRef.current)
        .getPropertyValue("width")
        .slice(0, -2);
      //scale the canvas
      canvasRef.current.setAttribute("height", style_height * dpi);
      canvasRef.current.setAttribute("width", style_width * dpi);
      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        setContext(renderCtx);
      }
    }
  }, [canvasRef, windowSize]);

  return context;
}

export default useCanvas;
