import React from 'react';

const LoadingCircle = () => {
  return (
    <div className="flex justify-center items-center h-20">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-blue-800 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingCircle;
