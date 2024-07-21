import React from 'react';

const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <span className="animate-pulse delay-0">.</span>
      <span className="animate-pulse delay-200">.</span>
      <span className="animate-pulse delay-400">.</span>
    </div>
  );
};

export default LoadingDots;
