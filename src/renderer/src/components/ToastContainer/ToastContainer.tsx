import * as React from 'react';
import { useTransition } from 'react-spring';
import Wrapper from './ToastContainer.styles';
import Toast from './Toast/Toast';
import { ToastMessage } from '../../contexts/Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    {
      keys: (message) => message.id,
      from: { right: '-120%', transform: 'rotateX(180deg)' },
      enter: { right: '0%', transform: 'rotateX(0deg)' },
      leave: { right: '-120%', transform: 'rotateX(180deg)' },
    }
  );

  return (
    <Wrapper>
      {messagesWithTransitions((style, item, t) => (
         <Toast key={t.key} style={style} message={item} />
      ))}
    </Wrapper>
    
  );
};

export default ToastContainer;
