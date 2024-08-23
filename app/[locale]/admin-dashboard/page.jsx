'use client'
import { useState, useEffect, useCallback, createContext, useRef } from "react"
import axios from "axios"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

// Dynamically import components
const AdminNavbar = dynamic(() => import("@/components/Admin-components/AdminNavbar"))
const AdminSidebar = dynamic(() => import("@/components/Admin-components/AdminSidebar"))
const TenantTable = dynamic(() => import("@/components/Admin-components/Tables/TenantTable"))
const UserTable = dynamic(() => import("@/components/Admin-components/Tables/UserTable"))
const CampaignTable = dynamic(() => import("@/components/Admin-components/Tables/CampaignTable"))
const TenantProfile = dynamic(() => import("@/components/Admin-components/TenantProfile"))
const AccountTable = dynamic(() => import("@/components/Admin-components/Tables/AccountTable"))
const ClientTable = dynamic(() => import("@/components/Admin-components/Tables/ClientTable"))
const Dashboard = dynamic(() => import("@/components/Admin-components/Dashboard"))

export const AdminDashboardContext = createContext()

function AdminDashboard() {
    const router = useRouter()
    const [userData, setUserData] = useState([])
    const [tenantsCount, setTenantsCount] = useState("")
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [navbarBrandHide, setNavbarBrandHide] = useState(false)
    const [sidebarHide, setSidebarHide] = useState(false)
    const [updateCard, setUpdateCard] = useState(false)
    const [dataDashboard, setDataDashboard] = useState({
        tenants: "",
        users: "",
        campaigns: "",
        clients: ""
    }) 
    const [changeTable, setChangeTable] = useState("dashboard")

    useEffect(() => {
        if (window.innerWidth <= 640) {
            setSidebarHide(true)
            setNavbarBrandHide(true)
        }
    }, [changeTable])
    
    const AdminDashboardContextValue = {
        tenantsCount,
        setTenantsCount,
        sidebarHide,
        setSidebarHide,
        updateCard,
        setUpdateCard,
        changeTable,
        setChangeTable,
        userData,
        dataDashboard,
        isDarkMode,
        setIsDarkMode,
        navbarBrandHide,
        setNavbarBrandHide,
    }

    useEffect(() => {
        if(localStorage.getItem('color-theme') === "dark" || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)){
            setIsDarkMode(true)
        } else {
            setIsDarkMode(false)
        }
    }, [])

    const getUserData = useCallback(async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-by-id`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setUserData(response.data.Data[0])
    }, [])

    useEffect(() => {
        if (userData.roles === 'sadmin') {
            const fetchTenantsCount = async () => {
                const getTenants = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tenant-get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    }
                })
                setTenantsCount(getTenants.data.Data.length)
            }
            fetchTenantsCount()
        }
    }, [userData.roles])

    useEffect(() => {
        getUserData()
    }, [getUserData])

    const MainCard = useRef(null)

    useEffect(() => {
        if (typeof window !== "undefined" && updateCard) {
            setUpdateCard(false)
        }
    }, [updateCard])

    function isTokenExpired(token) {
        // Decode the token (base64)
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Dapatkan timestamp saat ini
        const currentTime = Math.floor(Date.now() / 1000);
    
        // Cek apakah token sudah expired
        return payload.exp < currentTime;
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('jwtToken')
            const role = localStorage.getItem('roles')
            if (!token) {
                Swal.fire('Authentication failed', 'You Must Login First', 'error').then(() => {
                    router.push('/en/login')
                })
            } else if (role !== 'admin' && role !== 'sadmin') {
                Swal.fire('Authorization failed', 'Request Denied', 'error').then(() => {
                    router.push(`/${localStorage.getItem('lang')}/dashboard`)
                })
            } else if(isTokenExpired(token)) {
                Swal.fire('Authentication failed', 'Token Expired', 'error').then(() => {
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('tenantId');
                    localStorage.removeItem('roles');
                    localStorage.removeItem('name');
                    localStorage.removeItem('lang');
                    router.push('/en/login')
                })
            }
        }
    }, [router]);

    return(
        <>
            <AdminDashboardContext.Provider value={AdminDashboardContextValue}>
                <AdminNavbar userData={userData}/>
                <AdminSidebar />
                {/* main content */}
                <div className="flex w-full min-h-[100vh] justify-end bg-[#f1f5f9] dark:bg-slate-900">
                    <div className={`w-full ${sidebarHide ? 'md:w-full' : 'md:w-[calc(100%-300px)]'} mt-[85px] p-4 md:p-8`} ref={MainCard}>
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
