import React from 'react'

const SuggestionLoding = () => {
  return (
    <div className={`w-full p-7 rounded-lg shadow-lg bg-gray-100 dark:bg-slate-700 mt-5 transition-all`}>
        <div className="flex gap-10">
            {/* Icon */}
            <div>
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse"></div>
            </div>
            {/* Title */}
            <div>
                <div className="w-40 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                <div className="w-44 md:60 h-3 bg-gray-300 dark:bg-gray-500 rounded my-2 animate-pulse"></div>
            </div>
        </div>
        <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-500 my-3"></div>
        <div className="flex gap-10">
            <div className="w-20 h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
            <div className="w-20 h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
        </div>
        <div className="flex justify-between md:gap-0 gap-2 items-center">
            <div className="mt-3 w-60 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
            <div className="text-sm self-end w-20 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
        </div>
    </div>
  )
}

export default SuggestionLoding