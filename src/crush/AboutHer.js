import React, { useEffect} from 'react'
import imgArr from "./helper/images";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { animationVariants } from './helper/animationVariants';
import useMobileDetect from './helper/useMobileDetect';

function AboutHer() {
    const { isMobile } = useMobileDetect();
    const isMobileDevice = isMobile();

    const animation = useAnimation();
    const [containerRef, inView] = useInView({ triggerOnce: true, rootMargin: isMobileDevice ? "-40%" : "-30%" });

    useEffect(() => {
        if (inView) {
            animation.start("visible")
        }
    }, [inView, animation])

    return (
        <div ref={containerRef} >

            {/* {<img className="" src={imgArr[2].src} alt="" style={{ position: "absolute", left: 0, top: 0, minHeight: "100vh", width: "100vw",  background: "radial-gradient(transparent 0%, black 100%)" }} />} */}

            <div id="crushAboutHerContainer">

                <div className="crushHalfContainer">
                    <motion.img src={imgArr[5].src} alt="" id="crushAboutPic" animate={animation} initial={"hidden"} variants={animationVariants(
                      isMobileDevice ? 30: 0,   !isMobileDevice ? 30: 0
                    )} />
                </div>

                <motion.div className="crushHalfContainer" id="crushSecLine" animate={animation} initial={"hidden"} variants={animationVariants(
                    isMobileDevice ? 30: 0,   !isMobileDevice ? 30: 0
                )}>
                    <motion.p id="crushAboutHerHeading" initial={"hidden"} animate={animation}>why she is my crush</motion.p>
                    <motion.blockquote id="crushFewLinesAboutHer" initial={"hidden"} animate={animation}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).,
                    </motion.blockquote>
                </motion.div>

            </div>

        </div>
    )
}

export default AboutHer
