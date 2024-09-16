'use client'

import { useState, useEffect, useRef, useCallback } from "react"
import { IconContext } from "react-icons"
import axios from "axios"
import { FaBuilding, FaDollarSign, FaDolly, FaEnvelope, FaFlag, FaHome, FaPen, FaPhone } from "react-icons/fa"
import { useContext } from "react"
import { FaTimes } from "react-icons/fa"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import Swal from "sweetalert2"
import { CiLock } from "react-icons/ci"
import { FiWatch } from "react-icons/fi"
import { useTranslations } from "next-intl"
import countryMap from "@/helpers/CountryMap"
import Currency from "@/helpers/Currency"
import Image from "next/image"
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function TenantProfile({tenant_id}){

    const [tenant, setTenant] = useState([])
    const {sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable,  userData} = useContext(AdminDashboardContext)
    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("edit")
    const t = useTranslations('tenant-profile')
    const s = useTranslations('profile')

    const [timezone, setTimezone] = useState([])
    const [currency, setCurrency] = useState([])
    const [culture, setCulture] = useState([])
    const [Country, setCountry] = useState([])
    const [City, setCity] = useState([])
    const [alldial, setDial] = useState([])
    const [DialCountry, setDialCountry] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    async function getTenant(){
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tenant-by-id?tenant_id=${tenant_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        }).then((response) => {
            setTenant(response.data.Data[0])
        })
    }

    useEffect(() => {
        getTenant()
    })

    useEffect(() => {
        if(Country.length > 0){
            document.getElementById("country").value =  tenant.address.split(" - ")[2]
            handleCityList(tenant.address.split(" - ")[2])
        }
    }, [Country])

    useEffect(() => {
        if(City.length > 0){
            document.getElementById("city").value = tenant.address.split(" - ")[1]
        }
    }, [City])

    useEffect(() => {
        if(culture.length > 0){
            document.getElementById("culture").value = tenant.culture
        }
    }, [culture])

    useEffect(() => {
        if(currency.length > 0){
            document.getElementById("currency").value = tenant.currency
        }
    }, [currency])

    useEffect(() => {
        if(timezone.length > 0){
            setTimeout(() => {
                document.getElementById("input_timezone").value = tenant.timezone_name
            }, 500);
        }
    }, [timezone])

    

    function showModal(mode, tenant_id = null ){
        setModeModal(mode)
        if(mode == "Edit"){
            if(tenant !== null) {
                // console.log(filteredTenant[0])
                let isFullAdress = false;
                document.getElementById('name').value = tenant.company
                document.getElementById('address').value = tenant.address
                document.getElementById('email').value = tenant.email
                document.getElementById('language').value = tenant.language
                document.getElementById('currencyposition').checked = tenant.currency_position
                document.getElementById('contact').value = tenant.contact.slice(1)

                setValues({name: tenant.company, address: tenant.address, contact: tenant.contact, email: tenant.email})
                setError({name: '', address: '', contact: '', email: ''})
                    
            } else{
                Swal.fire("Tenant not found");
            }
        }else if(mode == "Create") {
            setValues({name: '', address: '', contact: '', email: ''})
            setError({name: '', address: '', contact: '', email: ''})
            deleteButton.current.classList.add("hidden")
            document.getElementById('name').value = null
            document.getElementById('address').value = null
            document.getElementById('contact').value = null
            document.getElementById('email').value = null  
        }
        addModal.current.classList.remove("hidden")
    }
    function closeModal(){
        addModal.current.classList.add("hidden")
    }

    // Validasi Form 
    const [values, setValues] = useState({name: '', address: '', contact: '', email: ''})
    const [error, setError] = useState({
        name: '',
        address: '',
        contact: '',
        email: '',
    })
    const [isvalid, setIsvalid] = useState(false)

    const validateForm = useCallback(() => {
        let errors = {}
        if(values.name == ''){
            errors.name = t('name-error')
        }
        if(values.address == ''){
            errors.address = t('address-error')
        }
        if(values.contact == ''){
            errors.contact = t('contact-error')
        }
        if(!values.email.includes('@')){
            errors.email = t('email-error2')
        }
        if(values.email == ''){
            errors.email = t('email-error')
        }
        setError(errors)
        setIsvalid(Object.keys(errors).length === 0)
    }, [values, t])

    useEffect(() => {
        validateForm()
    }, [values, validateForm])

    async function updateTenant(){
        setIsLoading(true)
        if(tenant !== null) {
            setIsLoading(true)
            if(isvalid){
            setIsLoading(true)
            const company = document.getElementById('name').value
            const address = document.getElementById('address').value
            const contact = `+${document.getElementById('contact').value}`
            const email = document.getElementById('email').value
            const language = document.getElementById('language').value
            const culture = document.getElementById('culture').value
            const currency = document.getElementById('currency').value
            const timezone = document.getElementById('input_timezone').value
            const currencyposition = document.getElementById('currencyposition').checked
            const city = document.getElementById('city').value
            const country = document.getElementById('country').value
            const filteraddress = address.split(' - ')
            // console.log(filteraddress)
            const fulladdress = `${filteraddress[0]} - ${city} - ${country}`

            const formData = new FormData();
            formData.append('company', company);
            formData.append('address', fulladdress);
            formData.append('email', email);
            formData.append('contact', contact);
            formData.append('language', language);
            formData.append('culture', culture);
            formData.append('currency', currency);
            formData.append('input_timezone', timezone);
            formData.append('currency_position', currencyposition);
    
            const response = await axios.put(`https://umaxxnew-1-d6861606.deta.app/tenant-edit?tenantId=${tenant._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
    
            if(response.data.Output == "Data Updated Successfully"){
                getTenant()
                closeModal()
                document.getElementById('name').value = null
                document.getElementById('address').value = null
                document.getElementById('contact').value = null
                document.getElementById('email').value = null
                setIsLoading(false)
                // Swal.fire("Success", "Tenant Updated", "success")
                toastr.success('Tenant Updated', "Success")
            }else{
                // Swal.fire("Error", response.detail.ErrMsg, "error")
                toastr.error(response.detail.ErrMsg, "Error")
                setIsLoading(false)
            }
            }else{
                // Swal.fire("Failed!","Please fill all required fields!", "error")
                toastr.error("Please fill all required fields!", "Failed")
                setIsLoading(false)
            }
            
        }
        setIsLoading(false)
    }

    // useEffect(() => {
    //     console.log(tenant)
    // }, [tenant])

    async function getSelectFrontend(){
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/timezone`).then((response) => {
            setTimezone(response.data)
        })

        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currency`).then((response) => {
            setCurrency(response.data)
        })

        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/culture`).then((response) => {
            setCulture(response.data)
        })

        await axios.get("https://countriesnow.space/api/v0.1/countries").then((response) => {
            setCountry(response.data.data)

        })
        await axios.get("https://countriesnow.space/api/v0.1/countries/codes").then((response) => {
            setDial(response.data.data)
        })


    }

    async function handleCityList(countryname, callback){
        let citylist = []
        Country.map((item) => {
            if(item.country == countryname){
                citylist= item.cities
            }
        })
        // alldial.map((item) => {
        //     if(item.name == countryname){
        //         setDialCountry(item.dial_code)
        //         // console.log(item.dial_code)
        //     }
        // })   

        setCity(citylist)

        if (callback) {
            setTimeout(() => {
                callback();
            }, 1000);
        }
    }

    useEffect(() => {
        document.getElementById("contact").value = DialCountry.slice(1)
    }, [DialCountry])   

    useEffect(() => {
        getSelectFrontend()
    }, [])

    function getCountryNameFromCode(code) {
        // Extract the country code from the format like 'quz_BO'
        const countryCode = code.split('_')[1]; // 'BO'
        return countryMap[countryCode] || 'Unknown Country';
    }

    function getCurrencyNameFromCode(code) {
        return Currency[code] || 'Unknown Currency';
    }

    const getFlagSrc = (language) => {
        switch (language) {
            case 'id':
                return '/assets/indonesia.png';
            case 'en':
                return '/assets/us.png';
            case 'ja':
                return '/assets/japan.jpg';
            default:
                return '';
        }
    };

    function LoadingCircle(){
        return(
            <div className="flex justify-center items-center h-6 px-3">
                <div className="relative">
                    <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        )
    }
    
    return (
        <>
            <div className="w-full h-full rounded-sm">
                <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row justify-between items-center">
                    <h1 className="text-2xl dark:text-white font-bold uppercase">{t('title')}</h1>
                    <div className="dark:text-white"><a className="hover:cursor-pointer hover:text-blue-400 hover:underline dark:text-white" onClick={() => setChangeTable("dashboard")}>{t('dashboard')}</a> / {t('title')}</div>
                </div>

                <div className="rounded-sm mt-3 rounded-t-md">
                    <div className="w-full flex justify-between h-[30vh] bg-bg-tenant gap-4 items-end px-5 py-5 rounded-t-md">
                        {
                            tenant.company ? (
                                <h1 className="font-bold text-2xl text-white drop-shadow-xl">{tenant.company}</h1>
                            ) : (
                                <div className="w-64 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                            )
                        }

                        {
                            tenant.company ? (
                                <div className="self-end text-xs md:text-md text-nowrap flex gap-2 items-center text-white hover:cursor-pointer dark:hover:bg-slate-700 dark:bg-slate-700 bg-[#3d50e0] hover:bg-blue-600 p-2 rounded-md" onClick={() => showModal("Edit", tenant._id)}>
                                    <FaPen />
                                    {t('edit-profile')}
                                </div>
                            ) : (
                                <div className="w-32 h-8 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse flex items-center justify-center">
                                    {/* You can add a placeholder icon here if needed */}
                                </div>
                            )
                        }

                    </div>

                    <div className="p-5 bg-white dark:bg-slate-800 rounded-b-sm">
                        {
                            tenant.address ? (
                                <>
                                    <div className="flex items-center gap-5 my-5 mb-10">
                                        <h1 className="font-bold text-xl text-gray-700 dark:text-white">{t('general')}</h1>
                                        <div className="w-full h-0.5 mt-3 bg-gradient-to-r from-blue-400 to-[#3d50e0]"></div>
                                    </div>
                                    <div className="flex flex-row gap-4 items-center mt-3 p-5 bg-gray-50 dark:bg-slate-700 rounded-sm outline-none">
                                        <FaBuilding className="text-xl text-[#3d50e0]" />
                                        <p className="dark:text-white">
                                            <span className="font-semibold">{t('address')}</span><br />
                                            {tenant.address}
                                        </p>
                                    </div>
                                    <div className="flex flex-row gap-4 items-center mt-3 p-5 bg-gray-50 dark:bg-slate-700 rounded-sm outline-none">
                                        <FaPhone className="text-[#3d50e0]" />
                                        <div className="ml-2 dark:text-white">
                                            <span className="font-semibold">{t('contact')}</span> <a href={`https://wa.me/${tenant.contact.replace(/\D+/g, '')}`} target="_blank" className="text-blue-500 font-semibold"><br />
                                            {tenant.contact}</a>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-4 items-center mt-3 p-5 bg-gray-50 dark:bg-slate-700 rounded-sm outline-none">
                                        <FaEnvelope className="text-[#3d50e0]" />
                                        <div className="ml-2 dark:text-white">
                                            <span className="font-semibold">Email</span> <a href={`mailto:${tenant.email}`} className="text-blue-500 font-semibold"><br />{tenant.email}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 my-5 mb-10">
                                        <h1 className="font-bold text-xl text-gray-700 dark:text-white">FORMAT</h1>
                                        <div className="w-full h-0.5 mt-3 bg-gradient-to-r from-blue-400 to-[#3d50e0]"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md-grid-cols-2 lg:grid-cols-2 xl:grid-cols-2    justify-between gap-5 mt-5 pb-5 bg-white dark:bg-gray-800 rounded-sm outline-none">
                                        <div className="flex gap-4 items-center p-5 bg-gray-50 dark:bg-slate-700 rounded-sm outline-none w-full">
                                            <FaHome className="text-xl text-[#3d50e0]" />
                                            <p className="ml-2 dark:text-white">
                                                <span className="font-semibold">{t('culture')}</span><br /> {getCountryNameFromCode(tenant.culture)}
                                            </p>
                                        </div>
                                        <div className="flex gap-4 items-center p-5 bg-gray-50 dark:bg-slate-700 rounded-sm outline-none w-full">
                                            <FaFlag className="text-xl text-[#3d50e0]" />
                                            <p className="ml-2 dark:text-white">
                                                <span className="font-semibold">{t('language')}</span><br /> 
                                                <span className="flex gap-2 items-center">
                                                    <Image src={getFlagSrc(tenant.language)} width={50} height={50} className="h-5 w-5" alt="flag" /> 
                                                    {tenant.language == 'id' ? t('indonesian') : tenant.language == 'en' ? t('english') : ''}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex gap-4 items-center p-5 bg-gray-50 dark:bg-slate-700 rounded-sm outline-none w-full">
                                            <FaDollarSign className="text-xl text-[#3d50e0]" />
                                            <p className="ml-2 dark:text-white">
                                                <span className="font-semibold">{t('currency')}</span><br /> {getCurrencyNameFromCode(tenant.currency)}
                                            </p>
                                        </div>
                                        <div className="flex gap-4 items-center p-5 bg-gray-50 dark:bg-slate-700 rounded-sm outline-none w-full">
                                            <FiWatch className="text-xl text-[#3d50e0]" />
                                            <p className="ml-2 dark:text-white">
                                                <span className="font-semibold">{t('timezone')}</span><br /> {tenant.timezone_name}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-5 my-5 mb-10">
                                        <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                        <div className="w-full h-0.5 bg-gradient-to-r from-blue-300 to-[#3d50e0] animate-pulse"></div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-5 mt-3 bg-gray-200 dark:bg-gray-700 rounded-sm outline-none p-5">
                                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                                        <div className="ml-4 flex-1">
                                            <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse mb-2"></div>
                                            <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-5 mt-5 bg-gray-200 dark:bg-gray-700 rounded-sm outline-none p-5">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                                            <div className="ml-4 flex-1">
                                                <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse mb-2"></div>
                                                <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                                            <div className="ml-4 flex-1">
                                                <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse mb-2"></div>
                                                <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>             
            </div>

             {/* <!-- Main modal --> */}
             <div id="crud-modal" ref={addModal} className="fixed inset-0 flex hidden items-center justify-center bg-gray-500 dark:border-none0 bg-opacity-75 z-50">
             <div
                className="w-screen h-screen fixed top-0 left-0"
                onClick={closeModal}
            ></div>
                <div className="relative mt-1 w-screen md:w-full max-w-2xl max-h-screen">
                {/* <!-- Modal content --> */}
                <div className="relative bg-white dark:bg-[#243040] shadow max-h-[100vh] overflow-auto">
                    {/* <!-- Modal header --> */}
                    <div className="fixed z-50 w-full max-w-2xl flex items-center justify-between p-4 md:p-5 border-b bg-white dark:bg-[#243040] dark:border-[#314051] text-black dark:text-white">
                        <h3 className="text-xl font-semibold">
                            {`${modeModal} ${t('tenant')}`}
                        </h3>
                        
                        <button type="button" className="text-xl bg-transparent hover:text-slate-500  dark:hover:text-slate-300 outline-none w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className="w-full h-0.5 bg-gray-300"></div>
                    {/* <!-- Modal body --> */}
                    <div className="p-4 md:p-5 bg-white dark:bg-[#243040] dark:text-white overflow-y-auto mt-[4.5rem]">
                        <div className="flex justify-between items-center">
                        <div className="text-xl font-semibold text-[#3d50e0]">{t('general')}</div>

                        <div className="flex gap-2 items-center">
                        {
                            modeModal === 'Edit' ? <button className="bg-[#3d50e0] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-nowrap" onClick={updateTenant}>{isLoading ? s('saving') : t('save') }</button> : <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Add Tenant</button>
                        }
                        </div>
                        </div>
                    
                    <div className="w-full h-0.5 my-3 bg-gray-300"></div>
                        <div className="grid gap-4 mb-4 grid-cols-2 max-h-screen md:pb-3">
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="name" className="mb-2 text-sm font-medium  flex">{t('company-name')} {
                                    error.name && <p className="text-red-500 text-sm">*</p>
                                }</label>
                                <input type="text" name="name" id="name" className="bg-gray-50 dark:bg-slate-800 dark:border-none border outline-1 border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5 " placeholder={t('holder-name')}
                                required onChange={(e) => setValues({...values, name: e.target.value})}/>
                                {
                                    error.name && <p className="text-red-500 text-sm">{error.name}</p>
                                }
                            </div>  
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="address" className="mb-2 text-sm font-medium  flex">{t('company-address')} {
                                    error.address && <p className="text-red-500 text-sm">*</p>
                                }</label>
                                <input type="text" name="address" id="address" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5 " placeholder={t('holder-address')}
                                required onChange={(e) => setValues({...values, address: e.target.value})}/>
                                {
                                    error.address && <p className="text-red-500 text-sm">{error.address}</p>
                                }
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="country" className="block mb-2 text-sm font-medium ">{t('country')}</label>
                                <select id="country" onChange={(e) => {handleCityList(e.target.value)}} className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5"   defaultValue={0}>
                                    <option value="0" key={0} disabled hidden>Select Country</option>
                                    {
                                        Country.length > 0 ? Country.map((item, index) => (
                                            <option key={index} value={item.country}>{item.country}</option>
                                        )) : <option disabled>Loading...</option>
                                    }
                                </select>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="city" className="block mb-2 text-sm font-medium ">{t('city')}</label>
                                <select id="city" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5" defaultValue={0}>
                                <option disabled value={0} key={0} hidden>Please Select Country</option>
                                    {
                                        City.length > 0 ? City.map((item, index) => (
                                            <option key={index} value={item}>{item}</option>
                                        )) : <option disabled >Loading...</option>
                                    }
                                </select>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="email" className="flex mb-2 text-sm font-medium  ">Email{
                                    error.email && <p className="text-red-500 text-sm">*</p>
                                }</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5 " placeholder={t('holder-email')} required onChange={(e) => setValues({...values, email: e.target.value})}/>
                                {
                                    error.email && <p className="text-red-500 text-sm">{error.email}</p>
                                }
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="contact" className="flex mb-2 text-sm font-medium  ">{t('contact')} {
                                    error.contact && <p className="text-red-500 text-sm">*</p>
                                }</label>
                                <input type="number" name="contact" id="contact" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5 " placeholder={t('holder-contact')} required onChange={(e) => setValues({...values, contact: e.target.value})}/>
                                {
                                    error.contact && <p className="text-red-500 text-sm">{error.contact}</p>
                                }
                            </div>

                            <div className="
                            col-span-2">
                                <div className="flex justify-between items-center   gap-5">
                                <div className="text-xl w-[50%] font-semibold text-[#3d50e0] ">FORMAT</div>
                                <div className="flex w-[50%] justify-start items-center gap-1 me-1 py-3">
                                    <label htmlFor="currencyposition" className="flex flex-col md:flex-row gap-2 items-center cursor-pointer">

                                    <span className="text-sm font-medium ">{t('currency-position')} :</span>
                                    <div className="flex flex-row gap-2 items-center">
                                        <input type="checkbox" value="" id="currencyposition" name="currencyposition" className="sr-only peer"/>
                                        <div className="text-sm font-medium">{t('right')}(-$)</div>
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <div className="text-sm font-medium">{t('left')}($-)</div>
                                    </div>
                                    </label>
                                    </div>
                                </div>
                            <div className="w-full h-0.5 my-1 bg-gray-300"></div>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="language" className="block mb-2 text-sm font-medium ">{t('language')}</label>
                                <select id="language" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5" defaultValue={0}>
                                    <option value={null} index={0} disabled hidden>Select Language</option>
                                    <option value="en">English</option>
                                    <option value="id">Indonesia</option>
                                </select>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="culture" className="block mb-2 text-sm font-medium ">{t('culture')}</label>
                                <select id="culture" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5" defaultValue={0}>
                                <option value={null} index={0} disabled hidden>Select Culture</option>
                                    {
                                        culture.length > 0 ? culture.map((item, index) => (
                                            <option key={index} value={item.cultureInfoCode}>{item.country} ({item.cultureInfoCode})</option>
                                        )) : <option disabled>Loading</option>
                                    }
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="input_timezone" className="block mb-2 text-sm font-medium ">{t('timezone')}</label>
                                <select id="input_timezone" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5" defaultValue={0}>
                                <option value={null} index={0} disabled hidden>Select Timezone</option>
                                {
                                        timezone.length > 0 ? timezone.map((item, index) => (
                                            <option key={index} value={item.timezone}>{item.timezone}</option>
                                        )) : <option disabled>Loading</option>
                                    }
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1 pb-20 md:pb-2">
                                <label htmlFor="currency" className="block mb-2 text-sm font-medium ">{t('currency')}</label>
                                <select id="currency" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-sm outline-none focus:ring-[#3c54d9] focus:border-[#3c54d9] block w-full p-2.5" defaultValue={0}>
                                <option value={null} index={0} disabled hidden>Select Currency</option>
                                {
                                    currency.length > 0 ? currency.map((item, index) => (
                                        <option key={index} value={item.currency.split(" ")[0]}>{item.currency}</option>
                                    )) : <option disabled>Loading</option>
                                }
                                </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}