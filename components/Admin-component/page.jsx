'use client'
import axios from "axios"
import { useState,useEffect, createContext, useRef } from "react"

import AdminNavbar from "@/components/Admin-component/AdminNavbar"
import AdminSidebar from "@/components/Admin-component/AdminSidebar"
import CountCard from "@/components/Admin-component/CountCard"
import TenantTable from "@/components/Admin-component/Table/TenantTable"
import { Main } from "next/document"

export const SidebarContext = createContext()
export const UpdateCardContext = createContext()
export default function AdminDashboard(){

    const [userData, setUserData] = useState([])

    const [tenantsCount, setTenantsCount] = useState ("")
    const [usersCount, setUsersCount] = useState("")
    const [campaignsCount, setCampaignsCount] = useState("")

    const [sidebarHide, setSidebarHide] = useState(false)
    const [updateCard, setUpdateCard] = useState(false)

    const sidebarContext = (() => ({
        sidebarHide,
        setSidebarHide
    }), [sidebarHide, setSidebarHide])

    const updateCardContext = (() => ({
        updateCard,
        setUpdateCard
    }), [updateCard, setUpdateCard])

    async function getUserData(){
        const response = await axios.get('https://umaxxnew-1-d6861606.deta.app/user-by-id', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setUserData(response.data.Data[0])
    }

    async function getUserCampaignCount(){
        const getUsers = await axios.get('https://umaxxnew-1-d6861606.deta.app/user-by-tenant', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setUsersCount(getUsers.data.Data.length)
        const getCampaigns = await axios.get('https://umaxxnew-1-d6861606.deta.app/campaign-by-tenant', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setCampaignsCount(getCampaigns.data.Data.length)
    }

    async function getTenantsCount(){
        const getTenants = await axios.get('https://umaxxnew-1-d6861606.deta.app/tenant-get-all', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setTenantsCount(getTenants.data.Data.length)
    }

    useEffect(() => {
        getUserData()
        getUserCampaignCount()
    }, [])

    const MainCard = useRef(null)
    
    useEffect(() => {
        MainCard.current.classList.toggle("w-full")
    }, [sidebarHide])

    useEffect(() => {
        if(updateCard){
            getTenantsCount()
            getUserCampaignCount()
            setUpdateCard(false)
        }
    }, [updateCard])

    return(
        <>
            <SidebarContext.Provider value={sidebarContext}>
                <AdminNavbar userData={userData}/>
                <AdminSidebar/>
            </SidebarContext.Provider>
                
            {/* main content */}
            <UpdateCardContext.Provider value={updateCardContext}>
            <div className="w-full h-full flex justify-end px-5">
                <div className="w-[75%] mt-20 border border-gray-300 rounded-md p-5 shadow-xl transition-transform" ref={MainCard}>
                    <div className="flex flex-wrap justify-evenly">
                        {
                            userData.roles == 'sadmin' ?
                                getTenantsCount() &&
                                <CountCard color="blue" title="Total Tenants" value={tenantsCount ? tenantsCount : <div className="animate-pulse">Loading....</div>}/>
                                :
                                <CountCard color="blue" title="Company" value={userData.company_name ? <div className="text-center text-xl">{userData.company_name}</div> : <div className="animate-pulse">Loading....</div>}/>
                        }
                        <CountCard color="green" title="Total Users" value={usersCount ? usersCount : <div className="animate-pulse">Loading....</div>}/>    
                        <CountCard color="yellow" title="Total Campaigns" value={campaignsCount ? campaignsCount : <div className="animate-pulse">Loading....</div>}/>    
                    </div>
                    <div>
                        <TenantTable/>
                    </div>
                </div>
            </div>
            </UpdateCardContext.Provider>
        </>
    )
}