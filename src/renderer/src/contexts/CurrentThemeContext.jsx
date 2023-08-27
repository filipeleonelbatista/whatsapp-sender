import { createContext, useCallback, useEffect, useState } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";

export const CurrentThemeContext = createContext({
  currentTheme: "light",
  toggleTheme: () => "light",
});

export function CurrentThemeContextProvider(props) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [currentTheme, setCurrentTheme] = useState("light");

  const loadThemePreferences = useCallback(() => {
    const value = localStorage.getItem("@theme");
    if (value !== null) {
      setCurrentTheme(value);
    } else {
      localStorage.setItem("@theme", prefersDarkMode ? "dark" : "light");
      setCurrentTheme(prefersDarkMode ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    loadThemePreferences();
  }, []);

  return (
    <CurrentThemeContext.Provider
      value={{
        currentTheme,
        toggleTheme: () => {
          setCurrentTheme(currentTheme === "light" ? "dark" : "light");
          localStorage.setItem(
            "@theme",
            currentTheme === "light" ? "dark" : "light",
          );
        },
      }}
    >
      {props.children}
    </CurrentThemeContext.Provider>
  );
}
