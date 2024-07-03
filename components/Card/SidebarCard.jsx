'use client'

import { useState,useEffect } from "react"

export default function SidebarCard({platform, name, status, amountspend, reach, startdate}){

    const [Status, setStatus] = useState("")

    useEffect(() => {
        if(status == "active"){
            setStatus("bg-green-500")
        }else if(status == "complete"){
            setStatus("bg-yellow-500")
        }else{
            setStatus("bg-gray-500")
        }
    }, [status])

    return (
        <>
            <div className="text-sm text-black border-b-2 border-gray-300 hover:cursor-pointer hover:bg-cyan-300 p-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div>{platform} </div>
                        <p>{name}</p>
                    </div>
                    <p className={`${Status} w-3 h-3 rounded-full`}></p>
                </div>
                <div className="flex text-xs gap-5 mt-3">
                    <p>Amountspent : <br /> {amountspend}</p>
                    <p>Reach : <br />{reach}</p>
                    <p>Start Date : <br />{startdate}</p>
                </div>
            </div>
        </>
    )
}