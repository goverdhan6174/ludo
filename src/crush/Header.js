import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./crush.css";
import imgArr from "./helper/images";
import { animationVariants } from "./helper/animationVariants";

function Header({ setCursorState }) {

    let [isVisible, setVisibility] = useState(false)

    const firstLineContainer = useRef(null);

    const onMouseEnter = () => {
        setCursorState("increaseSize");
        setVisibility(true);
        firstLineContainer.current.style.opacity = "0";
    }

    const onMouseLeave = () => {
        setCursorState(false);
        firstLineContainer.current.style.opacity = "1";
        setVisibility(false);
    }

    return (
        <div className="crushFlexContainer">
            <div className="crushFlexContainer">
                <div className="crushHalfContainer">
                    <img src={imgArr[12].src} alt="" id="firstCrushBg" />
                </div>
                <div className="crushHalfContainer">
                    <img src={imgArr[19].src} alt="" id="secCrushBg" />
                </div>
            </div>
            <AnimatePresence exitBeforeEnter>
                <motion.div
                    animate={isVisible ? "hidden" : "visible"}
                    initial="visible"
                    variants={animationVariants(0, 0, 1, 0, 0.5)}
                    className="LinesForCrush"
                    id="firstCrushLinesContainer"
                    ref={firstLineContainer}
                    onMouseEnter={onMouseEnter}
                    onHoverStart={onMouseEnter}
                    onHoverEnd={onMouseLeave}
                    onMouseLeave={onMouseLeave}
                >
                    <p id="crushHeading">CRUSH</p>
                    <blockquote>
                        “A burning desire to be with someone who you find very attractive and
                        extremely special.”
                    </blockquote>
                    <blockquote>
                        Naah Pagle Crush means “Bhabhi hain tumhari.”
                    </blockquote>
                </motion.div>
            </AnimatePresence>
            <AnimatePresence exitBeforeEnter>
                <motion.div
                    animate={isVisible ? "visible" : "hidden"}
                    initial="hidden"
                    variants={animationVariants(0, 0, 1, 0, 0.5)}
                    className="LinesForCrush"
                    id="secCrushLinesContainer"
                >
                    <p id="crushHeading">CRUSH</p>
                    <blockquote>
                        ”It’s nice to have a crush on someone. It feels like you’re alive, you
                        know?”
        </blockquote>
                    <blockquote>– Scarlett Johansson</blockquote>
                    <blockquote>Yaad rakho “Bhabhi hain tumhari.”</blockquote>
                </motion.div>
            </AnimatePresence>
            <p className="crushBio">Travel . Lifestyle . Fashion</p>
        </div>
    );
}

export default Header;
