'use client'
import { AdminDashboardContext, SidebarContext } from "@/app/[locale]/admin-dashboard/page";
import { useEffect, useState, useContext, useRef } from "react"
import { IconContext } from "react-icons";
import { FaBars, FaBell, FaBuilding, FaCheck, FaMoon, FaSignOutAlt, FaSun, FaTimes, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { RiBellLine, RiChat3Line} from "react-icons/ri";
import { BiBell } from "react-icons/bi";
import dynamic from "next/dynamic";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";

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

    function hideHandle(){
        setSidebarHide(!sidebarHide)
        setNavbarBrandHide(!navbarBrandHide)
    }

    useEffect(() => {
        if(navbarBrandHide){
            navbarBrand.current.classList.add("hidden")
        } else {
            navbarBrand.current.classList.remove("hidden")
        }
    }, [navbarBrandHide])

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

    function handleTheme(){
        setIsDarkMode(!isDarkMode)
        document.documentElement.classList.toggle("dark")
        localStorage.setItem('color-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light')
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
        <>
            <nav className="w-full fixed z-20 h-[80px] shadow-md bg-white text-black dark:bg-slate-800 dark:text-white flex justify-between items-center">
                <div className="flex h-full">
                <div className="w-[300px] flex h-full bg-slate-800 shadow-none items-center p-3 transition-transform" ref={navbarBrand}>
                    <Image src="/assets/icon.png" alt="Logo" className="w-[60px] h-[60px] decoration-white" width={40} height={40}/>
                    {/* <p className="text-white font-sans text-3xl">UMAX</p> */}
                    <Image
                        src="/assets/logo.png"
                        alt="Logo"
                        className="w-[140px] h-10 decoration-white mr-1 mt-2"
                        width={140}
                        height={40}
                        />
                </div>
                    <button onClick={hideHandle} className="mx-5">
                    <FaBars className="text-2xl" />
                    </button>
                </div>

                <div className="flex items-center gap-3 me-5 md:me-10 text-xs cursor-pointer" 
                // onClick={() => {
                //     document.querySelector("#profileDropDown").classList?.toggle("hidden")
                // }}
                >
                    <div className="hidden absolute top-16 right-10 p-5 bg-white rounded-lg shadow-lg" id="profileDropDown">
                    {userData.image ?  <Image src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-20 h-20 bg-slate-200 rounded-full" width={80} height={80} /> : <p className="animate-pulse">Loading...</p> }
                    <h1 className="font-bold text-lg">{userData.name}</h1><p className="text-md">{userData.roles}</p>
                    <div className="w-full h-0.5 bg-gray-400 my-3 px-5"></div>
                    <button className="text-md flex items-center gap-2" onClick={() => Router.push('/profile')} >
                        <FaUser/> 
                        Profile
                    </button>
                    <div className="w-full h-0.5 bg-gray-400 my-3 px-5"></div>
                    <button className="text-md flex items-center gap-2" onClick={handleLogout} >
                        <FaSignOutAlt/> 
                        Log Out
                    </button>
                    </div>

                    <div className=" flex items-center gap-2 ms-20">
                    
                    <div className="w-16 h-9 flex justify-center items-center rounded-full">
                        <label htmlFor="theme" className="inline-flex items-center cursor-pointer me-2">
                            {
                                isDarkMode ? <FaMoon className="text-lg text-white me-2"/> : <FaSun className="text-xl text-blue-500 me-2"/>
                            }
                        {/* <input type="checkbox" value="" id="theme" name="theme" className="sr-only peer" onChange={handleTheme}/>
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                        </div> */}
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
                    <div className="absolute text-black dark:text-white top-20 right-20 p-5 w-[300px] max-h-[400px] overflow-y-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <ul className="space-y-3">
                        {requestlist.length === 0 ? (
                            <p className="text-center text-gray-500">No Request</p>
                        ) : (
                            requestlist.map((request, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                                <li className="flex items-center justify-between">
                                <div className="flex gap-3 items-center">
                                    <FaBuilding className="text-blue-500 mr-2 text-2xl" />
                                    <div className="flex flex-col">
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {request.company} {request.subscription ? "(Paid)" : "(Free)"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{request.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                    onClick={() => handleAccept(request._id)}
                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md transition duration-200"
                                    >
                                    <FaCheck />
                                    </button>
                                    <button
                                    onClick={() => handleReject(request._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md transition duration-200"
                                    >
                                    <FaTimes />
                                    </button>
                                </div>
                                </li>
                            </div>
                            ))
                        )}
                        </ul>
                    </div>
                    )}

                    </div>

                    <div className="flex flex-col items-end mt-2">
                    <h1 className="text-nowrap font-medium">{userData.name}</h1>
                    <p className="text-gray-500">{userData.roles}</p>
                    </div>
                    <div className="block">
                    {userData.image ?  <Image src={`data:image/png;base64, ${userData.image}`} alt="profile" className="w-[40px] h-[40px] bg-slate-200 rounded-full" width={40} height={40} /> : <p className="animate-pulse">Loading...</p>}
                    </div>
                </div>
            </nav>

        </>
    )
}
export default dynamic(() => Promise.resolve(AdminNavbar));