import React, { useEffect, useRef } from 'react';

function Cursor({ cursorState }) {

    let pointer = useRef(null);


    const onMouseMove = (e) => {
        pointer.current.style.top = `calc(${e.pageY}px)`;
        pointer.current.style.left = `calc(${e.clientX}px)`;
    }

    const cursor = (pointer, cursorState) => {
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

            case ("hideCursor"): {
                style.display = "none";
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

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        }
    }, [])

    useEffect(() => {
        cursor(pointer, cursorState);
    }, [cursorState])


    return <div id="cursor" ref={pointer}></div>
}

export default Cursor;






/**
 * Determine the mobile operating system.
 * This function either returns 'iOS', 'Android' or 'unknown'
 *
 * @returns {String}
 */


// function getMobileOperatingSystem() {
//     var userAgent = navigator.userAgent || navigator.vendor || window.opera;

//     if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
//     {
//       return 'iOS';

//     }
//     else if( userAgent.match( /Android/i ) )
//     {

//       return 'Android';
//     }
//     else
//     {
//       return 'unknown';
//     }
//   }