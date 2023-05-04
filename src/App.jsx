import React, { useEffect } from "react";
import { ConversionContextProvider } from "./context/ConversionContext";
import { LoadingContextProvider } from "./context/LoadingContext";
import { ResizeContextProvider } from "./context/ResizeContext";
import Routes from "./routes";
import "./styles/global.css";
import { ToastContextProvider } from "./context/ToastContext";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

function App() {


  const mdTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#128C7E',
        dark: '#075E54',
        light: '#25D366',
        contrastText: "#FFF"
      }
    }
  });

  useEffect(() => {
    console.log("Ambiente", process.env.NODE_ENV)
    if (process.env.NODE_ENV !== 'development') {
      const handleContextmenu = e => {
        e.preventDefault()
      }
      document.addEventListener('contextmenu', handleContextmenu)

      document.onkeydown = function (e) {
        // disable F12 key
        if (e.keyCode == 123) {
          return false;
        }
        // disable I key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
          return false;
        }
        // disable J key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
          return false;
        }
        // disable U key
        if (e.ctrlKey && e.keyCode == 85) {
          return false;
        }
      }

      return function cleanup() {
        document.removeEventListener('contextmenu', handleContextmenu)
      }
    }
  }, [])

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <LoadingContextProvider>
        <ToastContextProvider>
          <ConversionContextProvider>
            <ResizeContextProvider>
              <Routes />
            </ResizeContextProvider>
          </ConversionContextProvider>
        </ToastContextProvider>
      </LoadingContextProvider>
    </ThemeProvider>
  );
}

export default App;
