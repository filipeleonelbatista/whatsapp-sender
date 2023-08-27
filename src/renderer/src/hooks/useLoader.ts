import { useContext } from "react";
import { LoaderContext } from "../contexts/LoaderContext";

const useLoader = () => {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("Contexto do loader nao foi criado");
  }

  return context;
};

export default useLoader;
