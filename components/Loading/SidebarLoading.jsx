import React from 'react'

const SidebarLoading = () => {
  return (
    <div className="text-sm text-black border-b-2 border-gray-300 hover:cursor-pointer hover:bg-cyan-300 p-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-[25px] bg-gray-300 rounded-full animate-pulse"></div>
          <div className="bg-gray-300 h-3 w-16 rounded-full animate-pulse"></div>
        </div>
        <div className="bg-gray-300 w-3 h-3 rounded-full animate-pulse"></div>
      </div>
      <div className="flex flex-col text-xs gap-1 mt-3">
        <div className="flex gap-2">
          <div className="bg-gray-300 w-20 h-3 rounded-full animate-pulse"></div>
          <div className="bg-gray-300 w-16 h-3 rounded-full animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="bg-gray-300 w-20 h-3 rounded-full animate-pulse"></div>
          <div className="bg-gray-300 w-16 h-3 rounded-full animate-pulse"></div>
        </div>
        <div className="bg-gray-300 w-24 h-3 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

export default SidebarLoading