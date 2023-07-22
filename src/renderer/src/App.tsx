import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { CurrentThemeProvider } from './contexts/CurrentThemeContext'
import { LoaderContextProvider } from './contexts/LoaderContext'
import { SnackContextProvider } from './contexts/SnackContext'
import { useCurrentTheme } from './hooks/useCurrentTheme'
import Routes from './Routes'

function AppComponent(): JSX.Element {
  const { currentTheme } = useCurrentTheme()

  return (
    <>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <SnackContextProvider>
          <LoaderContextProvider>
            <Routes />
          </LoaderContextProvider>
        </SnackContextProvider>
      </ThemeProvider>
    </>
  )
}

function App(): JSX.Element {
  return (
    <CurrentThemeProvider>
      <AppComponent />
    </CurrentThemeProvider>
  )
}

export default App
