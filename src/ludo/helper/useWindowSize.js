import { useState, useEffect } from 'react';

// Hook
function useWindowSize() {
  const isClient = typeof window === 'object';

  const [windowSize, setWindowSize] = useState(getSize);

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;

  ///// to implement just called the hook useWindowSize and it will return the size
}

export default useWindowSize;