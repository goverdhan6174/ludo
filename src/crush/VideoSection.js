import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { animationVariants } from './helper/animationVariants';
import useMobileDetect from './helper/useMobileDetect';
import ReactPlayer from 'react-player/youtube'

function VideoSection() {
    const { isMobile } = useMobileDetect();
    const animation = useAnimation();
    let [isVideoPlaying , setVideoPlaying] = useState(false);
    const [containerRef, inView] = useInView({ triggerOnce: true, rootMargin: isMobile() ? "-40%" : "-30%" });

    useEffect(() => {
        if (inView) {
            animation.start("visible");
            setVideoPlaying(true);
        }
    }, [inView, animation])

    return (
        <div className="crushVideoSection" ref={containerRef}>
            <motion.div className="crushVideoContianer" animate={animation} initial={"hidden"} variants={animationVariants(0, 0, 0.95)}>
                <ReactPlayer url='https://www.youtube.com/watch?v=h8MzocnmCyQ' playing={isVideoPlaying}/>
            </motion.div>
            <motion.blockquote id="crushFewLinesAboutVideo" animate={animation} initial={"hidden"} variants={animationVariants(0, 30, 1, 0.8, 3)}>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
            </motion.blockquote>
        </div >
    )
}

export default VideoSection
