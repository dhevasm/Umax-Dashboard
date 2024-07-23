import React from 'react'

const SettingLoading = () => {
    return (
      <div className='h-screen w-full bg-white dark:bg-slate-800'>
        {Array.from({ length: 1 }).map((_, index) => (
          <div key={index} className='p-6 mb-8 bg-white dark:bg-slate-800 rounded-lg animate-pulse'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 mb-8'>
              <div>
                <div className='block h-4 bg-gray-300 dark:bg-gray-500 rounded mb-2'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-400 rounded mb-4'></div>
                <div className='h-10 bg-gray-200 dark:bg-gray-400 rounded'></div>
              </div>
              <div>
                <div className='block h-4 bg-gray-300 dark:bg-gray-500 rounded mb-2'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-400 rounded mb-4'></div>
                <div className='h-10 bg-gray-200 dark:bg-gray-400 rounded'></div>
              </div>
              <div>
                <div className='block h-4 bg-gray-300 dark:bg-gray-500 rounded mb-2'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-400 rounded mb-4'></div>
                <div className='h-10 bg-gray-200 dark:bg-gray-400 rounded'></div>
              </div>
              <div>
                <div className='block h-4 bg-gray-300 dark:bg-gray-500 rounded mb-2'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-400 rounded mb-4'></div>
                <div className='h-10 bg-gray-200 dark:bg-gray-400 rounded'></div>
              </div>
              <div>
                <div className='block h-4 bg-gray-300 dark:bg-gray-500 rounded mb-2'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-400 rounded mb-4'></div>
                <div className='h-10 bg-gray-200 dark:bg-gray-400 rounded'></div>
              </div>
              <div>
                <div className='block h-4 bg-gray-300 dark:bg-gray-500 rounded mb-2'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-400 rounded mb-4'></div>
                <div className='h-10 bg-gray-200 dark:bg-gray-400 rounded'></div>
              </div>
            </div>
            <div className='w-full h-10 bg-gray-300 dark:bg-gray-500 rounded'></div>
          </div>
        ))}
      </div>
    );
  };
  
export default SettingLoading