'use client'

import { useState, useEffect, useRef } from "react"
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

export default function TenantProfile({tenant_id}){

    const [tenant, setTenant] = useState([])
    const {sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable,  userData} = useContext(AdminDashboardContext)
    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("edit")
    const t = useTranslations('tenant-profile')

    const [timezone, setTimezone] = useState([])
    const [currency, setCurrency] = useState([])
    const [culture, setCulture] = useState([])
    const [Country, setCountry] = useState([])
    const [City, setCity] = useState([])
    const [alldial, setDial] = useState([])
    const [DialCountry, setDialCountry] = useState([])

    async function getTenant(){
        const response = await axios.get(`https://umaxxxxx-1-r8435045.deta.app/tenant-by-id?tenant_id=${tenant_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        }).then((response) => {
            setTenant(response.data.Data[0])
        })
    }

    useEffect(() => {
        getTenant()
    }, [])

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
                document.getElementById('culture').value = tenant.culture
                document.getElementById('currency').value = tenant.currency
                document.getElementById('input_timezone').value = tenant.timezone_name
                document.getElementById('currencyposition').checked = tenant.currency_position
                setValues({name: tenant.company, address: tenant.address, contact: tenant.contact, email: tenant.email})
                setError({name: '', address: '', contact: '', email: ''})
                document.getElementById('country').value = tenant.address.split(" - ")[2]
                handleCityList(tenant.address.split(" - ")[2])
                setTimeout(() => {
                    document.getElementById('city').value = tenant.address.split(" - ")[1]
                    document.getElementById('contact').value = tenant.contact.slice(1)
                }, 300);
                
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

    function validateForm(){
        let errors = {}
        if(values.name == ''){
            errors.name = 'Name is required'
        }
        if(values.address == ''){
            errors.address = 'Address is required'
        }
        if(values.contact == ''){
            errors.contact = 'Contact is required'
        }
        if(!values.email.includes('@')){
            errors.email = "Email must contain '@'"
        }
        if(values.email == ''){
            errors.email = 'Email is required'
        }
        setError(errors)
        setIsvalid(Object.keys(errors).length === 0)
        }

    useEffect(() => {
        validateForm()
    }, [values])

    async function updateTenant(){
        if(tenant !== null) {
            if(isvalid){
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
                Swal.fire("Success", "Tenant Updated", "success")
            }else{
                Swal.fire("Error", response.detail.ErrMsg, "error")
            }
            }else{
                Swal.fire("Failed!","Please fill all required fields!", "error")
            }
            
        }
    }

    // useEffect(() => {
    //     console.log(tenant)
    // }, [tenant])

    async function getSelectFrontend(){
        await axios.get('https://umaxxnew-1-d6861606.deta.app/timezone').then((response) => {
            setTimezone(response.data)
        })

        await axios.get('https://umaxxnew-1-d6861606.deta.app/currency').then((response) => {
            setCurrency(response.data)
        })

        await axios.get('https://umaxxnew-1-d6861606.deta.app/culture').then((response) => {
            setCulture(response.data)
        })

        await axios.get("https://countriesnow.space/api/v0.1/countries").then((response) => {
            setCountry(response.data.data)

        })
        await axios.get("https://countriesnow.space/api/v0.1/countries/codes").then((response) => {
            setDial(response.data.data)
        })


    }

    async function handleCityList(countryname){
        let citylist = []
        Country.map((item) => {
            if(item.country == countryname){
                citylist= item.cities
            }
        })
        alldial.map((item) => {
            if(item.name == countryname){
                setDialCountry(item.dial_code)
                // console.log(item.dial_code)
            }
        })

        setCity(citylist)
    }

    useEffect(() => {
        document.getElementById("contact").value = DialCountry.slice(1)
    }, [DialCountry])   

    useEffect(() => {
        getSelectFrontend()
    }, [])

    return (
        <>
            <div className="w-full h-full rounded-sm">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <h1 className="text-2xl dark:text-white">{t('title')}</h1>
                    <p className="dark:text-white"><a className="hover:cursor-pointer hover:text-blue-400 hover:underline dark:text-white" onClick={() => setChangeTable("dashboard")}>{t('dashboard')}</a> / {t('title')}</p>
                </div>

                <div className="rounded-sm shadow-md mt-3 rounded-t-md">
                    <div className="w-full flex justify-between h-[30vh] bg-bg-tenant  items-end px-5 py-5 rounded-t-md">
                        {
                            tenant.company ? (
                                <h1 className="font-bold text-2xl text-white drop-shadow-xl">{tenant.company}</h1>
                            ) : "Loading ..."
                        }
                        { tenant.company? <div className="self-end text-nowrap flex gap-2 items-center text-white hover:cursor-pointer dark:hover:bg-slate-800 dark:bg-slate-700 bg-blue-500 hover:bg-blue-600 p-2 rounded-md shadow-md" onClick={() => showModal("Edit", tenant._id)}>
                            <FaPen/>
                            Edit Tenant
                        </div>
                        : ""    
                    }
                    </div>

                    <div className="p-5 bg-white dark:bg-slate-800 rounded-b-sm">
                        {tenant.address ? (
                            <>
                            <div className="flex items-center gap-5 my-5 mb-10">
                                <h1 className="font-bold text-xl text-gray-700 dark:text-white">{t('general')}</h1>
                                <div className="w-full h-0.5 mt-3 bg-gradient-to-r from-blue-400 to-[#3d50e0]"></div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 items-start mt-3 p-5">
                                <FaBuilding className="text-2xl text-[#3d50e0]" />
                                <p className="ml-2 dark:text-white">{t('address')}: {tenant.address}</p>
                            </div>
                            <div className="flex w-full flex-wrap flex-col md:flex-row gap-5 mt-5">
                                <div className="flex gap-2 items-center p-5">
                                <FaPhone className="text-[#3d50e0]" />
                                <div className="ml-2 dark:text-white">
                                    {t('contact')}: <a href={`https://wa.me/${tenant.contact.replace(/\D+/g, '')}`} target="_blank" className="text-blue-500">{tenant.contact}</a>
                                </div>
                                </div>
                                <div className="flex gap-2 items-center p-5">
                                <FaEnvelope className="text-[#3d50e0]" />
                                <div className="ml-2 dark:text-white">
                                    Email: <a href={`mailto:${tenant.email}`} className="text-blue-500">{tenant.email}</a>
                                </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 my-5 mb-10">
                                <h1 className="font-bold text-xl text-gray-700 dark:text-white">Format</h1>
                                <div className="w-full h-0.5 mt-3 bg-gradient-to-r from-blue-400 to-[#3d50e0]"></div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-5 md:gap-10 mt-5 pb-5">
                                <div className="flex gap-2 items-center p-5">
                                <FaHome className="text-[#3d50e0]" />
                                <p className="ml-2 dark:text-white">{t('culture')}: {tenant.culture}</p>
                                </div>
                                <div className="flex gap-2 items-center p-5">
                                <FaFlag className="text-[#3d50e0]" />
                                <p className="ml-2 dark:text-white">{t('language')}: {tenant.language}</p>
                                </div>
                                <div className="flex gap-2 items-center p-5">
                                <FaDollarSign className="text-[#3d50e0]" />
                                <p className="ml-2 dark:text-white">{t('currency')}: {tenant.currency}</p>
                                </div>
                                <div className="flex gap-2 items-center p-5">
                                <FiWatch className="text-[#3d50e0]" />
                                <p className="ml-2 dark:text-white">{t('timezone')}: {tenant.timezone_name}</p>
                                </div>
                            </div>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                </div>             

            </div>

             {/* <!-- Main modal --> */}
             <div id="crud-modal" ref={addModal} className="fixed inset-0 flex hidden items-center justify-center bg-gray-500 dark:border-none0 bg-opacity-75 z-50">
                <div className="relative mt-1 w-screen md:w-full max-w-2xl max-h-screen">
                {/* <!-- Modal content --> */}
                <div className="relative bg-white rounded-lg shadow">
                    {/* <!-- Modal header --> */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-blue-500 dark:bg-slate-800 text-white ">
                        <h3 className="text-xl font-semibold">
                            {`${modeModal} ${t('tenant')}`}
                        </h3>
                        
                        <button type="button" className="text-xl bg-transparent hover:bg-blue-400 dark:hover:bg-slate-500 hover:text-slate-100 rounded-lg  w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                            <FaTimes />
                        </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className="p-4 md:p-5 dark:bg-slate-900 dark:text-white">
                        <div className="flex justify-between items-center">
                        <div className="text-xl font-semibold text-blue-500">{t('general')}</div>

                        <div className="flex gap-2 items-center">
                        {
                            modeModal === 'Edit' ? <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded text-nowrap" onClick={updateTenant}>{t('save')}</button> : <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Add Tenant</button>
                        }
                        </div>
                        </div>
                    
                    <div className="w-full h-0.5 my-3 bg-gray-300"></div>
                
                        <div className="grid gap-4 mb-4 grid-cols-2 max-h-screen overflow-y-auto pb-52 md:pb-3">
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="name" className="mb-2 text-sm font-medium  flex">{t('company-name')} {
                                    error.name && <p className="text-red-500 text-sm">*</p>
                                }</label>
                                <input type="text" name="name" id="name" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type company address here"
                                required onChange={(e) => setValues({...values, name: e.target.value})}/>
                                {
                                    error.name && <p className="text-red-500 text-sm">{error.name}</p>
                                }
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="address" className="mb-2 text-sm font-medium  flex">{t('company-address')} {
                                    error.address && <p className="text-red-500 text-sm">*</p>
                                }</label>
                                <input type="text" name="address" id="address" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type company address here"
                                required onChange={(e) => setValues({...values, address: e.target.value})}/>
                                {
                                    error.address && <p className="text-red-500 text-sm">{error.address}</p>
                                }
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="country" className="block mb-2 text-sm font-medium ">{t('country')}</label>
                                <select id="country" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" onChange={(e) => handleCityList(e.target.value)} defaultValue={0}>
                                    <option value="0" key={0} disabled hidden>Select Country</option>
                                    {
                                        Country.length > 0 ? Country.map((item, index) => (
                                            <option key={index} value={item.country}>{item.country}</option>
                                        )) : <option disabled>Loading</option>
                                    }
                                </select>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="city" className="block mb-2 text-sm font-medium ">{t('city')}</label>
                                <select id="city" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={0}>
                                    {
                                        City.length > 0 ? City.map((item, index) => (
                                            <option key={index} value={item}>{item}</option>
                                        )) : <option disabled value={0} key={0} hidden>Please Select Country</option>
                                    }
                                </select>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="email" className="flex mb-2 text-sm font-medium  ">Email{
                                    error.email && <p className="text-red-500 text-sm">*</p>
                                }</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="example@gmail.com" required onChange={(e) => setValues({...values, email: e.target.value})}/>
                                {
                                    error.email && <p className="text-red-500 text-sm">{error.email}</p>
                                }
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="contact" className="flex mb-2 text-sm font-medium  ">{t('contact')} {
                                    error.contact && <p className="text-red-500 text-sm">*</p>
                                }</label>
                                <input type="number" name="contact" id="contact" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="+62427836778" required onChange={(e) => setValues({...values, contact: e.target.value})}/>
                                {
                                    error.contact && <p className="text-red-500 text-sm">{error.contact}</p>
                                }
                            </div>

                            <div className="
                            col-span-2">
                                <div className="flex justify-between items-center">
                                <div className="text-xl font-semibold text-blue-500 ">Format</div>
                                <div className="flex items-center gap-1 me-1">
                                    <label htmlFor="currencyposition" className="flex flex-col md:flex-row gap-2 items-center cursor-pointer">

                                    <span className="text-sm font-medium ">Currency position :</span>
                                    <div className="flex flex-row gap-2 ">
                                        <input type="checkbox" value="" id="currencyposition" name="currencyposition" className="sr-only peer"/>
                                        <div className="text-sm font-medium">right(-$)</div>
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <div className="text-sm font-medium">left($-)</div>
                                    </div>
                                    </label>
                                    </div>
                                </div>
                            <div className="w-full h-0.5 my-1 bg-gray-300"></div>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="language" className="block mb-2 text-sm font-medium ">{t('language')}</label>
                                <select id="language" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={0}>
                                    <option value={null} index={0} disabled hidden>Select Language</option>
                                    <option value="en">English</option>
                                    <option value="id">Indonesia</option>
                                </select>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="culture" className="block mb-2 text-sm font-medium ">{t('culture')}</label>
                                <select id="culture" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={0}>
                                <option value={null} index={0} disabled hidden>Select Culture</option>
                                    {
                                        culture.length > 0 ? culture.map((item, index) => (
                                            <option key={index} value={item.cultureInfoCode}>{item.country} | {item.cultureInfoCode}</option>
                                        )) : <option disabled>Loading</option>
                                    }
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="input_timezone" className="block mb-2 text-sm font-medium ">{t('timezone')}</label>
                                <select id="input_timezone" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={0}>
                                <option value={null} index={0} disabled hidden>Select Timezone</option>
                                {
                                        timezone.length > 0 ? timezone.map((item, index) => (
                                            <option key={index} value={item.timezone}>{item.timezone}</option>
                                        )) : <option disabled>Loading</option>
                                    }
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="currency" className="block mb-2 text-sm font-medium ">{t('currency')}</label>
                                <select id="currency" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={0}>
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