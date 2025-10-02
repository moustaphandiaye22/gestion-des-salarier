import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, message, duration };

    setToasts(prev => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title, message, duration) => {
    return addToast('success', title, message, duration);
  }, [addToast]);

  const showError = useCallback((title, message, duration) => {
    return addToast('error', title, message, duration);
  }, [addToast]);

  const showWarning = useCallback((title, message, duration) => {
    return addToast('warning', title, message, duration);
  }, [addToast]);

  const showInfo = useCallback((title, message, duration) => {
    return addToast('info', title, message, duration);
  }, [addToast]);

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={removeToast}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
