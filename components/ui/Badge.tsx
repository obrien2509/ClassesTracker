
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

const Badge: React.FC<BadgeProps> = ({ children, color }) => {
  const colorClasses = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    default: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

export default Badge;
