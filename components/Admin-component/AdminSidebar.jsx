'use client'

import { useState } from "react"

import { IconContext } from "react-icons"
import { FaAngleDown } from "react-icons/fa"
import { FaAngleUp } from "react-icons/fa"
import { FaTable } from "react-icons/fa"

import { useRef } from "react"

export default function AdminSidebar(){

    const sidebarLink = useRef()
    
    const [minimizedSidebar, setMinimizedSidebar] = useState(false)

    function handleSidebarLink(){
        setMinimizedSidebar(!minimizedSidebar)
        sidebarLink.current.classList.toggle('hidden')
    }

    return(
        <>
            <div className="fixed z-10 bg-slate-200 w-[300px] h-screen text-black">
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
                                <a href="#" className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 flex gap-2 items-center">
                                    <IconContext.Provider value={{ className: "text-md" }}>
                                        <FaTable />
                                    </IconContext.Provider>

                                    Table Tenants
                                </a>
                            </li>
                            <li>
                                <a href="#" className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        <FaTable />
                                    </IconContext.Provider>
                                Table Users</a>
                            </li>
                            <li>
                                <a href="#" className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 flex gap-2 items-center">
                                <IconContext.Provider value={{ className: "text-md" }}>
                                        <FaTable />
                                    </IconContext.Provider>
                                    Table Campaigns</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    )
}