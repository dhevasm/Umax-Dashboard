'use client'

import { useState, useContext, useEffect } from "react"
import { AdminDashboardContext } from "@/app/admin-dashboard/page"
import { IconContext } from "react-icons"
import { FaAngleDown, FaBuilding } from "react-icons/fa"
import { FaAngleUp } from "react-icons/fa"
import { FaTable } from "react-icons/fa"

import { useRef } from "react"
import Sidebar from "../Sidebar";
import { jsx } from "react/jsx-runtime"

export default function AdminSidebar(){

    const sidebarLink = useRef()
    const sideBar = useRef()
    
    const [minimizedSidebar, setMinimizedSidebar] = useState(false)
    const [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData] = useContext(AdminDashboardContext)

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

    return(
        <>
            <div className="fixed z-10 bg-slate-200 w-[300px] h-screen text-black transition-transform " ref={sideBar}>
                <ul className="pt-20 ms-5">
                    <li className="mb-4">
                        <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200" onClick={handleSidebarLink}>
                            Data table
                            <IconContext.Provider value={{ className: "text-xl" }}>
                                {
                                  minimizedSidebar ? <FaAngleDown /> : <FaAngleUp />
                                }
                            </IconContext.Provider>
                        </button>
                        <ul className="pl-4 mt-2 space-y-2" ref={sidebarLink}>
                            <li>
                               { userData.roles == "sadmin" &&
                                <button onClick={() => setChangeTable("tenants")} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 flex gap-2 items-center">
                                    <IconContext.Provider value={{ className: "text-md" }}>
                                        <FaTable />
                                    </IconContext.Provider>
                                    Table Tenants
                                </button>}
                                {
                                  userData.roles == "admin" && <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 flex gap-2 items-center" onClick={() => setChangeTable("company")}>
                                   <IconContext.Provider value={{ className: "text-md" }}>
                                       <FaBuilding />
                                   </IconContext.Provider>
                                   Your Tenant
                               </button>
                                }
                            </li>
                            <li>
                                <button onClick={() => setChangeTable("users")} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        <FaTable />
                                </IconContext.Provider>
                                Table Users</button>
                            </li>
                            <li>
                                <button onClick={() => setChangeTable("campaigns")} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        <FaTable />
                                </IconContext.Provider>
                                    Table Campaigns</button>
                            </li>
                            <li>
                                <button onClick={() => setChangeTable("campaigns")} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        <FaTable />
                                    </IconContext.Provider>
                                    Table Ads Account</button>
                            </li>
                            <li>
                                <button onClick={() => setChangeTable("campaigns")} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        <FaTable />
                                    </IconContext.Provider>
                                    Table Clients
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    )
}