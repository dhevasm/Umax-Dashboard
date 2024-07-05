'use client'

import { useState, useRef, useEffect, useContext, Suspense } from "react"
import { SidebarContext } from "@/app/dashboard/page"
import SidebarCard from "./Card/SidebarCard"
import axios from "axios"
import SidebarLoading from "./Loading/SidebarLoading"
import { FaSearch } from 'react-icons/fa';

export default function Sidebar({ onCampaignIDChange }){

    const [campaigns, setCampaigns] = useState([]);
    const sidebar = useRef(null)
    const [status, setStatus] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarHide, setSidebarHide] = useContext(SidebarContext)
    const [campaignID, setCampaignID] = useContext(SidebarContext)
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

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

    // fetch Campaign
    const fetchMetrics = async () => {
        try {
            const response = await axios.get(`${umaxUrl}/metric-by-tenant-id?tenantId=${localStorage.getItem('tenantId')}&status=${status}`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            setCampaigns(response.data.Data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, [status]);

    const filteredCampaigns = campaigns.filter(campaign => {
        if (status === 0) {
            return campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return (
                campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                campaign.campaign_status === status
            );
        }
    });

    const handleClick = (newStatus, newLink) => {
        setStatus(newStatus);
        SetActiveLink(newLink);
    };

    return (   
        <>
        {/* Sidebar */}
            <div className="fixed mt-20 m-3 left-0 w-[300px] h-screen bg-white rounded-lg flex flex-col items-center px-3 z-10 transition-transform shadow-md md:pb-28" ref={sidebar}>
                {/* Campaing Status Filter */}
                <div className="m-3 mt-5 px-3 w-full bg-gray-200 p-2 rounded-full flex justify-between items-center text-md hover:cursor-pointer font-bold">
                    <style jsx>
                        {
                            `.SidebarFilterActive{
                                background-color: blue;
                                padding: 5px 10px;
                                border-radius: 50px;
                                color: white;
                                transition: background-color 0.3s, color 0.3s;
                            }

                            .SidebarFilterActive:hover{
                                cursor: pointer;
                                background-color: rgba(0, 0, 255, 0.1);
                                color: blue;
                            }`
                        }
                    </style>
                    <p className="SidebarFilterActive hover:bg-slate-500 text-gray-600" id="all" onClick={() => handleClick(0, 'all')}>All</p>
                    <p className="text-gray-600" id="draft" onClick={() => handleClick(2, 'draft')}>Draft</p>
                    <p className="text-gray-600" id="active" onClick={() => handleClick(1, 'active')}>Active</p>
                    <p className="text-gray-600" id="complete" onClick={() => handleClick(3, 'complete')}>Complete</p>
                </div>

                {/* Search Bar */}
                <div className="w-full flex items-center">
                    <div className="relative">
                        <input className="text-black m-1 p-2 pl-8 rounded-xl border w-full border-gray-300 focus:outline-blue-400" type="text" placeholder="Search" onChange={(event) => setSearchTerm(event.target.value)}/>
                        <div className="absolute left-3 top-4 text-gray-500">
                            <FaSearch className="h-4 w-4 text-[3px]" />
                        </div>
                    </div>
                </div>
                
                {/* Campaign Cards */}
                <div className="w-full overflow-y-auto">
                    {/* Campaing Card */}
                    <Suspense fallback={<SidebarLoading />}>
                    {filteredCampaigns.map((campaign, index) =>(
                        <>
                            <SidebarCard 
                                key={index}
                                platform={campaign.campaign_platform} 
                                name={campaign.campaign_name} 
                                status={campaign.campaign_status} 
                                amountspend={campaign.amountspent} 
                                reach={campaign.reach} 
                                startdate={campaign.start_date} 
                                id={campaign.campaign_id}
                                onCardClick={onCampaignIDChange}
                            />
                            {console.log(`Status ${campaign.status}`)}
                        </>
                    ))}
                    </Suspense>
                </div>
                {/* Sidebar Hide Button */}
                <button 
                    onClick={hideHandle} 
                    className="absolute top-10 -right-10 z-10 bg-blue-600 text-white rounded-r-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
                    aria-label="Close"
                    >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth="2" 
                        stroke="currentColor" 
                        className="w-6 h-6"
                    >
                        <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M6 18L18 6M6 6l12 12" 
                        />
                    </svg>
                </button>
            </div>
        </>
    )
}