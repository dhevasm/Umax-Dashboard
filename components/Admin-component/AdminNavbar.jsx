'use client'
import { AdminDashboardContext, SidebarContext } from "@/app/admin-dashboard/page";
import { useEffect, useState, useContext, useRef } from "react"
import { IconContext } from "react-icons";
import { FaBars } from "react-icons/fa";

export default function AdminNavbar({userData}){

    const [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable] = useContext(AdminDashboardContext)

    const navbarBrand = useRef()

    function hideHandle(){
        setSidebarHide(!sidebarHide)
        navbarBrand.current.classList.toggle("hidden")
    }

    useEffect(() => {
        if (sidebarHide) {
            document.querySelector("body").classList.add("overflow-hidden")
        } else {
            document.querySelector("body").classList.remove("overflow-hidden")
        }
    }, [sidebarHide])

    return (
        <>
            <nav className="w-full fixed z-20 h-14 bg-slate-100 shadow-md flex justify-between items-center">
                <div className="flex h-full">
                    <div className="w-[300px] h-full bg-slate-200 flex justify-center items-center transition-transform" ref={navbarBrand}>
                        <img src="assets/logo.png" alt="Logo"/>
                    </div>
                    <button onClick={hideHandle} className="ms-5">
                        <FaBars className="text-2xl" />
                    </button>
                </div>

                <div className="me-10 text-xs flex gap-3">
                    <div>
                        <img  src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-7 h-7 bg-slate-200 rounded-full" />
                    </div>
                    <div>
                        <h1 className="font-bold">{userData.name}</h1>
                        <p>{userData.roles}</p>
                    </div>
                    
                </div>
            </nav>
        </>
    )
}