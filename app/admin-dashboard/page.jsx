'use client'
import axios from "axios"
import { useState,useEffect, createContext, useRef } from "react"

import AdminNavbar from "@/components/Admin-component/AdminNavbar"
import AdminSidebar from "@/components/Admin-component/AdminSidebar"
import CountCard from "@/components/Admin-component/CountCard"
import TenantTable from "@/components/Admin-component/TenantTable"
import UserTable from "@/components/Admin-component/UserTable"
import CampaignTable from "@/components/Admin-component/CampaignTable"
import TenantProfile from "@/components/Admin-component/TenantProfile"
import AccountTable from "@/components/Admin-component/AccountTable"
import ClientTable from "@/components/Admin-component/ClientTable"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export const AdminDashboardContext = createContext()
export default function AdminDashboard(){

    const router = useRouter()

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
        if(userData.roles == 'sadmin'){
            const getTenants = await axios.get('https://umaxxnew-1-d6861606.deta.app/tenant-get-all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
            setTenantsCount(getTenants.data.Data.length)
        }
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
            // MainCard.current.classList.toggle("")

    }, [sidebarHide])

    useEffect(() => {
        if(updateCard){
            getTenantsCount()
            getUserCampaignCount()
            setUpdateCard(false)
        }
    }, [updateCard])

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const role = localStorage.getItem('roles');
        if (!token) {
            Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
                router.push('/');
            });
        } else if (role !== 'admin' && role !== 'sadmin') {
            Swal.fire('Request Denied', 'Nice Try!', 'error').then(() => {
                router.push('/dashboard');
            });
        }
    }, [router]);

    return(
        <>
            <AdminDashboardContext.Provider value={AdminDashboardContextValue}>
                    <AdminNavbar userData={userData}/>
                    <AdminSidebar />

            {/* main content */}

            <div className="flex w-full min-h-full justify-end  bg-gray-100">
                <div className={`${sidebarHide ? 'w-full' : 'w-[calc(100%-300px)]'} bg-red-200 mt-[85px] p-5`} ref={MainCard}>

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