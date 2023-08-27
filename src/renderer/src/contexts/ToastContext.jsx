import { Alert, AlertTitle, Slide, Snackbar } from "@mui/material";
import { createContext, useState } from "react";

import Grow from "@mui/material/Grow";

export const ToastContext = createContext({});

export function ToastContextProvider(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState(null);
  const [autoHide, setAutoHide] = useState(6000);

  const addToast = ({ severity, message, title = null }) => {
    setTitle(title);
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
    const valor =
      (message.split(/\s+/).filter((word) => word !== "").length / 50) * 60000;
    setAutoHide(valor);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider
      value={{
        addToast,
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={autoHide}
        onClose={handleClose}
        TransitionComponent={(props) =>
          true ? <Grow {...props} /> : <Slide {...props} direction="left" />
        }
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ maxWidth: "400px", width: "100%" }}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </Snackbar>
      {props.children}
    </ToastContext.Provider>
  );
}
