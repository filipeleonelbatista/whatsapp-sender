import { CurrentTheme } from '@renderer/contexts/CurrentThemeContext'
import { useContext } from 'react'

export function useCurrentTheme(): unknown {
  const value = useContext(CurrentTheme)
  return value
}
