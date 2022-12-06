import {
  Box, CircularProgress,
  circularProgressClasses
} from '@mui/material';
import React from 'react';

interface LoaderProps {
  isLoading?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => (
  <Box sx={{
    position: 'absolute',
    width: "100vw",
    height: '100vh',
    zIndex: 10000,
    backgroundColor: "#00000064",
    overflow: "hidden",
    display: isLoading ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: "center"
  }}>
    <CircularProgress
      variant="indeterminate"
      disableShrink
      sx={{
        color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
        animationDuration: '550ms',
        [`& .${circularProgressClasses.circle}`]: {
          strokeLinecap: 'round',
        },
      }}
      size={50}
      thickness={6}
    />
  </Box>
);

Loader.defaultProps = {
  isLoading: false,
};

export default Loader;
