import { createContext, useLayoutEffect, useState } from "react";

export const ResizeContext = createContext({});

export function ResizeContextProvider(props) {

  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);

    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <ResizeContext.Provider
      value={{
        size
      }}
    >
      {props.children}
    </ResizeContext.Provider>
  );
}
