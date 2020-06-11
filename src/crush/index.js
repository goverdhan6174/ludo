import React, {useEffect, useState } from "react";
import Header from "./Header";
import Home from "./Home";
import AboutHer from "./AboutHer";
import VideoSection from "./VideoSection";
import Footer from "./Footer";
import useMobileDetect from "./helper/useMobileDetect";
import Cursor from "./helper/cursor";

function Crush() {
  const { isMobile } = useMobileDetect();
  
  // @TODO:// find a better way to setCursorState to implement in Cursor Component
  let [cursorState, setCursorState] = useState("default");

  useEffect(() => {
   if(isMobile()){
     setCursorState("hideCursor");
   }
  }, [cursorState , isMobile])

  return (
    <>
     <Cursor cursorState={cursorState} />
      <Header setCursorState={setCursorState} />
      <Home />
      <AboutHer />
      <VideoSection />
      <Footer setCursorState={setCursorState} />
    </>
  );
}

export default Crush;
