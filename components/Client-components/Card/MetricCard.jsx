'use client'

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CSSTransition } from "react-transition-group";
import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from "recharts";

export default function MetricCard({ id, Title, Value, isActive, onToggle, Description, data, totalSpent, averageSpent }) {
    const t = useTranslations('metrics');
    const [isDark, setIsDark] = useState(false);

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

    // Formatter for numbers in Tooltip
    const numberFormatter = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value;
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white w-fit dark:bg-slate-600 border border-gray-400 dark:border-gray-200 text-slate-800 dark:text-gray-200 py-1 px-7 rounded-lg shadow-lg" style={{ transform: 'translateY(-100%)', position: 'absolute', bottom: '1' }}>
                    <p className="text-sm">{numberFormatter(payload[0].value)} 
                    {
                        Title === 'Reach Amount Spent Ratio' || Title === 'Click Through Rate' || Title === 'Outbound Click Landing Page' || Title === 'Add To Cart' ? '%'
                        : Title === 'Return on Ad Spent' || Title === 'Real ROAS' || Title === 'ROAS Asli' ? 'x' : null
                    }
                    </p>
                </div>
            );
        }
        return null;
    };

    // Determine badge color based on value change
    const getBadgeColor = () => {
        if (data && data.length >= 2) {
            const latestValue = data[6]?.value; // Assume Title maps to a key in data
            const previousValue = data[5]?.value;

            if (latestValue > previousValue) {
                return 'bg-green-500'; // Green for increase
            } else if (latestValue < previousValue) {
                return 'bg-red-500'; // Red for decrease
            } else {
                return 'bg-blue-500'; // Blue for no change
            }
        }
        return 'bg-gray-300'; // Default color if not enough data
    };   

    useEffect(() => {
        getBadgeColor();
    }, [data]);

    const getPercent = () => {
        if (data && data.length >= 2) {
            const amount = (data[6]?.value - data[5]?.value) / data[5].value

            const percent = amount * 100

            return percent.toFixed(1)
        }
    }

    return (
        <div className="relative bg-gray-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-400 rounded-lg shadow-md p-4 w-full transition-all">
            <div className="flex flex-row items-start justify-between mb-3">
                <div className="flex flex-col gap-2">
                    <p className="text-md font-medium text-blue-700 dark:text-blue-500 mb-2">{Title}</p> {/* Updated text color */}
                    <div className="text-xl font-semibold text-slate-600 dark:text-slate-400">{Value}</div>
                </div>
                
                {/* Small bar chart */}
                <div className="w-24 h-16 absolute top-10 right-7">
                    {!data ? 
                        <div className="flex">
                            <div className="w-4 h-4 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                            <div className="w-4 h-6 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                            <div className="w-4 h-9 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                            <div className="w-4 h-5 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                            <div className="w-4 h-3 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                            <div className="w-4 h-10 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                            <div className="w-4 h-2 animate-pulse bg-gray-300 dark:bg-gray-500"></div>
                        </div>
                    : 
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={data}>
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[2, 2, 0, 0]} fill={isDark ? '#93C5FD' : '#1D4ED8'}> {/* Updated bar color */}
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={isDark ? '#93C5FD' : '#1D4ED8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    }
                </div>

                <svg 
                    className="w-6 h-6 text-blue-700 dark:text-blue-500 hover:cursor-pointer mt-2 sm:mt-0 transition-transform transform-gpu hover:rotate-45" 
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
                <>
                <div className="fixed w-screen h-screen z-40 top-0 left-0" onClick={() => onToggle(id)}></div>
                <div className="absolute z-50 top-11 -right-8 w-full bg-white dark:bg-slate-700 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out">
                    <div className="border-b border-gray-300 dark:border-slate-600 px-4 py-2">
                        <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-500">{Title}</h3> {/* Updated dropdown title color */}
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-xs text-gray-700 dark:text-gray-300">{Description}</p>
                    </div>
                </div>
                </>
            </CSSTransition>
            <div className="w-full mt-4 flex justify-start items-center gap-2">
                <div className={`text-white rounded-full gap-1 px-2 flex items-center ${getBadgeColor() ? getBadgeColor() : 'bg-gray-300'}`}>
                    <span className="text-xs">{getPercent() ? getPercent() : 0}%</span>
                </div>
                <span className="text-[10px] w-full text-gray-500 dark:text-gray-400">Total {Title} {t('desc')}</span>
            </div>
        </div>
    );
}
