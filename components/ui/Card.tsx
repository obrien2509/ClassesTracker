
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold text-cyan-700 mb-5 pb-3 border-b-2 border-gray-100">
        {title}
      </h2>
      {children}
    </section>
  );
};

export default Card;
