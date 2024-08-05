'use client'
import { useEffect, useState, useContext, useRef } from "react";
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page";
import { FaBars, FaMoon, FaSignOutAlt, FaSun, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { RiChat3Line } from "react-icons/ri";
import { BiBell, BiMailSend, BiX } from "react-icons/bi";
import Image from "next/image";
import dynamic from "next/dynamic";

function AdminNavbar({ userData }) {
    const { sidebarHide, setSidebarHide, isDarkMode, setIsDarkMode, navbarBrandHide, setNavbarBrandHide } = useContext(AdminDashboardContext);
    const [isOpen, setIsOpen] = useState(0);
    const navbarBrand = useRef(null);
    const router = useRouter();

    // Handle sidebar visibility and navbar brand visibility
    function hideHandle() {
        setSidebarHide(!sidebarHide);
        setNavbarBrandHide(!navbarBrandHide);
    }

    useEffect(() => {
        if (navbarBrandHide) {
            navbarBrand.current?.classList.add("hidden");
        } else {
            navbarBrand.current?.classList.remove("hidden");
        }
    }, [navbarBrandHide]);

    // Handle theme setting based on localStorage or user preference
    useEffect(() => {
        const theme = localStorage.getItem('color-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.getElementById("theme").checked = theme === 'dark';
        localStorage.setItem('color-theme', theme);
    }, []);

    function handleLogout() {
        localStorage.clear();
        router.push('/');
    }

    function handleTheme() {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        document.documentElement.classList.toggle("dark", newDarkMode);
        localStorage.setItem('color-theme', newDarkMode ? 'dark' : 'light');
    }

    const Popup = ({ isOpen, handleClose, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed top-16 right-10 z-50 p-5 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                <div className="relative">
                    <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 dark:text-gray-300">
                        <BiX className="w-6 h-6" />
                    </button>
                    {children}
                </div>
            </div>
        );
    };

    function handleOpen(popup) {
        setIsOpen(popup);
    }

    return (
        <nav className="w-full fixed z-20 h-[80px] shadow-md bg-white text-black dark:bg-slate-800 dark:text-white flex justify-between items-center">
            <div className="flex h-full">
                <div className="w-[300px] flex h-full bg-slate-800 shadow-none items-center p-3 transition-transform" ref={navbarBrand}>
                    <Image src="/assets/icon.png" alt="Logo" className="w-[60px] h-[60px] decoration-white" width={60} height={60} />
                    <Image src="/assets/logo.png" alt="Logo" className="w-[140px] h-10 decoration-white mr-1 mt-2" width={140} height={40} />
                </div>
                <button onClick={hideHandle} className="mx-5">
                    <FaBars className="text-2xl" />
                </button>
            </div>

            <div className="flex items-center gap-3 me-5 md:me-10 text-xs cursor-pointer">
                <div className="flex items-center gap-2 ms-20">
                    <div className="w-20 h-9 flex justify-center items-center rounded-full">
                        <label htmlFor="theme" className="inline-flex items-center cursor-pointer me-2">
                            {
                                isDarkMode ? <FaMoon className="text-lg text-white me-2"/> : <FaSun className="text-xl text-blue-500 me-2"/>
                            }
                        <input data-hs-theme-switch className="relative w-[3.25rem] h-7 bg-blue-200 checked:bg-none checked:bg-gray-700 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ring-1 ring-transparent focus:border-slate-700 focus:ring-slate-700 focus:outline-none appearance-none
                            before:inline-block before:size-6 before:bg-white checked:before:bg-gray-500 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200
                            after:absolute after:end-1.5 after:top-[calc(50%-0.40625rem)] after:w-[.8125rem] after:h-[.8125rem] after:bg-no-repeat after:bg-[right_center] after:bg-[length:.8125em_.8125em] after:transform after:transition-all after:ease-in-out after:duration-200 after:opacity-70 checked:after:start-1.5 checked:after:end-auto" type="checkbox" id="theme" onChange={handleTheme}></input>
                        </label>
                    </div>
                    <div className="w-9 h-9 flex justify-center items-center rounded-full bg-[#edf3fa] dark:bg-slate-900" onClick={() => handleOpen(isOpen === 0 || isOpen === 2 ? 1 : 0)}>
                        <BiBell className="text-xl" />
                    </div>
                    <div className="w-9 h-9 flex justify-center items-center rounded-full bg-[#edf3fa] dark:bg-slate-900" onClick={() => handleOpen(isOpen === 0 || isOpen === 1 ? 2 : 0)}>
                        <RiChat3Line className="text-xl" />
                    </div>
                </div>

                {isOpen === 1 &&
                    <Popup isOpen={isOpen === 1} handleClose={() => setIsOpen(0)}>
                        <div className="bg-white dark:bg-slate-800 rounded-lg w-[300px]">
                            <h1 className="text-xl font-medium px-4 py-2 border-b border-gray-200 dark:border-slate-600">Tenant Request</h1>
                            <div className="max-h-32 overflow-y-auto">
                                <div className="divide-y divide-gray-200 dark:divide-slate-600">
                                    {[1, 2, 3, 4, 5].map((notif) => (
                                        <div key={notif} className="flex items-center px-4 py-3 space-x-4 hover:bg-gray-100 dark:hover:bg-slate-700">
                                            <div className="bg-blue-500 rounded-full w-8 h-8 flex justify-center items-center text-white">
                                                <BiBell className="text-xl" />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-lg font-medium">Notif {notif}</p>
                                                <p className="text-gray-500 dark:text-gray-400">Deskripsi notif {notif}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Popup>
                }

                {isOpen === 2 &&
                    <Popup isOpen={isOpen === 2} handleClose={() => setIsOpen(0)}>
                        <div className="bg-white dark:bg-slate-800 rounded-lg w-[300px]">
                            <h1 className="text-xl font-medium px-4 py-2 border-b border-gray-200 dark:border-slate-600">Mail</h1>
                            <div className="max-h-32 overflow-y-auto">
                                <div className="divide-y divide-gray-200 dark:divide-slate-600">
                                    {[1, 2, 3, 4, 5].map((mail) => (
                                        <div key={mail} className="flex items-center px-4 py-3 space-x-4 hover:bg-gray-100 dark:hover:bg-slate-700">
                                            <div className="bg-blue-500 rounded-full w-8 h-8 flex justify-center items-center text-white">
                                                <BiMailSend className="text-xl" />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-lg font-medium">Mail {mail}</p>
                                                <p className="text-gray-500 dark:text-gray-400">Deskripsi Mail {mail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Popup>
                }

                <div className="flex flex-col items-end mt-2">
                    <h1 className="text-nowrap font-medium">{userData.name}</h1>
                    <p className="text-gray-500">{userData.roles}</p>
                </div>
                <div className="block">
                    {userData.image ? 
                        <Image src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-[40px] h-[40px] bg-slate-200 rounded-full" width={40} height={40} /> 
                        : <p className="animate-pulse">Loading...</p>
                    }
                </div>
            </div>
        </nav>
    );
}

export default dynamic(() => Promise.resolve(AdminNavbar));
