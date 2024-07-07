'use client'
import axios from "axios"
import { useState,useEffect, createContext, useRef } from "react"

import AdminNavbar from "@/components/Admin-component/AdminNavbar"
import AdminSidebar from "@/components/Admin-component/AdminSidebar"
import CountCard from "@/components/Admin-component/CountCard"
import { Main } from "next/document"
import { navbar } from "@material-tailwind/react"
import TenantTable from "@/components/Admin-component/TenantTable"
import UserTable from "@/components/Admin-component/UserTable"
import CampaignTable from "@/components/Admin-component/CampaignTable"
import TenantProfile from "@/components/Admin-component/TenantProfile"
import AccountTable from "@/components/Admin-component/AccountTable"
import ClientTable from "@/components/Admin-component/ClientTable"

export const AdminDashboardContext = createContext()
export default function AdminDashboard(){

    const [userData, setUserData] = useState([])

    const [tenantsCount, setTenantsCount] = useState ("")
    const [usersCount, setUsersCount] = useState("")
    const [campaignsCount, setCampaignsCount] = useState("")

    const [sidebarHide, setSidebarHide] = useState(false)
    const [updateCard, setUpdateCard] = useState(false)
    const [changeTable, setChangeTable] = useState("tenants")

    const AdminDashboardContextValue = (() => {
        sidebarHide,
        setSidebarHide,
        updateCard,
        setUpdateCard,
        changeTable,
        setChangeTable,
        userData
    }, [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData])

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

    useEffect(() => {
        if(userData.roles == 'admin'){
            setChangeTable("company")   
        }
    }, [userData])

    const MainCard = useRef(null)
    
    useEffect(() => {
        MainCard.current.classList.toggle("w-full")
        MainCard.current.classList.toggle("me-3")
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
            <AdminDashboardContext.Provider value={AdminDashboardContextValue}>
                    <AdminNavbar userData={userData}/>
                    <AdminSidebar />

            {/* main content */}
            <div className="flex w-full min-h-full justify-end px-3  bg-gray-100">
                <div className="w-[75%] mt-20 rounded-md p-5 me-3 shadow-xl bg-white" ref={MainCard}>
                    <div className="flex flex-wrap justify-evenly">
                        {
                            userData.roles == 'sadmin' ?
                                getTenantsCount() &&
                                <CountCard color="blue" handleClick="tenants" title="Total Tenants" value={tenantsCount ? tenantsCount : <div className="animate-pulse">Loading....</div>}/>
                                :
                                <CountCard color="blue" handleClick="company" title="Company" value={userData.company_name ? <div className="text-center text-xl">{userData.company_name}</div> : <div className="animate-pulse">Loading....</div>}/>
                        }       
                        <CountCard color="green" title="Total Users" handleClick="users" value={usersCount ? usersCount : <div className="animate-pulse">Loading....</div>}/>    
                        <CountCard color="yellow" title="Total Campaigns" handleClick="campaigns" value={campaignsCount ? campaignsCount : <div className="animate-pulse">Loading....</div>}/>    
                    </div>
                    <div>  
                       {userData.roles == 'sadmin' && changeTable == "tenants" && <TenantTable />}
                       {userData.roles == 'admin' && changeTable == "company" && <TenantProfile tenant_id={userData.tenant_id} />}
                       {changeTable == "users" && <UserTable/>}
                        {changeTable == "campaigns" && <CampaignTable/>}
                        {changeTable == "accounts" && <AccountTable/>}
                        {changeTable == "clients" && <ClientTable/>}
                    </div>
                </div>
            </div>
             </AdminDashboardContext.Provider>
        </>
    )
}