import React, { useEffect } from "react";
import Routes from "./routes";
import "./styles/global.css";

function App() {

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
    <Routes />
  );
}

export default App;
