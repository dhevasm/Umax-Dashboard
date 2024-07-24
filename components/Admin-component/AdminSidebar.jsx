'use client'

import { useState, useContext, useEffect } from "react"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import { IconContext } from "react-icons"
import { FaAngleDown, FaBuilding, FaChartLine, FaServer, FaSignOutAlt, FaTachometerAlt, FaUser } from "react-icons/fa"
import { FaAngleUp } from "react-icons/fa"
import { FaTable } from "react-icons/fa"

import { useRef } from "react"
import Sidebar from "../Sidebar";
import { jsx } from "react/jsx-runtime"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { RiAccountBoxFill, RiArrowGoBackLine, RiBuilding2Fill, RiDashboard2Line, RiDeleteBack2Line, RiEye2Fill, RiLogoutBoxLine, RiMegaphoneFill, RiProfileFill, RiTableLine, RiUser2Fill, RiUser3Fill, RiUser3Line, RiWindowLine } from "react-icons/ri"
import { VscDashboard } from "react-icons/vsc"
import { MdDashboard } from "react-icons/md"
import { useTranslations } from "next-intl"

export default function AdminSidebar(){

    const sidebarLink = useRef()
    const sideBar = useRef()
    const t = useTranslations('admin-sidebar')

    const Router = useRouter()
    
    const [minimizedSidebar, setMinimizedSidebar] = useState(false)
    const {sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData} = useContext(AdminDashboardContext)

    useEffect(() => {
        if (sidebarHide) {
            sideBar.current.classList.add('-translate-x-full')
        } else {
            sideBar.current.classList.remove('-translate-x-full')
        }
    }, [sidebarHide])


    function handleSidebarLink(){
        setMinimizedSidebar(!minimizedSidebar)
        sidebarLink.current.classList.toggle('hidden')
    }

    function handleLogout(){
        Swal.fire({
            title: "Are you sure?",
            text: "you will be logged out of your account",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sign Out"
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('tenantId');
                localStorage.removeItem('roles');
                localStorage.removeItem('name');
                localStorage.removeItem('lang');
                Router.push('/')
            }
          });
    }

    return(
        <>
            <div className="fixed z-10 bg-slate-800 w-[300px] h-screen text-white transition-transform pe-5" ref={sideBar}>
                <ul className="pt-28 pl-3 uppercase ms-5">
                    <li className="mb-4 ms-2 text-slate-400 font-semibold">
                        Menu
                    </li>
                    <li className="mb-4 text-sm">
                        <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium  rounded-md hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48]" onClick={() => setChangeTable("dashboard")}>
                            <div className="flex items-center gap-2 text-slate-300 font-semibold">
                                <MdDashboard size={20}/>
                                {t('dashboard')}
                            </div>
                        </button>
                    </li>
                    {
                        userData.roles == "admin" &&
                        <li className="mb-4 text-sm">
                        <button className="flex items-center justify-betwesen w-full px-4 py-2 text-sm font-medium  rounded-md hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48]" onClick={() => Router.push(`/${localStorage.getItem('lang')}/dashboard`)}>
                            <div className="flex items-center gap-2 text-slate-300 font-semibold">
                                <FaChartLine size={20}/>
                                Analystics
                            </div>
                        </button>
                    </li>}
                    <li className="mb-4">
                    {
                        userData.roles == "admin" && <button className="px-4 py-2 w-full text-slate-300 text-sm  hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center" onClick={() => setChangeTable("company")}>
                        <IconContext.Provider value={{ className: "text-lg" }}>
                            <FaBuilding size={20}/>
                        </IconContext.Provider>
                        {t('tenant-profile')}
                        </button>
                    }
                    </li>
                    <li className="mb-4">
                        { userData.roles == "sadmin" &&
                        <button onClick={() => setChangeTable("tenants")} className="px-4 py-2 w-full text-slate-300 text-sm  hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center">
                            <IconContext.Provider value={{ className: "text-lg" }}>
                                <RiBuilding2Fill />
                            </IconContext.Provider>
                            {t('tenants')}
                        </button>}
                    </li>
                    <li className="mb-4">
                        <button onClick={() => setChangeTable("users")} className="px-4 py-2 w-full text-slate-300 text-sm  hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center">
                        <IconContext.Provider value={{ className: "text-lg" }}>
                                <RiProfileFill />
                        </IconContext.Provider>
                            {t('users')}
                        </button>
                    </li>
                    <li className="mb-4">
                        <button onClick={() => setChangeTable("campaigns")} className="px-4 py-2 w-full text-slate-300 text-sm  hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center">
                        <IconContext.Provider value={{ className: "text-lg" }}>
                                <RiMegaphoneFill />
                        </IconContext.Provider>
                            {t('campaigns')}
                        </button>
                    </li>
                    <li className="mb-4">
                        <button onClick={() => setChangeTable("accounts")} className="px-4 py-2 w-full text-slate-300 text-sm  hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center">
                        <IconContext.Provider value={{ className: "text-lg" }}>
                                <RiAccountBoxFill />
                            </IconContext.Provider>
                            {t('accounts')}
                        </button>
                    </li>
                    <li className="mb-4">
                        <button onClick={() => setChangeTable("clients")} className="px-4 py-2 w-full text-slate-300 text-sm  hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center">
                        <IconContext.Provider value={{ className: "text-lg" }}>
                                <RiEye2Fill />
                            </IconContext.Provider>
                            {t('clients')}
                        </button>
                    </li>
                    <li className="mb-4">
                    <button className="flex items-center text-slate-300 justify-between w-full px-4 py-2 text-sm font-medium  rounded-md hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48]" onClick={() => Router.push(`/${localStorage.getItem("lang")}/profile`)}>
                            <div className="flex items-center gap-2">
                                <RiUser3Line size={20}/>
                                {t('profile')}
                            </div>
                        </button>
                    </li>
                    <li className="mb-4">
                    <button className="flex items-center text-slate-300 justify-between w-full px-4 py-2 text-sm font-medium  rounded-md hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48]" onClick={handleLogout}>
                            <div className="flex items-center gap-2">
                                <RiLogoutBoxLine size={20}/>
                                {t('logout')}
                            </div>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}