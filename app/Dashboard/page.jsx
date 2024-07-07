'use client'

import axios from "axios"
import { useState, useEffect, useRef, createContext, useMemo, use } from "react"
import { Suspense } from "react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import dynamic from "next/dynamic"

// Components
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

// Dashboard Content
const Performance = dynamic(() => import('@/components/Dashboard-content/Performance'))
import Metrics from "@/components/Dashboard-content/Metrics"
import History from "@/components/Dashboard-content/History"
import Setting from "@/components/Dashboard-content/Setting"
import PerformenceNavLoading from "@/components/Loading/PerformenceNavLoading"

export const SidebarContext = createContext()
// export const campaignIDContext = createContext()

function Dashboard() {

    // expanse card start
    const Card = useRef(null)
    const router = useRouter()
    const [campaignID, setCampaignID] = useState('');
    const [name, setName] = useState('');
    const [platform, setPlatform] = useState('');
    const [SidebarHide, setSidebarHide] = useState(false)
    const sidebarContext = (() => ({
        SidebarHide,
        setSidebarHide,
        campaignID,
        setCampaignID,
        name,
        setName
    }), [SidebarHide, setSidebarHide])

    useEffect(() => {
      const handleResize = () => {
        // setWidth(window.innerWidth);
        if (window.innerWidth > 1420) {
          if (SidebarHide) {
            Card.current.classList.add('w-full');
          } else {
            Card.current.classList.remove('w-full');
          }
        } else {
          Card.current.classList.add('w-full');
        }
      };
  
      // Initial call and event listener setup
      handleResize();
      window.addEventListener('resize', handleResize);
  
      // Cleanup on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [SidebarHide]);
    // expnase card end

    const handleCampaignIDChange = (id, name, platform) => {
        setCampaignID(id);
        setName(name);
        setPlatform(platform);
    };

    // Dashborad Change Content Start
    const [activeContent, setActiveContent] = useState("performance")
    // Dashborad Change Content End

    // Dashboard Link active start
    function SetActiveLink(Link){
        document.querySelector(".dashboardActive").classList?.remove("dashboardActive");
        document.getElementById(Link).classList?.add("dashboardActive");
        setActiveContent(Link)
    }
    // Dashboard Link active end

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
        Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
            router.back();
        });
        }
    }, [router]);

    return (
        <>
        {/* Header */}
        
        <SidebarContext.Provider value={sidebarContext}>
            <Navbar />
            <Sidebar onCampaignIDChange={handleCampaignIDChange}/>
        </SidebarContext.Provider>

        {/* Dashboard Container */}
        <div className="flex w-full min-h-full justify-end items-center bg-gray-100">
            {/* Dashboard Card */}
            <div className="w-[75%] min-h-screen bg-white rounded-xl mt-[100px] md:me-3 ms-5 text-black transition-transform" ref={Card}>
                {/* header */}
                <div className="m-10">
                    {campaignID === '' ? (
                        <PerformenceNavLoading/>
                    ) : (
                        <div className="flex gap-3 items-center md:flex-row flex-col">
                            <img src={`../assets/${platform == 1 ? 'meta.svg' : platform == 2 ? 'google.svg' : platform == 3 ? 'tiktok.svg' : null}`} className="w-[50px]" alt="" />
                            <p className="text-2xl font-semibold">{name}</p>
                        </div>  
                    )}  

                    {/* Dashboard Nav Link */}
                    <div className="md:flex hidden gap-7 mt-5 border-b-2 border-gray-300">
                        <style jsx>
                            {
                                `
                                .dashboardActive{
                                    color : blue;
                                    padding-bottom: 10px;
                                    border-bottom: 3px solid blue;
                                    font-weight: 800;
                                    transition: background-color 0.5s, color 0.5s;
                                }
                                .DashboardLink:hover{
                                    cursor: pointer;
                                }
                                `
                            }
                        </style>
                        <p className="dashboardActive DashboardLink font-semibold text-gray-300 text-[15px]" id="performance" onClick={() => SetActiveLink("performance")}>Performance</p>
                        <p className="DashboardLink font-semibold text-gray-300 text-[15px]" id="metrics" onClick={() => SetActiveLink("metrics")}>Metrics</p>
                        <p className="DashboardLink font-semibold text-gray-300 text-[15px]" id="history" onClick={() => SetActiveLink("history")}>History</p>
                        <p className="DashboardLink font-semibold text-gray-300 text-[15px]" id="setting" onClick={() => SetActiveLink("setting")}>Setting</p>
                    </div>
                </div>

                {/* Nav Select */}
                <div className="flex md:hidden justify-end m-10">
                    <select className="border w-full border-gray-300 rounded-md shadow-sm p-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={(e) => SetActiveLink(e.target.value)}>
                        <option value="performance">Performance</option>
                        <option value="metrics">Metrics</option>
                        <option value="history">History</option>
                        <option value="setting">Setting</option>
                    </select>
                </div>

                {/* Content */}
                <div className="m-10">
                    {activeContent === "performance" && <Performance key={campaignID} id={campaignID}/>}
                    {activeContent === "metrics" && <Metrics key={campaignID} id={campaignID}/>}
                    {activeContent === "history" && <History key={campaignID} id={campaignID}/>}
                    {activeContent === "setting" && <Setting key={campaignID} id={campaignID}/>}
                </div>
            </div>
        </div>
        </>
    )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
