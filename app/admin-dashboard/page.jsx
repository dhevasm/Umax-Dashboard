import axios from "axios";
import { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";

const AdminNavbar = dynamic(() => import("@/components/Admin-component/AdminNavbar"));
const AdminSidebar = dynamic(() => import("@/components/Admin-component/AdminSidebar"));
const TenantTable = dynamic(() => import("@/components/Admin-component/TenantTable"));
const UserTable = dynamic(() => import("@/components/Admin-component/UserTable"));
const CampaignTable = dynamic(() => import("@/components/Admin-component/CampaignTable"));
const TenantProfile = dynamic(() => import("@/components/Admin-component/TenantProfile"));
const AccountTable = dynamic(() => import("@/components/Admin-component/AccountTable"));
const ClientTable = dynamic(() => import("@/components/Admin-component/ClientTable"));
const Dashboard = dynamic(() => import("@/components/Admin-component/Dashboard"));

export const AdminDashboardContext = createContext();

function AdminDashboard() {
    const router = useRouter();

    const [userData, setUserData] = useState([]);
    const [tenantsCount, setTenantsCount] = useState("");
    const [usersCount, setUsersCount] = useState("");
    const [campaignsCount, setCampaignsCount] = useState("");
    const [clientCount, setClientCount] = useState("");
    const [sidebarHide, setSidebarHide] = useState(false);
    const [updateCard, setUpdateCard] = useState(false);
    const [dataDashboard, setDataDashboard] = useState({
        tenants: "",
        users: "",
        campaigns: "",
        clients: ""
    });
    const [changeTable, setChangeTable] = useState("campaigns");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const role = localStorage.getItem('roles');

                if (!token || (role !== 'admin' && role !== 'sadmin')) {
                    throw new Error('Unauthorized');
                }

                // Fetch user data
                const userResponse = await axios.get('https://umaxxnew-1-d6861606.deta.app/user-by-id', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(userResponse.data.Data[0]);

                // Fetch counts
                if (userData.roles === 'sadmin') {
                    const tenantsResponse = await axios.get('https://umaxxnew-1-d6861606.deta.app/tenant-get-all', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setTenantsCount(tenantsResponse.data.Data.length);
                }

                const usersResponse = await axios.get('https://umaxxnew-1-d6861606.deta.app/user-by-tenant', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsersCount(usersResponse.data.Data.length);

                const campaignsResponse = await axios.get('https://umaxxnew-1-d6861606.deta.app/campaign-by-tenant', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCampaignsCount(campaignsResponse.data.Data.length);

                const clientsResponse = await axios.get('https://umaxxnew-1-d6861606.deta.app/client-by-tenant', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setClientCount(clientsResponse.data.Data.length);

                // Set data for dashboard
                setDataDashboard({
                    tenants: tenantsCount,
                    users: usersCount,
                    campaigns: campaignsCount,
                    clients: clientCount
                });
            } catch (error) {
                Swal.fire('Error', 'Failed to fetch data', 'error');
                router.push('/');
            }
        };

        fetchData();
    }, [router]);

    return (
        <AdminDashboardContext.Provider value={{
            sidebarHide,
            setSidebarHide,
            updateCard,
            setUpdateCard,
            changeTable,
            setChangeTable,
            userData,
            dataDashboard
        }}>
            <AdminNavbar userData={userData} />
            <AdminSidebar />
            <div className="flex w-full min-h-full justify-end bg-[#f1f5f9]">
                <div className={`w-full ${sidebarHide ? 'md:w-full' : 'md:w-[calc(100%-300px)]'} mt-[85px] p-8`}>
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
    );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
