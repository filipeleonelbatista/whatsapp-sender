import { createContext, useState } from 'react'

import { Slide, Snackbar, Alert, AlertTitle } from '@mui/material'

interface SnackMessage {
  id?: string
  title?: string
  message?: string
  severity: 'warning' | 'error' | 'success' | 'info'
  duration?: number
}

interface SnackProps {
  handleSetMessage: (props: SnackMessage) => void
}

interface SnackProviderProps {
  children?: React.ReactNode
}

export const SnackContext = createContext<SnackProps | null>(null)

export function SnackContextProvider(props: SnackProviderProps): JSX.Element {
  const [message, setMessage] = useState<SnackMessage>()
  const [open, setOpen] = useState<boolean>(false)

  const handleSetMessage = (props: SnackMessage): void => {
    setMessage(props)
  }
  return (
    <SnackContext.Provider
      value={{
        handleSetMessage
      }}
    >
      <Snackbar
        id={message.id ?? 'snackbar-default-message'}
        sx={{ mt: 8 }}
        open={open}
        autoHideDuration={message?.duration ?? 6000}
        onClose={(): void => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={(props): void => <Slide {...props} direction="left" />}
      >
        <Alert
          onClose={(): void => setOpen(false)}
          severity={message.severity ?? 'info'}
          sx={{ maxWidth: '400px', width: '100%' }}
        >
          {
            !!message.title && (
              <AlertTitle>{message.title}</AlertTitle>
            )
          }
          {message.message ?? ''}
        </Alert>
      </Snackbar>
      {props.children}
    </SnackContext.Provider>
  )
}
