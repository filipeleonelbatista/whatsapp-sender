import { useContext } from 'react'
import LoaderContext, { LoaderContextData } from '../contexts/Loader'

const useLoader = (): LoaderContextData => {
  const context = useContext(LoaderContext)

  if (!context) {
    throw new Error('Contexto do loader nao foi criado')
  }

  return context
}

export default useLoader
