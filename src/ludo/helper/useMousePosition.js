import { useState, useEffect, useRef } from "react";


function useMousePosition(contRef) {

  let containerRef = useRef();

  const [mousePosition, setMousePosition] = useState({ x: undefined, y: undefined });

  const updateMousePosition = ev => {
    let { pageY, pageX } = ev;
    let { top, left } = contRef.current.getBoundingClientRect();
    let x = pageX - left;
    let y = pageY - top;
    setMousePosition({ x, y })
  };

  useEffect(() => {

    if (contRef.current) {
      containerRef.current = contRef.current;
    }

    if (typeof contRef === "undefined") {
      containerRef.current = window;
    }

    containerRef.current.addEventListener("click", updateMousePosition);

    return () => containerRef.current.removeEventListener("click", updateMousePosition);
  }, [contRef]);

  return mousePosition;
};

export default useMousePosition;