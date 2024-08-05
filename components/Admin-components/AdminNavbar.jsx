'use client'

import { AdminDashboardContext, SidebarContext } from "@/app/[locale]/admin-dashboard/page";
import { useEffect, useState, useContext, useRef } from "react"
import { IconContext } from "react-icons";
import { FaBars, FaBell, FaBuilding, FaCheck, FaMoon, FaSignOutAlt, FaSun, FaTimes, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { RiChat3Line } from "react-icons/ri";
import { BiBell, BiMailSend, BiX } from "react-icons/bi";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";

function AdminNavbar({userData}){

    const {sidebarHide,
        setSidebarHide,
        updateCard,
        setUpdateCard,
        changeTable,
        setChangeTable,
        test,
        dataDashboard,
        isDarkMode,
        setIsDarkMode,
        navbarBrandHide,
        setNavbarBrandHide
    } = useContext(AdminDashboardContext)
    const [requestlist, setRequestList] = useState([]);
    const [requestCount, setRequestCount] = useState(0);

    const navbarBrand = useRef()

    // Handle sidebar visibility and navbar brand visibility
    function hideHandle() {
        setSidebarHide(!sidebarHide);
        setNavbarBrandHide(!navbarBrandHide);
    }

    useEffect(() => {
        if (navbarBrandHide) {
            navbarBrand.current?.classList.add("hidden");
        } else {
            navbarBrand.current?.classList.remove("hidden");
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
    }, [navbarBrandHide]);

    // Handle theme setting based on localStorage or user preference
    useEffect(() => {
       if(localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            document.getElementById("theme").checked = true
            localStorage.setItem('color-theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            document.getElementById("theme").checked = false
            localStorage.setItem('color-theme', 'light')
        }
        getRequestList()
    }, [])

    const Router = useRouter()

    function handleLogout(){
        localStorage.clear()
        Router.push('/')
    }

    function handleTheme() {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        document.documentElement.classList.toggle("dark", newDarkMode);
        localStorage.setItem('color-theme', newDarkMode ? 'dark' : 'light');
    }

    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

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
                                    title: 'Register new user & new tenant successfully',
                                }).then(() => {
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
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request-accept?request_id=${request_id}`,{
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                }).then((response) => {
                    if(!response.IsError){
                        createTenant(response.data.Data, request_id)
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.ErrorMessage,
                        })
                    }
                })
                // alert(request_id)
            }
          });
    }

    return (
        <nav className="w-full fixed z-20 h-[80px] shadow-md bg-white text-black dark:bg-slate-800 dark:text-white flex justify-between items-center">
            <div className="flex h-full">
                <div className="w-[300px] flex h-full bg-slate-800 shadow-none items-center p-3 transition-transform" ref={navbarBrand}>
                    <Image src="/assets/icon.png" alt="Logo" className="w-[60px] h-[60px] decoration-white" width={60} height={60} />
                    <Image src="/assets/logo.png" alt="Logo" className="w-[140px] h-10 decoration-white mr-1 mt-2" width={140} height={40} />
                </div>
                <button onClick={hideHandle} className="mx-5">
                    <FaBars className="text-2xl" />
                </button>
            </div>

                    <div className=" flex items-center gap-2 ms-20">
                    
                    <div className="w-16 h-9 flex justify-center items-center rounded-full">
                        <label htmlFor="theme" className="inline-flex items-center cursor-pointer me-2">
                            {
                                isDarkMode ? <FaMoon className="text-lg text-white me-2"/> : <FaSun className="text-xl text-blue-500 me-2"/>
                            }
                        <input data-hs-theme-switch className="relative w-[3.25rem] h-7 bg-blue-200 checked:bg-none checked:bg-gray-700 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ring-1 ring-transparent focus:border-slate-700 focus:ring-slate-700 focus:outline-none appearance-none
                            before:inline-block before:size-6 before:bg-white checked:before:bg-gray-500 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200
                            after:absolute after:end-1.5 after:top-[calc(50%-0.40625rem)] after:w-[.8125rem] after:h-[.8125rem] after:bg-no-repeat after:bg-[right_center] after:bg-[length:.8125em_.8125em] after:transform after:transition-all after:ease-in-out after:duration-200 after:opacity-70 checked:after:start-1.5 checked:after:end-auto" type="checkbox" id="theme" onChange={handleTheme}></input>
                        </label>
                    </div>
                    
                    {
                        userData.roles === "sadmin" && (
                            <button className="text-md flex items-center gap-2" onClick={handleDropdown}>
                                <FaBell className="text-2xl text-blue-500 ms-3" />
                                <span className="relative top-0 right-5 bg-red-500 text-white rounded-full px-1 text-xs">{requestCount}</span>
                            </button>
                        )
                    }
                    
                    {showDropdown && (
                        <div className="absolute text-black dark:text-white top-20 right-20 p-5 w-[270px] h-[270px] overflow-y-auto bg-white dark:bg-slate-700 rounded-lg shadow-lg">
                            <ul className="space-y-2">
                                {
                                    requestlist.length === 0 && (
                                        <p className="text-center">No Request</p>
                                    )
                                }
                                {
                                    requestlist.map((request, index) => (
                                        <>
                                        <li key={index} className="flex items-center w-full justify-between">
                                            <div className="text-xl flex gap-3 items-center">
                                                <FaBuilding className="text-blue-500 mr-2" />
                                                <div className="flex flex-col">
                                                <p className="text-sm font-bold">{request.company} {request.subscription ? "(Paid)" : "(Free)"}</p>
                                                <p className="text-xs ">{request.email}</p>
                                                </div>
                                            </div>

                                            <div className="text-xl flex gap-3">
                                                <button>
                                                    <FaCheck className="text-green-500" onClick={() => handleAccept(request._id)}/>
                                                </button>
                                                <button>
                                                    <FaTimes className="text-red-500" onClick={() => handleReject(request._id)}/>
                                                </button>
                                            </div>
                                        </li>
                                        <div className="w-full h-0.5 bg-gray-400"></div>
                                        </>
                                    ))
                                }
                            </ul>
                        </div>
                    )}
                    </div>
                </div>

                {isOpen === 1 &&
                    <Popup isOpen={isOpen === 1} handleClose={() => setIsOpen(0)}>
                        <div className="bg-white dark:bg-slate-800 rounded-lg w-[300px]">
                            <h1 className="text-xl font-medium px-4 py-2 border-b border-gray-200 dark:border-slate-600">Tenant Request</h1>
                            <div className="max-h-32 overflow-y-auto">
                                <div className="divide-y divide-gray-200 dark:divide-slate-600">
                                    {[1, 2, 3, 4, 5].map((notif) => (
                                        <div key={notif} className="flex items-center px-4 py-3 space-x-4 hover:bg-gray-100 dark:hover:bg-slate-700">
                                            <div className="bg-blue-500 rounded-full w-8 h-8 flex justify-center items-center text-white">
                                                <BiBell className="text-xl" />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-lg font-medium">Notif {notif}</p>
                                                <p className="text-gray-500 dark:text-gray-400">Deskripsi notif {notif}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Popup>
                }

                {isOpen === 2 &&
                    <Popup isOpen={isOpen === 2} handleClose={() => setIsOpen(0)}>
                        <div className="bg-white dark:bg-slate-800 rounded-lg w-[300px]">
                            <h1 className="text-xl font-medium px-4 py-2 border-b border-gray-200 dark:border-slate-600">Mail</h1>
                            <div className="max-h-32 overflow-y-auto">
                                <div className="divide-y divide-gray-200 dark:divide-slate-600">
                                    {[1, 2, 3, 4, 5].map((mail) => (
                                        <div key={mail} className="flex items-center px-4 py-3 space-x-4 hover:bg-gray-100 dark:hover:bg-slate-700">
                                            <div className="bg-blue-500 rounded-full w-8 h-8 flex justify-center items-center text-white">
                                                <BiMailSend className="text-xl" />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-lg font-medium">Mail {mail}</p>
                                                <p className="text-gray-500 dark:text-gray-400">Deskripsi Mail {mail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Popup>
                }

                <div className="flex flex-col items-end mt-2">
                    <h1 className="text-nowrap font-medium">{userData.name}</h1>
                    <p className="text-gray-500">{userData.roles}</p>
                </div>
                <div className="block">
                    {userData.image ? 
                        <Image src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-[40px] h-[40px] bg-slate-200 rounded-full" width={40} height={40} /> 
                        : <p className="animate-pulse">Loading...</p>
                    }
                </div>
            </div>
        </nav>
    );
}

export default dynamic(() => Promise.resolve(AdminNavbar));
