import { createContext, useEffect, useState } from 'react'

export interface WaSocketProps {
  list: string[]
  hasSocket: boolean
  handleCreateWs: (name: string) => Promise<void>
}

export interface WaSocketProviderProps {
  children?: React.ReactNode
}

export const WaSocketContext = createContext<WaSocketProps | null>(null)

export function WaSocketContextProvider(props: WaSocketProviderProps): JSX.Element {
  const [list, setList] = useState<string[]>([])
  const [hasSocket, setHasSocket] = useState<boolean>(false)

  const handleCreateWs = async (name: string): Promise<void> => {
    setList((prevState) => [...prevState, name])
    localStorage.setItem('@ws-list', JSON.stringify([...list, name]))
  }

  useEffect(() => {
    const list = localStorage.getItem('@ws-list')
    if (list !== null) {
      setList(JSON.parse(list))
      setHasSocket(true)
    } else {
      localStorage.setItem('@ws-list', JSON.stringify(list))
      setHasSocket(false)
    }
  }, [])

  return (
    <WaSocketContext.Provider
      value={{
        list,
        hasSocket,
        handleCreateWs
      }}
    >
      {props.children}
    </WaSocketContext.Provider>
  )
}
