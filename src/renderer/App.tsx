import { createTheme, ThemeProvider } from "@mui/material/styles";
import Routes from "./Routes";
import { CurrentThemeContextProvider } from "./src/contexts/CurrentThemeContext";
import { LoaderContextProvider } from "./src/contexts/LoaderContext";
import { ToastContextProvider } from "./src/contexts/ToastContext";
import useCurrentTheme from "./src/hooks/useCurrentTheme";
import "./src/styles/global.css";

function AppComponent() {
  const { currentTheme } = useCurrentTheme();

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: currentTheme,
          primary: {
            main: "#128C7E",
            dark: "#075E54",
            light: "#25D366",
            contrastText: "#FFF",
          },
        },
      })}
    >
      <LoaderContextProvider>
        <ToastContextProvider>
          <Routes />
        </ToastContextProvider>
      </LoaderContextProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <CurrentThemeContextProvider>
      <AppComponent />
    </CurrentThemeContextProvider>
  );
}
