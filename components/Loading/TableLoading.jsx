import React from 'react'

const TableLoading = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="ml-4">
                  <div className="w-20 h-3 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="w-20 h-3 bg-gray-300 rounded animate-pulse"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="w-12 h-3 bg-gray-300 rounded animate-pulse"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="w-20 h-3 bg-gray-300 rounded animate-pulse"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="w-12 h-3 bg-gray-300 rounded animate-pulse"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default TableLoading