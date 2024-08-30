import React from 'react'

const AdminNavbarLoading = () => {
  return (
    <div className="text-black hover:cursor-pointer relative">
        <div className="flex items-center gap-1">
            <div className="w-10 h-10 hidden sm:hidden md:block lg:block xl:block rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse"></div>
            <div className="flex flex-col">
                <div className="text-sm font-medium bg-gray-300 dark:bg-gray-500 text-transparent rounded-md animate-pulse w-24 h-4"></div>
                <div className="text-xs text-gray-500 bg-gray-300 dark:bg-gray-500 text-transparent rounded-md animate-pulse h-3 w-24 mt-1"></div>
            </div>
        </div>
    </div>
  )
}

export default AdminNavbarLoading