import React from 'react';

const LoadingCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    </div>
  );
};

export default LoadingCard;