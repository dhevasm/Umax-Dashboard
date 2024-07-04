'use client'

import { useState, useRef, useEffect, useContext } from "react"
import { SidebarContext } from "@/app/dashboard/page"
import SidebarCard from "./Card/SidebarCard"

export default function Sidebar(){

    const sidebar = useRef(null)
    const [sidebarHide, setSidebarHide] = useContext(SidebarContext)

    // Sidebar Hide Handle start
    function hideHandle(){
        sidebar.current.classList.toggle("-translate-x-full")
        setSidebarHide(!sidebarHide)
    }
    // Sidebar Hide Handle end

    // Sidebar Link active start
    function SetActiveLink(Link){
        document.querySelector(".SidebarFilterActive").classList?.remove("SidebarFilterActive");
        document.getElementById(Link).classList?.add("SidebarFilterActive");
    }
    // Sidebar Link active end


    return (   
        <>
        {/* Sidebar */}
            <div className="fixed mt-20 m-3 left-0 w-[300px] h-screen bg-white rounded-lg flex flex-col items-center px-3 z-10 transition-transform shadow-md" ref={sidebar}>
                {/* Campaing Status Filter */}
                <div className="m-3 mt-5 px-3 w-full bg-gray-300 p-1 rounded-lg flex justify-between items-center text-md hover:cursor-pointer font-bold">
                    <style jsx>
                        {
                            `.SidebarFilterActive{
                                background-color: blue;
                                padding: 5px 10px;
                                border-radius: 10px;
                                color: white;
                            }`
                        }
                    </style>
                    <p className="SidebarFilterActive" id="all" onClick={() => SetActiveLink("all")}>All</p>
                    <p id="draft" onClick={() => SetActiveLink("draft")}>Draft</p>
                    <p id="active" onClick={() => SetActiveLink("active")}>Active</p>
                    <p id="complete" onClick={() => SetActiveLink("complete")}>Complete</p>
                </div>

                {/* Search Bar */}
                <div>
                    <input className="text-black m-2 p-2 rounded-lg border border-gray-300" type="text" placeholder="Search" />
                </div>
                
                {/* Campaign Cards */}
                <div className="w-full overflow-y-auto">
                    {/* Campaing Card */}
                    <SidebarCard platform="Facebook" name="Campaign 1" status="active" amountspend="$1000" reach="1000" startdate="10/10/2022"/>
                    <SidebarCard platform="Tiktok" name="Campaign 2" status="complete" amountspend="$1000" reach="1000" startdate="10/10/2022"/>
                </div>
                {/* Sidebar Hide Button */}
                <button onClick={hideHandle} className="absolute top-10 -right-10 -z-10 bg-green-400 rounded-e-full w-10 h-10 text-center hover:cursor-pointer">
                    <h1>X</h1>
                </button>
            </div>
        </>
    )
}