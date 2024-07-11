'use client'

import { useState, useContext, useEffect } from "react"
import { AdminDashboardContext } from "@/app/admin-dashboard/page"
import { IconContext } from "react-icons"
import { FaAngleDown, FaBuilding, FaServer, FaSignOutAlt, FaTachometerAlt, FaUser } from "react-icons/fa"
import { FaAngleUp } from "react-icons/fa"
import { FaTable } from "react-icons/fa"

import { useRef } from "react"
import Sidebar from "../Sidebar";
import { jsx } from "react/jsx-runtime"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { RiArrowGoBackLine, RiDashboard2Line, RiDeleteBack2Line, RiLogoutBoxLine, RiTableLine, RiUser3Line, RiWindowLine } from "react-icons/ri"
import { VscDashboard } from "react-icons/vsc"
import { MdDashboard } from "react-icons/md"

export default function AdminSidebar(){

    const sidebarLink = useRef()
    const sideBar = useRef()

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
                localStorage.clear()
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
                                Dashboard
                            </div>
                        </button>
                    </li>
                    <li className="mb-4">
                    {
                        userData.roles == "admin" && <button className="px-4 py-2 w-full text-slate-300 text-sm  hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center" onClick={() => setChangeTable("company")}>
                        <IconContext.Provider value={{ className: "text-md" }}>
                            <FaBuilding size={20}/>
                        </IconContext.Provider>
                        Your Tenant
                        </button>
                    }
                    </li>
                    <li className="mb-4">
                        <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium  rounded-md hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48]" onClick={handleSidebarLink}>
                            <div className="flex items-center gap-2 text-slate-300 ">
                                <RiTableLine size={20}/>
                                Data Table
                            </div>
                            <IconContext.Provider value={{ className: "text-xl" }}>
                                {
                                  minimizedSidebar ? <FaAngleDown /> : <FaAngleUp />
                                }
                            </IconContext.Provider>
                        </button>
                        <ul className="pl-4 mt-2 space-y-2" ref={sidebarLink}>
                            <li>
                               { userData.roles == "sadmin" &&
                                <button onClick={() => setChangeTable("tenants")} className="px-7 py-2 text-sm w-full  text-slate-300  hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center">
                                    <IconContext.Provider value={{ className: "text-md" }}>
                                        {/* <FaTable /> */}
                                    </IconContext.Provider>
                                    Tenants
                                </button>}
                            </li>
                            <li>
                                <button onClick={() => setChangeTable("users")} className="px-7 py-2 text-sm  w-full text-slate-300 hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        {/* <FaTable /> */}
                                </IconContext.Provider>
                                Users</button>
                            </li>
                            <li>
                                <button onClick={() => setChangeTable("campaigns")} className="px-7 py-2 text-sm w-full text-slate-300 hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        {/* <FaTable /> */}
                                </IconContext.Provider>
                                    Campaigns</button>
                            </li>
                            <li>
                                <button onClick={() => setChangeTable("accounts")} className="px-7 py-2 text-sm w-full text-slate-300 hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48] flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        {/* <FaTable /> */}
                                    </IconContext.Provider>
                                    Accounts</button>
                            </li>
                            <li>
                                <button onClick={() => setChangeTable("clients")} className="px-7 py-2 text-sm w-full text-slate-300 hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48]  flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        {/* <FaTable /> */}
                                    </IconContext.Provider>
                                    Clients
                                </button>
                            </li>
                        </ul>
                    </li>
                    <li className="mb-4">
                    <button className="flex items-center text-slate-300 justify-between w-full px-4 py-2 text-sm font-medium  rounded-md hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48]" onClick={() => Router.push('/profile')}>
                            <div className="flex items-center gap-2">
                                <RiUser3Line size={20}/>
                                Profile
                            </div>
                        </button>
                    </li>
                    <li className="mb-4">
                    <button className="flex items-center text-slate-300 justify-between w-full px-4 py-2 text-sm font-medium  rounded-md hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48]" onClick={handleLogout}>
                            <div className="flex items-center gap-2">
                                <RiLogoutBoxLine size={20}/>
                                Log Out
                            </div>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}