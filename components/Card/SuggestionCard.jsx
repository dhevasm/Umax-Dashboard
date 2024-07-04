'use client'

import { useState, useEffect } from "react"

export default function SuggestionCard({Title, Desc, Value, Target, Message, Color}){

    const [background, setBackground] = useState("")
    const [icon, setIcon] = useState("")

    useEffect(() => {
        if(Color == "success"){
            setBackground("bg-green-200")
            setIcon("Success")
        }else if(Color == "warning"){
            setBackground("bg-yellow-200")
            setIcon("Warning")
        }else{
            setBackground("bg-blue-200")
            setIcon("No Icon")
        }
    }, [Color])

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
                        <h1 className="text-lg font-bold">{Title}</h1>
                        <p className="text-sm text-gray-500">{Desc}</p>
                    </div>
                </div>
                <div className="w-full h-0.5 bg-gray-400 my-3"></div>
                <div className="flex gap-10">
                    <p>Nilai : {Value}</p>
                    <p>Target : {Target} </p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="mt-3">Pesan : {Message}</p>
                    <p className="text-sm self-end">Learn More</p>
                </div>
            </div>
        </>
    )
}