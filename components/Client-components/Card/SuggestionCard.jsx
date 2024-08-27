'use client'

import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function SuggestionCard({ Title, Desc, Value, Target, Message, Color }) {
    const [background, setBackground] = useState("");
    const [bordercolor, setBordercolor] = useState("");
    const [icon, setIcon] = useState("");

    useEffect(() => {
        if (Color === "Success") {
            setBackground("bg-green-100 dark:bg-green-600");
            setBordercolor("border-green-500 dark:border-green-200");
            setIcon(<FiCheckCircle className="text-green-600 dark:text-green-200" size={30} />);
        } else if (Color === "Warning") {
            setBackground("bg-yellow-100 dark:bg-yellow-600");
            setBordercolor("border-yellow-500 dark:border-yellow-200");
            setIcon(<FiAlertTriangle className="text-yellow-600 dark:text-yellow-200" size={30} />);
        } else {
            setBackground("bg-blue-100 dark:bg-blue-600");
            setBordercolor("border-blue-500 dark:border-blue-200");
            setIcon("No Icon");
        }
    }, [Color]);

    return (
        <>
            {/* Suggestion Card */}
            <div className={`w-full p-7 rounded-lg shadow-sm ${background} ${bordercolor} border mt-5 transition-all`}>
                <div className="flex gap-5">
                    {/* Icon */}
                    <div>
                        {icon}
                    </div>
                    {/* Title */}
                    <div>
                        <h1 className="text-lg font-bold dark:text-white">{Title}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-200">{Desc}</p>
                    </div>
                </div>
                <div className="w-full h-0.5 bg-gray-400 dark:bg-gray-600 my-3"></div>
                <div className="flex gap-10 dark:text-white">
                    <p><span className='font-semibold'>Nilai:</span> <span className='text-red-600 dark:text-red-300 font-semibold'>{Value}</span></p>
                    <p><span className='font-semibold'>Target:</span> <span className='text-green-600 dark:text-green-300 font-semibold'>{Target}</span></p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="mt-3 dark:text-white"><span className='font-semibold'>Pesan:</span> {Message}</p>
                    <p className="text-sm self-end text-blue-600 dark:text-blue-300 cursor-pointer">Learn More</p>
                </div>
            </div>
        </>
    );
}
