'use client'

import React from "react";
import { useTranslations } from "next-intl";

export default function MetricCard({ id, Title, Value, isActive, onToggle, Description }) {
    const t = useTranslations('metrics');

    return (
        <div className="relative bg-white dark:bg-slate-700 rounded-lg shadow-lg p-3 w-full transition-all">
            <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center items-center gap-3">
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{Title}</p>
                    <div className="text-xl font-semibold text-blue-500">{Value}</div>
                </div>
                <svg 
                    className="w-6 h-6 text-blue-500 hover:cursor-pointer" 
                    onClick={() => onToggle(id)} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            {isActive && (
                <div className="absolute z-50 -right-10 mt-2 w-full bg-white dark:bg-slate-700 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out">
                    <div className="border-b border-gray-300 dark:border-slate-600 px-4 py-2">
                        <h3 className="text-sm font-semibold dark:text-gray-100">{Title}</h3>
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-xs text-gray-700 dark:text-gray-300">{Description}</p>
                    </div>
                </div>
            )}
            <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Total {Title} {t('desc')}</span>
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span className="text-sm text-green-500">+2%</span>
            </div>
        </div>
    )
}
