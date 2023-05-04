import { Box, CircularProgress, Modal } from "@mui/material";
import React, { createContext, useState } from "react";

export const LoadingContext = createContext({});

export function LoadingContextProvider(props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      <Modal open={isLoading}>
        <Box sx={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={64} />
        </Box>
      </Modal>
      {props.children}
    </LoadingContext.Provider>
  );
}
