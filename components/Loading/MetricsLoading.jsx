import React from 'react';

const MetricsLoading = () => {
  return (
    <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg p-3 w-full transition-all">
        <div className="flex items-center justify-between">
            <div className="flex flex-col justify-center items-center gap-3">
                <p className="text-lg bg-gray-300 dark:bg-gray-500 text-transparent rounded-md font-medium skeleton w-24 h-4 animate-pulse">lorem</p>
                <div className="text-xl font-semibold bg-gray-300 dark:bg-gray-500 text-transparent rounded-md skeleton w-16 h-6 animate-pulse">lorem ipsum</div>
            </div>
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] text-transparent bg-gray-300 dark:bg-gray-500 rounded-md skeleton animate-pulse">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</span>
            <svg className="w-3 h-3 text-green-500 skeleton animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span className="text-sm text-transparent bg-gray-300 dark:bg-gray-500 rounded-md skeleton animate-pulse w-6 h-4"></span>
        </div>
    </div>
  );
};

export default MetricsLoading;
