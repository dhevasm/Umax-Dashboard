'use client'

import { useState, useEffect } from "react"

export default function Infocard({Color, Title, Value, Desc}){

    const [showDropdown, setShowDropdown] = useState(false)

   const [bordercolor, setBordercolor] = useState("")
   const [background, setBackground] = useState("")
   const [text, setText] = useState("")

    useEffect(() => {
        if(Color == "Success"){
            setBordercolor("border-green-500")
            setBackground("bg-green-100")
            setText("text-green-500")
        }else if(Color == "Warning"){
            setBordercolor("border-yellow-500")
            setBackground("bg-yellow-100")
            setText("text-yellow-500")
        }else{
            setBordercolor("border-blue-500")
            setBackground("bg-blue-100")
            setText("text-blue-500") 
        }
    }, [Color])

    return (
        <>
        {/* card */}
            <div className={`border ${bordercolor} ${background} p-4 rounded-lg w-full transition-all`}>
                <p className={`text-sm ${text}`}>{Title}</p>
                <div className="flex justify-between items-center">
                    <h1 className={`text-2xl ${text}`}>{Value}</h1>
                    <button className="relative" onClick={() => setShowDropdown(!showDropdown)}>
                        <i className="fas fa-info-circle text-xs text-gray-500">info</i>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-2">
                                <p className="text-xs">{Desc}</p>
                            </div>
                        )}
                    </button>
                </div>  
            </div>
        </>
    )
} 