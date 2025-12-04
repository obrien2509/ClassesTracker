
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 font-semibold text-slate-700 text-sm">
        {label}
      </label>
      <select
        id={id}
        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
