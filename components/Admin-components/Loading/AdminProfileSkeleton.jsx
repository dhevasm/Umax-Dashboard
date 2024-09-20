import React from 'react';

const AdminProfileSkeleton = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="animate-pulse flex flex-col items-center mb-6">
        <div className="rounded-full bg-gray-300 h-24 w-24 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
      </div>

      {/* Personal Information */}
      <div className="mb-6">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>

      {/* International Information */}
      <div className="mb-6">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileSkeleton;
