'use client'

import { useContext } from "react"
import { AdminDashboardContext } from "@/app/admin-dashboard/page"

export default function CountCard({color, title, value, handleClick}){
    const [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData] = useContext(AdminDashboardContext)

    function handleCardClick(table){
        setChangeTable(table)
    }

   
    return (
        <div className={` bg-blue-300 text-white p-4 rounded-md shadow-md w-full mb-3 md:w-[30%]`}> 
            <h3 className="text-xl font-semibold">{title}</h3>
            <h1 className="text-4xl font-bold">{value}</h1>
            <button onClick={() => handleCardClick(handleClick)} className="text-white font-bold rounded mt-4">
                Lihat Detail
            </button>
        </div>
    )

    
}