import * as React from 'react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  timeout?: number
}

export interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = React.createContext<ToastContextData>(
  {} as ToastContextData
);

export default ToastContext;
