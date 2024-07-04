'use client'
import { IconContext } from "react-icons"

export default function Navbar() {

    // Active Link start
    function SetActiveLink(Link){
        document.querySelector(".ActiveLink").classList?.remove("ActiveLink");
        document.getElementById(Link).classList?.add("ActiveLink");
    }
    // Active Link end

    return (
        <>
        {/* Navbar */}
            <nav className="fixed top-0 z-50 w-screen p-3 bg-white shadow-lg">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <img src="assets/logo.png" alt="Logo" className="ms-5"/>

                    {/* Nav Links */}
                    <div>
                        <ul className="hidden md:flex text-black gap-5">
                            <style jsx>
                                {
                                    `
                                    .ActiveLink{
                                        background-color: blue;
                                        padding: 5px 10px;
                                        border-radius: 10px;
                                        color: white;
                                    }
                                    ul li:hover{
                                        cursor:pointer;
                                    }
                                    `
                                }
                            </style>
                            <li className="ActiveLink" id="dashboard" onClick={() => SetActiveLink("dashboard")}>Dashboard</li>
                            <li id="campaign" onClick={() => SetActiveLink("campaign")}>Campaigns</li>
                            <li id="account" onClick={() => SetActiveLink("account")}>Accounts</li>
                            <li id="clients" onClick={() => SetActiveLink("clients")}>Clients</li>
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
                                H
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
                            <a href="/profile">Profile</a>
                            <a href="/profile">User</a>
                            <a href="/settings">Tenant</a>
                            <div className="border border-gray-300"></div>
                            <a href="/logout">Logout</a>
                        </div>
                    </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

