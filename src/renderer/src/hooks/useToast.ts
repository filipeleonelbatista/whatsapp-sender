import { useContext } from 'react';
import ToastContext, {
  ToastContextData,
} from '../contexts/Toast';

const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("Toast não foi criado");
  }

  return context;
};

export default useToast;
