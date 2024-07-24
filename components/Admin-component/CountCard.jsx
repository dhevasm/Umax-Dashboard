'use client'

import { useContext } from "react"
import { AdminDashboardContext } from "@/app/admin-dashboard/page"
import { RiBuildingLine, RiEyeLine, RiMegaphoneLine, RiUser2Fill, RiUser2Line, RiUser3Fill, RiUser3Line } from "react-icons/ri"

export default function CountCard({title, value, handleClick}){
    const {sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData} = useContext(AdminDashboardContext)

    function handleCardClick(table){
        setChangeTable(table)
    }

    return (
        <div className={`bg-white dark:bg-slate-800 dark:text-white text-black p-4 flex flex-col shadow-lg w-full mb-3`}> 
            <div className="w-12 h-12 flex justify-center items-center rounded-full bg-slate-50">
                {
                title == 'Tenants' ? <RiBuildingLine className="text-[#3d50e0] font-thin" size={22}/> :
                title == 'Users' ? <RiUser3Line className="text-[#3d50e0] font-thin" size={22}/> :
                title == 'Campaigns' ? <RiMegaphoneLine className="text-[#3d50e0] font-thin" size={22}/> :
                title == 'Clients' ? <RiEyeLine className="text-[#3d50e0] font-thin" size={22}/> : ''
                }
            </div>
            <div className="p-3 text-xl font-semibold">{value}
                <div className="flex justify-between items-end">
                <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
                <p className="text-xs text-blue-500 hover:cursor-pointer" onClick={() => handleCardClick(handleClick)}>Show Detail </p>
                </div>
            </div>
        </div>
    )

    
}