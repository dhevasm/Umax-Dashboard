import React from 'react';
import { usePathname } from 'next/navigation';

const TableLoading = () => {
  const pathname = usePathname();

  return (
    <div className="w-full h-full bg-transparent rounded-lg p-3 overflow-x-auto">
      {!pathname.includes('/dashboard') && (
        <div className="w-32 h-11 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse mb-10"></div>
      )}
      <div className="bg-transparent rounded-lg p-3 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-slate-600">
            <tr>
              {["Column 1", "Column 2", "Column 3", "Column 4", "Column 5", "Column 6"].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  <span className="bg-gray-300 dark:bg-gray-500 text-transparent h-10 rounded-full animate-pulse w-20">lorem ipsum</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {Array.from({ length: 8 }).map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="ml-4">
                      <div className="w-20 h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                    </div>
                  </div>
                </td>
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="w-20 h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="w-12 h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableLoading;
