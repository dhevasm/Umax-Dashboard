'use client'
import { IconContext } from "react-icons"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import UserInfoLoading from "./Loading/UserInfoLoading";


export default function Navbar() {
    
    const pathName = usePathname()
    const router = useRouter();
    const [activeLink, setActiveLink] = useState(pathName);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [image, setImage] = useState('')
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app'

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${umaxUrl}/user-by-id`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
            });
            response.data.Data.map(item => {
                setName(item.name)
                setEmail(item.email)
                setRole(item.roles)
                setImage(item.image)
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleClick = (link) => {
        setActiveLink(link);
        router.push(link);
    };

    function handleLogout(){
        localStorage.removeItem('jwtToken');
        router.push('/');
    }

    function ProfileDropdown({ name, email, role, image }) {
        const handleLogout = () => {
            localStorage.removeItem('jwtToken');
            window.location.href = '/';
        };
    
        return (
            <div className="text-black me-5 hover:cursor-pointer relative">
                <div className="flex items-center">
                    <img src={`data:image/png;base64, ${image}`} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                    <h1 onClick={(e) => {
                            document.querySelector(".profile-dropdown").classList.toggle("hidden");
                            e.stopPropagation();
                        }} className="flex flex-col">
                        <div className="text-sm font-medium">{name} <span className="text-blue-500">▼</span></div>
                        <div className="text-xs text-gray-500">{role}</div>
                    </h1>
                </div>
                <div className="profile-dropdown hidden absolute z-10 mt-3 -right-7 p-3 bg-white border border-gray-100 shadow-md w-48 transition-all duration-3000">
                    <div className="flex flex-col mb-2">
                        <p className="font-semibold text-[12px]">{name}</p>
                        <p className="from-neutral-300 text-[12px]">{email}</p>
                    </div>
                    <div className="border-t border-gray-300"></div>
                    <Link href="/profile" className="block px-2 py-1 text-[12px] text-black">Profile</Link>
                    <a href="/users" className="block px-2 py-1 text-[12px] text-black">Users</a>
                    <a href="/settings" className="block px-2 py-1 text-[12px] text-black">Settings</a>
                    <div className="border-t border-gray-300"></div>
                    <a onClick={handleLogout} className="block px-2 py-1 text-[12px] mt-2 cursor-pointer">Logout</a>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full p-3 bg-white shadow-lg">
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
                            }
                            }>
                                N
                            </h1>
                        <div className="notif-dropdown flex hidden absolute z-10 mt-2 p-5 right-5 bg-white rounded-lg shadow-lg flex-col gap-3 w-[200px]">
                            <a href="/">Notification 1</a>
                            <a href="/">Notification 3</a>
                            <a href="/">Notification 3</a>
                        </div>  
                    </div>
                    </div>
                        {name == '' ? 
                        <>
                            <UserInfoLoading />
                        </>
                        : 
                        <ProfileDropdown name={name} email={email} role={role} image={image}/>
                        }
                    </div>
                </div>
            </nav>
        </>
    )
}

