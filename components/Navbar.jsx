'use client'
import { IconContext } from "react-icons"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";


export default function Navbar() {
    
    const pathName = usePathname()
    const router = useRouter();
    const [activeLink, setActiveLink] = useState(pathName);

    console.log(pathName)

    const handleClick = (link) => {
        setActiveLink(link);
        router.push(link);
    };

    function handleLogout(){
        localStorage.removeItem('jwtToken');
        router.push('/');
    }

    return (
        <>
        {/* Navbar */}
            <nav className="fixed top-0 z-50 w-screen p-3 bg-white shadow-lg">
                <div className="flex justify-between items-center h-10">
                    {/* Logo */}
                    <img src="assets/logo.png" alt="Logo" className="ms-5 w-[100px]"/>

                    {/* Nav Links */}
                    <div>
                        <ul className="hidden md:flex p-2 text-black gap-5">
                            <style jsx>
                                {`
                                .active-link {
                                    background-color: blue;
                                    padding: 9px 16px;
                                    border-radius: 25px;
                                    color: white;
                                    transition: background-color 0.3s, color 0.3s;
                                }
                                ul li {
                                    padding: 9px 16px;
                                    border-radius: 25px;
                                    transition: background-color 0.3s, color 0.3s;
                                }
                                ul li:hover {
                                    cursor: pointer;
                                    background-color: rgba(0, 0, 255, 0.1);
                                    color: blue;
                                }
                                `}
                            </style>
                            <li className={`font-semibold ${activeLink === "/dashboard" ? "active-link" : ""}`} onClick={() => handleClick("/dashboard")}>
                                Dashboard
                            </li>
                            <li className={`font-semibold ${activeLink === "/campaigns" ? "active-link" : ""}`} onClick={() => handleClick("/campaigns")}>
                                Campaigns
                            </li>
                            <li className={`font-semibold ${activeLink === "/accounts" ? "active-link" : ""}`} onClick={() => handleClick("/accounts")}>
                                Accounts
                            </li>
                            <li className={`font-semibold ${activeLink === "/clients" ? "active-link" : ""}`} onClick={() => handleClick("/clients")}>
                                Clients
                            </li>
                        </ul>
                    </div>

                    {/* Profile */}
                    <div className="flex gap-3">
                        {/* Notification */}
                    <div>
                    <div className="text-black me-5 hover:cursor-pointer">
                            <h1 className="relative" onClick={(e) => {
                                document.querySelector(".notif-dropdown").classList.toggle("hidden");
                                e.stopPropagation();
                            }}>
                                N
                            </h1>
                        <div className="notif-dropdown flex hidden absolute z-10 mt-2 p-5 right-5 bg-white rounded-lg shadow-lg flex-col gap-3 w-[200px]">
                            <a href="/">Notification 1</a>
                            <a href="/">Notification 3</a>
                            <a href="/">Notification 3</a>
                        </div>  
                    </div>
                    </div>
                    <div className="text-black me-5 hover:cursor-pointer">
                            <h1 className="relative" onClick={(e) => {
                                document.querySelector(".profile-dropdown").classList.toggle("hidden");
                                e.stopPropagation();
                            }}>
                                Profile <span className="text-blue-500">▼</span>
                            </h1>
                        <div className="profile-dropdown flex hidden absolute z-10 mt-2 p-5 right-5 bg-white rounded-lg shadow-lg flex-col gap-3 w-[200px]">
                            <Link href="/profile">Profile</Link>
                            <a href="/users">User</a>
                            <a href="/settings">Tenant</a>
                            <div className="border border-gray-300"></div>
                            <a onClick={handleLogout}>Logout</a>
                        </div>
                    </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

