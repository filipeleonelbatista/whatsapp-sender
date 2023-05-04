import { Alert, Snackbar } from "@mui/material";
import React, { createContext, useState } from "react";

export const ToastContext = createContext({});

export function ToastContextProvider(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');

  const addToast = ({ severity, message }) => {
    setMessage(message)
    setSeverity(severity)
    setOpen(true)
  }

  const handleClose = () => {
    setMessage('')
    setSeverity('success')
    setOpen(false)
  }

  return (
    <ToastContext.Provider
      value={{
        addToast
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      {props.children}
    </ToastContext.Provider>
  );
}
