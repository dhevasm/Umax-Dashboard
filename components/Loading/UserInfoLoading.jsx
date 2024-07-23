import React from 'react'

const UserInfoLoading = () => {
  return (
    <div className="text-black me-5 hover:cursor-pointer relative">
        <div className="flex items-center">
            <div className="w-8 h-8 rounded-full mr-2 bg-gray-300 dark:bg-gray-500 animate-pulse"></div>
            <div className="flex flex-col">
                <div className="text-sm font-medium bg-gray-300 dark:bg-gray-500 text-transparent rounded-md animate-pulse w-24 h-4"></div>
                <div className="text-xs text-gray-500 bg-gray-300 dark:bg-gray-500 text-transparent rounded-md animate-pulse h-3 w-24 mt-1"></div>
            </div>
        </div>
        <div className="profile-dropdown hidden absolute z-10 mt-3 -right-7 p-3 bg-white border border-gray-100 shadow-md w-48 transition-all duration-3000">
            <div className="flex flex-col mb-2">
                <div className="text-sm font-medium bg-gray-300 dark:bg-gray-500 text-transparent rounded-md animate-pulse w-36 h-4"></div>
            </div>
            <div className="border-t border-gray-300"></div>
            <div className="text-sm bg-gray-300 dark:bg-gray-500 text-transparent rounded-md animate-pulse h-3 w-24 mt-2 mb-2"></div>
            <div className="text-sm bg-gray-300 dark:bg-gray-500 text-transparent rounded-md animate-pulse h-3 w-24 mt-2 mb-2"></div>
            <div className="text-sm bg-gray-300 dark:bg-gray-500 text-transparent rounded-md animate-pulse h-3 w-24 mt-2 mb-2"></div>
            <div className="border-t border-gray-300"></div>
            <div className="text-sm bg-gray-300 dark:bg-gray-500 text-transparent rounded-md animate-pulse h-3 w-32 mt-2"></div>
        </div>
    </div>
  )
}

export default UserInfoLoading