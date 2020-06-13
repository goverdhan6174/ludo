import React, { useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import imgArr from "./helper/images";
import HoverImage from './HoverImage';
import { animationVariants } from './helper/animationVariants';
import useMobileDetect from './helper/useMobileDetect';

function Home() {
    const { isMobile } = useMobileDetect();
    let [hoverImg, setHoverImg] = useState(false);
    let [imgIndex, setImgIndex] = useState(0);
    let [displayImgs, setdisplayImgs] = useState(true);
    let animation = useAnimation();
    let [homeRef, inView] = useInView({ triggerOnce: true, rootMargin: isMobile() ? "-40%" : "-30%" });

    useEffect(() => {
        if (inView) {
            animation.start("visible")
        }
    }, [inView, animation])

    const onHoverImgStarts = (imgUrl, index) => {
        setHoverImg(imgUrl);
        setdisplayImgs(false);
        setImgIndex(index);
    }

    const onHoverImgEnds = () => {
        setHoverImg(false);
        setImgIndex(0)
        setdisplayImgs(true);
    }


    return (

        <motion.div className="crushContainer" id="crushHomePage" ref={homeRef}>
            {/* //@TODO: remove hoverimg state, on Tap */}
            <AnimatePresence exitBeforeEnter>
                {hoverImg && <motion.img src={hoverImg ? hoverImg : imgArr[2]} alt="" style={{ position: "absolute", left: 0, height: "100%", width: "100%", objectFit: "cover", filter: "blur(3px)" }} initial="hidden" animate={hoverImg ? "visible" : "hidden"} variants={animationVariants(0, 0, 1.1, 0, 1)} exit="hidden" />}
            </AnimatePresence>

            <motion.p className="crushText" animate={animation} initial={"hidden"} variants={animationVariants(-30)}> CRUSH </motion.p>

            <div className="crushImgContainer">
                <AnimatePresence>
                    {!hoverImg &&
                        [
                            <motion.div className="crushBlendLine crushBlendLineLeft" key="text1" initial="visible" animate={!hoverImg ? "visible" : "hidden"} variants={animationVariants(30, 0, 1, 0, 1)} exit="hidden">
                                <motion.p animate={animation} initial={"hidden"} variants={animationVariants(30)} exit="hidden">  completely random text again and aggain
                                </motion.p>
                            </motion.div>,

                            <motion.div key="text2" className="crushBlendLine crushBlendLineRight" initial="visible" animate={!hoverImg ? "visible" : "hidden"} variants={animationVariants(-30, 0, 1, 0, 1)} exit="hidden">
                                <motion.p key="text2" animate={animation} initial={"hidden"} variants={animationVariants(-30)} exit="hidden"> some random text ageina aifjkadsfo
                                </motion.p>
                            </motion.div>
                        ]}
                </AnimatePresence>

                <div className="imgBox flex3 flexEnd">
                    <AnimatePresence exitBeforeEnter>
                        {(imgIndex === 1 || displayImgs) &&
                            <motion.div initial="visible" animate={(imgIndex === 1 || displayImgs) ? "visible" : "hidden"} variants={animationVariants(0, 0, 1, 0, 1)} exit="hidden" >
                                <HoverImage img={imgArr[17]} align="crushLeft" animate={animation} variants={animationVariants(0, -10, 1, 0.8)} exit="hidden" index={1} onHoverStarts={onHoverImgStarts} onHoverEnds={onHoverImgEnds} />
                            </motion.div>}
                    </AnimatePresence>
                </div>

                <div className="imgBox flex4 flexCenter">
                    <AnimatePresence exitBeforeEnter>
                        {(imgIndex === 2 || displayImgs) &&
                            <motion.div initial="visible" animate={(imgIndex === 2 || displayImgs) ? "visible" : "hidden"} variants={animationVariants(0, 0, 1, 0, 1)} exit="hidden" >
                                <HoverImage img={imgArr[13]} align="crushCenter" animate={animation} variants={animationVariants(0, 0, 0.97, 0.8)} exit="hidden" index={2} onHoverStarts={onHoverImgStarts} onHoverEnds={onHoverImgEnds} />
                            </motion.div>}
                    </AnimatePresence>
                </div>

                <div className="imgBox flex3 flexStart">
                    <AnimatePresence exitBeforeEnter>
                        {(imgIndex === 3 || displayImgs) &&
                            <motion.div initial="visible" animate={(imgIndex === 3 || displayImgs) ? "visible" : "hidden"} variants={animationVariants(0, 0, 1, 0, 1)} exit="hidden" >
                                <HoverImage img={imgArr[16]} align="crushRight" animate={animation} variants={animationVariants(0, 10, 1, 0.8)} index={3} onHoverStarts={onHoverImgStarts} onHoverEnds={onHoverImgEnds} />
                            </motion.div>}
                    </AnimatePresence>

                </div>

            </div>
        </motion.div>
    )
}

export default Home
