'use client'

import React from "react";
import { useTranslations } from "next-intl";

export default function MetricCard({ id, Title, Value, isActive, onToggle, Description }) {
    const t = useTranslations('metrics');

    return (
        <div className="relative bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-400 rounded-lg shadow-sm p-4 w-full transition-all">
            <div className="flex flex-row items-start justify-between mb-3">
                <div className="flex flex-col gap-2">
                    <p className="text-md font-medium text-gray-500 dark:text-gray-200">{Title}</p>
                    <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">{Value}</div>
                </div>
                <svg 
                    className="w-6 h-6 text-gray-500 dark:text-gray-200 hover:cursor-pointer mt-2 sm:mt-0" 
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
            <div className="w-full mt-4 flex flex-col sm:flex-row items-center gap-2">
                <span className="text-[10px] w-full text-gray-500 dark:text-gray-400">Total {Title} {t('desc')}</span>
                <div className="flex w-full sm:w-[20%] items-center justify-end">
                    <div className="bg-green-500 rounded-full gap-1 px-2 flex items-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <span className="text-xs text-white">+2.0%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
