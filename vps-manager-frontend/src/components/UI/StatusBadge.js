import React from 'react';
import { API_STATUS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case API_STATUS.CONNECTED:
        return {
          color: 'bg-green-500',
          text: 'Connectée'
        };
      case API_STATUS.ERROR:
        return {
          color: 'bg-red-500',
          text: 'Déconnectée'
        };
      default:
        return {
          color: 'bg-yellow-500',
          text: 'Vérification...'
        };
    }
  };

  const { color, text } = getStatusConfig();

  return (
    <div className="flex items-center text-sm">
      <div className={`w-2 h-2 rounded-full mr-2 ${color}`}></div>
      <span className="text-gray-600">API {text}</span>
    </div>
  );
};

export default StatusBadge;