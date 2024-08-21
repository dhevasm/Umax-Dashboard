'use client'

import CountCard from "./CountCard"
import ChartOne from "./Charts/ChartOne"
import ChartTwo from "./Charts/ChartTwo"
import ChartThree from "./Charts/ChartThree"
import Map from "./Maps/Map"
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi"
import { useCallback, useContext, useRef } from "react"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import { useState, useEffect } from "react"
import LoadingCircle from "../Client-components/Loading/LoadingCircle"
import { useTranslations } from "next-intl"
import axios from "axios"
import Image from "next/image"
import { IconContext } from "react-icons"
import { RiAdvertisementFill, RiGoogleFill, RiGoogleLine, RiMetaLine, RiRefreshFill, RiTiktokFill, RiTiktokLine } from "react-icons/ri"
import { reach } from "yup"
import { FaArrowUp, FaBuilding, FaCheck, FaTimes } from "react-icons/fa"
import { map } from "leaflet"
import Swal from "sweetalert2"
import { LiaSpinnerSolid } from "react-icons/lia"
import { html2pdf } from "html2pdf.js"

export default function Dashboard({ tenant_id }) {
    const t = useTranslations("admin-dashboard")
    const { sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData} = useContext(AdminDashboardContext)
    const [campaigns, setCampaigns] = useState([])
    const [filter, setFilter] = useState("reach")
    const [chartData, setChartData] = useState([])
    const [requestlist, setRequestList] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const roles = localStorage.getItem('roles')
    const [isLoading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)

    const getCampaign = async() => {
        setDataLoading(true)
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/metric-by-tenant-id?tenantId=${localStorage.getItem('tenantId')}&status=${status}`, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        }).then((response) => {
            setCampaigns(response.data.Data);
            // console.log(response.data.Data)
            setDataLoading(false)
        })
    }

    async function getRequestList(){
        setDataLoading(true)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request-list`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
        })
        setRequestList(res.data.Output)
        setRequestCount(res.data.Output.length)
        setDataLoading(false)
    }

    useEffect(() => {
        if(roles == 'admin'){
            setFilterCampaign("reach")
            getCampaign()
        }
        if(roles == 'sadmin'){
            getRequestList()
        }
    }, [])

    const setFilterCampaign = (filterset) => {
        let filteredCampaigns = []
        if(filterset === "reach"){
            filteredCampaigns = campaigns.sort((a, b) => parseInt(b.reach.replace(/\./g, "")) - parseInt(a.reach.replace(/\./g, "")));
        }else if (filterset === "amountspent"){
            filteredCampaigns = campaigns.sort((a, b) => parseInt(b.amountspent.slice(3).replace(/\./g, "")) - parseInt(a.amountspent.slice(3).replace(/\./g, "")));
        }else if(filterset === "impressions"){
            filteredCampaigns = campaigns.sort((a, b) => parseInt(b.impressions.replace(/\./g, "")) - parseInt(a.impressions.replace(/\./g, "")));
        }
        setCampaigns(filteredCampaigns);
    }
    
    const handlechangeFiilter = (value) => {
        // console.log(value)
        setFilter(value)
        setFilterCampaign(value)
    }

    async function getChartData() { 
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chart-data`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        const data = res.data.Output
        setChartData(data)
    }  

    useEffect(() => {
        getChartData()
        getCount()
    }, [])

    const handleReject = async (request_id, name, email) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, Reject it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            setLoading(true);
            await axios
              .delete(
                `${process.env.NEXT_PUBLIC_API_URL}/request-reject?request_id=${request_id}`,
                {
                  headers: {
                    authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                  },
                }
              )
              .then(async (response) => {
                if (!response.IsError) {
                  const formData = new FormData();
                  formData.append("from", "UMAX Dashboard Team");
                  formData.append("to", `${email}`);
                  formData.append(
                    "body",
                    `
                                <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                                    <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            background-color: #f4f4f4;
                                            margin: 0;
                                            padding: 0;
                                        }
                                        .email-container {
                                            max-width: 600px;
                                            margin: 20px auto;
                                            background-color: #ffffff;
                                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                            border-radius: 10px;
                                            overflow: hidden;
                                        }
                                        .email-header {
                                            background-color: #dc3545;
                                            padding: 10px;
                                            text-align: center;
                                            color: white;
                                        }
                                        .email-body {
                                            padding: 20px;
                                        }
                                        .email-body h2 {
                                            color: #333333;
                                            margin-top: 0;
                                        }
                                        .email-body p {
                                            color: #555555;
                                            line-height: 1.6;
                                        }
                                        .email-footer {
                                            background-color: #f1f1f1;
                                            padding: 10px;
                                            text-align: center;
                                            color: #777777;
                                            font-size: 12px;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="email-container">
                                        <div class="email-header">
                                            <h1>UMAX Dashboard</h1>
                                        </div>
                                        <div class="email-body">
                                            <h2>Your Request Status has rejected</h2>
                                            <p>Hello, <strong>${name}</strong>,</p>
                                            <p>We are pleased to inform you that your request has been <strong>Rejected</strong>.</p>
                                            <p>Thank you for using our services.</p>
                                            <p>Best regards,</p>
                                            <p>The UMAX Team</p>
                                        </div>
                                        <div class="email-footer">
                                            &copy; 2024 UMAX Team. All rights reserved.
                                        </div>
                                    </div>
                                </body>
                                </html>
                            `
                  );
    
                  try {
                    await axios.post("/en/api/send", formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    });
                    // Mengatur ulang formulir jika pengiriman berhasil
                    setLoading(false);
                    Swal.fire("Success", "Request has rejected", "success").then(
                      () => {
                        getRequestList();
                        setLoading(false);
                      }
                    );
                  } catch (error) {
                    console.error(error);
                    setLoading(false);
                    Swal.fire("Error", "Failed to reject request", "error");
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.ErrorMessage,
                  }).then(() => {
                    setLoading(false);
                  });
                }
              });
          }
        });
      };

      const createUser = async (datatenant, tenant_id, request_id) => {
        const formData = new FormData();
        formData.append("name", datatenant.username);
        formData.append("email", datatenant.email);
        formData.append("password", datatenant.password);
        formData.append("confirm_password", datatenant.password);
        formData.append("role", "admin");
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/register?tenantId=${tenant_id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          )
          .then(async (res) => {
            if (res.data.Output === "Registration Successfully") {
              console.log("user register success");
              await axios
                .delete(
                  `${process.env.NEXT_PUBLIC_API_URL}/request-reject?request_id=${request_id}`,
                  {
                    headers: {
                      authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                  }
                )
                .then(async (response) => {
                  if (!response.IsError) {
                    const formData = new FormData();
                    formData.append("from", "UMAX Dashboard Team");
                    formData.append("to", `${datatenant.email}`);
                    formData.append(
                      "body",
                      `
                                <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                                    <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            background-color: #f4f4f4;
                                            margin: 0;
                                            padding: 0;
                                        }
                                        .email-container {
                                            max-width: 600px;
                                            margin: 20px auto;
                                            background-color: #ffffff;
                                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                            border-radius: 10px;
                                            overflow: hidden;
                                        }
                                        .email-header {
                                            background-color: #0073E6;
                                            padding: 10px;
                                            text-align: center;
                                            color: white;
                                        }
                                        .email-body {
                                            padding: 20px;
                                        }
                                        .email-body h2 {
                                            color: #333333;
                                            margin-top: 0;
                                        }
                                        .email-body p {
                                            color: #555555;
                                            line-height: 1.6;
                                        }
                                        .email-footer {
                                            background-color: #f1f1f1;
                                            padding: 10px;
                                            text-align: center;
                                            color: #777777;
                                            font-size: 12px;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="email-container">
                                        <div class="email-header">
                                            <h1>UMAX Dashboard</h1>
                                        </div>
                                        <div class="email-body">
                                            <h2>Your Request Status has Accepted</h2>
                                            <p>Hello, <strong>${datatenant.username}</strong>,</p>
                                            <p>We are pleased to inform you that your request has been <strong>Accepted</strong>, your tenant ${datatenant.company} was registered.</p>
                                            <p>Thank you for using our services.</p>
                                            <a href='https://umax-dashboard.vercel.app/en/login'>Login Now</a>
                                            <p>Best regards,</p>
                                            <p>The UMAX Team</p>
                                        </div>
                                        <div class="email-footer">
                                            &copy; 2024 UMAX Team. All rights reserved.
                                        </div>
                                    </div>
                                </body>
                                </html>
                            `
                    );
    
                    try {
                      await axios.post("/en/api/send", formData, {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      });
                      // Mengatur ulang formulir jika pengiriman berhasil
                      setLoading(false);
                      Swal.fire({
                        icon: "success",
                        title: "Request Successfully",
                        text: "Register new user & new tenant successfully",
                      }).then(() => {
                        setLoading(false);
                        getRequestList();
                      });
                    } catch (error) {
                      console.error(error);
                      setLoading(false);
                      Swal.fire("Error", "Failed to Accept request", "error");
                    }
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: response.ErrorMessage,
                    });
                  }
                });
            }
          });
      };

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

    const [userCount, setUserCount] = useState(0)
    const [clientCount, setClientCount] = useState(0)
    const [campaignCount, setCampaignCount] = useState(0)
    const [tenantCount, setTenantCount] = useState(0)
    const [loadingCount, setLoadingCount] = useState(false)
    
    async function getCount() {
        try{
            setLoadingCount(true)
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/count-card`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            }).then((response) => {
                if(!response.IsError){
                    setLoadingCount(false)
                    const data = response.data.Output
                    // console.log(data)
                    setUserCount(data["total_user"])
                    setClientCount(data["total_client"])
                    setCampaignCount(data["total_campaign"])
                    setTenantCount(data["total_tenant"])
                }
            })
        } catch(error){
            console.error(error)
        }
    }
    

    const printPage = useRef(null)

    return (
        <>
            <div className="w-full h-full flex flex-wrap gap-5" ref={printPage}>
                <div className="grid grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 w-full">
                    {userData.roles == "admin" ? <CountCard title={t('tenants')} value={userData.company_name ? userData.company_name : <div className="text-md animate-pulse">Loading...</div>} handleClick={"company"} /> :
                        userData.roles == "sadmin" ? <CountCard title={t('tenants')} value={loadingCount ? "Loading..." : tenantCount} handleClick={"tenants"} /> :
                            <CountCard title={t('tenants')} value={<div className="text-md animate-pulse">Loading...</div>} />}
                            <CountCard title={t('users')} value={loadingCount ? "Loading..." : userCount} handleClick={"users"} />
                            <CountCard title={t('campaigns')} value={loadingCount ? "Loading..." : campaignCount} handleClick={"campaigns"} />
                            <CountCard title={t('clients')} value={loadingCount ? "Loading..." : clientCount} handleClick={"clients"} />
                </div>  
                <div className="w-full flex flex-col lg:flex-row gap-7 mb-3 max-w-full">
                    <div className="w-full max-w-full lg:w-1/3 h-[450px] flex justify-center bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <ChartOne chartData={chartData} />
                    </div>
                    <div className="w-full max-w-full flex justify-center lg:w-2/3 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <ChartTwo chartData={chartData} />
                    </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-7 mb-3 max-w-full">
                    <div className="w-full max-w-full flex justify-center lg:w-3/5 h-[300px] md:h-[450px] relative bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5 overflow-hidden">
                        <Map />
                    </div>
                    <div className="w-full max-w-full flex justify-center lg:w-2/5 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <ChartThree chartData={chartData} />
                    </div>
                </div>
            </div>
            {userData.roles === 'admin' ? (
                <div className="w-full h-fit flex flex-col gap-7 mb-3 mt-5">
                    <div className="w-full h-fit bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5 overflow-x-auto">
                        <div className="rounded-sm bg-white dark:bg-slate-800 shadow-default sm:px-7.5 xl:pb-1">
                            <div className="flex justify-between items-center mb-5">
                                <h4 className="text-xl font-semibold text-black dark:text-slate-200">
                                    {t('top-5-campaigns')}
                                </h4>
                                <div className="flex gap-2">
                                    <style>
                                        {
                                            `
                                            .filterselect{
                                                background-color: #3d50e0;
                                                color: white;
                                            }
                                            `
                                        }
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
                                            <th className="p-2.5 text-center sm:table-cell xl:p-5 text-sm font-medium uppercase">
                                                <span className={`hover:cursor-pointer ${filter == "impressions" ? "text-blue-500" : ""}`} onClick={() => handlechangeFiilter("impressions")}>
                                                    {t('impressions')}
                                                </span>
                                            </th>
                                            <th className="p-2.5 text-center sm:table-cell xl:p-5 text-sm font-medium uppercase">
                                                {t('start-date')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {dataLoading ? (
                                        <tr>
                                        <td colSpan="5" className="w-full text-center align-middle">
                                            <div className="flex items-center justify-center h-full">
                                            <LoadingCircle />
                                            </div>
                                        </td>
                                        </tr>
                                    ) : campaigns.length === 0 ? (
                                        <tr>
                                        <td colSpan="5" className="w-full text-center align-middle border dark:border-slate-400">
                                            <div className="flex items-center justify-center h-full dark:text-slate-200 py-5">
                                            Campaign not found
                                            </div>
                                        </td>
                                        </tr>
                                    ) : (
                                        campaigns.slice(0, 5).map((data, index) => (
                                        <tr
                                            key={index}
                                            className="border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                                        >
                                            <td className="p-2.5 xl:p-5 flex flex-col md:flex-row items-center text-center gap-3">
                                            <Image
                                                src={`/assets/${data.campaign_platform === 1 ? 'meta.svg' : data.campaign_platform === 2 ? 'google.svg' : data.campaign_platform === 3 ? 'tiktok.svg' : ''}`}
                                                width={45}
                                                height={45}
                                                alt="Logo"
                                            />
                                            <p className="text-xs md:text-sm text-black dark:text-slate-200">
                                                {data.campaign_name}
                                            </p>
                                            </td>
                                            <td className="p-2.5 xl:p-5 text-nowrap text-black dark:text-slate-200 text-center">
                                            {data.amountspent}
                                            </td>
                                            <td className="p-2.5 xl:p-5 text-nowrap text-meta-3 dark:text-slate-200 text-center">
                                            {data.reach}
                                            </td>
                                            <td className="sm:table-cell p-2.5 text-nowrap xl:p-5 text-meta-5 dark:text-slate-200 text-center">
                                            {data.impressions}
                                            </td>
                                            <td className="sm:table-cell p-2.5 text-nowrap xl:p-5 text-black dark:text-slate-200 text-center">
                                            {data.start_date}
                                            </td>
                                        </tr>
                                        ))
                                    )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-fit flex flex-col gap-7 mb-3 mt-5">
                    <div className="w-full h-fit bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5 overflow-x-auto">
                        <div className="rounded-sm bg-white dark:bg-slate-800 shadow-default sm:px-7.5 xl:pb-1">
                            <div className="flex justify-between items-center mb-5">
                                <h4 className="text-xl font-semibold text-black dark:text-slate-200">
                                    Register Request
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

                                                    {"Company's Email"}

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
                                        {dataLoading ? (
                                            <tr>
                                                <td colSpan="5" className="w-full text-center align-middle">
                                                    <div className="flex items-center justify-center h-full">
                                                        <LoadingCircle />
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : requestlist.length < 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="w-full text-center align-middle border dark:border-slate-400">
                                                        <div className="flex items-center justify-center h-full dark:text-slate-200 py-5">
                                                            Request not found
                                                        </div>
                                                    </td>
                                                </tr>
                                        ) : (
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
                                                            <div className="px-5 py-1 rounded-full border-2 border-blue-800 bg-blue-500 text-red-200">Free</div>}
                                                    </td>
                                                    <td className="hidden sm:table-cell p-2.5 xl:p-5 text-center">
                                                        {isLoading ? (
                                                            <LiaSpinnerSolid className="w-15 h-15 dark:text-white animate-spin" />
                                                        ) : (
                                                            <>
                                                                <button onClick={() => handleAccept(data._id)} className="text-green-500 px-2 py-2 border border-green-500 hover:text-green-200 hover:bg-green-500 transition-colors duration-200">
                                                                    <FaCheck size={20}/>
                                                                </button>
                                                                <button onClick={() => handleReject(
                                                                        data._id,
                                                                        data.username,
                                                                        data.email
                                                                    )} className="text-red-500 px-2 py-2 border border-red-500 hover:text-red-200 hover:bg-red-500 transition-colors duration-200 ms-2">
                                                                    <FaTimes size={20}/>
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                        }
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
