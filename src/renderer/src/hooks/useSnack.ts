import { SnackContext } from '@renderer/contexts/SnackContext'
import { useContext } from 'react'

export function useSnack(): unknown {
  const value = useContext(SnackContext)
  return value
}
