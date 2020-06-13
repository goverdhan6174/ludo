import React, { useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import imgArr from "./helper/images";
import HoverImage from './HoverImage';
import { animationVariants } from './helper/animationVariants';
import useMobileDetect from './helper/useMobileDetect';

function Home() {
    const { isMobile } = useMobileDetect();
    const bgcolor = ["#ee5253", "#10ac84", "#0abde3", "#ff9f43", "#f368e0", "#1dd1a1", "#48dbfb", "#ff6b6b", "#feca57", "#222f3e", "#341f97", "#341f97", "#01a3a4", "#5f27cd", "#c8d6e5", "#54a0ff"];

    let [bgColNumber, setBgColNumber] = useState(0);
    let [hoverImg, setHoverImg] = useState(false);
    let [imgIndex, setImgIndex] = useState(0);
    let [displayImgs, setdisplayImgs] = useState(true);
    let [randomImg, setRandomImg] = useState([0, 0, 0]);
    let animation = useAnimation();
    let [homeRef, inView] = useInView({ triggerOnce: true, rootMargin: isMobile() ? "-40%" : "-30%" });

    useEffect(() => {
        let randomImgSet = new Set();
        for (let i = 0; randomImgSet.size < 3; i++) {
            let randomNumber = Math.floor(Math.random() * imgArr.length);
            randomImgSet.add(randomNumber);
        }
        setRandomImg([...randomImgSet])
    }, [])

    useEffect(() => {
        if (inView) {
            animation.start("visible")
        }
    }, [inView, animation])

    const handleBackgroundColor = () => {
        let randomNumber = Math.floor(Math.random() * bgcolor.length);
        setBgColNumber(randomNumber);
    }

    const onHoverImgStarts = (imgUrl, index) => {
        setHoverImg(imgUrl);
        setdisplayImgs(false);
        setImgIndex(index);
    }

    const onHoverImgEnds = () => {
        handleBackgroundColor()
        setHoverImg(false);
        setImgIndex(0)
        setdisplayImgs(true);
    }


    return (

        <motion.div className="crushContainer" id="crushHomePage" ref={homeRef} style={{ backgroundColor: `${bgcolor[bgColNumber]}` }} onTap = {handleBackgroundColor} onClick = {handleBackgroundColor}>
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
                                <HoverImage img={imgArr[randomImg[0]]} align="crushLeft" animate={animation} variants={animationVariants(0, -10, 1, 0.8)} exit="hidden" index={1} onHoverStarts={onHoverImgStarts} onHoverEnds={onHoverImgEnds} />
                            </motion.div>}
                    </AnimatePresence>
                </div>

                <div className="imgBox flex4 flexCenter">
                    <AnimatePresence exitBeforeEnter>
                        {(imgIndex === 2 || displayImgs) &&
                            <motion.div initial="visible" animate={(imgIndex === 2 || displayImgs) ? "visible" : "hidden"} variants={animationVariants(0, 0, 1, 0, 1)} exit="hidden" >
                                <HoverImage img={imgArr[randomImg[1]]} align="crushCenter" animate={animation} variants={animationVariants(0, 0, 0.97, 0.8)} exit="hidden" index={2} onHoverStarts={onHoverImgStarts} onHoverEnds={onHoverImgEnds} />
                            </motion.div>}
                    </AnimatePresence>
                </div>

                <div className="imgBox flex3 flexStart">
                    <AnimatePresence exitBeforeEnter>
                        {(imgIndex === 3 || displayImgs) &&
                            <motion.div initial="visible" animate={(imgIndex === 3 || displayImgs) ? "visible" : "hidden"} variants={animationVariants(0, 0, 1, 0, 1)} exit="hidden" >
                                <HoverImage img={imgArr[randomImg[2]]} align="crushRight" animate={animation} variants={animationVariants(0, 10, 1, 0.8)} index={3} onHoverStarts={onHoverImgStarts} onHoverEnds={onHoverImgEnds} />
                            </motion.div>}
                    </AnimatePresence>

                </div>

            </div>
        </motion.div>
    )
}

export default Home
