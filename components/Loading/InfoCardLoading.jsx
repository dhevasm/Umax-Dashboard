import React from 'react'

const InfoCardLoading = () => {
  return (
    <div className={`bg-gray-100 dark:bg-slate-700 p-4 pt-5 pb-5 rounded-lg w-full transition-all shadow-lg`}>
        <p className={`text-sm text-gray-300 dark:text-gray-500 text-nowrap`}>
            <span className="w-20 h-2 bg-gray-300 dark:bg-gray-500 rounded-lg animate-pulse-slow animate-pulse">span</span>
        </p>
        <div className="flex justify-between items-center animate-pulse-slow">
            <h1 className={`text-2xl text-gray-300 dark:text-gray-500 text-nowrap`}>
                <span className="w-24 h-2 bg-gray-300 dark:bg-gray-500 rounded-lg animate-pulse">Lorem</span>
            </h1>
            <button className="relative bottom-7 animate-pulse-slow">
                <i className="fas fa-info-circle text-xs text-gray-300 dark:text-gray-500">
                    <svg className="w-6 h-6 text-gray-300 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </i>
            </button>
        </div> 
    </div>

  )
}

export default InfoCardLoading