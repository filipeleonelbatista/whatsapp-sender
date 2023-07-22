import { LoaderContext } from '@renderer/contexts/LoaderContext'
import { useContext } from 'react'

export function useLoader(): unknown {
  const value = useContext(LoaderContext)
  return value
}
