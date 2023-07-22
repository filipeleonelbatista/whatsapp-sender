import { WaSocketContext } from '@renderer/contexts/WaSocketContext'
import { useContext } from 'react'

export function useWaSocket(): unknown {
  const value = useContext(WaSocketContext)
  return value
}
