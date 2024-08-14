'use client';

import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CSSTransition } from "react-transition-group";
import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from "recharts";

export default function MetricCard({ id, Title, Value, isActive, onToggle, Description, data, totalSpent, averageSpent }) {
    const t = useTranslations('metrics');
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
            localStorage.setItem('color-theme', 'light');
        }
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-600 border border-gray-400 dark:border-gray-200 text-slate-800 dark:text-gray-200 py-1 px-7 rounded-lg shadow-lg" style={{ transform: 'translateY(-100%)', position: 'absolute', bottom: '1' }}>
                    <p className="text-sm">{`${payload[0].value}`}</p>
                </div>
            );
        }
    
        return null;
    };

    return (
        <div className="relative bg-gray-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-400 rounded-lg shadow-md p-4 w-full transition-all">
            <div className="flex flex-row items-start justify-between mb-3">
                <div className="flex flex-col gap-2">
                    <p className="text-md font-medium text-gray-500 dark:text-gray-200 mb-2">{Title}</p>
                    <div className="text-xl font-semibold text-slate-600 dark:text-slate-400">{Value}</div>
                </div>
                
                {/* Small bar chart */}
                <div className="w-24 h-16 absolute top-10 right-7">
                    {!data ? 
                        <>
                            <div className="flex">
                                <div className="w-4 h-4 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                                <div className="w-4 h-6 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                                <div className="w-4 h-9 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                                <div className="w-4 h-5 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                                <div className="w-4 h-3 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                                <div className="w-4 h-10 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                                <div className="w-4 h-2 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                            </div>
                        </>
                    : 
                        <>
                            <ResponsiveContainer width="100%" height="80%">
                                <BarChart data={data}>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#9CA3AF">
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill='#9CA3AF' />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </>
                    }
                </div>

                <svg 
                    className="w-6 h-6 text-gray-500 dark:text-gray-200 hover:cursor-pointer mt-2 sm:mt-0 transition-transform transform-gpu hover:rotate-45" 
                    onClick={() => onToggle(id)} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <CSSTransition
                in={isActive}
                timeout={300}
                classNames="dropdown"
                unmountOnExit
            >
                <div className="absolute z-50 top-11 -right-8 w-full bg-white dark:bg-slate-700 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out">
                    <div className="border-b border-gray-300 dark:border-slate-600 px-4 py-2">
                        <h3 className="text-sm font-semibold dark:text-gray-100">{Title}</h3>
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-xs text-gray-700 dark:text-gray-300">{Description}</p>
                    </div>
                </div>
            </CSSTransition>
            <div className="w-full mt-4 flex justify-start items-center gap-2">
                <div className="bg-green-500 rounded-full gap-1 px-2 flex items-center">
                    <span className="text-xs text-white">{averageSpent && totalSpent ? ((averageSpent / totalSpent) * 100).toFixed(1) : 0}%</span>
                </div>
                <span className="text-[10px] w-full text-gray-500 dark:text-gray-400">Total {Title} {t('desc')}</span>
            </div>
        </div>
    );
}
