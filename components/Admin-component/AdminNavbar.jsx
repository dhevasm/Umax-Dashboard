'use client'
import { AdminDashboardContext, SidebarContext } from "@/app/admin-dashboard/page";
import { useEffect, useState, useContext, useRef } from "react"
import { IconContext } from "react-icons";
import { FaBars, FaMoon, FaSignOutAlt, FaSun, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { RiBellLine, RiChat3Line} from "react-icons/ri";
import { BiBell } from "react-icons/bi";
import dynamic from "next/dynamic";

function AdminNavbar({userData}){

    const {sidebarHide,
        setSidebarHide,
        updateCard,
        setUpdateCard,
        changeTable,
        setChangeTable,
        test,
        dataDashboard,
        isDarkMode,
        setIsDarkMode} = useContext(AdminDashboardContext)

    const navbarBrand = useRef()
    useEffect(() => {
        if (window.innerWidth <= 640) {
            navbarBrand.current.classList.toggle("hidden")
        } 
    }, [changeTable])

    function hideHandle(){
        setSidebarHide(!sidebarHide)
        navbarBrand.current.classList.toggle("hidden")
    }

    const checkIsMobile = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 640) {
                navbarBrand.current.classList.add("hidden")
            } 
        }
    }

    useEffect(() => {
        checkIsMobile()
       if(localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            document.getElementById("theme").checked = true
            localStorage.setItem('color-theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            document.getElementById("theme").checked = false
            localStorage.setItem('color-theme', 'light')
        }
    }, [])

    const Router = useRouter()

    function handleLogout(){
        localStorage.clear()
        Router.push('/')
    }

    function handleTheme(){
        setIsDarkMode(!isDarkMode)
        document.documentElement.classList.toggle("dark")
        localStorage.setItem('color-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }


    return (
        <>
            <nav className="w-full fixed z-20 h-[80px] shadow-md bg-white text-black dark:bg-slate-800 dark:text-white flex justify-between items-center">
                <div className="flex h-full">
                <div className="w-[300px] flex h-full bg-slate-800 shadow-none items-end p-3 transition-transform" ref={navbarBrand}>
                    <img src="assets/icon.png" alt="Logo" className="w-10 h-10 decoration-white mr-1"/>
                    <p className="text-white font-sans text-3xl">UMAX</p>
                </div>
                    <button onClick={hideHandle} className="mx-5">
                    <FaBars className="text-2xl" />
                    </button>
                </div>

                <div className="flex items-center gap-3 me-5 md:me-10 text-xs cursor-pointer" 
                // onClick={() => {
                //     document.querySelector("#profileDropDown").classList?.toggle("hidden")
                // }}
                >
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

                    <div className="flex items-center gap-2 me-2">
                    <div className="w-16 h-9 flex justify-center items-center rounded-full">
                        <label htmlFor="theme" className="inline-flex items-center cursor-pointer me-2">
                            {
                                isDarkMode ? <FaMoon className="text-lg text-white me-2"/> : <FaSun className="text-xl text-blue-500 me-2"/>
                            }
                        {/* <input type="checkbox" value="" id="theme" name="theme" className="sr-only peer" onChange={handleTheme}/>
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                        </div> */}
                        <input data-hs-theme-switch class="relative w-[3.25rem] h-7 bg-blue-200 checked:bg-none checked:bg-gray-700 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ring-1 ring-transparent focus:border-slate-700 focus:ring-slate-700 focus:outline-none appearance-none
                        before:inline-block before:size-6 before:bg-white checked:before:bg-gray-500 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200
                        after:absolute after:end-1.5 after:top-[calc(50%-0.40625rem)] after:w-[.8125rem] after:h-[.8125rem] after:bg-no-repeat after:bg-[right_center] after:bg-[length:.8125em_.8125em] after:transform after:transition-all after:ease-in-out after:duration-200 after:opacity-70 checked:after:start-1.5 checked:after:end-auto" type="checkbox" id="theme" onChange={handleTheme}></input>
                        </label>
                    </div>
                    {/* <div className="w-9 h-9 flex justify-center items-center rounded-full bg-[#edf3fa] dark:bg-slate-900">
                        <BiBell className="text-xl" />
                    </div>
                    <div className="w-9 h-9 flex justify-center items-center rounded-full bg-[#edf3fa] dark:bg-slate-900">
                        <RiChat3Line className="text-xl" />
                    </div> */}
                    </div>

                    <div className="flex flex-col items-end mt-2">
                    <h1 className="text-nowrap font-medium">{userData.name}</h1>
                    <p className="text-gray-500">{userData.roles}</p>
                    </div>
                    <div className="hidden md:block">
                    {userData.image ?  <img  src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-[50px] h-[50px] bg-slate-200 rounded-full" /> : <p className="animate-pulse">Loading...</p>}
                    </div>
                </div>
            </nav>

        </>
    )
}

export default dynamic(() => Promise.resolve(AdminNavbar));