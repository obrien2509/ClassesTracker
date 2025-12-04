
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-cyan-700">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
