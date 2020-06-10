export const animationVariants = (x = 0, y = 0, scale = 1, opacity = 1, duration = 2, toX = 0, toY = 0, toScale = 1, toOpacity = 1) => {

    let transition = {
        duration: duration, ease: "easeInOut",
        staggerChildren: 0.2,
    };

 return {
            hidden: { opacity , x ,y ,scale , transition},
            visible: { opacity: toOpacity, x: toX, y: toY, scale: toScale, transition: transition },
        };
}