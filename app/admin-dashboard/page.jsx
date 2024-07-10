'use client'
import { useState, useEffect, createContext, useRef } from "react"
import axios from "axios"

import dynamic from "next/dynamic"
const AdminNavbar = dynamic(() => import("@/components/Admin-component/AdminNavbar"))
const AdminSidebar = dynamic(() => import("@/components/Admin-component/AdminSidebar"))
const TenantTable = dynamic(() => import("@/components/Admin-component/TenantTable"))
const UserTable = dynamic(() => import("@/components/Admin-component/UserTable"))
const CampaignTable = dynamic(() => import("@/components/Admin-component/CampaignTable"))
const TenantProfile = dynamic(() => import("@/components/Admin-component/TenantProfile"))
const AccountTable = dynamic(() => import("@/components/Admin-component/AccountTable"))
const ClientTable = dynamic(() => import("@/components/Admin-component/ClientTable"))
const Dashboard = dynamic(() => import("@/components/Admin-component/Dashboard"))
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export const AdminDashboardContext = createContext()

function AdminDashboard() {
    const router = useRouter()

    const [userData, setUserData] = useState([])
    const [tenantsCount, setTenantsCount] = useState("")
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
    const [changeTable, setChangeTable] = useState("dashboard")

    const AdminDashboardContextValue = {
        sidebarHide,
        setSidebarHide,
        updateCard,
        setUpdateCard,
        changeTable,
        setChangeTable,
        userData,
        dataDashboard
    }

    async function getUserData() {
        const response = await axios.get('https://umaxxnew-1-d6861606.deta.app/user-by-id', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setUserData(response.data.Data[0])
    }

    async function getUserCampaignCount() {
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

    async function getTenantsCount() {
        if (userData.roles === 'sadmin') {
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
        if (typeof window !== "undefined" && updateCard) {
            getTenantsCount()
            getUserCampaignCount()
            setUpdateCard(false)
        }
    }, [updateCard])

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('jwtToken')
            const role = localStorage.getItem('roles')
            if (!token) {
                Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
                    router.push('/')
                })
            } else if (role !== 'admin' && role !== 'sadmin') {
                Swal.fire('Request Denied', 'Nice Try!', 'error').then(() => {
                    router.push('/dashboard')
                })
            }
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



            <div className="flex w-full min-h-[100vh] justify-end bg-[#f1f5f9]">
                <div className={`w-full ${sidebarHide ? 'md:w-full' : 'md:w-[calc(100%-300px)]'} mt-[85px] p-8`} ref={MainCard}>
                    <div>
                        {userData.roles === 'sadmin' && changeTable === "tenants" && <TenantTable />}
                        {userData.roles === 'admin' && changeTable === "company" && <TenantProfile tenant_id={userData.tenant_id} />}
                        {changeTable === "users" && <UserTable />}
                        {changeTable === "campaigns" && <CampaignTable />}
                        {changeTable === "accounts" && <AccountTable />}
                        {changeTable === "clients" && <ClientTable />}
                        {changeTable === "dashboard" && <Dashboard />}
                    </div>
                </div>
            </div>
        </AdminDashboardContext.Provider>
    </>
    )
}
export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false })
