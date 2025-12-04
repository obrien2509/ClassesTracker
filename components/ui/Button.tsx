
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseClasses = 'font-semibold rounded-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-cyan-700 text-white hover:bg-cyan-800 shadow-md hover:shadow-lg',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2.5 px-5 text-sm',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
