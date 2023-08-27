import { useContext } from "react";
import { CurrentThemeContext } from "../contexts/CurrentThemeContext";

const useCurrentTheme = () => {
  const context = useContext(CurrentThemeContext);

  if (!context) {
    throw new Error("CurrentTheme não foi criado");
  }

  return context;
};

export default useCurrentTheme;
