import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { animationVariants } from './helper/animationVariants';
import useMobileDetect from './helper/useMobileDetect';

function HoverImage({ img, align, animate, variants, index, onHoverStarts, onHoverEnds }) {
    const { isMobile } = useMobileDetect();
    let [isHovered, setHovered] = useState(false);
    let [isTapped, setTapped] = useState(false);

    let textVisible = (src, index) => {
        if (!isTapped) {
            onHoverStarts(src, index);
            setHovered(true);
        } else {
            onHoverEnds();
            setHovered(false);
        }
        setTapped(!isTapped);
    }

    return (
        <motion.div className="crushFlexImg"
            animate={animate}
            initial={"hidden"}
            variants={variants}
            onTap={() => { textVisible(img.src, index) }}
            onHoverStart={() => { onHoverStarts(img.src, index); setHovered(true); }}
            onHoverEnd={() => { onHoverEnds(); setHovered(false); }}
        >
            {(isHovered && !isMobile()) && <div className="crushHoverText ">
                <motion.p className="crushBGBlend" initial="hidden" animate={isHovered ? "visible" : "hidden"} variants={animationVariants(0, 20, 1, 0, 1)} exit="hidden">{img.desc}
                   </motion.p>
            </div>}

            {isHovered && <div className={`crushHoverBgText ${align}`}>
                <motion.p className="crushBGBlend paddingHorizontal" initial="hidden" animate={isHovered ? "visible" : "hidden"} variants={animationVariants(-0, -30, 1, 0, 1)} exit="hidden">
                    {img.desc}
                </motion.p>
            </div>}

            <img className="crushImgs" src={img.src} alt="" />

        </motion.div>
    )
}

export default HoverImage
