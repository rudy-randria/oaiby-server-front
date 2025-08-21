import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        <button
          onClick={onMenuClick}
          className="text-gray-500 hover:text-gray-700"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">VPS Manager</h1>
        <div className="w-6"></div>
      </div>
    </header>
  );
};

export default Header;