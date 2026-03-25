import React, { useState, useCallback, useRef, createContext, useContext } from 'react';
import './Toast.css';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(0);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = ++nextIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  return (
    <div className={`toast toast--${toast.type} toast--visible`}>
      {toast.message}
    </div>
  );
};
