import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ToastContainer from '../components/ToastContainer/ToastContainer';
import ToastContext, { ToastMessage } from '../contexts/Toast';


interface Props {
  children: React.ReactNode;
}

const ToastProvider: React.FC<Props> = ({ children }) => {
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback(
    ({ type, title, description, timeout }: Omit<ToastMessage, 'id'>) => {
      const id = uuidv4;

      const toast = {
        id,
        type,
        title,
        description,
        timeout
      };
      
      setMessages([...messages, toast]);

      timeout ? setTimeout(()=>{
        console.log("REMOVENDO TOAST");
        
        removeToast(id)
      },timeout)
      :
      setTimeout(()=>{
        console.log("REMOVENDO TOAST");
        
        removeToast(id)
      },2000)
    },
    [messages]
  );

  const removeToast = React.useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
