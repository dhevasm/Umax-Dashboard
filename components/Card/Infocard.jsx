'use client'

import { useState, useEffect } from "react"
// import { CSSTransition } from 'react-transition-group';

export default function InfoCard({ Color, Title, Value, Desc }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const [bordercolor, setBordercolor] = useState("");
    const [background, setBackground] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        if (Color === "Success") {
            setBordercolor("border-green-600");
            setBackground("bg-green-300");
            setText("text-green-600");
        } else if (Color === "Warning") {
            setBordercolor("border-yellow-600");
            setBackground("bg-yellow-300");
            setText("text-yellow-600");
        } else {
            setBordercolor("border-blue-600");
            setBackground("bg-blue-300");
            setText("text-blue-600");
        }
    }, [Color]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <>
            {/* card */}
            <div className={`border ${bordercolor} ${background} p-5 rounded-lg w-full transition-all`}>
                <p className={`text-sm ${text} text-nowrap`}>{Title}</p>
                <div className="flex justify-between items-center">
                    <h1 className={`text-[20px] font-semibold ${text} overflow-hidden text-ellipsis whitespace-nowrap`}>{Value}</h1>
                    <button className="relative bottom-7" onClick={toggleDropdown}>
                        <i className="fas fa-info-circle text-xs text-gray-500">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </i>
                        {showDropdown && (
                            <div className="absolute z-50 right-0 mt-2 w-60 bg-white rounded-lg shadow-lg transform transition-transform duration-1000 ease-in-out">
                                <div className="border-b flex justify-between items-center px-4 py-2">
                                    <h3 className="text-sm font-semibold">{Title}</h3>
                                </div>
                                <div className="px-4 py-3">
                                    <p className="text-xs text-gray-700">{Desc}</p>
                                </div>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
