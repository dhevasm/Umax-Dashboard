import React from 'react'

const PerformenceNavLoading = () => {
  return (
    <div className="flex gap-3 items-center md:flex-row flex-col">
        <div className="w-[50px] h-[50px] bg-gray-300 dark:bg-slate-700 rounded-full animate-pulse"></div>
        <div className="w-56 h-[30px] bg-gray-300 dark:bg-slate-700 rounded-md animate-pulse"></div>
    </div>
  )
}

export default PerformenceNavLoading