'use client'
import axios from "axios"
import { useState,useEffect, createContext, useRef } from "react"

import dynamic from "next/dynamic"
const AdminNavbar = dynamic(() => import("@/components/Admin-component/AdminNavbar"), {ssr: false})
const AdminSidebar = dynamic(() => import("@/components/Admin-component/AdminSidebar"), {ssr: false})
const TenantTable = dynamic(() => import("@/components/Admin-component/TenantTable"), {ssr: false})
const UserTable = dynamic(() => import("@/components/Admin-component/UserTable"), {ssr: false})
const CampaignTable = dynamic(() => import("@/components/Admin-component/CampaignTable"), {ssr: false})
const TenantProfile = dynamic(() => import("@/components/Admin-component/TenantProfile"), {ssr: false})
const AccountTable = dynamic(() => import("@/components/Admin-component/AccountTable"), {ssr: false})
const ClientTable = dynamic(() => import("@/components/Admin-component/ClientTable"), {ssr: false})
const Dashboard = dynamic(() => import("@/components/Admin-component/Dashboard"), {ssr: false})
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export const AdminDashboardContext = createContext()
function Page(){

    const router = useRouter()

    const [userData, setUserData] = useState([])

    const [tenantsCount, setTenantsCount] = useState ("")
    const [usersCount, setUsersCount] = useState("")
    const [campaignsCount, setCampaignsCount] = useState("")
    const [clientCount, setClientCount] = useState("")

    const [sidebarHide, setSidebarHide] = useState(false)
    const [updateCard, setUpdateCard] = useState(false)

    const [dataDashboard, setDataDashboard] = useState({
        tenants: "",
        users: "",
        campaigns: "",
        clients: ""
    })
    const [changeTable, setChangeTable] = useState("campaigns")


    const AdminDashboardContextValue = (() => {
        sidebarHide,
        setSidebarHide,
        updateCard,
        setUpdateCard,
        changeTable,
        setChangeTable,
        userData,
        dataDashboard
    }, [sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData, dataDashboard])

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
        const getClient = await axios.get('https://umaxxnew-1-d6861606.deta.app/client-by-tenant', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setClientCount(getClient.data.Data.length)
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
        setDataDashboard({
            tenants: tenantsCount,
            users: usersCount,
            campaigns: campaignsCount,
            clients: clientCount
        })
    },[clientCount, tenantsCount, campaignsCount, usersCount])

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

    if (typeof window !== "undefined" && updateCard) {
        getTenantsCount()
        getUserCampaignCount()
        setUpdateCard(false)
    }

    return(
        <>
            <AdminDashboardContext.Provider value={AdminDashboardContextValue}>
                    <AdminNavbar userData={userData}/>
                    <AdminSidebar />
            {/* main content */}



            <div className="flex w-full min-h-full justify-end bg-[#f1f5f9]">
                <div className={`w-full ${sidebarHide ? 'md:w-full' : 'md:w-[calc(100%-300px)]'} mt-[85px] p-8`} ref={MainCard}>

                    <div>  
                        {userData.roles == 'sadmin' && changeTable == "tenants" && <TenantTable />}
                        {userData.roles == 'admin' && changeTable == "company" && <TenantProfile tenant_id={userData.tenant_id} />}
                        {changeTable == "users" && <UserTable/>}
                        {changeTable == "campaigns" && <CampaignTable/>}
                        {changeTable == "accounts" && <AccountTable/>}
                        {changeTable == "clients" && <ClientTable/>}
                        {changeTable == "dashboard" && <Dashboard/>}
                    </div>
                </div>
            </div>
             </AdminDashboardContext.Provider>
        </>
    )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });
