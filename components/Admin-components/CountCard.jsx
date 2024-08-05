'use client'

import { useContext } from "react"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import { RiBuildingLine, RiEyeLine, RiMegaphoneLine, RiUser2Fill, RiUser2Line, RiUser3Fill, RiUser3Line } from "react-icons/ri"
import { useTranslations } from "next-intl"

export default function CountCard({title, value, handleClick}){
    const {sidebarHide,
        setSidebarHide,
        updateCard,
        setUpdateCard,
        changeTable,
        setChangeTable,
        test,
        dataDashboard,
        isDarkMode,
        setIsDarkMode,
        navbarBrandHide,
        setNavbarBrandHide
    } = useContext(AdminDashboardContext)
    const t = useTranslations('admin-dashboard')

    function handleCardClick(table){
        setChangeTable(table)
        if (window.innerWidth <= 640) {
            setSidebarHide(!sidebarHide)
            setNavbarBrandHide(!navbarBrandHide)
        } 
    }

    return (    
        <div className={`bg-white dark:bg-slate-800 dark:text-white text-black p-4 flex flex-col justify-between shadow-lg w-full mb-3`}> 
            <div className="w-12 h-12 flex justify-center items-center rounded-full bg-slate-50">
                {
                title == t('tenants') ? <RiBuildingLine className="text-[#3d50e0] font-thin" size={22}/> :
                title == t('users') ? <RiUser3Line className="text-[#3d50e0] font-thin" size={22}/> :
                title == t('campaigns') ? <RiMegaphoneLine className="text-[#3d50e0] font-thin" size={22}/> :
                title == t('clients') ? <RiEyeLine className="text-[#3d50e0] font-thin" size={22}/> : ''
                }
            </div>
            <div className="p-3 text-xl font-semibold">{value}
                <div className="flex justify-between items-end">
                <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
                <p className="text-xs text-blue-500 hover:cursor-pointer" onClick={() => handleCardClick(handleClick)}>{t('show-detail')}</p>
                </div>
            </div>
        </div>
    )

    
}