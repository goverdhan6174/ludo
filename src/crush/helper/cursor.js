export const onMouseMove = (e , pointer) => {
    pointer.current.style.top = `calc(${e.pageY}px)`;
    pointer.current.style.left = `calc(${e.clientX}px)`;
  }



export const cursor = (pointer, cursorState) => {
    let { style } = pointer.current;
    switch (cursorState) {
        case ("increaseSize"): {
            style.width = "20vmin";
            style.height = "20vmin";
            style.backgroundColor = "rgba(255, 255, 255,0.2)";
            style.border = "none";
            break;
        }
        case ("onButton"): {
            style.backgroundColor = "transparent";
            style.border = "solid 2px teal";
            break;
        }
        default: {
            style.width = "20px";
            style.height = "20px";
            style.backgroundColor = "teal";
            style.border = "solid 2px teal"
            break;
        }
    }
}
