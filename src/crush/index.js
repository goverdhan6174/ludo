import React, { useRef, useEffect, useState } from "react";
import Header from "./Header";
import Home from "./Home";
import AboutHer from "./AboutHer";
import VideoSection from "./VideoSection";
import Footer from "./Footer";
import { cursor, onMouseMove } from "./helper/cursor";


function Crush() {
  let [cursorState, setCursorState] = useState(false);
  let pointer = useRef(null);

  useEffect(() => {
    window.addEventListener("mousemove", e => onMouseMove(e , pointer));
    return () => {
      window.removeEventListener("mousemove", e => onMouseMove(e , pointer));
    }
  }, [])

  useEffect(() => {
    cursor(pointer,cursorState);
  }, [cursorState])



  return (
    <>
      <div id="cursor" ref={pointer}></div>
      <Header setCursorState={setCursorState} />
      <Home />
      <AboutHer />
      <VideoSection />
      <Footer setCursorState={setCursorState} />
    </>
  );
}

export default Crush;
