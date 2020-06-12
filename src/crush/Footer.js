import React, { useEffect } from 'react'
import imgArr from "./helper/images";
import InstaLogo from '../assets/svg/instagram.svg';

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { animationVariants } from './helper/animationVariants';

// Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

function Footer({ setCursorState }) {

    const animation = useAnimation();
    const [containerRef, inView] = useInView({ triggerOnce: true, rootMargin:"-40%"  });

    useEffect(() => {
        if (inView) {
            animation.start("visible")
        }
    }, [inView, animation])

    const onMouseEnter = () => {
        setCursorState("onButton");
    }
    const onMouseLeave = () => {
        setCursorState(false);
    }

    return (
        <div className="crushContainer" ref={containerRef}>

            <div className="flex3 imgBox flexColumn" >
                <motion.img src={imgArr[2].src} className="flexCenter crushImgs" alt="" initial="hidden" animate={animation} variants={animationVariants(0, -10)} />
            </div>

            <motion.div className="flex3 imgBox crushFollowflexColumn" initial="hidden" animate={animation} variants={animationVariants(0, 10)} >
                <motion.img src={imgArr[0].src} className="flexCenter crushImgs" alt="" />
                <p className="crushFollowText">Hain saari pics and video ish site pe mile wali tumko?</p>
                <p className="crushFollowText">Go follow her on Instagram</p>
                <button id="crushFollowButton" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <p> <img src={InstaLogo} alt="React Logo" style={{ height: "17px", marginBottom: "-3px" }} /></p>
                    <p id="barkhaInstaId">@barkhasingh0308</p>
                </button>
            </motion.div>

            <div className="flex3 imgBox flexColumn" >
                <motion.img src={imgArr[4].src} className="flexCenter crushImgs" alt="" initial="hidden" animate={animation} variants={animationVariants(0, -10)} />
            </div>

            <motion.div className="crushFootBg crushFootRight" initial="hidden" animate={animation} variants={animationVariants(60, 0, 1, 0.6, 4)} ></motion.div>
            <motion.div className="crushFootBg crushFootLeft" initial="hidden" animate={animation} variants={animationVariants(-60, 0, 1, 0.6, 4)} ></motion.div>

        </div>
    )
}

export default Footer
