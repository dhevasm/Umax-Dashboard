'use client'
import { AdminDashboardContext, SidebarContext } from "@/app/admin-dashboard/page";
import { useEffect, useState, useContext, useRef } from "react"
import { IconContext } from "react-icons";
import { FaBars, FaPersonBooth, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AdminNavbar({userData}){

    const [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable] = useContext(AdminDashboardContext)

    const navbarBrand = useRef()

    function hideHandle(){
        setSidebarHide(!sidebarHide)
        navbarBrand.current.classList.toggle("hidden")
    }

    const checkIsMobile = () => {
        if (window.innerWidth <= 640) {
            hideHandle()
            navbarBrand.current.classList.add("hidden")
        } 
    }
    useEffect(() => {
        checkIsMobile()
    }, [])

    const Router = useRouter()

    function handleLogout(){
        localStorage.clear()
        Router.push('/')
    }

    return (
        <>
            <nav className="w-full fixed z-20 h-[85px] bg-slate-100 shadow-md flex justify-between items-center">
                <div className="flex h-full">
                    <div className="w-[300px] h-full bg-[#1C2434] flex justify-center items-center transition-transform" ref={navbarBrand}>
                        <img src="assets/logo.png" alt="Logo" className="drop-shadow-xl decoration-white"/>
                    </div>
                    <button onClick={hideHandle} className="mx-5">
                        <FaBars className="text-2xl" />
                    </button>
                </div>

                <div className="me-10 text-xs flex gap-3 cursor-pointer" onClick={() => {
                    document.querySelector("#profileDropDown").classList?.toggle("hidden")
                }}>
                    <div className="hidden absolute top-16 right-10 p-5 bg-white rounded-lg shadow-lg" id="profileDropDown">
                         {userData.image ?  <img src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-20 h-20 bg-slate-200 rounded-full" /> : <p className="animate-pulse">Loading...</p> }
                         <h1 className="font-bold text-lg">{userData.name}</h1><p className="text-md">{userData.roles}</p>
                         <div className="w-full h-0.5 bg-gray-400 my-3 px-5"></div>
                         <button className="text-md flex items-center gap-2" onClick={() => Router.push('/profile')} >
                            <FaUser/> 
                            Profile
                        </button>
                         <div className="w-full h-0.5 bg-gray-400 my-3 px-5"></div>
                         <button className="text-md flex items-center gap-2" onClick={handleLogout} >
                            <FaSignOutAlt/> 
                            Log Out
                        </button>
                    </div>
                    
                    <div>
                        {
                            userData.image ?  <img  src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-7 h-7 bg-slate-200 rounded-full" /> : <p className="animate-pulse">Loading...</p> 
                        }
                       
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