import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { CurrentThemeProvider } from './contexts/CurrentThemeContext'
import { useCurrentTheme } from './hooks/useCurrentTheme'
import Routes from './Routes'

function AppComponent(): JSX.Element {
  const { currentTheme } = useCurrentTheme()

  return (
    <>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Routes />
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
