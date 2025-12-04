
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 font-semibold text-slate-700 text-sm">
        {label}
      </label>
      <input
        id={id}
        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        {...props}
      />
    </div>
  );
};

export default Input;
