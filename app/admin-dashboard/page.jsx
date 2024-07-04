'use client'
import axios from "axios"
import { useState,useEffect } from "react"

import AdminNavbar from "@/components/Admin-component/AdminNavbar"
import AdminSidebar from "@/components/Admin-component/AdminSidebar"
import CountCard from "@/components/Admin-component/CountCard"

export default function AdminDashboard(){

    const [userData, setUserData] = useState([])

    const [tenantsCount, setTenantsCount] = useState ("")
    const [usersCount, setUsersCount] = useState("")
    const [campaignsCount, setCampaignsCount] = useState("")
    

    async function getUserData(){
        const response = await axios.get('https://umaxxnew-1-d6861606.deta.app/user-by-id', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setUserData(response.data.Data[0])
    }

    async function getAllData(){
        const getTenants = await axios.get('https://umaxxnew-1-d6861606.deta.app/tenant-get-all', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setTenantsCount(getTenants.data.Data.length)
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

    useEffect(() => {
        getUserData()
        getAllData()
    }, [])

    return(
        <>
            <AdminNavbar userData={userData}/>
            <AdminSidebar/>
            
            {/* main content */}
            <div className="w-full h-full flex justify-end">
                <div className="w-[75%] mt-20 border border-gray-300 rounded-md p-5 me-5 shadow-xl">
                    <div className="flex flex-wrap justify-evenly">
                        <CountCard color="blue" title="Total Tenants" value={tenantsCount ? tenantsCount : <div>Loading....</div>}/>    
                        <CountCard color="green" title="Users" value={usersCount ? usersCount : "Loading..."}/>    
                        <CountCard color="yellow" title="Campaign" value={campaignsCount ? campaignsCount : "Loading..."}/>    
                    </div>
                </div>
            </div>
        </>
    )
}