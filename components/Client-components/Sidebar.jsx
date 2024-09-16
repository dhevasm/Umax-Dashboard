'use client'

import { useState, useRef, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import SidebarCard from "./Card/SidebarCard"
import axios from "axios"
import SidebarLoading from "./Loading/SidebarLoading"
import { FaSearch } from 'react-icons/fa';
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io"

export default function Sidebar({ onCampaignIDChange, sidebarHide, setSidebarHide }) {
    const [campaigns, setCampaigns] = useState([]);
    const sidebar = useRef(null);
    const [status, setStatus] = useState(0);
    const [hidden, setHidden] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const t = useTranslations('sidebar');
    const umaxUrl = process.env.NEXT_PUBLIC_API_URL;

    // Sidebar Hide Handle start
    function hideHandle() {
        setHidden(!hidden);
        sidebar.current.classList.toggle("-translate-x-full");
        setSidebarHide(!sidebarHide);
    }
    // Sidebar Hide Handle end

    // Sidebar Link active start
    function SetActiveLink(Link) {
        document.querySelector(".SidebarFilterActive").classList?.remove("SidebarFilterActive");
        document.getElementById(Link).classList?.add("SidebarFilterActive");
    }
    // Sidebar Link active end

    // fetch Campaign
    const fetchMetrics = useCallback(async () => {
        setIsLoading(true);
        const clientId = localStorage.getItem('clientId'); // Ambil clientId dari localStorage
        try {
            const response = await axios.get(`${umaxUrl}/metric-by-tenant-id?tenantId=${localStorage.getItem('tenantId')}&status=${status}`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
    
            // Filter data yang diambil berdasarkan clientId
            if(localStorage.getItem('roles') == "client"){
                const filteredCampaigns = response.data.Data.filter(campaign => campaign.client_id === clientId);
                setCampaigns(filteredCampaigns);
                setIsLoading(false);
            }else{
                setCampaigns(response.data.Data);
                setIsLoading(false);
            }

    
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }, [status, umaxUrl]);

    useEffect(() => {
        fetchMetrics()
    }, [fetchMetrics]);

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
            <div className="fixed mt-[100px] min-w-[300px] max-w-[340px] mb-3 me-3 md:ms-3 left-0 w-[300px] sm:w-[300px] md:w-[340px] lg:w-[340px] h-screen bg-white dark:bg-slate-800 rounded-xl flex flex-col items-center px-3 z-10 transition-transform shadow-md pb-28" ref={sidebar}>
                {/* Campaign Status Filter */}
                <div className="m-3 mt-5 px-4 md:px-5 mx-5 w-full bg-gray-200 dark:bg-slate-500 p-1 rounded-xl flex justify-between items-center text-md hover:cursor-pointer font-bold">
                    <style jsx>
                        {`
                        .SidebarFilterActive {
                            background-color: rgb(38, 100, 235);
                            padding: 5px 15px;
                            border-radius: 10px;
                            color: white;
                        }
                        .SidebarFilterActive:hover {
                            cursor: pointer;
                        }
                        `}
                    </style>
                    <p className="SidebarFilterActive text-gray-600 md:text-[17px] dark:text-slate-100" id="all" onClick={() => handleClick(0, 'all')}>
                        {t('all')}
                    </p>
                    <p className="text-gray-600 md:text-[17px] dark:text-slate-100" id="draft" onClick={() => handleClick(2, 'draft')}>
                        {t('draft')}
                    </p>
                    <p className="text-gray-600 md:text-[17px] dark:text-slate-100" id="active" onClick={() => handleClick(1, 'active')}>
                        {t('active')}
                    </p>
                    <p className="text-gray-600 md:text-[17px] dark:text-slate-100" id="complete" onClick={() => handleClick(3, 'complete')}>
                        {t('complete')}
                    </p>
                </div>
                {/* Search Bar */}
                <div className="w-full flex items-center">
                    <div className="relative w-full px-2 mb-2 flex justify-center">
                        <input className="text-black dark:bg-slate-700 dark:text-slate-100 m-1 p-2 pl-9 rounded-xl h-11 border border-gray-300 dark:border-slate-600 w-full focus:outline-none" type="text" placeholder={t('search')} onChange={(event) => setSearchTerm(event.target.value)} />
                        <div className="absolute left-6 top-4 text-gray-500 dark:text-slate-300">
                            <FaSearch className="h-4 w-4 text-[3px]" />
                        </div>
                    </div>
                </div>

                {/* Campaign Cards */}
                <div className="w-full overflow-y-auto">
                    {/* Campaign Card */}
                    {isLoading ? (
                        Array(3).fill(0).map((_, index) => (
                            <SidebarLoading key={index} />
                        ))
                    ) : filteredCampaigns.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                            {t('no-data')}
                        </div>
                    ) : (
                        filteredCampaigns.map((campaign, index) => (
                            <SidebarCard 
                                key={campaign.campaign_id} // Use campaign_id as the key
                                platform={campaign.campaign_platform} 
                                name={campaign.campaign_name} 
                                status={campaign.campaign_status} 
                                amountspend={campaign.amountspent}
                                atc={campaign.atc}
                                reach={campaign.reach} 
                                startdate={campaign.start_date} 
                                id={campaign.campaign_id}
                                onCardClick={onCampaignIDChange}
                                click={() => {
                                    if (window.innerWidth <= 768) {
                                        hideHandle();
                                    }
                                }}  
                            />
                        ))
                    )}
                </div>
                
                {/* Sidebar Hide Button */}
                <button 
                    onClick={hideHandle} 
                    className="absolute top-10 -right-10 z-10 bg-blue-600 text-white rounded-r-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-blue-700 hover:scale-105 transition-transform duration-300 dark:bg-blue-500 dark:hover:bg-blue-400"
                    aria-label="Close"
                >
                    {!hidden ? <IoIosArrowDropright className="h-6 w-6" /> : <IoIosArrowDropleft className="h-6 w-6" />}
                </button>
            </div>
        </>
    );
}
