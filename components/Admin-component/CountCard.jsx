'use client'

import { useContext } from "react"
import { AdminDashboardContext } from "@/app/admin-dashboard/page"

export default function CountCard({color, title, value, handleClick}){
    const [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData] = useContext(AdminDashboardContext)

    function handleCardClick(table){
        setChangeTable(table)
    }

    return (
        <>
            <div className={`w-[300px] h-[100px] bg-${color}-200 border border-${color}-500 text-${color}-500 shadow-lg rounded-lg flex justify-center items-center hover:cursor-pointer`} onClick={() => handleCardClick(handleClick)}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold">{value}</h1>
                    <p>{title}</p>
                </div>
            </div>
        </>
    )
}