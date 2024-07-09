'use client'
import { AdminDashboardContext, SidebarContext } from "@/app/admin-dashboard/page";
import { useEffect, useState, useContext, useRef } from "react"
import { IconContext } from "react-icons";
import { FaBars, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { RiBellLine, RiChat3Line} from "react-icons/ri";
import { BiBell } from "react-icons/bi";

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
            <nav className="w-full fixed z-20 h-[80px] shadow-md bg-white flex justify-between items-center">
                <div className="flex h-full">
                <div className="w-[300px] h-full bg-[#1C2434] flex items-end p-3 transition-transform" ref={navbarBrand}>
                    <img src="assets/icon.png" alt="Logo" className="w-10 h-10 decoration-white mr-1"/>
                    <p className="text-white font-sans text-3xl">UMAX</p>
                </div>
                    <button onClick={hideHandle} className="mx-5">
                    <FaBars className="text-2xl" />
                    </button>
                </div>

                <div className="flex items-center gap-3 me-5 md:me-10 text-xs cursor-pointer" onClick={() => {
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

                    <div className="flex items-center gap-2">
                    <div className="w-16 h-9 flex justify-center items-center rounded-full bg-slate-50">
                        {/* Add any content here if needed */}
                    </div>
                    <div className="w-9 h-9 flex justify-center items-center rounded-full bg-[#edf3fa]">
                        <BiBell className="text-xl" />
                    </div>
                    <div className="w-9 h-9 flex justify-center items-center rounded-full bg-[#edf3fa]">
                        <RiChat3Line className="text-xl" />
                    </div>
                    </div>

                    <div className="flex flex-col items-end mt-2">
                    <h1 className="text-nowrap font-medium">{userData.name}</h1>
                    <p className="text-gray-500">{userData.roles}</p>
                    </div>
                    <div>
                    {userData.image ?  <img  src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-[50px] h-[50px] bg-slate-200 rounded-full" /> : <p className="animate-pulse">Loading...</p>}
                    </div>
                </div>
            </nav>

        </>
    )
}