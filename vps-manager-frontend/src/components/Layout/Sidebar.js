import React from 'react';
import { Server, X, BarChart3, Monitor, Cpu, Wifi, Settings } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const Sidebar = ({ isOpen, onClose, activeView, onViewChange, apiStatus }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'system', label: 'Système', icon: Monitor },
    { id: 'hardware', label: 'Hardware', icon: Cpu },
    { id: 'network', label: 'Réseau', icon: Wifi },
    { id: 'services', label: 'Services', icon: Settings },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      
      {/* Header Sidebar */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <Server className="h-8 w-8 text-blue-500 mr-3" />
          <span className="text-xl font-semibold text-gray-800">VPS Manager</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                onClose();
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeView === item.id
                  ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                  : 'text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Statut API */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <StatusBadge status={apiStatus} />
      </div>
    </div>
  );
};

export default Sidebar;