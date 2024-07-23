'use client'

import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function SuggestionCard({ Title, Desc, Value, Target, Message, Color }) {
    const [background, setBackground] = useState("");
    const [icon, setIcon] = useState("");

    useEffect(() => {
        if (Color === "Success") {
            setBackground("bg-green-200 dark:bg-green-800");
            setIcon(<FiCheckCircle className="text-green-500 dark:text-green-400" size={30} />);
        } else if (Color === "Warning") {
            setBackground("bg-yellow-200 dark:bg-yellow-800");
            setIcon(<FiAlertTriangle className="text-yellow-500 dark:text-yellow-400" size={30} />);
        } else {
            setBackground("bg-blue-200 dark:bg-blue-800");
            setIcon("No Icon");
        }
    }, [Color]);

    return (
        <>
            {/* Suggestion Card */}
            <div className={`w-full p-7 rounded-lg shadow-lg ${background} mt-5 transition-all`}>
                <div className="flex gap-10">
                    {/* Icon */}
                    <div>
                        {icon}
                    </div>
                    {/* Title */}
                    <div>
                        <h1 className="text-lg font-bold dark:text-white">{Title}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{Desc}</p>
                    </div>
                </div>
                <div className="w-full h-0.5 bg-gray-400 dark:bg-gray-600 my-3"></div>
                <div className="flex gap-10 dark:text-gray-300">
                    <p>Nilai: {Value}</p>
                    <p>Target: {Target}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="mt-3 dark:text-gray-300">Pesan: {Message}</p>
                    <p className="text-sm self-end text-blue-600 dark:text-blue-400 cursor-pointer">Learn More</p>
                </div>
            </div>
        </>
    );
}
