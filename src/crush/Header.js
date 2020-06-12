import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./crush.css";
import imgArr from "./helper/images";
import { animationVariants } from "./helper/animationVariants";
import useMobileDetect from "./helper/useMobileDetect";

function Header({ setCursorState }) {
    const { isMobile } = useMobileDetect();
    const isMobileDevice = isMobile();
    let [isVisible, setVisibility] = useState(false);
    let [animObj, setAnimObj] = useState({});
    let [mixBlendMode, setMixBlendMode] = useState("soft-light")

    useEffect(() => {
        if (isMobileDevice) {
            setMixBlendMode("normal")
            setAnimObj({
                x: 0,  y: "-100%", xTo: 0,  yTo: "100%"
            });
        }else{
            setAnimObj({
                x: "100%", y: 0, xTo: "-100%", yTo: 0
            })
        }
    }, [isMobileDevice])

    const onMouseEnter = () => {
        setCursorState("increaseSize");
        setVisibility(true);
    }

    const onMouseLeave = () => {
        setCursorState(false);
        setVisibility(false);
    }

    return (
        <div className="crushFlexContainer">
            <div className="crushFlexContainer">
                <motion.div
                    className="crushHalfContainer"
                    onMouseEnter={onMouseEnter}
                    onHoverStart={onMouseEnter}
                    onHoverEnd={onMouseLeave}
                    onMouseLeave={onMouseLeave}
                >
                    <img src={imgArr[15].src} alt="" id="firstCrushBg" style={{ mixBlendMode: mixBlendMode }} />
                </motion.div>
                <div className="crushHalfContainer">
                    <img src={imgArr[19].src} alt="" id="secCrushBg" />
                </div>
            </div>
            <AnimatePresence exitBeforeEnter>
                <motion.div
                    animate={isVisible ? "hidden" : "visible"}
                    initial="visible"
                    variants={animationVariants(animObj.x, animObj.y, 1, 0, 1)}
                    className="LinesForCrush"
                    id="firstCrushLinesContainer"
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
                    variants={animationVariants(animObj.xTo, animObj.yTo, 1, 0, 1)}
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
