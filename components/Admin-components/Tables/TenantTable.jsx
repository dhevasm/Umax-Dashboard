'use client'

import axios from "axios"
import { useState,useEffect, useRef, useContext, useCallback } from "react"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import Swal from "sweetalert2"
import { useDownloadExcel } from "react-export-table-to-excel"
import jsPDF from "jspdf"
import 'jspdf-autotable'
import { IconContext } from "react-icons"
import { AiOutlineFilePdf } from "react-icons/ai"
import { FaArrowLeft, FaArrowRight, FaFileExcel, FaTable } from "react-icons/fa"
import { FaPlus } from "react-icons/fa"
import { FaPen } from "react-icons/fa"
import { FaTrash } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import { FaTimes } from "react-icons/fa"
import { Switch } from "@material-tailwind/react"
import { RiBuildingLine, RiFileExcel2Line } from "react-icons/ri"
import CountCard from "../CountCard"
import { BiPlug, BiPlus } from "react-icons/bi"
export default function TenantTable() {

    const [tenants, setTenants] = useState([])
    const [tenantMemo, setTenantMemo] = useState([])
    const [EditTenantId, setEditTenantId] = useState(null)
    const [searchTerm, setSearchTerm] = useState("");

    const {sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData, dataDashboard } = useContext(AdminDashboardContext)

    const addModal = useRef(null)
    const [modeModal, setModeModal] = useState("add")
    const deleteButton = useRef(null)

    const [timezone, setTimezone] = useState([])
    const [currency, setCurrency] = useState([])
    const [culture, setCulture] = useState([])
    const [Country, setCountry] = useState([])
    const [City, setCity] = useState([])
    const [alldial, setDial] = useState([])
    const [DialCountry, setDialCountry] = useState([])

    function showModal(mode, tenant_id = null ){
        setModeModal(mode)
        if(mode == "Edit"){
            deleteButton.current.classList.remove("hidden")
            const filteredTenant = tenantMemo.filter(tenant => tenant._id === tenant_id);
            if(filteredTenant.length > 0){
                // console.log(filteredTenant[0])

                setValues({name: filteredTenant[0].company, address: filteredTenant[0].address, contact:filteredTenant[0].contact, email: filteredTenant[0].email, language:filteredTenant[0].language, culture: filteredTenant[0].culture, timezone: filteredTenant[0].timezone_name, currency: filteredTenant[0].currency, country:filteredTenant[0].address, city:filteredTenant[0].address})
                setError({name: '', address: '', contact: '', email: '', language:'', culture:'', timezone:'', currency:'', country :'', city:''})
                
                let isFullAdress = false;
                setEditTenantId(tenant_id)
                document.getElementById('name').value = filteredTenant[0].company
                document.getElementById('address').value = filteredTenant[0].address
                document.getElementById('email').value = filteredTenant[0].email
                document.getElementById('language').value = filteredTenant[0].language
                document.getElementById('culture').value = filteredTenant[0].culture
                document.getElementById('currency').value = filteredTenant[0].currency
                document.getElementById('input_timezone').value = filteredTenant[0].timezone_name
                document.getElementById('currencyposition').checked = filteredTenant[0].currency_position
                document.getElementById('country').value = filteredTenant[0].address.split(" - ")[2]
                handleCityList(filteredTenant[0].address.split(" - ")[2])
                setTimeout(() => {
                    document.getElementById('city').value = filteredTenant[0].address.split(" - ")[1]
                    document.getElementById('contact').value = filteredTenant[0].contact.slice(1)
                }, 300);
            } else{
                Swal.fire("Tenant not found");
            }
        }else if(mode == "Create") {
            setValues({name: '', address: '', contact: '', email: '', language:'', culture: '', timezone: '', currency: '', country:'', city:''})
            setError({name: '', address: '', contact: '', email: '', language:'', culture: '', timezone: '', currency: '', country:'', city:''})
            deleteButton.current.classList.add("hidden")
            document.getElementById('name').value = null
            document.getElementById('address').value = null
            document.getElementById('contact').value = null
            document.getElementById('email').value = null  
            document.getElementById('language').value = ""  
            document.getElementById('culture').value = ""  
            document.getElementById('input_timezone').value = ""  
            document.getElementById('currency').value = ""  
            document.getElementById('country').value = ""  
            document.getElementById('city').value = ""   
        }
        addModal.current.classList.remove("hidden")
    }
    function closeModal(){
        addModal.current.classList.add("hidden")
    }

    // Validasi Form 
    const [values, setValues] = useState({name: '', address: '', contact: '', email: '', language:'', culture:'', timezone:'', currency:'', country:'', city:''})
    const [error, setError] = useState({
        name: '',
        address: '',
        contact: '',
        email: '',
        language:'',
        culture : '',
        timezone: '',
        currency : '',
        country : '', 
        city : '',
    })
    const [isvalid, setIsvalid] = useState(false)

    const validateForm = useCallback(() => {
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
        if(values.email == ''){
            errors.email = 'Email is required'
        }
        if(values.language == ""){
            errors.language = "Language is required"
        }
        if(values.culture == ""){
            errors.culture = "Culture is required"
        }
        if(values.timezone == ""){
            errors.timezone = "Timezone is required"
        }
        if(values.currency == ""){
            errors.currency = "Currency is required"
        }
        if(values.country == ""){
            errors.country = "Country is required"
        }
        if(values.city == ""){
            errors.city == "City is required"
        }
        setError(errors)
        setIsvalid(Object.keys(errors).length === 0)
    }, [values])

    useEffect(() => {
        validateForm()
    }, [values, validateForm])
    

    
    function handleDelete(tenant_id){
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
            deleteTenant(tenant_id)
            closeModal()
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            })
            }
          });
    }

    const deleteTenant = async (tenant_id) => {
        // console.log(tenant_id)
        closeModal()
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tenant-delete?tenant_id=${tenant_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
            getTenants()
            setUpdateCard(true)
        } catch (error) {
            console.log(error)
        }
    }

    const tableRef = useRef(null);

    function generateExcel(){
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure want to download excel file?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!"
          }).then((result) => {
            if (result.isConfirmed) {
                const backupLastPage = lastPage;
                const backupFirstPage = firstPage;
                setFirstPage(0);
                setLastPage(tenants.length);
                setTimeout(() => {
                    onDownload();
                    setFirstPage(backupFirstPage);
                    setLastPage(backupLastPage);
                }, 100);
              Swal.fire({
                title: "Downloaded!",
                text: "Your file has been downloaded.",
                icon: "success"
              });
            }
          });
    }

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "DataTenant",
        sheet: "DataTenant",
      });

    const generatePDF = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure want to download pdf file?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!"
          }).then((result) => {
            if (result.isConfirmed) {
                const doc = new jsPDF();
                doc.text('Data Tenant Umax Dashboard', 10, 10);
                doc.autoTable({
                    head: [['Name', 'Address', 'Contact', "Email"]],
                    body: tenants.map((tenant) => [tenant.company, tenant.address, tenant.contact, tenant.email]),
                });
                doc.save('DataTenant.pdf');
              Swal.fire({
                title: "Downloaded!",
                text: "Your file has been downloaded.",
                icon: "success"
              });
            }
          });
    };

    function handleDetail(tenant_id){
        const filteredTenant = tenants.filter(tenant => tenant._id === tenant_id);
        if(filteredTenant.length > 0) {
            const [tenant] = filteredTenant;
            Swal.fire(`<p>
                ${tenant.company}\nAddress: ${tenant.address}\nContact: ${tenant.contact}\nEmail: ${tenant.email}
                </p>`);
        } else {
            Swal.fire("Tenant not found");
        }
    }

    async function getTenants(){
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tenant-get-all`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        })
        setTenants(response.data.Data)
        setTenantMemo(response.data.Data)
        setTotalPages(Math.ceil(tenants.length / itemsPerPage));
        setFirstPage(0);
        setLastPage(itemsPerPage);
    }

    useEffect(() => {
        getTenants()
    })

    async function createTenant(){
        if(isvalid){
            const company = document.getElementById('name').value
            const address = document.getElementById('address').value
            const country = document.getElementById('country').value
            const city = document.getElementById('city').value
    
            const fulladdress = `${address} - ${city} - ${country}`
            
            const contact = `+${document.getElementById('contact').value}`
            const email = document.getElementById('email').value
            const language = document.getElementById('language').value
            const culture = document.getElementById('culture').value
            const currency = document.getElementById('currency').value
            const timezone = document.getElementById('input_timezone').value
            const currencyposition = document.getElementById('currencyposition').checked
    
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
    
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tenant-create`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
    
            if(response.data.Output == "Registration Successfully"){
                getTenants()
                closeModal()
                setUpdateCard(true)
                document.getElementById('name').value = null
                document.getElementById('address').value = null
                document.getElementById('contact').value = null
                document.getElementById('email').value = null
                document.getElementById('language').value = ""  
                document.getElementById('culture').value = ""  
                document.getElementById('input_timezone').value = ""  
                document.getElementById('currency').value = ""  
                document.getElementById('country').value = ""  
                document.getElementById('city').value = ""  
                Swal.fire("Success", "Tenant created successfully", "success")
            }else{
                Swal.fire("Error", response.detail, "error")
            }
        }else{
            Swal.fire("Failed!","Please fill all required fields!", "error")
        }
    }

    async function updateTenant(){
        if(EditTenantId !== null) {
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
    
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tenant-edit?tenantId=${EditTenantId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            })
    
                if(response.data.Output == "Data Updated Successfully"){
                    getTenants()
                    closeModal()
                    document.getElementById('name').value = null
                    document.getElementById('address').value = null
                    document.getElementById('contact').value = null
                    document.getElementById('email').value = null
                    document.getElementById('language').value = ""  
                    document.getElementById('culture').value = ""  
                    document.getElementById('input_timezone').value = ""  
                    document.getElementById('currency').value = ""  
                    document.getElementById('country').value = ""  
                    document.getElementById('city').value = ""  
                    Swal.fire("Success", "Tenant Updated", "success")
                }else{
                    Swal.fire("Error", response.detail.ErrMsg, "error")
                }
            }else{
                Swal.fire("Failed!","Please fill all required fields!", "error")
            }
            
        }
    }

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

    async function handleCityList(countryname){
        setValues({...values, country: countryname})
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


    // Pagination

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [firstPage, setFirstPage] = useState(0);
    const [lastPage, setLastPage] = useState(10);

    useEffect(() => {
        setCurrentPage(1);
        setTotalPages(Math.ceil(tenants.length / itemsPerPage));
        setFirstPage(0);
        setLastPage(itemsPerPage);
    }, [tenants, itemsPerPage]);

    const firstPageButton = useRef(null);
    const previousButton = useRef(null);
    const nextButton = useRef(null);
    const lastPageButton = useRef(null);

    useEffect(() => {
        setFirstPage((currentPage - 1) * itemsPerPage);
        setLastPage(currentPage * itemsPerPage);
        if(currentPage == 1){
            firstPageButton.current.classList.add("paginDisable");
            previousButton.current.classList.add("paginDisable");
            nextButton.current.classList.remove("paginDisable");
            lastPageButton.current.classList.remove("paginDisable");
        }else if(currentPage == totalPages){
            nextButton.current.classList.add("paginDisable");
            lastPageButton.current.classList.add("paginDisable");
            firstPageButton.current.classList.remove("paginDisable");
            previousButton.current.classList.remove("paginDisable");
        }else if(currentPage == 1 && currentPage == totalPages){
            firstPageButton.current.classList.add("paginDisable");
            previousButton.current.classList.add("paginDisable");
            nextButton.current.classList.add("paginDisable");
            lastPageButton.current.classList.add("paginDisable");
        }else{
            firstPageButton.current.classList.remove("paginDisable");
            previousButton.current.classList.remove("paginDisable");
            nextButton.current.classList.remove("paginDisable");
            lastPageButton.current.classList.remove("paginDisable");
        }
    }, [currentPage, itemsPerPage, totalPages]);

    function handleNextButton(){
        if(currentPage < totalPages){
            setCurrentPage(currentPage + 1);
        }
    }

    function handlePreviousButton(){
        if(currentPage > 1){
            setCurrentPage(currentPage - 1);
        }
    }

    function handleFristPageButton(){
        if(currentPage > 1){
            setCurrentPage(1);
        }
    }

    function handleLastPageButton(){
        if(currentPage < totalPages){
            setCurrentPage(totalPages);
        }
    }

    function LoadingCircle() {
        return (
          <div className="flex justify-center items-center h-20">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-[#1C2434] dark:border-white rounded-full border-t-transparent dark:border-t-transparent animate-spin"></div>
            </div>
          </div>
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = tenants.filter((data) => {
        return (
            (!searchTerm ||
                data.company.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });



    return (
        <>
            <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold uppercase dark:text-white flex gap-2"><RiBuildingLine size={35}/> Tenants</h1>
                    <p className="dark:text-white"><a className="hover:cursor-pointer dark:text-white hover:text-blue-400 hover:underline" href="#" onClick={() => setChangeTable("dashboard")}>Dashboard</a>  / Tenants</p>
                </div>

                {/* {'Statistic Card end'} */}

                <div className="w-full h-fit mb-5 rounded-md shadow-md">
                    {/* Header */}
                    <div className="w-full h-12 bg-[#3c50e0] flex  items-center rounded-t-md">
                        <h1 className="flex gap-2 p-4 items-center text">
                            <FaTable  className="text-blue-200" size={18}/><p className="text-white text-md font-semibold"></p>
                        </h1>
                    </div>
                    {/* Header end */}

                    {/* Body */}
                    <div className="w-full h-fit bg-white dark:bg-slate-800 dark:text-white rounded-b-md p-4">
                        <div className=" flex flex-col-reverse md:flex-row justify-between items-center w-full ">
                            <div className="flex">
                                {/* Button */}
                                <button className=" py-2 mb-4 border hover:bg-gray-100 dark:hover:bg-slate-400 font-bold px-3 rounded-s-md" onClick={generatePDF}>
                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                        <AiOutlineFilePdf />
                                    </IconContext.Provider>
                                </button>
                                <button className=" py-2 mb-4 border-b border-t border-e hover:bg-gray-100 dark:hover:bg-slate-400 font-bold px-3" onClick={generateExcel}>
                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                        <RiFileExcel2Line />
                                    </IconContext.Provider>
                                </button>
                                <button className=" py-2 mb-4 border-b border-t border-e rounded-e-md hover:bg-gray-100 dark:hover:bg-slate-400 font-bold px-3 " onClick={() => showModal("Create")} >
                                    <IconContext.Provider value={{ className: "text-xl" }}>
                                        <BiPlus className="text-thin"/>
                                    </IconContext.Provider>
                                </button>
                                {/* Button end */}
                            </div>

                            {/* Search */}
                            <div className="flex gap-5">
                                <div className="relative mb-4">
                                    <label htmlFor="search" className="hidden"></label>
                                    <input type="text" id="search" name="search" className="dark:bg-slate-800 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search" 
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </span>
                                </div>
                            </div>
                            {/* Search */}
                        </div>

                        <div className="bg-white h-fit overflow-auto">
                            <table className="w-full text-sm text-left" ref={tableRef}>
                                <thead className="text-md text-left uppercase bg-white dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Name</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Client</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Account</th>
                                        <th scope="col" className="px-5 border dark:border-gray-500 py-3">Platform</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800">
                                    {
                                        filteredData.length > 0 ? filteredData.map((tenant, index) => {
                                            return (
                                                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-slate-400 dark:odd:bg-slate-600 dark:even:bg-slate-700 hover:cursor-pointer transition-colors duration-300">
                                                    <td scope="row" className="px-6 py-3 font-medium border dark:border-gray-500 whitespace-nowrap underline"  onClick={() => showModal("Edit", tenant._id)}>{tenant.company}</td>
                                                    <td scope="row" className="px-6 py-3 font-medium border dark:border-gray-500 whitespace-nowrap">{tenant.address}</td>
                                                    <td scope="row" className="px-6 py-3 font-medium border dark:border-gray-500 whitespace-nowrap">
                                                        <a href={`mailto:${tenant.email}`} className="text-blue-500">{tenant.email}</a>
                                                    </td>
                                                    <td scope="row" className="px-6 py-3 font-medium  whitespace-nowrap">
                                                        <a className="text-blue-500" href={`https://wa.me/${tenant.contact.slice(1)}`} target="_blank">{String(tenant.contact)}</a>
                                                    </td>
                                                </tr>
                                            )
                                    }).slice(firstPage, lastPage) : (
                                        // Check user yang sudah difilter
                                        tenants.length > 0 ? (
                                            // Jika data tida ditemukan
                                            <tr className="text-center border dark:border-gray-500">
                                                <td colSpan={8} className=" py-4">
                                                    Data not found
                                                </td>
                                            </tr>
                                        ) :
                                        (
                                            // Jika data ditemukan tapi masih loading
                                            <tr className="text-center py-3 border dark:border-gray-500">
                                                <td colSpan={8}>
                                                    <LoadingCircle />
                                                </td>
                                            </tr>
                                        )
                                    )
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/* Pagin */}
                        <style jsx>
                            {
                                `
                                    .paginDisable{
                                        opacity:0.5;
                                    }
                                `
                            }

                        </style>
                        <div className="w-full flex justify-between items-center mb-4">
                            <div className="mt-5 flex  gap-3 items-center w-full justify-end">
                                <button className=" hover:bg-gray-100 border py-1.5 px-3 rounded inline-flex items-center" onClick={handleFristPageButton} ref={firstPageButton}>
                                    {"<<"}
                                </button>
                                <button className=" hover:bg-gray-100 border py-1.5 px-3 rounded inline-flex items-center" onClick={handlePreviousButton} ref={previousButton}>
                                    {"<"}   
                                </button>
                                <div>
                                    <p>Page {currentPage} / {totalPages}</p>
                                </div>
                                <button className=" hover:bg-gray-100 border py-1.5 px-3 rounded inline-flex items-center" onClick={handleNextButton} ref={nextButton}>
                                    {">"}
                                </button>
                                <button className=" hover:bg-gray-100 border py-1.5 px-3 rounded inline-flex items-center" onClick={handleLastPageButton} ref={lastPageButton}>
                                {">>"}
                                </button>
                            </div>
                        </div>
                        {/* Pagin end */}
                    </div>
                    {/* Body end */}
                </div>
            </div>

            {/* <!-- Main modal --> */}
            <div id="crud-modal" ref={addModal} className="fixed inset-0 flex hidden items-center justify-center bg-gray-500 dark:border-none0 bg-opacity-75 z-50">

                <div className="relative mt-1 w-screen md:w-full max-w-2xl max-h-screen">
                    {/* <!-- Modal content --> */}
                    <div className="relative  rounded-lg shadow">
                        {/* <!-- Modal header --> */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-[#3c50e0] dark:bg-slate-800 text-white ">
                            <h3 className="text-xl font-semibold">
                                {`${modeModal} Tenant`}
                            </h3>
                            
                            <button type="button" className="text-xl bg-transparent hover:bg-blue-400 dark:hover:bg-slate-500 hover:text-slate-100 rounded-lg  w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <div className="p-4 md:p-5 bg-white dark:bg-slate-900 dark:text-white" >
                            <div className="flex justify-between items-center">
                            <div className="text-xl font-semibold text-blue-500">General</div>

                            <div className="flex gap-2 items-center">
                            {
                                modeModal === 'Edit' ? <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded text-nowrap" onClick={updateTenant}>Save Change</button> : <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" onClick={createTenant}>Add Tenant</button>
                            }
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded" ref={deleteButton} onClick={() => handleDelete(EditTenantId)}>
                                <FaTrash className="text-xl"/>
                            </button>
                            </div>
                            
                            </div>
                        
                        <div className="w-full h-0.5 my-3 bg-gray-300"></div>
                       
                            <div className="grid gap-4 mb-4 grid-cols-2 max-h-screen overflow-y-auto pb-52 md:pb-3">
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="name" className="mb-2 text-sm font-medium  flex">Company Name {
                                        error.name && <p className="text-red-500 text-sm">*</p>
                                    }</label>
                                    <input type="text" name="name" id="name" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type company address here"
                                    required onChange={(e) => setValues({...values, name: e.target.value})}/>
                                    
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="address" className="mb-2 text-sm font-medium  flex">Company Address {
                                        error.address && <p className="text-red-500 text-sm">*</p>
                                    }</label>
                                    <input type="text" name="address" id="address" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Type company address here"
                                    required onChange={(e) => setValues({...values, address: e.target.value})}/>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="country" className="flex mb-2 text-sm font-medium ">Country {
                                            error.country && <p className="text-red-500 text-sm">*</p>
                                    }</label>
                                    <select id="country" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={""} onChange={(e) => handleCityList(e.target.value)}  >
                                        <option value="" disabled hidden>Select Country</option>
                                        {
                                            Country.length > 0 ? Country.map((item, index) => (
                                                <option key={index} value={item.country}>{item.country}</option>
                                            )) : <option disabled>Loading</option>
                                        }
                                    </select>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="city" className="block mb-2 text-sm font-medium ">City {
                                        error.city && <p className="text-red-500 text-sm">*</p>}</label>
                                    <select id="city" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={""} onChange={(e) => setValues({...values, city: e.target.value})}>
                                        {
                                            City.length > 0 ? City.map((item, index) => (
                                                <option key={index} value={item}>{item}</option>
                                            )) : <option  value="" hidden disabled>Please Select Country</option>
                                        }
                                    </select>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="email" className="flex mb-2 text-sm font-medium  ">Email{
                                        error.email && <p className="text-red-500 text-sm">*</p>
                                    }</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="example@gmail.com" required onChange={(e) => setValues({...values, email: e.target.value})}/>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="contact" className="flex mb-2 text-sm font-medium  ">Contact {
                                        error.contact && <p className="text-red-500 text-sm">*</p>
                                    }</label>
                                    <input type="number" name="contact" id="contact" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="+62427836778" required onChange={(e) => setValues({...values, contact: e.target.value})}/>
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
                                    <label htmlFor="language" className="flex mb-2 text-sm font-medium ">Language {
                                        error.language && <p className="text-red-500 text-sm">*</p>}</label>
                                    <select id="language" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={""} onChange={(e) => setValues({...values, language: e.target.value})}>
                                        <option value="" disabled hidden>Select Language</option>
                                        <option value="en">English</option>
                                        <option value="id">Indonesia</option>
                                    </select>
                                    {/* {
                                        error.language && <p className="text-red-500 text-xs">{error.language}</p>
                                    } */}
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="culture" className="flex mb-2xs font-medium ">Culture {
                                        error.culture && <p className="text-red-500 text-sm">*</p>}</label>
                                    <select id="culture" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={""} onChange={(e) => setValues({...values, culture: e.target.value})}>
                                    <option value="" disabled hidden>Select Culture</option>
                                        {
                                            culture.length > 0 ? culture.map((item, index) => (
                                                <option key={index} value={item.cultureInfoCode}>{item.country} | {item.cultureInfoCode}</option>
                                            )) : <option disabled>Loading</option>
                                        }
                                    </select>
                                    {/* {
                                        error.culture && <p className="text-red-500 text-xs">{error.culture}</p>
                                    } */}
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="input_timezone" className="flex mb-2 text-sm font-medium ">Time Zone {
                                        error.timezone && <p className="text-red-500 text-sm">*</p>}</label>
                                    <select id="input_timezone" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={""} onChange={(e) => setValues({...values, timezone: e.target.value})}>
                                    <option value="" index={0} disabled hidden>Select Timezone</option>
                                    {
                                            timezone.length > 0 ? timezone.map((item, index) => (
                                                <option key={index} value={item.timezone}>{item.timezone}</option>
                                            )) : <option disabled>Loading</option>
                                        }
                                    </select>
                                    {/* {
                                        error.timezone && <p className="text-red-500 text-xs">{error.timezone}</p>
                                    } */}
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="currency" className="flex mb-2 text-sm font-medium ">Currency {
                                        error.currency && <p className="text-red-500 text-sm">*</p>}</label>
                                    <select id="currency" className="bg-gray-50 dark:bg-slate-800 dark:border-none border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" defaultValue={""} onChange={(e) => setValues({...values, currency: e.target.value})}>
                                    <option value="" disabled hidden>Select Currency</option>
                                    {
                                            currency.length > 0 ? currency.map((item, index) => (
                                                <option key={index} value={item.currency.split(" ")[0]}>{item.currency}</option>
                                            )) : <option disabled>Loading</option>
                                        }
                                    </select>
                                    {/* {
                                        error.currency && <p className="text-red-500 text-xs">{error.currency}</p>
                                    } */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}