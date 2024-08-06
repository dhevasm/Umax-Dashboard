'use client'

import CountCard from "./CountCard"
import ChartOne from "./Charts/ChartOne"
import ChartTwo from "./Charts/ChartTwo"
import ChartThree from "./Charts/ChartThree"
import Map from "./Maps/Map"
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi"
import { useCallback, useContext } from "react"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import { useState, useEffect } from "react"
import LoadingCircle from "../Client-components/Loading/LoadingCircle"
import { useTranslations } from "next-intl"
import axios from "axios"
import Image from "next/image"
import { IconContext } from "react-icons"
import { RiAdvertisementFill, RiGoogleFill, RiGoogleLine, RiMetaLine, RiTiktokFill, RiTiktokLine } from "react-icons/ri"
import { reach } from "yup"
import { FaArrowUp, FaBuilding, FaCheck, FaTimes } from "react-icons/fa"
import { map } from "leaflet"
import Swal from "sweetalert2"

export default function Dashboard({ tenant_id }) {
    const t = useTranslations('admin-dashboard')
    const { userData, dataDashboard, tenantsCount } = useContext(AdminDashboardContext)
    const [campaigns, setCampaigns] = useState([])
    const [filter, setFilter] = useState("reach")
    const [chartData, setChartData] = useState([])
    const [requestlist, setRequestList] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const roles = localStorage.getItem('roles')
    const [isLoading, setLoading] = useState(false)

    const getCampaign = async() => {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/metric-by-tenant-id?tenantId=${localStorage.getItem('tenantId')}&status=${status}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            }).then((response) => {
                setCampaigns(response.data.Data);
            })
    }

    async function getRequestList(){
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request-list`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
        })
        setRequestList(res.data.Output)
        setRequestCount(res.data.Output.length)
    }

    useEffect(() => {
        setFilterCampaign("reach")
        getCampaign()
        if(roles == 'sadmin'){
            getRequestList()
        }
    }, [])

    useEffect(() => {
        setFilterCampaign(filter)
    }, [filter])

    const setFilterCampaign = useCallback((filterset) => {
        const sortedCampaigns = [...campaigns].sort((a, b) => {
            const getValue = (data, key) => parseInt(data[key].replace(/\./g, ''))
            switch (filterset) {
                case 'amountspent':
                    return getValue(b, 'amountspent') - getValue(a, 'amountspent')
                case 'reach':
                    return getValue(b, 'reach') - getValue(a, 'reach')
                case 'impressions':
                    return getValue(b, 'impressions') - getValue(a, 'impressions')
                default:
                    return 0
            }
        })
        setCampaigns(sortedCampaigns)
    }, [campaigns])

    const handleFilterChange = (value) => {
        setFilter(value)
    }

    function LoadingCircle() {
        return (
            <div className="flex justify-center items-center h-20">
                <div className="relative">
                    <div className="w-10 h-10 border-4 border-[#1C2434] dark:border-white rounded-full border-t-transparent dark:border-t-transparent animate-spin"></div>
                </div>
            </div>
        )
    }

    async function getChartData() { 
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chart-data`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        const data = res.data.Output
        setChartData(data)
        // console.log(data)
    }  

    useEffect(() => {
    getChartData()
    }, [])

    const handleReject = (request_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Reject it!"
          }).then(async(result) => {
            if (result.isConfirmed) {
                setLoading(true)
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/request-reject?request_id=${request_id}`,{
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                }).then((response) => {
                    if(!response.IsError){
                        Swal.fire({
                            icon: 'success',
                            title: 'Request Rejected',
                        }).then(() => {
                            getRequestList()
                            setLoading(false)
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.ErrorMessage,
                        }).then(() => {
                            setLoading(false)
                        })
                    }
                })
            }
          });

        
        
    }

    const createUser = async(datatenant, tenant_id, request_id) => {
        const formData = new FormData();
                formData.append('name', datatenant.username);
                formData.append('email', datatenant.email);
                formData.append('password', datatenant.password);
                formData.append('confirm_password', datatenant.password);
                formData.append('role', "admin");
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register?tenantId=${tenant_id}`, formData, {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    }
                }).then( async(res) => {
                    if (res.data.Output === "Registration Successfully") {
                        console.log("user register success")
                        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/request-reject?request_id=${request_id}`,{
                            headers: {
                                authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                            },
                        }).then((response) => {
                            if(!response.IsError){
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Request Successfully',
                                    text: 'Register new user & new tenant successfully',
                                }).then(() => {
                                    setLoading(false)
                                    getRequestList()
                                })
                            }else{
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: response.ErrorMessage,
                                })
                            }
                        })
                    }
                })
    }

    const getTenantID = async(datatenant, request_id) => {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tenant-get-all`,{
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
        }).then(async(response) => {
            if(!response.IsError){
                // console.log(response.data.Data)
                const data = response.data.Data
                const tenant_id = data.filter((tenant) => tenant.company === datatenant.company)[0]._id
                if(datatenant.subscription == true){
                    const formData = new FormData();
                    formData.append('subscription', true);
                    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tenant-subscription?tenantId=${tenant_id}`, 
                    formData
                        , {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                        }
                    })

                    if(response.data.IsError == false){
                        console.log("subscription success")
                    }else{
                        console.log("subscription failed")
                    }
                }
                // console.log(tenant_id)
                createUser(datatenant, tenant_id, request_id)
                }
            })
    }

    const createTenant = async(data, request_id) => {
        const formData = new FormData();
        console.log("creating company" + data.company)
        formData.append('company', data.company);
        formData.append('address', data.companyaddress);
        formData.append('email', data.companyemail);
        formData.append('contact', data.companycontact);
        formData.append('language', data.language);
        formData.append('culture', data.culture);
        formData.append('currency', data.currency);
        formData.append('input_timezone', data.timezone_name);
        formData.append('currency_position', data.currency_position);
        
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tenant-create`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })

        if(response.data.Output == "Registration Successfully"){
            console.log("tenant register success")
        }else{
            console.log("tenant register failed")
            return;
        }
        getTenantID(data, request_id)
    }

    const handleAccept = (request_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Accept it!"
          }).then( async(result) => {
            if (result.isConfirmed) {
                setLoading(true)
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request-accept?request_id=${request_id}`,{
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                }).then((response) => {
                    if(!response.IsError){
                        Swal.fire({
                            icon: 'info',
                            title: 'Please wait...',
                            text: 'Request is being processed',
                        }).then(() => {
                            createTenant(response.data.Data, request_id)
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.ErrorMessage,
                        }).then(() => {
                            setLoading(false)
                        })
                    }
                })
            }
          });
    }

    return (
        <>
            <div className="w-full h-full flex flex-wrap gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 w-full">
                    {userData.roles == "admin" ? <CountCard title={t('tenants')} value={userData.company_name ? userData.company_name : <div className="text-md animate-pulse">Loading...</div>} handleClick={"company"} /> :
                        userData.roles == "sadmin" ? <CountCard title={t('tenants')} value={tenantsCount ? tenantsCount : <div className="text-md animate-pulse">Loading...</div>} handleClick={"tenants"} /> :
                            <CountCard title={t('tenants')} value={<div className="text-md animate-pulse">Loading...</div>} />}
                            <CountCard title={t('users')} value={dataDashboard.users} handleClick={"users"} />
                            <CountCard title={t('campaigns')} value={dataDashboard.campaigns } handleClick={"campaigns"} />
                            <CountCard title={t('clients')} value={dataDashboard.clients } handleClick={"clients"} />
                </div>  
                <div className="w-full flex flex-col lg:flex-row gap-7 mb-3">
                    <div className="w-full lg:w-1/3 h-[450px] flex justify-center bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <ChartOne chartData={chartData} />
                    </div>
                    <div className="w-full flex justify-center lg:w-2/3 h-[200px] md:h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <ChartTwo chartData={chartData} />
                    </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-7 mb-3">
                    <div className="w-full flex justify-center lg:w-3/5 h-[300px] md:h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <Map/>
                    </div>
                    <div className="w-full flex justify-center lg:w-2/5 h-[370px] md:h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <ChartThree chartData={chartData} />
                    </div>
                </div>
            </div>
            {userData.roles === 'admin' ? (
                <div className="w-full h-fit flex flex-col gap-7 mb-3">
                    <div className="w-full h-fit bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5 overflow-x-auto">
                        <div className="rounded-sm bg-white dark:bg-slate-800 shadow-default sm:px-7.5 xl:pb-1">
                            <div className="flex justify-between items-center mb-5">
                                <h4 className="text-xl font-semibold text-black dark:text-slate-200">
                                    {t('top-5-campaigns')}
                                </h4>
                                <div className="flex gap-2">
                                    <style>
                                        {`
                                        .filterselect {
                                            background-color: #3d50e0;
                                            color: white;
                                        }
                                        `}
                                    </style>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-slate-200">
                                            <th className="p-2.5 xl:p-5 text-sm font-medium uppercase">{t('campaigns')}</th>
                                            <th className="p-2.5 text-center xl:p-5 text-sm font-medium uppercase">
                                                <span className={`hover:cursor-pointer ${filter == "amountspent" ? "text-blue-500" : ""}`} onClick={() => handlechangeFiilter("amountspent")}>
                                                    {t('amount-spent')}
                                                </span>
                                            </th>
                                            <th className="p-2.5 text-center xl:p-5 text-sm font-medium uppercase">
                                                <span className={`hover:cursor-pointer ${filter == "reach" ? "text-blue-500" : ""}`} onClick={() => handlechangeFiilter("reach")}>
                                                    {t('reach')}
                                                </span>
                                            </th>
                                            <th className="hidden p-2.5 text-center sm:table-cell xl:p-5 text-sm font-medium uppercase">
                                                <span className={`hover:cursor-pointer ${filter == "impressions" ? "text-blue-500" : ""}`} onClick={() => handlechangeFiilter("impressions")}>
                                                    {t('impressions')}
                                                </span>
                                            </th>
                                            <th className="hidden p-2.5 text-center sm:table-cell xl:p-5 text-sm font-medium uppercase">
                                                {t('start-date')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaigns.length > 0 ? (
                                            campaigns.slice(0, 5).map((data, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="p-2.5 xl:p-5 flex items-center gap-3">
                                                        <Image
                                                            src={`/assets/${data.campaign_platform === 1 ? 'meta.svg' : data.campaign_platform === 2 ? 'google.svg' : data.campaign_platform === 3 ? 'tiktok.svg' : ''}`}
                                                            width={45}
                                                            height={45}
                                                            alt="Logo"
                                                        />
                                                        <p className="hidden sm:block text-black dark:text-slate-200">
                                                            {data.campaign_name}
                                                        </p>
                                                    </td>
                                                    <td className="p-2.5 xl:p-5 text-black dark:text-slate-200 text-center">
                                                        {data.amountspent}
                                                    </td>
                                                    <td className="p-2.5 xl:p-5 text-meta-3 dark:text-slate-200 text-center">
                                                        {data.reach}
                                                    </td>
                                                    <td className="hidden sm:table-cell p-2.5 xl:p-5 text-meta-5 dark:text-slate-200 text-center">
                                                        {data.impressions}
                                                    </td>
                                                    <td className="hidden sm:table-cell p-2.5 xl:p-5 text-black dark:text-slate-200 text-center">
                                                        {data.start_date}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="w-full flex items-center justify-center p-2.5 xl:p-5">
                                                    <LoadingCircle />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-fit flex flex-col gap-7 mb-3">
                    <div className="w-full h-fit bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5 overflow-x-auto">
                        <div className="rounded-sm bg-white dark:bg-slate-800 shadow-default sm:px-7.5 xl:pb-1">
                            <div className="flex justify-between items-center mb-5">
                                <h4 className="text-xl font-semibold text-black dark:text-slate-200">
                                    {t('top-5-campaigns')}
                                </h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="dark:bg-slate-600 bg-slate-200 border dark:border-gray-400">
                                            <th className="p-2.5 xl:p-3 text-md dark:text-slate-200 font-medium uppercase text-left">
                                                <span className={``}>
                                                    Company
                                                </span>
                                            </th>
                                            <th className="p-2.5 xl:p-3 text-md dark:text-slate-200 font-medium uppercase text-left">
                                                <span className={``}>
                                                    Company's Email
                                                </span>
                                            </th>
                                            <th className="p-2.5 xl:p-3 text-md dark:text-slate-200 font-medium uppercase text-left">
                                                <span>
                                                    Username
                                                </span>
                                            </th>
                                            <th className="hidden p-2.5 sm:table-cell xl:p-3 text-md dark:text-slate-200 font-medium uppercase text-center">
                                                <span>
                                                    Status
                                                </span>
                                            </th>
                                            <th className="hidden p-2.5 sm:table-cell xl:p-3 text-md dark:text-slate-200 font-medium uppercase text-center">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestlist.length > 0 ? (
                                            requestlist.map((data, index) => (
                                                <tr key={index} className="border dark:border-gray-400">
                                                    <td className="p-2.5 xl:p-5 text-black dark:text-slate-200 text-left text-nowrap">
                                                        {data.company}
                                                    </td>
                                                    <td className="p-2.5 xl:p-5 text-black dark:text-slate-200 text-left">
                                                        {data.email}
                                                    </td>
                                                    <td className="p-2.5 xl:p-5 text-meta-3 dark:text-slate-200 text-left">
                                                        {data.username}
                                                    </td>
                                                    <td className="hidden sm:table-cell p-2.5 xl:p-5 text-meta-5 dark:text-slate-200 text-center">
                                                        {data.subscription ? 
                                                            <div className="px-5 py-1 rounded-full border-2 border-green-800 bg-green-500 text-green-200">Paid</div> : 
                                                            <div className="px-5 py-1 rounded-full border-2 border-red-800 bg-red-500 text-red-200">Free</div>}
                                                    </td>
                                                    <td className="hidden sm:table-cell p-2.5 xl:p-5 text-center">
                                                        <button onClick={() => handleAccept(data._id)} className="text-green-500 px-2 py-2 border border-green-500 hover:text-green-200 hover:bg-green-500 transition-colors duration-200">
                                                            <FaCheck size={20}/>
                                                        </button>
                                                        <button onClick={() => handleReject(data._id)} className="text-red-500 px-2 py-2 border border-red-500 hover:text-red-200 hover:bg-red-500 transition-colors duration-200 ms-2">
                                                            <FaTimes size={20}/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="w-full text-center align-middle">
                                                    <div className="flex items-center justify-center h-full">
                                                        <LoadingCircle />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
