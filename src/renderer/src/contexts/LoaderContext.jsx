import { Box, CircularProgress, Modal } from "@mui/material";
import { createContext, useState } from "react";

export const LoaderContext = createContext({});

export function LoaderContextProvider(props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      <Modal open={isLoading}>
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      </Modal>
      {props.children}
    </LoaderContext.Provider>
  );
}
