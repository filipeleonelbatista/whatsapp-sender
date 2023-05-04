import React, { createContext } from "react";

export const ConversionContext = createContext({});

export function ConversionContextProvider(props) {
    
    return (
        <ConversionContext.Provider
            value={{}}
        >
            {props.children}
        </ConversionContext.Provider>
    );
}
