
import React, { useState, useEffect } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;
  
  const baseClasses = 'p-4 mb-4 rounded-md border-l-4';
  const typeClasses = {
    success: 'bg-green-100 border-green-600 text-green-800',
    warning: 'bg-amber-100 border-amber-500 text-amber-800',
    error: 'bg-red-100 border-red-600 text-red-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {type === 'info' && <strong className='font-bold'>Instructions: </strong>}
      {message}
    </div>
  );
};

export default Alert;
