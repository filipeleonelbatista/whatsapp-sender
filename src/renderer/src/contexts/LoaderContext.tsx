import { createContext, useState } from 'react'

import { Box, CircularProgress, circularProgressClasses } from '@mui/material'

interface LoaderProviderProps {
  children?: React.ReactNode
}

interface LoaderProps {
  isLoading: boolean
  setLoader: (status: boolean) => void
}

export const LoaderContext = createContext<LoaderProps | null>(null)

export function LoaderContextProvider(props: LoaderProviderProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const setLoader = (status: boolean): void => {
    setIsLoading(status)
  }
  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        setLoader
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            zIndex: 10000,
            backgroundColor: '#00000064',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress
            variant="indeterminate"
            disableShrink
            color="primary"
            sx={{
              animationDuration: '550ms',
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: 'round'
              }
            }}
            size={50}
            thickness={6}
          />
        </Box>
      )}
      {props.children}
    </LoaderContext.Provider>
  )
}
