import { createTheme, useMediaQuery } from '@mui/material'
import { useEffect, useState, createContext } from 'react'

interface CurrentThemeProps {
  mode: string
  toggleMode: () => void
  currentTheme: unknown
}

interface CurrentThemeProviderProps {
  children?: React.ReactNode
}

export const CurrentTheme = createContext<CurrentThemeProps | null>(null)

export function CurrentThemeProvider(props: CurrentThemeProviderProps): JSX.Element {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  const toggleMode = (): void => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const currentTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#128C7E',
        dark: '#075E54',
        light: '#25D366',
        contrastText: '#FFF'
      }
    }
  })

  useEffect(() => {
    if (localStorage.getItem('@dark-theme') !== null) {
      const selectedTheme = localStorage.getItem('@dark-theme')
      setMode(selectedTheme || 'light')
    } else {
      localStorage.setItem('@dark-theme', prefersDarkMode ? 'dark' : 'light')
      setMode(prefersDarkMode ? 'dark' : 'light')
    }
  }, [])

  return (
    <CurrentTheme.Provider
      value={{
        currentTheme,
        mode,
        toggleMode
      }}
    >
      {props.children}
    </CurrentTheme.Provider>
  )
}
