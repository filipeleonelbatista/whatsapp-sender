import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("Toast não foi criado");
  }

  return context;
};

export default useToast;
