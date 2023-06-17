import { Box, Button, keyframes } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useResize } from "../hooks/useResize";

export default function TestCTA() {

  const { size } = useResize();

  const [scrollPosition, setScrollPosition] = useState(0);

  const pulse = keyframes`  
    0% {
      -moz-box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4);
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4);
    }
    70% {
        -moz-box-shadow: 0 0 0 36px rgba(37, 211, 102, 0);
        box-shadow: 0 0 0 36px rgba(37, 211, 102, 0);
    }
    100% {
        -moz-box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
    }
  `

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY || document.documentElement.scrollTop;
      setScrollPosition(currentPosition);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => console.log("scroll", scrollPosition), [scrollPosition])

  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        display: 'flex',
        opacity: size[0] > 720 ? scrollPosition < 1900 ? 0 : 1 : scrollPosition < 3500 ? 0 : 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1500,
        bottom: 24,
        transition: '0.3s',
      }}
    >
      <Button
        onClick={() => { }}
        sx={{
          backgroundColor: (theme) => theme.palette.primary.light,
          width: size[0] > 720 ? '40%' : '80%',
          height: 64,
          boxShadow: 3,
          fontSize: 16,
          fontWeight: 'bold',
          animation: `${pulse} 1s infinite`,

          '&:hover': {
            backgroundColor: (theme) => theme.palette.mode !== 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
          },
          '& > svg': {
            fill: (theme) => theme.palette.mode === 'dark' ? "#181818" : "#FFF",
          }
        }}
        color="primary"
        variant="contained"
      >
        Cadastre-se agora e pague 10R$ no primeiro mês!!!
      </Button>
    </Box>

  );
}
