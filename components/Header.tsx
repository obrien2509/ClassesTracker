
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-cyan-700 to-blue-500 text-white p-5 rounded-lg mb-8 shadow-md">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">📚 Class Tracker System</h1>
      <p className="opacity-90 text-sm">Manage courses, track attendance, and monitor class completion throughout the semester</p>
    </header>
  );
};

export default Header;
